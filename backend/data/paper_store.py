"""
Paper Store: In-memory storage with deduplication and preprocessing.

Preprocessing pipeline:
1. Remove duplicates (by title similarity or DOI)
2. Handle missing values
3. Clean text (remove HTML, extra whitespace)
4. Normalize data
"""

import re
import unicodedata
from typing import List, Dict, Optional
from models.schemas import Paper


def clean_text(text: str) -> str:
    """Remove HTML tags, normalize whitespace, unicode."""
    if not text:
        return ""
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # Normalize unicode
    text = unicodedata.normalize('NFKC', text)
    # Collapse whitespace
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def normalize_title(title: str) -> str:
    """Lowercase, remove punctuation for dedup comparison."""
    return re.sub(r'[^a-z0-9]', '', title.lower())


class PaperStore:
    """
    Thread-safe in-memory paper storage with deduplication.
    """

    def __init__(self):
        self._papers: Dict[str, Paper] = {}   # id → Paper
        self._title_hashes: set = set()        # normalized title hashes for dedup

    def add_papers(self, papers: List[Paper]) -> List[Paper]:
        """
        Add papers after preprocessing and deduplication.
        Returns only newly added papers.
        """
        new_papers = []

        for paper in papers:
            # Preprocess
            paper = self._preprocess(paper)

            # Dedup by normalized title
            title_hash = normalize_title(paper.title)
            if title_hash in self._title_hashes:
                continue
            if paper.id in self._papers:
                continue

            # Add
            self._title_hashes.add(title_hash)
            self._papers[paper.id] = paper
            new_papers.append(paper)

        return new_papers

    def get(self, paper_id: str) -> Optional[Paper]:
        return self._papers.get(paper_id)

    def get_all(self) -> List[Paper]:
        return list(self._papers.values())

    def get_by_ids(self, ids: List[str]) -> List[Paper]:
        return [self._papers[pid] for pid in ids if pid in self._papers]

    def clear(self):
        self._papers.clear()
        self._title_hashes.clear()

    @property
    def size(self) -> int:
        return len(self._papers)

    def _preprocess(self, paper: Paper) -> Paper:
        """Clean and normalize paper fields."""
        paper.title = clean_text(paper.title) or "Untitled"
        paper.abstract = clean_text(paper.abstract)

        # Handle missing year
        if paper.year and (paper.year < 1900 or paper.year > 2030):
            paper.year = None

        # Handle negative citations
        if paper.citation_count < 0:
            paper.citation_count = 0

        # Clean authors
        paper.authors = [clean_text(a) for a in paper.authors if a][:5]

        return paper


# Singleton
_store_instance: Optional[PaperStore] = None


def get_paper_store() -> PaperStore:
    global _store_instance
    if _store_instance is None:
        _store_instance = PaperStore()
    return _store_instance
