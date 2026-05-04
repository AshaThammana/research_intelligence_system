from typing import List
from models.schemas import Paper


def extract_domain_keywords(query: str):
    query = query.lower()

    if any(k in query for k in ["nlp", "language", "text", "bert", "gpt"]):
        return "nlp"

    if any(k in query for k in ["vision", "image", "visual"]):
        return "vision"

    if any(k in query for k in ["recommendation", "recommender"]):
        return "recommendation"

    return None


def domain_filter_papers(papers: List[Paper], query: str) -> List[Paper]:
    domain = extract_domain_keywords(query)

    if not domain:
        return papers

    filtered = []

    for p in papers:
        text = (p.title + " " + p.abstract).lower()

        if domain == "nlp":

            # Allow vision/diffusion for transformer-related queries
            if "transformer" not in query.lower():
                if any(bad in text for bad in [
                    "music", "audio", "speech"
                ]):
                    continue

            # Strong NLP signals
            if any(good in text for good in [
                "language", "text", "nlp",
                "bert", "gpt",
                "transformer",
                "self-attention",
                "token", "sequence"
            ]):
                filtered.append(p)

        else:
            filtered.append(p)

    if len(filtered) < 5:
        return papers[:20]

    return filtered[:20]