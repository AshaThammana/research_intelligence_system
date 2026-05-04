from models.schemas import Paper

def score_paper(paper):
    score = 0

    text = (paper.title + " " + paper.abstract).lower()

    # NLP relevance
    if any(k in text for k in ["nlp", "language", "text", "bert", "gpt"]):
        score += 3

    # Transformer relevance
    if any(k in text for k in ["transformer", "attention", "self-attention"]):
        score += 2

    # Penalize wrong domains
    if any(k in text for k in ["music", "audio", "vision", "image", "diffusion"]):
        score -= 3

    # Citation boost
    if paper.citation_count and paper.citation_count > 50:
        score += 2

    return score

