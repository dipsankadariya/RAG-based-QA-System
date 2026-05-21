# Nepali Legal QA System

**Final Year College Project** — A full-stack application for Nepali legal question answering using a fine-tuned SLM with HyDE (Hypothetical Document Embeddings) retrieval augmented generation (RAG), Google OAuth authentication, and a community forum.


---

## Features

- 🔍 **HyDE-powered RAG** - Hybrid document retrieval using hypothetical passage generation for better accuracy in low-resource languages
- 🔐 **Google OAuth Authentication** - Secure user login with Google accounts
- 💬 **Community Forum** - Users can post questions, answers, and engage in discussions
- 🎯 **Multi-mode Operation**:
  - RAG mode: Traditional retrieval-augmented question answering
  - Agent mode: Advanced reasoning with LangGraph + MCP support
- ⚡ **Production-ready** - FastAPI backend, React frontend, SQLite forum database

---

## What is HyDE and why we used it

Standard RAG embeds user questions directly and searches for similar passages. The problem is that a short Nepali question and a long legal answer sit in very different places in embedding space, reducing retrieval accuracy.

HyDE fixes this by:
1. Using a fine-tuned SLM to generate a *hypothetical legal answer* from the user's question
2. Embedding the hypothetical answer (semantically closer to real passages)
3. Searching the vector database using this embedded passage
4. This dramatically improves retrieval quality, especially for low-resource languages like Nepali

---

## System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React + Vite)                       │
│                      Runs on localhost:3000 or 5173                    │
│  Landing → Chat Interface → Forum → Google OAuth Integration           │
└──────────────────────────┬─────────────────────────────────────────────┘
                           │ HTTP/CORS
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
   ┌──────────┐      ┌──────────┐      ┌──────────┐
   │   Main   │      │  Forum   │      │   MCP    │
   │   RAG    │      │   API    │      │  Agent   │
   │ :8000    │      │ :8001    │      │ :8002    │
   └────┬─────┘      └────┬─────┘      └────┬─────┘
        │                 │                  │
        ▼                 ▼                  ▼
   ┌──────────────────────────────────────────────┐
   │              FastAPI Backends                │
   │  - HyDE RAG (Colab or Local)                 │
   │  - Forum Database (SQLite)                   │
   │  - LangGraph Agent (MCP adapters)            │
   └──────────────────────────────────────────────┘
        │
        ├─→ Embeddings: sentence-transformers/LaBSE
        ├─→ Vector Store: FAISS
        ├─→ HyDE SLM: zeri000/nepali_legal_qwen_merged_4
        └─→ Answer LLM: Groq llama-3.3-70b
