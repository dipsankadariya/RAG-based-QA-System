# Nyay (न्याय) — Nepali Legal AI + Research Agent + Community Forum

**Final Year Project** — A web-based legal assistance platform that combines:

1) **Instant legal Q&A** using a fine‑tuned small language model (SLM) + **HyDE RAG** for localized Nepali retrieval.
2) **Deep legal research** using a **LangGraph agent** that tool‑calls an external document index to fetch cases, verdicts, and official decisions.
3) A **Reddit‑style forum** so citizens, students, and lawyers can discuss and crowd‑verify legal insights.

This is not “just an AI wrapper”: the project includes SLM fine‑tuning, retrieval engineering, agentic tool use, authentication, and a full-stack web app.

---

## System description (high level)

**Goal:** Make complex Nepali legal information accessible, with a safety net for edge cases.

### Layer 1 — Instant Q&A (HyDE RAG)

- A fine‑tuned **Qwen2.5‑1.5B** model generates a **HyDE (hypothetical) legal passage** from the user question.
- The HyDE passage is embedded with **LaBSE** and retrieved against a **FAISS** vector index built from `augmented_nepali_legal_rag.txt`.
- A hosted LLM on **Groq** synthesizes the final answer in Nepali (and optionally generates an English rendering).

Why HyDE: Nepali questions are short, but legal answers are long; HyDE improves retrieval by embedding something closer to the target answer space.

### Layer 2 — Deep research (LangGraph Agent)

- For research-grade queries, the system switches to **Agent mode**.
- A **LangGraph** workflow orchestrates tool usage via an **MCP (Model Context Protocol)** server (PageIndex).
- The agent is intentionally **grounded**: it answers only using retrieved pages from the indexed documents.
- Non‑English inputs are translated to “proper English” before tool navigation to improve document search.

### Layer 3 — Human collaboration (Community Forum)

- A separate **forum service** supports questions, threaded answers, and voting.
- This acts as a human safety net: users can validate, debate, and refine advice in public threads.

---

## Technical architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                            Frontend (Web)                           │
│ React + Vite + Tailwind                                              │
│ - Login (Google)  - Chat (HyDE / Agent)  - Forum (threads + votes)   │
└───────────────▲───────────────────────────────────────────▲─────────┘
                │                                           │
                │ /api/* via Vite proxy                      │ /api/forum/*
                │                                           │
┌───────────────┴──────────────────────────┐   ┌────────────┴──────────────┐
│ QA Backend (FastAPI)                     │   │ Forum Backend (FastAPI)     │
│ backend/main.py                           │   │ backend/forum_api.py        │
│ - HyDE RAG pipeline                        │   │ - SQLite persistence         │
│ - Agent mode (LangGraph + MCP)             │   │ - Questions/answers/votes    │
│ - Google OAuth → JWT                       │   └───────────────────────────┘
└───────────────┬──────────────────────────┘
                │
     ┌──────────┴───────────┐
     │ External services     │
     │ - Groq (LLM API)      │
     │ - PageIndex MCP (docs)│
     │ - Gemini (agent LLM)  │
     └──────────────────────┘
```

Deployment pattern used for demos:

- **HyDE backend on Google Colab (GPU)** + **ngrok** public URL (easy CUDA access)
- **Forum backend on local machine** (SQLite)
- **Frontend on local machine** (Vite dev server)

---

## Tech stack

### Frontend

- React 18, React Router
- Vite dev server + proxy
- Tailwind CSS
- Markdown rendering for answers (`react-markdown`, `remark-gfm`)

### Backend (QA + Auth)

- FastAPI + Uvicorn + Pydantic
- HyDE/RAG: HuggingFace Transformers, PyTorch, Sentence-Transformers (LaBSE), FAISS
- Orchestration: LangChain
- LLM providers:
  - Groq for answer/refinement + translation utilities
  - Gemini (Google Generative AI) for agent reasoning/tool-calling
- Agent tools: LangGraph + MCP client (`langchain-mcp-adapters`) + PageIndex MCP server
- Auth: Google OAuth (ID token verification) → JWT (`python-jose`, `PyJWT`)

### Backend (Forum)

- FastAPI
- SQLite (local persistence)

---

## Models and data

| Component | Used for |
|---|---|
| Base SLM | `Qwen2.5-1.5B-Instruct` |
| Fine-tuned SLM | `zeri000/nepali_legal_qwen_merged_4` (HyDE generation only) |
| Embeddings | `sentence-transformers/LaBSE` |
| Vector store | FAISS (built at startup from the corpus text file) |
| Hosted LLM | Groq (answer synthesis + refinement + English rendering) |
| RAG corpus | `augmented_nepali_legal_rag.txt` (not committed; must be provided) |

Fine-tuning notes (project report): LoRA fine-tuning on a Nepali legal QA dataset to improve HyDE passage quality.

---

## How to run

This repo is set up so you can run **HyDE mode**, **Agent mode**, and the **Forum** independently.

### Prerequisites

- Node.js 18+
- Python 3.10–3.12 recommended (PyTorch wheels are not always available for the newest Python versions)

Optional (depending on modes):

- **Groq API key(s)** for HyDE answering
- **Google OAuth Client ID** for login
- **PAGEINDEX_API_KEY + GOOGLE_API_KEY** for Agent mode

### 1) QA backend (FastAPI)

From `nepali-legal-qa/backend`:

```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Configuration:

- Copy `backend/.env.example` → `backend/.env` and fill required keys.
- Provide the corpus file path via `DOC_FILE_PATH` (and ensure it exists where the server runs).

Notes:

- If HyDE dependencies are missing, **HyDE mode will be disabled** but the server can still start for **Agent mode**.
- `GET /api/health` reports whether HyDE and Agent are “ready”.

### 2) Forum backend (FastAPI + SQLite)

From `nepali-legal-qa/backend`:

```bash
uvicorn forum_api:app --reload --port 8001
```

Optional: seed sample threads

```bash
python seed_forum.py
```

### 3) Frontend (React)

From `nepali-legal-qa/frontend`:

```bash
npm install
npm run dev
```

Environment:

- Copy `frontend/.env.example` → `frontend/.env` and set:
  - `VITE_API_BASE` (QA backend base URL; can be an ngrok URL or `http://localhost:8000`)
  - `VITE_FORUM_API_BASE` (default `http://localhost:8001`)
- Add Google login config (recommended) in `frontend/.env.local`:
  - `VITE_GOOGLE_CLIENT_ID=...`

The current UI protects all routes behind login, so `VITE_GOOGLE_CLIENT_ID` is required to use the app end-to-end.

The Vite proxy forwards `/api/*` requests to the configured targets, avoiding CORS issues.

---

## Minimal API surface (for integration)

- `POST /api/query` with `mode: "hyde" | "agent"`
- `POST /api/auth/google` (Google ID token → JWT)
- Forum under `/api/forum/*` (threads, answers, voting)

---

## Known limitations

- Retrieval quality depends on corpus coverage and chunking.
- Agent mode depends on external document indexing (PageIndex MCP) and availability of API keys.
- Demo deployments via ngrok have a changing URL per session.

---

## Contributors

| Member | Contributions |
|---|---|
| Dipsan Kadariya | SLM fine-tuning, frontend, system integration |
| Ritesh Raut | HyDE-RAG pipeline, backend, evaluation |