# 🧠 Research Intelligence System

## ROLE · INTENT · CONTEXT · ENFORCEMENT

---

### 🎭 ROLE
You are an **AI Research Intelligence Architect** — an expert system combining:
- **ML Engineer**: Sentence-BERT embeddings, FAISS vector search
- **AI Agent Designer**: Query refinement using Claude/OpenAI
- **Backend Engineer**: FastAPI REST services
- **Data Engineer**: Multi-API ingestion pipelines (Semantic Scholar, arXiv)
- **Research Analyst**: Gap detection, trend analysis, insight generation

---

### 🎯 INTENT
Build a production-ready system that:
1. Accepts messy natural language research queries
2. Refines them via AI agent into academic format
3. Fetches real papers from Semantic Scholar + arXiv APIs
4. Embeds abstracts using Sentence-BERT (MiniLM-L6-v2)
5. Stores/searches vectors using FAISS
6. Ranks papers by relevance + citations + recency
7. Detects research gaps and trends
8. Presents everything in a polished React UI

---

### 📋 CONTEXT
- **User**: Developer/researcher building from scratch in VS Code
- **Environment**: Python 3.10+, Node.js 18+, local machine
- **APIs Used**: Semantic Scholar (free, no key needed), arXiv (free)
- **No LLM API key required for core**: Agent uses rule-based refinement by default; Claude/OpenAI optional
- **Legal**: Only metadata stored, no PDFs, official APIs only

---

### ⚡ ENFORCEMENT
| Rule | Reason |
|------|--------|
| No PDF storage | Copyright compliance |
| No Google Scholar scraping | Terms of service |
| Only official APIs | Legal & reliable |
| Embeddings precomputed | Performance |
| FAISS index persisted | Fast cold starts |
| Abstract-only text | Privacy + efficiency |

---

## 🏗️ ARCHITECTURE

```
User Query
    │
    ▼
[AI Agent] ──── refines query ────────────────────┐
    │                                              │
    ▼                                              ▼
[Query Embedding]                        [Paper Metadata DB]
    │                                     (SQLite / in-memory)
    ▼                                              │
[FAISS Search] ◄────── [Paper Embeddings] ◄────────┘
    │
    ▼
[Multi-Faceted Ranking]
(Relevance + Citations + Recency)
    │
    ▼
[Analysis Layer]
(Gap Detection + Trend Analysis)
    │
    ▼
[React Frontend Dashboard]
```

---

## 🚀 QUICK START

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 3. Open Browser
```
http://localhost:3000
```

---

## 📁 FOLDER STRUCTURE
```
research-intelligence/
├── backend/
│   ├── main.py                 # FastAPI entry point
│   ├── requirements.txt        # Python dependencies
│   ├── agents/
│   │   └── query_agent.py      # AI query refinement agent
│   ├── api/
│   │   ├── semantic_scholar.py # Semantic Scholar API client
│   │   └── arxiv_client.py     # arXiv API client
│   ├── core/
│   │   ├── embedder.py         # Sentence-BERT embeddings
│   │   ├── faiss_store.py      # FAISS vector store
│   │   ├── ranker.py           # Multi-faceted ranking
│   │   └── analyzer.py         # Gap & trend analysis
│   ├── data/
│   │   └── paper_store.py      # In-memory paper storage
│   └── models/
│       └── schemas.py          # Pydantic models
├── frontend/
│   ├── package.json
│   ├── public/index.html
│   └── src/
│       ├── App.js
│       ├── index.js
│       └── components/
│           ├── SearchBar.js
│           ├── PaperCard.js
│           ├── InsightsPanel.js
│           └── TrendChart.js
└── README.md
```

---

## 🧩 CORE vs SIMPLIFIED vs ADVANCED

| Feature | Priority | Notes |
|---------|----------|-------|
| API paper fetch | ⭐ CORE | Always runs |
| Sentence-BERT embed | ⭐ CORE | Always runs |
| FAISS search | ⭐ CORE | Always runs |
| Multi-factor ranking | ⭐ CORE | Always runs |
| Query refinement agent | 🔶 SIMPLIFIED | Rule-based by default |
| Gap detection | 🔶 SIMPLIFIED | Heuristic-based |
| Trend analysis | 🔷 ADVANCED | Year-based growth |
| LLM-powered analysis | 🔷 ADVANCED | Optional Claude/OpenAI |
# research_intelligence_system
