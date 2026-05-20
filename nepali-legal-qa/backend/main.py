import logging
import os
import time
from typing import Literal, Optional

from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# HyDE/RAG dependencies are optional so Agent mode can run even when
# torch/transformers wheels are unavailable (e.g., Python 3.14 on Windows).
HYDE_DEPS_ERROR: Optional[str] = None
try:
    import torch
    from langchain_community.document_loaders import TextLoader
    from langchain_community.vectorstores import FAISS
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_groq import ChatGroq
    from langchain_huggingface import HuggingFaceEmbeddings
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    from transformers import AutoModelForCausalLM, AutoTokenizer
except Exception as exc:
    torch = None
    TextLoader = None
    FAISS = None
    ChatPromptTemplate = None
    ChatGroq = None
    HuggingFaceEmbeddings = None
    RecursiveCharacterTextSplitter = None
    AutoModelForCausalLM = None
    AutoTokenizer = None
    HYDE_DEPS_ERROR = str(exc)

from auth import Token, TokenData, create_access_token, verify_access_token, verify_google_token


logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
log = logging.getLogger(__name__)

# Load local env vars if a .env exists (keeps running simple on Windows).
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"), override=False)


MODEL_ID = os.getenv("MODEL_ID", "zeri000/nepali_legal_qwen_merged_4")
DOC_FILE_PATH = os.getenv("DOC_FILE_PATH", "../../../augmented_nepali_legal_rag.txt")
GROQ_KEYS = [
    os.getenv("GROQ_API_KEY"),
    os.getenv("GROQ_API_KEY_2"),
    os.getenv("GROQ_API_KEY_3"),
    os.getenv("GROQ_API_KEY_4"),
]

device = "cpu"
if torch is not None:
    try:
        device = "cuda" if torch.cuda.is_available() else "cpu"
    except Exception:
        device = "cpu"


