import numpy as np
from typing import List, Dict, Any, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class KnowledgeChunk:
    def __init__(self, source_id: str, title: str, content: str, doc_type: str, metadata: Optional[Dict[str, Any]] = None):
        self.source_id = source_id
        self.title = title
        self.content = content
        self.doc_type = doc_type  # 'guideline' or 'fact'
        self.metadata = metadata or {}

    def full_text(self) -> str:
        return f"{self.title}: {self.content}"

class VectorIndex:
    """
    In-memory vector retrieval index for brand guidelines and approved facts.
    Uses TF-IDF + Cosine similarity vector representation, capable of being dynamically
    rebuilt whenever managers modify the brand library.
    """
    def __init__(self):
        self.chunks: List[KnowledgeChunk] = []
        self.vectorizer: Optional[TfidfVectorizer] = None
        self.vectors = None

    def build_index(self, guidelines: List[Dict[str, Any]], facts: List[Dict[str, Any]]) -> int:
        self.chunks = []

        # 1. Chunk Guidelines
        for g in guidelines:
            gid = g.get('id', '')
            title = g.get('title', '')
            desc = g.get('text', '')
            category = g.get('category', 'General')
            severity = g.get('severity', 'medium')

            # If description is long, we can split into logical clauses; otherwise store complete rule
            if len(desc) > 300:
                parts = desc.split('. ')
                for idx, part in enumerate(parts):
                    if part.strip():
                        self.chunks.append(KnowledgeChunk(
                            source_id=gid,
                            title=f"{title} (Part {idx+1})",
                            content=part.strip(),
                            doc_type='guideline',
                            metadata={'category': category, 'severity': severity}
                        ))
            else:
                self.chunks.append(KnowledgeChunk(
                    source_id=gid,
                    title=title,
                    content=desc,
                    doc_type='guideline',
                    metadata={'category': category, 'severity': severity}
                ))

        # 2. Chunk Approved Facts
        for f in facts:
            fid = f.get('id', '')
            statement = f.get('statement', '')
            source = f.get('source', '')
            category = f.get('category', 'General')

            self.chunks.append(KnowledgeChunk(
                source_id=fid,
                title=f"Approved Fact: {category}",
                content=statement,
                doc_type='fact',
                metadata={'source_doc': source, 'category': category}
            ))

        if not self.chunks:
            self.vectorizer = None
            self.vectors = None
            return 0

        # Build TF-IDF vector matrix
        corpus = [c.full_text() for c in self.chunks]
        self.vectorizer = TfidfVectorizer(stop_words='english', lowercase=True, ngram_range=(1, 2))
        self.vectors = self.vectorizer.fit_transform(corpus)
        return len(self.chunks)

    def retrieve(self, query: str, top_k: int = 4, min_score: float = 0.05) -> List[Dict[str, Any]]:
        """
        Retrieves the top-k most semantically relevant knowledge chunks for a query string.
        """
        if not self.vectorizer or self.vectors is None or not self.chunks:
            return []

        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.vectors).flatten()

        top_indices = np.argsort(similarities)[::-1][:top_k]
        results = []

        for idx in top_indices:
            score = float(similarities[idx])
            if score >= min_score or len(results) == 0:
                chunk = self.chunks[idx]
                results.append({
                    'source_id': chunk.source_id,
                    'title': chunk.title,
                    'content': chunk.content,
                    'doc_type': chunk.doc_type,
                    'similarity_score': round(score, 4),
                    'metadata': chunk.metadata
                })

        return results

# Singleton vector index instance for service lifecycle
global_vector_index = VectorIndex()