```

---

## Project Structure

```
nepali-legal-qa/
│
├── README.md                    ← You are here
├── AUTHENTICATION.md            ← Google OAuth setup guide
│
├── backend/
│   ├── main.py                  ← RAG FastAPI server (port 8000)
│   │                               - /api/query - Main RAG endpoint
│   │                               - /api/auth/* - Authentication endpoints
│   │                               - /api/chat - Chat history
│   │
│   ├── forum_api.py             ← Forum FastAPI server (port 8001)
│   │                               - /api/forum/posts - Create/retrieve posts
│   │                               - /api/forum/answers - Answer threads
│   │                               - /api/forum/comments - Add comments
│   │
│   ├── mcp_agent.py             ← LangGraph MCP Agent (experimental)
│   │
│   ├── auth.py                  ← JWT + Google OAuth utilities
│   ├── forum_db.py              ← SQLite helpers
│   ├── seed_forum.py            ← Initialize sample forum data
│   ├── test_api.py              ← API integration tests
│   │
│   ├── requirements.txt          ← Python dependencies
│   ├── .env.example              ← Configuration template
│   └── forum.db                  ← SQLite database (gitignored)
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx              ← React entry point
│   │   ├── App.jsx               ← Main router and layout
│   │   ├── index.css             ← Global styles (Tailwind)
│   │   │
│   │   ├── Landing.jsx           ← Home page
│   │   ├── Chat.jsx              ← RAG chat interface
│   │   ├── Forum.jsx             ← Forum listing
│   │   ├── ForumDetail.jsx       ← Forum thread detail
│   │   ├── GoogleLogin.jsx       ← OAuth login component
│   │   ├── Navbar.jsx            ← Navigation bar
│   │   └── About.jsx             ← About page
│   │
│   ├── package.json              ← Dependencies (React, Tailwind, Vite)
│   ├── vite.config.js            ← Vite build config
│   ├── tailwind.config.js        ← Tailwind CSS config
│   ├── postcss.config.js         ← PostCSS config
│   ├── .env.example              ← Frontend config template
│   └── public/                   ← Static assets (images, etc.)
│
└── .gitignore                   ← Git ignore rules
```

---

## Quick Start

### Prerequisites
- Python 3.10+ (backend)
- Node.js 18+ (frontend)
- Groq API key (for answer generation): https://console.groq.com
- Google Cloud OAuth credentials (for authentication): [Google Cloud Console](https://console.cloud.google.com/)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/Scripts/activate   # Windows
   # or
   source venv/bin/activate       # macOS/Linux
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your credentials:
   ```env
   GROQ_API_KEY=your_groq_key_here
   GROQ_API_KEY_2=your_groq_key_2  # Optional, for round-robin
   GROQ_API_KEY_3=your_groq_key_3  # Optional
   GROQ_API_KEY_4=your_groq_key_4  # Optional
   
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   SECRET_KEY=your-secret-key-change-in-production
   
   MODEL_ID=zeri000/nepali_legal_qwen_merged_4
   DOC_FILE_PATH=../../../augmented_nepali_legal_rag.txt
   ```

5. **Run the RAG server:**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

6. **In another terminal, run the Forum API:**
   ```bash
   # From backend directory with activated venv
   uvicorn forum_api:app --host 0.0.0.0 --port 8001 --reload
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local`:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   VITE_API_BASE=http://localhost:8000
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173` or `http://localhost:3000`

---

## API Endpoints

### RAG Server (port 8000)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/query` | POST | Submit a question for RAG-based answering |
| `/api/chat` | GET/POST | Retrieve or save chat history |
| `/api/auth/google` | POST | Authenticate with Google token |
| `/api/auth/verify` | GET | Verify current user session |
| `/` | GET | Health check |

**Query Request:**
```json
{
  "question": "What is the Nepal Civil Code?",
  "language": "nepali"
}
```

### Forum Server (port 8001)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/forum/posts` | GET/POST | List or create forum posts |
| `/api/forum/posts/{id}` | GET | Get post details |
| `/api/forum/answers` | POST | Add answer to post |
| `/api/forum/comments` | POST | Add comment to answer |

---

## Models and Data

| Component | Details |
|-----------|---------|
| **Base SLM** | `unsloth/Qwen2.5-1.5B-Instruct` |
| **Fine-tuned SLM** | [zeri000/nepali_legal_qwen_merged_4](https://huggingface.co/zeri000/nepali_legal_qwen_merged_4) |
| **SLM Purpose** | HyDE hypothetical passage generation |
| **Embedding Model** | `sentence-transformers/LaBSE` (multilingual) |
| **Answer LLM** | `llama-3.3-70b-versatile` (Groq API) |
| **Vector Store** | FAISS (CPU-based) |
| **RAG Corpus** | `augmented_nepali_legal_rag.txt` |
| **Database** | SQLite (forum) |

---

## Configuration

See [AUTHENTICATION.md](AUTHENTICATION.md) for detailed Google OAuth setup instructions.

Key environment variables:
- `GROQ_API_KEY` - Groq API key for answer generation
- `GOOGLE_CLIENT_ID` - Google OAuth 2.0 Client ID
- `SECRET_KEY` - JWT signing key (change in production)
- `MODEL_ID` - HuggingFace model ID for HyDE SLM
- `DOC_FILE_PATH` - Path to RAG corpus file

---

## Technologies Used

### Backend
- **FastAPI** - Web framework
- **LangChain** - LLM orchestration and RAG
- **LangGraph** - Agent/workflow framework
- **Transformers** - SLM inference
- **FAISS** - Vector similarity search
- **SQLite** - Forum database
- **Python-Jose** - JWT authentication

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Markdown** - Markdown rendering

---

## Troubleshooting

### Common Issues

**CUDA out of memory?**
- Model runs on CPU by default
- For GPU support, ensure `torch` is installed with CUDA toolkit

**API returns 401 Unauthorized?**
- Check that your JWT token is valid in localStorage
- Verify `GOOGLE_CLIENT_ID` is correct
- Re-authenticate via Google login

**Forum database locked?**
- Ensure only one process is accessing `forum.db`
- Delete `forum.db` and run `seed_forum.py` to reinitialize

**FAISS index not found?**
- Ensure `augmented_nepali_legal_rag.txt` exists in the specified path
- The vector index is built on first query (may take time)

---

## Project Statistics

- **Backend**: ~1500 lines of Python (FastAPI + RAG pipeline)
- **Frontend**: ~800 lines of React/JSX
- **Models**: 3 (1 fine-tuned SLM + 1 embedding + 1 LLM)
- **Supported Languages**: Nepali, English (bidirectional)

---

## Future Enhancements

- [ ] Deploy to cloud (AWS/GCP/Heroku)
- [ ] Real-time forum notifications
- [ ] Multi-turn conversational memory
- [ ] RAG evaluation metrics (RAGAS integration)
- [ ] Admin dashboard
- [ ] Bulk document upload interface

---

## License

This project is part of a college curriculum. For research and educational use only.

**Fine-tuning setup:** LoRA (rank 16, alpha 32) — 1.78% of parameters trained. 3 epochs, ~10.5K samples, Tesla T4, ~2h 45min, final val loss ~0.415.

---

## ▶ How to run the application

### Prerequisites

| Tool | Where |
|---|---|
| Google account | For Colab GPU |
| Groq API keys (×4) | [console.groq.com](https://console.groq.com) — free tier |
| ngrok account + token | [ngrok.com](https://ngrok.com) — free tier |
| Node.js 18+ | Local machine |
| `augmented_nepali_legal_rag.txt` | Must be uploaded to Colab manually |

---

### Step 1 — Start the RAG backend in Google Colab

1. Open **[collab-backend.ipynb](./collab-backend.ipynb)** in [Google Colab](https://colab.research.google.com)

2. Set runtime: **Runtime → Change runtime type → GPU (T4)**

3. **Run Cell 1** — clones the repo and installs dependencies:
   ```python
   !git clone https://github.com/dipsankadariya/RAG-based-QA-System.git
   %cd RAG-based-QA-System/nepali-legal-qa/backend
   !pip install -r requirements.txt
   !pip install pyngrok
   ```
   When the HuggingFace login prompt appears, paste a **read-access HF token**.

4. **Upload `augmented_nepali_legal_rag.txt`** to `/content/` in Colab
   (Files panel on the left → Upload)

5. **Run Cell 2** — set API keys and start ngrok:
   ```python
   import os
   from google.colab import userdata

   os.environ["GROQ_API_KEY"]   = userdata.get("GROQ_API_KEY")
   os.environ["GROQ_API_KEY_2"] = userdata.get("GROQ_API_KEY_2")
   os.environ["GROQ_API_KEY_3"] = userdata.get("GROQ_API_KEY_3")
   os.environ["GROQ_API_KEY_4"] = userdata.get("GROQ_API_KEY_4")

   from pyngrok import ngrok
   ngrok.set_auth_token(userdata.get("NGROK_TOKEN"))
   public_url = ngrok.connect(8000, "http")
   print(public_url)   # e.g. https://xxxx-xxxx.ngrok-free.app
   ```
   📋 **Copy this URL** — you need it in Step 3.

6. **Run Cell 3** — start the FastAPI server (keep this cell running):
   ```
   !uvicorn main:app --host 0.0.0.0 --port 8000 --workers 1 --timeout-keep-alive 120
   ```
   Wait for: `Application startup complete.`

7. **Verify** the backend is live:
   ```bash
   curl https://xxxx-xxxx.ngrok-free.app/api/health
   ```
   Expected response:
   ```json
   {"status":"ok","model":"zeri000/nepali_legal_qwen_merged_4","device":"cuda","has_vector_store":true,"has_llm":true}
   ```

---

### Step 2 — Start the forum backend locally (fast demo)

1. Open a new terminal:
   ```bash
   cd nepali-legal-qa/backend
   ```

2. Start the forum API (SQLite):
   ```bash
   uvicorn forum_api:app --reload --port 8001
   ```

### Step 3 — Start the frontend locally

1. Open a terminal, navigate to the frontend directory:
   ```bash
   cd nepali-legal-qa/frontend
   ```

2. Install dependencies (first time only):
   ```bash
   npm install
   ```

3. Set the backend URL — edit `frontend/.env`:
   ```env
   VITE_API_BASE=https://xxxx-xxxx.ngrok-free.app
   VITE_FORUM_API_BASE=http://localhost:8001
   ```
   > ⚠️ **This URL changes every Colab session.** Update `.env` and restart `npm run dev` each time.

4. Start the dev server:
   ```bash
   npm run dev
   ```
   Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

### How requests flow

```
Browser → localhost:3000/api/query
              ↓
    Vite dev server (proxy)
              ↓
    https://xxxx.ngrok-free.app/api/query
              ↓
    FastAPI on Google Colab (:8000)
              ↓
    [1] Local SLM generates HyDE passage (CUDA)
    [2] LaBSE embeds it → FAISS retrieves top 3 chunks
    [3] Groq llama-3.3-70b answers in Nepali

Browser → localhost:3000/api/forum/*
           ↓
   Vite dev server (proxy)
           ↓
   http://localhost:8001/api/forum/*
           ↓
   Forum FastAPI (SQLite)
```

The Vite proxy handles CORS and ngrok headers automatically.

---

## API reference

### `GET /api/health`
```json
{
  "status": "ok",
  "model": "zeri000/nepali_legal_qwen_merged_4",
  "device": "cuda",
  "has_vector_store": true,
  "has_llm": true
}
```

### `POST /api/query`

**Request:**
```json
{
  "question": "नेपालमा सम्बन्ध विच्छेद कसरी गर्ने?",
  "top_k": 3
}
```

**Response:**
```json
{
  "question": "नेपालमा सम्बन्ध विच्छेद कसरी गर्ने?",
  "hyde_passage": "...[hypothetical legal passage from SLM]...",
  "retrieved_docs": ["[chunk 1]", "[chunk 2]", "[chunk 3]"],
  "answer": "...[final answer in Nepali from Groq]...",
  "processing_time": 14.2
}
```

---

## Known limitations

- SLM occasionally loops or hallucinates on complex legal queries — known with small models on low-resource languages
- FAISS index is built from QA-format data, so retrieval quality is bounded by corpus coverage
- ngrok free-tier URL expires on every Colab session restart

---

