"""
Research Intelligence System — FastAPI Backend

ROLE: Orchestrate the full research intelligence pipeline
INTENT: Accept query → return analyzed papers, gaps, trends
CONTEXT: Called by React frontend on port 3000
"""

import asyncio
import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

from models.schemas import QueryRequest, SearchResponse, Paper
from agents.query_agent import QueryAgent
from api.semantic_scholar import fetch_semantic_scholar
from api.arxiv_client import fetch_arxiv
from core.embedder import get_embedder
from core.faiss_store import get_faiss_store
from core.ranker import rank_papers
from core.analyzer import analyze
from core.semantic_search import semantic_search
from core.reranker import rerank_papers
from core.clustering import generate_research_themes
from core.domain_filter import domain_filter_papers
from data.paper_store import get_paper_store


# ─────────────────────────────────────────
# APP SETUP
# ─────────────────────────────────────────
app = FastAPI(
    title="Research Intelligence System",
    description="AI-powered research paper analysis and insight generation",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Singletons
agent = QueryAgent()


# ─────────────────────────────────────────
# ROUTES
# ─────────────────────────────────────────

@app.get("/")
async def root():
    return {"status": "ok", "message": "Research Intelligence System is running"}


@app.get("/health")
async def health():
    store = get_paper_store()
    faiss = get_faiss_store()
    return {
        "status": "healthy",
        "papers_in_store": store.size,
        "vectors_in_index": faiss.size,
    }


@app.post("/search", response_model=SearchResponse)
async def search(request: QueryRequest):
    """
    Main search endpoint.
    """
    start_time = time.time()

    # Step 1: Query Refinement
    agent_result = agent.refine(request.query)
    refined_query = agent_result["refined_query"]
    topics = agent_result["topics"]

    # Strict query shaping for API retrieval
    retrieval_query = refined_query
    query_lower = refined_query.lower()

    if "attention" in query_lower:
        retrieval_query = refined_query + " NLP language model transformer BERT GPT"
    elif "federated learning" in query_lower:
        retrieval_query = refined_query + " secure aggregation distributed training privacy"

    print("Retrieval query:", retrieval_query)
    print("Refined query (internal):", refined_query)

    # Step 2: Fetch Papers
    ss_papers, arxiv_papers = await asyncio.gather(
        fetch_semantic_scholar(retrieval_query, limit=10),
        fetch_arxiv(retrieval_query, limit=10),
        return_exceptions=False,
    )
    print("Semantic Scholar:", len(ss_papers))
    print("arXiv:", len(arxiv_papers))

    all_fetched = ss_papers + arxiv_papers
    total_fetched = len(all_fetched)

    # High-quality source/citation filter
    trusted_sources = [
        "ieee", "acl", "springer", "elsevier",
        "neurips", "icml", "cvpr"
    ]
    
    def is_high_quality(paper):
        source_lower = (paper.source or "").lower()
        if any(s in source_lower for s in trusted_sources):
            return True
        if paper.citation_count and paper.citation_count >= 10:
            return True
        return False
    
    filtered_papers = [p for p in all_fetched if is_high_quality(p)]
    
    if len(filtered_papers) < 10:
        filtered_papers = all_fetched
        print("Quality filter skipped (fallback: too few papers)")
    else:
        print(f"Trusted papers filtered: {len(filtered_papers)}/{total_fetched}")

    from core.paper_scorer import score_paper

    scored_papers = [(p, score_paper(p)) for p in filtered_papers]
    scored_papers.sort(key=lambda x: x[1], reverse=True)

        # Relax filtering
    filtered_papers = [p for p, s in scored_papers if s >= -1]

        # Fallback if too few papers
    if len(filtered_papers) < 5:
            print("Scoring fallback used")
            filtered_papers = [p for p, s in scored_papers[:10]]

    print(f"After paper scoring: {len(filtered_papers)}")
    # FIXED INDENTATION ONLY
    if total_fetched == 0:
        filtered_papers = [
            Paper(
                id="demo_1",
                title="Machine Learning Basics",
                abstract="This is a fallback demo paper for machine learning.",
                authors=["Demo Author"],
                year=2023,
                citation_count=100,
                source="demo",
                relevance_score=0.9,
                final_score=0.9,
            )
        ]
        total_fetched = 1

    # Step 3: Store
    paper_store = get_paper_store()
    faiss_store = get_faiss_store()
    embedder = get_embedder()

    new_papers = paper_store.add_papers(filtered_papers)

    # Step 4: Embed
    if new_papers:
        texts = [p.title + ". " + p.abstract for p in new_papers]
        embeddings = embedder.embed_batch(texts)
        faiss_store.add_papers(new_papers, embeddings)

    # Step 5: Search
    query_vec = embedder.embed_text(refined_query)
    results = faiss_store.search(query_vec, top_k=min(100, faiss_store.size))

    result_ids = [r[0] for r in results]
    similarity_map = {r[0]: r[1] for r in results}

    candidate_papers = paper_store.get_by_ids(result_ids)

    # Step 6: Ranking
    ranked_papers = rank_papers(
        candidate_papers,
        similarity_map,
        top_n=request.max_results,
    )

    # Step 6.5: Semantic Search + Reranking for Analysis and Response
    papers = all_fetched
    try:
        semantic_results = semantic_search(refined_query, papers, top_k=100)
        print("Semantic candidates:", len(semantic_results))
        filtered_results = [
            item for item in semantic_results 
            if item["score"] >= 0.15
        ]
        if len(filtered_results) < 5:
            filtered_results = semantic_results[:15]
        print("After semantic filter:", len(filtered_results))
        
        top_papers = [item["paper"] for item in filtered_results]
        print(f"Filtered semantic papers: {len(filtered_results)}")
        
        top_papers = domain_filter_papers(top_papers, refined_query)
        print(f"After domain pre-filter: {len(top_papers)}")
        
        # Rerank for precision filtering
        reranked = rerank_papers(refined_query, top_papers)
        
        query_lower = refined_query.lower()

        if "transformer" in query_lower or "attention" in query_lower:
            threshold = 0.05
        else:
            threshold = 0.1

        filtered_reranked = [
            (paper, score) for paper, score in reranked
            if score >= threshold
        ]
        print("After reranker filter:", len(filtered_reranked))
        
        if len(filtered_reranked) < 5:
            print("Final fallback used")
            final_papers = [paper for paper, score in reranked[:10]]
        else:
            final_papers = [paper for paper, score in filtered_reranked[:10]]

        print("Reranking applied. Final papers:", len(final_papers))
    except Exception as e:
        print(f"Reranking pipeline failed: {e}, using semantic results")
        final_papers = top_papers[:10] if 'top_papers' in locals() else papers[:10]

    # Step 7: Analysis - use reranked final papers
    analysis = analyze(final_papers, refined_query, topics)
    analysis.refined_query = refined_query
    
    themes = generate_research_themes(final_papers)
    print("Generated themes:", themes)

    elapsed_ms = (time.time() - start_time) * 1000

    return SearchResponse(
        query=request.query,
        refined_query=refined_query,
        papers=final_papers,
        analysis=analysis,
        total_fetched=total_fetched,
        processing_time_ms=round(elapsed_ms, 1),
        themes=themes
    )


@app.delete("/cache")
async def clear_cache():
    get_paper_store().clear()
    get_faiss_store().clear()
    return {"status": "cleared"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
