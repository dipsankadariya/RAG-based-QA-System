"""
mcp_agent.py  —  LangGraph agent matching langgraph_mcp_agent.ipynb exactly.

Graph topology:
  START → router1 → translator (if non-English) → assistant
                  → assistant (if English)
  assistant → tools_condition → tools → assistant
                              → END
"""

from __future__ import annotations

import logging
import os
from dataclasses import dataclass
from typing import Literal, Optional

log = logging.getLogger(__name__)


# ──────────────────────────────────────────────────────────
# Runtime state
# ──────────────────────────────────────────────────────────

@dataclass
class AgentStatus:
    ready: bool
    error: Optional[str] = None


_agent_app      = None
_status         = AgentStatus(ready=False, error="Agent not initialized")


def get_agent_status() -> AgentStatus:
    return _status


# ──────────────────────────────────────────────────────────
# System prompt  (identical to notebook)
# ──────────────────────────────────────────────────────────

SYSTEM_PROMPT = """\
You are a strictly grounded legal research assistant. You answer ONLY using information retrieved via your PageIndex tools. You have NO outside knowledge and cannot offer personal legal advice.

### MANDATORY EXECUTION WORKFLOW
You must execute your retrieval in this exact sequence. Never skip steps.

1. Orient & Semantic Search: Call browse_documents(sort="relevance", query="<natural language topic>").
   -> LOOP BREAKER: If a document is returned (e.g., "najir_200pages.pdf"), DO NOT reject it. You MUST proceed to Step 2 immediately.
2. Verify Status: Call get_document(doc_name="<exact_doc_name>", wait_for_completion=true). Proceed ONLY if the status is "completed".
3. Find Relevant Pages (MANUAL NAVIGATION):
   -> You must manually find the Table of Contents or Index to navigate large documents.
   -> Call get_page_content(doc_name="<exact_doc_name>", pages="1-6") to read the initial pages and locate the relevant page numbers for the user's specific query.
4. Extract Content: Call get_page_content(doc_name="<exact_doc_name>", pages="<target_pages>").
   -> Limit this to a maximum of 3 to 5 pages at a time (e.g., "45-48").
5. Escalate (Fallback Only): ONLY if Step 1 yields exactly zero documents, or if your page review yields nothing, call search_documents(query="<keywords>") using 2-4 precise keywords.

### HARD CONSTRAINTS
* NEVER guess page numbers. Always verify via the Table of Contents first.
* NEVER request more than 5 pages at a time in a single get_page_content() call.
* NEVER call search_documents() before attempting browse_documents().
* NEVER answer from memory/general knowledge. If it's not in the documents, state that.
* NEVER delete a document (remove_document) without explicit user confirmation of the exact filename.

### FINAL OUTPUT FORMAT
Synthesize your findings using the exact structure below. Cite the case name, number, and page number for every claim. Use the court's exact language where possible.
CASE IDENTIFICATION
Case Name: [Full name] | Case Number: [Number] | Court: [Court name] | Year: [Year]
Document: [Source doc name, page numbers cited]
FACTS OF THE CASE
[Parties involved, nature of dispute, legal issues raised]
COURT DECISION & HOLDING
[Exact ruling, reasoning, orders issued, relief granted/denied]
LEGAL PRINCIPLES ESTABLISHED
[Key rights, doctrines, statutes, or tests applied]
RELATED & PRECEDENT CASES
[Prior cases cited; subsequent cases that applied/distinguished this ruling]
PROCEDURAL HISTORY
[Trial court → appellate → Supreme Court, if applicable]
"""

TRANSLATOR_PROMPT = """\
You are an expert linguist and translator. Your single task is to process the user's input—regardless of the original language—and convert it into proper, grammatically correct, natural-sounding English.
Strictly adhere to the following rules:
1. Translate & Refine: If the input is in any language other than English, translate it accurately into English.
2. Polish English: If the input is already in English (or mixed), fix any typos, grammatical errors, or awkward phrasing to elevate it to "proper English."
3. Preserve Intent: Maintain the original meaning, tone, and context. Do not alter the core message.
4. Output Only the Result: Provide ONLY the final English text. Do not include introductory phrases, explanations, or conversational filler.
"""


# ──────────────────────────────────────────────────────────
# init_agent  —  called once from FastAPI startup
# ──────────────────────────────────────────────────────────

