from sentence_transformers import CrossEncoder
from typing import List
from models.schemas import Paper

# Singleton model (load only once)
_model = None

def get_reranker():
    global _model
    if _model is None:
        print("[Reranker] Loading cross-encoder model...")
        _model = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')
    return _model

def rerank_papers(query: str, papers: List[Paper]) -> List[tuple[Paper, float]]:
    """
    query: string
    papers: list of Paper objects
    returns: list of (paper, score)
    """
    if not papers:
        return []

    model = get_reranker()

    pairs = [
        (query, f"Title: {p.title}. Abstract: {p.abstract}")
        for p in papers
    ]

    # Batch prediction for safety
    scores = model.predict(pairs, batch_size=16)

    results = list(zip(papers, scores))

    # Sort by score descending
    results.sort(key=lambda x: x[1], reverse=True)

    return results

