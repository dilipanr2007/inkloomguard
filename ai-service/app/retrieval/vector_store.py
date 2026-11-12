import re
import numpy as np
from typing import List, Dict, Any, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class KnowledgeChunk:
    def __init__(self, source_id: str, title: str, content: str, doc_type: str, metadata: Optional[Dict[str, Any]] = None):
        self.source_id = source_id
        self.title = title
        self.content = content
        self.doc_type = doc_type  # 'guideline', 'regulatory', or 'fact'
        self.metadata = metadata or {}

    def full_text(self) -> str:
        category = self.metadata.get('category', '')
        return f"{self.source_id} {self.title} {category}: {self.content}"

class VectorIndex:
    """
    Hybrid semantic retrieval index for brand guidelines, statutory regulations,
    and approved product facts.
    Combines TF-IDF n-gram vectorization with domain semantic keyword boosting
    to ensure relevant regulatory and brand standards are always surfaced even when
    exact lexical overlap is sparse.
    """
    def __init__(self):
        self.chunks: List[KnowledgeChunk] = []
        self.vectorizer: Optional[TfidfVectorizer] = None
        self.vectors = None

    def build_index(self, guidelines: List[Dict[str, Any]], facts: List[Dict[str, Any]]) -> int:
        self.chunks = []

        # 1. Chunk Guidelines & Statutory Regulations
        for g in guidelines:
            gid = g.get('id', '') or g.get('guidelineId', '')
            title = g.get('title', '')
            desc = g.get('text', '') or g.get('description', '')
            category = g.get('category', 'General')
            severity = g.get('severity', 'medium')
            source_url = g.get('sourceUrl', '')
            source_clause = g.get('sourceClause', '')
            regulatory_body = g.get('regulatoryBody', 'Internal')

            # Expand chunk with clause metadata if regulatory
            chunk_metadata = {
                'category': category,
                'severity': severity,
                'source_url': source_url,
                'source_clause': source_clause,
                'regulatory_body': regulatory_body
            }

            if len(desc) > 350:
                parts = desc.split('. ')
                for idx, part in enumerate(parts):
                    if part.strip():
                        self.chunks.append(KnowledgeChunk(
                            source_id=gid,
                            title=f"{title} (Part {idx+1})",
                            content=part.strip(),
                            doc_type='regulatory' if gid.startswith('REG-') else 'guideline',
                            metadata=chunk_metadata
                        ))
            else:
                self.chunks.append(KnowledgeChunk(
                    source_id=gid,
                    title=title,
                    content=desc,
                    doc_type='regulatory' if gid.startswith('REG-') else 'guideline',
                    metadata=chunk_metadata
                ))

        # 2. Chunk Approved Facts
        for f in facts:
            fid = f.get('id', '') or f.get('factId', '')
            statement = f.get('statement', '')
            source = f.get('source', '') or f.get('sourceDoc', '')
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

        # Build TF-IDF vector matrix with sublinear TF scaling
        corpus = [c.full_text() for c in self.chunks]
        self.vectorizer = TfidfVectorizer(
            stop_words='english',
            lowercase=True,
            ngram_range=(1, 2),
            sublinear_tf=True
        )
        self.vectors = self.vectorizer.fit_transform(corpus)
        return len(self.chunks)

    def retrieve(self, query: str, top_k: int = 6, min_score: float = 0.02) -> List[Dict[str, Any]]:
        """
        Retrieves the top-k most semantically relevant knowledge chunks for a query string.
        Applies hybrid semantic boosting to resolve cross-domain terminology (e.g. immunity -> health claims).
        """
        if not self.vectorizer or self.vectors is None or not self.chunks:
            return []

        query_lower = query.lower()
        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.vectors).flatten()

        scored_chunks = []
        for idx, base_score in enumerate(similarities):
            chunk = self.chunks[idx]
            score = float(base_score)
            cid = chunk.source_id.upper()
            cat = chunk.metadata.get('category', '').lower()

            # Semantic boost 1: Health & Curative Claims
            if any(k in query_lower for k in ['cure', 'curing', 'fatigue', 'tired', 'immunity', 'disease', 'viral', 'flu', 'cold', 'stamina', 'vitality']):
                if 'unsupported claim' in cat or 'regulatory compliance' in cat or 'GUIDE-002' in cid or 'REG-FSSAI-001' in cid:
                    score += 0.35

            # Semantic boost 2: Superlatives & Market Leadership
            if any(k in query_lower for k in ['no. 1', 'no.1', '#1', 'best', "world's best", 'leader', 'guarantee', 'guaranteed']):
                if 'promotional claim' in cat or 'GUIDE-003' in cid or 'REG-ASCI-001' in cid or 'REG-CCPA-001' in cid:
                    score += 0.35

            # Semantic boost 3: Terminology & Brand Name Formatting
            if any(k in query_lower for k in ['fresh+', 'fresh plus', 'sugar free', 'orange soda', 'synthetic']):
                if 'brand terminology' in cat or 'GUIDE-001' in cid or 'TERM-001' in cid or 'REG-FSSAI-003' in cid:
                    score += 0.35

            # Semantic boost 4: Influencer Endorsement & Material Connection
            if any(k in query_lower for k in ['influencer', 'creator', 'reel', 'post-workout', 'routine', '#ad', 'sponsored']):
                if 'influencer marketing' in cat or 'GUIDE-008' in cid or 'REG-ASCI-002' in cid or 'REG-CCPA-002' in cid:
                    score += 0.35

            scored_chunks.append((score, chunk))

        # Sort descending by hybrid score
        scored_chunks.sort(key=lambda x: x[0], reverse=True)

        results = []
        for score, chunk in scored_chunks[:top_k]:
            if score >= min_score or len(results) == 0:
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