async def init_agent() -> None:
    global _agent_app, _status

    # ── dependency check ──────────────────────────────────
    try:
        from langchain_core.messages import SystemMessage
        from langchain_core.prompts import ChatPromptTemplate
        from langgraph.graph import START, StateGraph, MessagesState
        from langgraph.prebuilt import ToolNode, tools_condition
        from langchain_mcp_adapters.client import MultiServerMCPClient
        from langchain_google_genai import ChatGoogleGenerativeAI
        from langchain_groq import ChatGroq
        from pydantic import BaseModel, Field
    except ImportError as exc:
        _status = AgentStatus(
            ready=False,
            error=(
                "Agent dependencies not installed. Run: pip install langgraph "
                "langchain-mcp-adapters langchain-google-genai langchain-groq pydantic. "
                f"Error: {exc}"
            ),
        )
        log.warning("Agent mode disabled: %s", exc)
        return

    # ── env / key check ───────────────────────────────────
    pageindex_key = os.getenv("PAGEINDEX_API_KEY", "").strip()
    google_key    = os.getenv("GOOGLE_API_KEY", "").strip()
    # Groq key for language detection + translation (reuse existing keys)
    groq_key = next(
        (
            k for k in [
                os.getenv("GROQ_API_KEY", ""),
                os.getenv("GROQ_API_KEY_2", ""),
                os.getenv("GROQ_API_KEY_3", ""),
                os.getenv("GROQ_API_KEY_4", ""),
            ]
            if k.strip()
        ),
        None,
    )
    agent_model   = os.getenv("AGENT_MODEL", "gemini-3.1-flash-lite-preview").strip()
    pageindex_url = os.getenv("PAGEINDEX_MCP_URL", "https://api.pageindex.ai/mcp").strip()

    missing = []
    if not pageindex_key: missing.append("PAGEINDEX_API_KEY")
    if not google_key:    missing.append("GOOGLE_API_KEY")
    if not groq_key:      missing.append("GROQ_API_KEY")
    if missing:
        _status = AgentStatus(ready=False, error=f"Missing env vars: {', '.join(missing)}")
        log.warning("Agent mode disabled: %s", _status.error)
        return

    try:
        # ── MCP tools ─────────────────────────────────────
        mcp_client = MultiServerMCPClient({
            "pageindex": {
                "transport": "http",
                "url": pageindex_url,
                "headers": {"Authorization": f"Bearer {pageindex_key}"},
            }
        })
        mcp_tools = await mcp_client.get_tools()
        # NOTE: filter is commented out in the new notebook — keep all tools
        if not mcp_tools:
            _status = AgentStatus(ready=False, error="MCP returned no tools. Check PAGEINDEX_API_KEY.")
            return
        log.info("PageIndex MCP tools: %s", [t.name for t in mcp_tools])

        # ── LLMs ──────────────────────────────────────────
        # llm   → Gemini  (main agent, tool-calling)
        # llm_2 → Groq    (language detection + translation)
        llm = ChatGoogleGenerativeAI(
            model=agent_model,
            google_api_key=google_key,
            temperature=0,
        )
        llm_2 = ChatGroq(model="openai/gpt-oss-120b", api_key=groq_key)

        llm_with_tools = llm.bind_tools(mcp_tools)

        # ── Language detection (structured output) ────────
        class GetLanguage(BaseModel):
            language: Literal["ENGLISH", "NOT_ENGLISH"] = Field(
                description=(
                    "Return 'ENGLISH' if the given text is primarily written in English, "
                    "else 'NOT_ENGLISH' if the text is written in any other language."
                )
            )

        llm_with_language_detection = llm_2.with_structured_output(GetLanguage)

        lang_detect_prompt = ChatPromptTemplate([
            ("system", "You are an expert language classifier. Extract the language classification for the user's text."),
            ("user", "{text}"),
        ])
        language_detector = lang_detect_prompt | llm_with_language_detection

        # ── Translator chain ──────────────────────────────
        translator_prompt = ChatPromptTemplate([
            ("system", TRANSLATOR_PROMPT),
            ("user", "translate this:{query}"),
        ])
        translator_chain = translator_prompt | llm_2

        # ── Nodes ─────────────────────────────────────────
        assistant_sys = SystemMessage(content=SYSTEM_PROMPT)

        async def assistant_node(state: MessagesState):
            response = await llm_with_tools.ainvoke([assistant_sys] + state["messages"])
            return {"messages": [response]}

        def translator_node(state: MessagesState):
            query = state["messages"][-1].content
            response = translator_chain.invoke({"query": query})
            return {"messages": [response]}

        # ── Router at START ───────────────────────────────
        def router1(state: MessagesState) -> Literal["assistant", "translator"]:
            query = state["messages"][-1].content
            try:
                result = language_detector.invoke({"text": query})
                return "assistant" if result.language == "ENGLISH" else "translator"
            except Exception as exc:
                log.warning("Language detection failed (%s); defaulting to assistant", exc)
                return "assistant"

        # ── Graph ─────────────────────────────────────────
        builder = StateGraph(MessagesState)
        builder.add_node("assistant", assistant_node)
        builder.add_node("tools", ToolNode(mcp_tools))
        builder.add_node("translator", translator_node)

        builder.add_conditional_edges(
            START,
            router1,
            {"assistant": "assistant", "translator": "translator"},
        )
        builder.add_conditional_edges("assistant", tools_condition)
        builder.add_edge("tools", "assistant")
        builder.add_edge("translator", "assistant")

        _agent_app = builder.compile()
        _status = AgentStatus(ready=True, error=None)
        log.info("Agent ready (model=%s, tools=%d)", agent_model, len(mcp_tools))

    except Exception as exc:
        _agent_app = None
        _status = AgentStatus(ready=False, error=str(exc))
        log.exception("Agent init failed: %s", exc)


# ──────────────────────────────────────────────────────────
# run_agent  —  called per request from main.py
# ──────────────────────────────────────────────────────────

async def run_agent(question: str) -> str:
    if not _agent_app or not _status.ready:
        raise RuntimeError(_status.error or "Agent not ready")

    from langchain_core.messages import HumanMessage

    result = await _agent_app.ainvoke({"messages": [HumanMessage(content=question)]})
    messages = result.get("messages") or []
    if not messages:
        return "Agent produced no output."

    last = messages[-1]
    content = getattr(last, "content", None)
    if isinstance(content, list):
        # Gemini sometimes returns content as a list of blocks
        return " ".join(b.get("text", "") for b in content if isinstance(b, dict)) or str(last)
    return content or str(last)