app = FastAPI(title="Nepali Legal QA", version="6.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


tokenizer = None
model = None
vector_store = None
answer_generators=[]
generators = []
english_answer_generators=[]
terminators = None
request_counter = [0]


class QueryRequest(BaseModel):
    question: str
    top_k: Optional[int] = 3
    mode: Literal["hyde", "agent"] = "hyde"


class QueryResponse(BaseModel):
    question: str
    mode: Literal["hyde", "agent"]
    answer: str
    answer_in_english: Optional[str] = None
    hyde_passage: Optional[str] = None
    retrieved_docs: Optional[list[str]] = None
    processing_time: float


def build_terminators():
    ids = []
    if tokenizer.eos_token_id is not None:
        ids.append(tokenizer.eos_token_id)

    try:
        im_end_id = tokenizer.convert_tokens_to_ids("<|im_end|>")
    except Exception:
        im_end_id = None

    if im_end_id is not None and im_end_id != tokenizer.unk_token_id:
        ids.append(im_end_id)

    return list(dict.fromkeys(ids)) or None


def format_docs_for_prompt(docs: list) -> str:
    return "\n\n".join(
        f"[Context {idx}]\n{doc.page_content}"
        for idx, doc in enumerate(docs, start=1)
    )


def generate_hyde_document(user_query: str) -> str:
    """
    Fine-tuned SLM is used only for HyDE generation, matching the project design.
    """
    messages = [
        {
            "role": "system",
            "content": "तपाईं एक विशेषज्ञ नेपाली कानूनी सहायक हुनुहुन्छ।",
        },
        {
            "role": "user",
            "content": f"यस प्रश्नको आधारमा एउटा विस्तृत र सम्भावित कानूनी उत्तर वा व्याख्या तयार गर्नुहोस्: {user_query}",
        },
    ]

    prompt = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    inputs = tokenizer([prompt], return_tensors="pt").to(device)
    outputs = model.generate(
        **inputs,
        max_new_tokens=512,
        temperature=0.3,
        top_p=0.95,
        do_sample=True,
        eos_token_id=terminators,
        pad_token_id=tokenizer.eos_token_id,
    )
    input_length = inputs.input_ids.shape[1]
    generated_tokens = outputs[0][input_length:]
    return tokenizer.decode(generated_tokens, skip_special_tokens=True).strip()


def retrieve_with_baseline(question: str, top_k: int):
    return vector_store.similarity_search(question, k=top_k)


def retrieve_with_hyde(hyde_passage: str, top_k: int):
    return vector_store.similarity_search(hyde_passage, k=top_k)


def generate_answer_from_docs(question: str, docs: list, generator) -> str:
    response = generator.invoke(
        {
            "document": format_docs_for_prompt(docs),
            "query": question,
        }
    )
    return response.content.strip()

def generate_hyde_answer_final(question:str, answer,generator)->str:
    response=generator.invoke(
        {
            "query":question,
            "answer":answer,
        }
    )
    return response.content.strip()


def generate_english_answer(question:str,answer:str,generator)->str:
    response=generator.invoke(
        {
            "query":question,
            "answer":answer
        }
    )
    return response.content.strip()


@app.on_event("startup")
def load_models():
    global tokenizer, model, vector_store, generators, terminators, answer_generators, english_answer_generators

    if HYDE_DEPS_ERROR:
        log.warning("HyDE mode disabled (missing dependencies): %s", HYDE_DEPS_ERROR)
        return

    active_keys = [key for key in GROQ_KEYS if key]
    if not active_keys:
        log.warning("HyDE mode disabled: set GROQ_API_KEY (or GROQ_API_KEY_2/3/4) to enable answering")
        return

    log.info("Device: %s", device)

    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_ID,
        torch_dtype=torch.float16,
        device_map="auto",
    )
    terminators = build_terminators()
    log.info("Loaded HyDE SLM: %s", MODEL_ID)

    if not os.path.exists(DOC_FILE_PATH):
        raise RuntimeError(f"Document file not found: {DOC_FILE_PATH}")

    loader = TextLoader(DOC_FILE_PATH, autodetect_encoding=True)
    raw_docs = loader.load()
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n"],
    )
    chunks = splitter.split_documents(raw_docs)

    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/LaBSE")
    vector_store = FAISS.from_documents(chunks, embeddings)
    log.info("Built FAISS store with %d chunks", len(chunks))

    system_prompt = """
You are a Nepali legal question-answering assistant.

Rules:
- Answer in Nepali only.
- Use the provided context as the basis of the answer.
- If the context is insufficient, say so clearly.
- Prefer a direct, complete answer.
"""
    answer_prompt = ChatPromptTemplate(
        [
            ("system", system_prompt),
            ("human", "Generate the best answer on the basis of this {document} for user query: {query}."),
        ]
    )

    answer_generators = [
        answer_prompt | ChatGroq(model="openai/gpt-oss-120b", api_key=key)
        for key in active_keys
    ]
    log.info("Initialized %d answer generator(s)", len(answer_generators))
    
    system_prompt_2 = """
You are an expert Nepali legal assistant with comprehensive knowledge of Nepal's Constitution, Acts (ऐन), Regulations (नियमावली), and legal precedents.

Your task is to receive a user query and a draft answer, then produce a refined, authoritative final answer in Nepali.

Follow these rules strictly:

1. **Always answer** — Even if the draft answer says "थाहा छैन", "सन्दर्भ छैन", or similar, you must still provide the best possible legal answer using your own knowledge.

2. **Always cite sources** — Every answer must include:
   - नेपालको संविधान (भाग, धारा, उपधारा) — if applicable
   - सम्बन्धित ऐन/कानुन (नाम र दफा नम्बर सहित)
   - सम्बन्धित नियमावली वा विनियम — if applicable

3. **Answer structure** — Always follow this format:
   - **सिधा जवाफ:** (Direct answer in 1–2 sentences)
   - **विस्तृत विवरण:** (Detailed explanation)
   - **कानुनी आधार:** (Legal basis — cite Constitution articles, ऐन, दफा)

4. **Language** — Answer entirely in Nepali. Use clear, simple Nepali that a common citizen can understand, while keeping legal terms accurate.

5. **Accuracy** — Do not fabricate laws. If a specific दफा number is uncertain, cite the ऐन by name and describe the relevant provision.

6. **Completeness** — Never give a partial or vague answer. A citizen relying on this answer must get actionable legal guidance.
"""
    answer_prompt_2 = ChatPromptTemplate(
        [
            ("system", system_prompt_2),
            ("human", "Generate the best refined answer on the basis of this {answer} for user query: {query}."),
        ]
    )
    
    generators=[
        answer_prompt_2 | ChatGroq(model="openai/gpt-oss-120b", api_key=key)
        for key in active_keys
    ]
    log.info("Initialized %d answer generator(s)", len(generators))
    
    
    system_prompt_3="""
    You are a legal assistant specializing in Nepal law. You will receive a question and an answer, both written in Nepali, related to a Nepal legal query.

Your task is to produce a clear, professional English response that:
- Accurately conveys the legal meaning of the original Nepali answer
- Uses proper legal terminology applicable to Nepal's legal system (reference relevant Acts, Codes, or Constitutional provisions where appropriate)
- Is structured logically: start with a direct answer, followed by explanation and legal basis
- Remains accessible to a non-lawyer while maintaining legal accuracy
- Is concise yet complete — avoid padding, but omit nothing legally significant

Do not add opinions, assumptions, or information not present in the original answer. If the answer references specific Nepali laws (e.g., Muluki Civil Code 2074, Labor Act 2074), retain and translate those references accurately.

Output only the English answer — no commentary, no preamble. 
"""
    answer_prompt_3 = ChatPromptTemplate(
        [
            ("system", system_prompt_3),
            ("human", "Generate the best english refined answer on the basis of this nepali {answer} for user nepali query: {query}."),
        ]
    )
    
    english_answer_generators = [
        answer_prompt_3 | ChatGroq(model="openai/gpt-oss-120b", api_key=key)
        for key in active_keys
    ]


