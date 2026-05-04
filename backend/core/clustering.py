from core.embedder import get_embedder
from sklearn.cluster import KMeans
from collections import Counter

def cluster_papers(papers, n_clusters=None):
    """
    papers: list of Paper objects
    returns: dictionary of clusters
    """
    if not papers:
        return {}
    
    if n_clusters is None:
        n_clusters = min(3, max(2, len(papers)//2))
    
    embedder = get_embedder()

    texts = [
        f"Title: {p.title}. Abstract: {p.abstract}"
        for p in papers
    ]

    if not texts:
        return {}
    
    embeddings = embedder.embed_batch(texts)

    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    labels = kmeans.fit_predict(embeddings)

    clusters = {}

    for label, paper in zip(labels, papers):
        if label not in clusters:
            clusters[label] = []
        clusters[label].append(paper)

    return clusters


def extract_cluster_keywords(cluster):
    text = " ".join([p.title + " " + p.abstract for p in cluster]).lower()

    words = text.split()

    stopwords = {"the", "and", "of", "to", "in", "for", "with", "on", "a", "is", "are"}

    filtered = [w for w in words if w not in stopwords and len(w) > 4]

    common = Counter(filtered).most_common(5)

    return [word for word, _ in common]


def generate_theme_name(keywords):
    if not keywords:
        return "General Research"

    keywords_lower = [kw.lower() for kw in keywords]

    # Specific rules FIRST
    if "self-attention" in keywords_lower:
        return "Self-Attention in Deep Learning"

    if "transformer" in keywords_lower and "attention" in keywords_lower:
        return "Transformer Attention Mechanisms"

    if "graph" in keywords_lower:
        return "Graph Neural Networks"

    if "recommendation" in keywords_lower:
        return "Recommendation Systems"

    if "diffusion" in keywords_lower:
        return "Diffusion Models"

    if "kernel" in keywords_lower:
        return "Kernel-based Learning Methods"

    # fallback
    return " ".join([kw.capitalize() for kw in keywords[:3]])


def generate_research_themes(papers):
    if not papers:
        return []
    
    clusters = cluster_papers(papers)

    themes = []

    for label, cluster in clusters.items():
        keywords = extract_cluster_keywords(cluster)

        themes.append({
            "cluster_id": int(label),
            "size": int(len(cluster)),
            "keywords": [str(kw) for kw in keywords],
            "theme_name": generate_theme_name(keywords)
        })

    return themes

