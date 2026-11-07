from typing import List, Set
from app.schemas.review import FindingItem

class FindingValidator:
    """
    Verification and validation layer that screens all findings before returning them.
    Ensures zero hallucinated citations, accurate excerpt matching, and valid statuses.
    """

    ALLOWED_CATEGORIES = {
        'Brand Terminology',
        'Brand Tone',
        'Messaging Consistency',
        'Unsupported Claim',
        'Contradicted Fact',
        'Promotional Claim',
        'Style and Communication'
    }

    ALLOWED_SEVERITIES = {'high', 'medium', 'low', 'advisory'}
    ALLOWED_STATUSES = {'supported', 'contradicted', 'unsupported', 'advisory'}

    @classmethod
    def validate_findings(
        cls,
        findings: List[FindingItem],
        submitted_text: str,
        valid_source_ids: Set[str]
    ) -> List[FindingItem]:
        validated = []
        seen_excerpts = set()

        for f in findings:
            # 1. Excerpt presence check (must exist in original submitted text)
            if f.excerpt not in submitted_text and f.excerpt.lower() not in submitted_text.lower():
                # Discard finding if the excerpt was invented and does not occur in text
                continue

            # Deduplicate multiple findings on identical excerpt
            dedup_key = f"{f.excerpt.lower()}::{f.category}"
            if dedup_key in seen_excerpts:
                continue
            seen_excerpts.add(dedup_key)

            # 2. Category normalization
            if f.category not in cls.ALLOWED_CATEGORIES:
                f.category = 'Style and Communication'

            # 3. Severity normalization
            if f.severity not in cls.ALLOWED_SEVERITIES:
                f.severity = 'medium'

            # 4. Evidence Status validation
            if f.evidence_status not in cls.ALLOWED_STATUSES:
                f.evidence_status = 'unsupported'

            # 5. Citation verification: Filter out any source_id not present in valid_source_ids
            verified_sources = [sid for sid in f.source_ids if sid in valid_source_ids]
            
            # If a hard violation has NO valid source ID, downgrade or label advisory
            if not verified_sources:
                if f.severity == 'high' and f.evidence_status == 'contradicted':
                    f.evidence_status = 'unsupported'
                    f.severity = 'medium'
            f.source_ids = verified_sources

            # 6. Ensure confidence within bounds
            f.confidence = max(0.1, min(1.0, f.confidence))

            # 7. Ensure suggested_rewrite has default if missing
            if not f.suggested_rewrite:
                f.suggested_rewrite = f"[Review phrasing: {f.excerpt}]"

            validated.append(f)

        return validated