@app.on_event("startup")
async def load_agent():
    # Optional agent mode: keep HyDE working even if agent deps/keys are missing.
    try:
        from mcp_agent import get_agent_status, init_agent
        await init_agent()
        status = get_agent_status()
        if status.ready:
            log.info("Agent mode ready")
        else:
            log.warning("Agent mode disabled: %s", status.error)
    except Exception as exc:
        log.warning("Agent startup failed (HyDE still available): %s", exc)
    
    


@app.get("/api/health")
def health():
    agent_ready = False
    agent_error = None
    try:
        from mcp_agent import get_agent_status

        st = get_agent_status()
        agent_ready = st.ready
        agent_error = st.error
    except Exception:
        agent_ready = False
        agent_error = "Agent module unavailable"

    return {
        "status": "ok",
        "model": MODEL_ID,
        "device": device,
        "hyde_ready": (model is not None and vector_store is not None and bool(generators) and bool(answer_generators)),
        "hyde_error": HYDE_DEPS_ERROR,
        "has_vector_store": vector_store is not None,
        "has_llm": bool(generators),
        "agent_ready": agent_ready,
        "agent_error": agent_error,
    }


class GoogleTokenRequest(BaseModel):
    token: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: TokenData


@app.post("/api/auth/google", response_model=AuthResponse)
def google_login(req: GoogleTokenRequest):
    """Login with Google OAuth2 token."""
    try:
        token_data = verify_google_token(req.token)
        access_token = create_access_token({
            "sub": token_data.sub,
            "email": token_data.email,
            "name": token_data.name,
            "picture": token_data.picture,
        })
        return AuthResponse(
            access_token=access_token,
            token_type="bearer",
            user=token_data
        )
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))


@app.get("/api/auth/verify")
def verify_token(authorization: Optional[str] = Header(None)):
    """Verify and get current user info from token."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    try:
        parts = authorization.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authorization header")
        
        token = parts[1]
        user = verify_access_token(token)
        return {"user": user}
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))


def get_current_user(authorization: Optional[str] = Header(None)) -> TokenData:
    """Dependency to verify token and get current user."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    try:
        parts = authorization.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authorization header")
        
        token = parts[1]
        return verify_access_token(token)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))


@app.post("/api/query", response_model=QueryResponse)
async def query(req: QueryRequest, authorization: Optional[str] = Header(None)):
    question = req.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question is required")

    top_k = max(1, min(req.top_k or 3, 8))
    t0 = time.perf_counter()

    mode = req.mode

    if mode == "agent":
        try:
            from mcp_agent import run_agent

            answer = await run_agent(question)
        except Exception as exc:
            raise HTTPException(status_code=503, detail=str(exc))

        answer_in_english = None
        if english_answer_generators:
            idx = request_counter[0] % len(english_answer_generators)
            request_counter[0] += 1
            try:
                answer_in_english = generate_english_answer(
                    question,
                    answer,
                    english_answer_generators[idx],
                )
            except Exception:
                answer_in_english = None

        return QueryResponse(
            question=question,
            mode="agent",
            answer=answer,
            answer_in_english=answer_in_english,
            hyde_passage=None,
            retrieved_docs=None,
            processing_time=round(time.perf_counter() - t0, 2),
        )

    # Default: HyDE mode
    if HYDE_DEPS_ERROR:
        raise HTTPException(status_code=503, detail=f"HyDE dependencies not installed: {HYDE_DEPS_ERROR}")
    if model is None or vector_store is None or not generators or not answer_generators:
        raise HTTPException(status_code=503, detail="HyDE pipeline not ready yet")
    if not english_answer_generators:
        raise HTTPException(status_code=503, detail="English generator not ready yet")

    idx = request_counter[0] % len(generators)
    request_counter[0] += 1
    current_answer_generator = answer_generators[idx]
    current_generator = generators[idx]
    current_english_answer_generator = english_answer_generators[idx]

    hyde_passage = generate_hyde_document(question)
    hyde_docs = retrieve_with_hyde(hyde_passage, top_k)
    if not hyde_docs:
        raise HTTPException(status_code=500, detail="Document retrieval failed")

    try:
        draft = generate_answer_from_docs(question, hyde_docs, current_answer_generator)
        answer = generate_hyde_answer_final(question, draft, current_generator)
    except Exception as exc:
        log.exception("HyDE answer generation failed")
        answer = f"HyDE answer error: {exc}"

    answer_in_english = None
    try:
        answer_in_english = generate_english_answer(question, answer, current_english_answer_generator)
    except Exception:
        answer_in_english = None

    return QueryResponse(
        question=question,
        mode="hyde",
        answer=answer,
        answer_in_english=answer_in_english,
        hyde_passage=hyde_passage,
        retrieved_docs=[doc.page_content for doc in hyde_docs],
        processing_time=round(time.perf_counter() - t0, 2),
    )
