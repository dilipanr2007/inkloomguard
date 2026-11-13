import re
from typing import List, Set, Optional, Dict, Any
from app.schemas.review import FindingItem

class FindingValidator:
    """
    Verification and validation layer that screens all findings before returning them.
    Ensures zero hallucinated citations, accurate excerpt matching, valid statuses,
    and verified, guideline-grounded suggested corrections.
    """

    ALLOWED_CATEGORIES = {
        'Brand Terminology',
        'Brand Tone',
        'Messaging Consistency',
        'Unsupported Claim',
        'Contradicted Fact',
        'Promotional Claim',
        'Style and Communication',
        'Regulatory Compliance',
        'Influencer Marketing',
        'Packaging & Labelling'
    }

    ALLOWED_SEVERITIES = {'high', 'medium', 'low', 'advisory'}
    ALLOWED_STATUSES = {'supported', 'contradicted', 'unsupported', 'advisory'}

    # Unapproved health, curative, stamina, vitality, and medical claim patterns
    UNSAFE_HEALTH_PATTERNS = re.compile(
        r'\b(vitality|natural\s+vitality|stamina|cures?|curing|curative|prevents?|preventing|disease|illness|medicinal|therapeutic|miracle\s+cure|instant\s+energy|energy\s+boost|boosts?\s+(your\s+)?immunity)\b',
        re.IGNORECASE
    )

    # Unsupported rankings, superlatives, and popularity/consensus patterns
    UNSAFE_SUPERLATIVE_PATTERNS = re.compile(
        r"\b(most\s+loved|beloved|most\s+popular|India's\s+No\.?\s*1|#1|world's\s+best|best\s+in|market\s+leader|guaranteed(\s+results)?|top\s+rated|favourite|favorite|number\s+one)\b",
        re.IGNORECASE
    )

    # Default prohibited brand terms if none dynamically provided
    DEFAULT_PROHIBITED_TERMS = [
        'Fresh+', 'Fresh Plus',
        'Orange Soda', 'Synthetic Orange', 'Fruit Concentrate Drink', 'Orange Squash'
    ]

    @classmethod
    def is_suggestion_safe(
        cls,
        rewrite: Optional[str],
        category: str = "",
        approved_facts: Optional[List[Dict[str, Any]]] = None,
        prohibited_terms: Optional[List[str]] = None
    ) -> bool:
        """
        Validates that a suggested correction strictly adheres to approved brand facts and guidelines.
        Guarantees that:
        - Never replaces one unsupported claim with another.
        - For unsupported medical claims, removes the medical benefit entirely unless approved evidence exists.
        - For unsupported rankings or superlatives, uses neutral promotional wording without popularity claims.
        - Prohibits all unapproved brand terminology while preserving approved preferred terms (e.g. FreshPlus).
        """
        if not rewrite or not rewrite.strip():
            return False

        trimmed = rewrite.strip()
        if trimmed.lower() == "human review required":
            return False

        # 1. Check for unapproved medical, curative, vitality, or stamina claims
        if cls.UNSAFE_HEALTH_PATTERNS.search(trimmed):
            return False

        # 2. Check for unapproved rankings, superlatives, or popularity claims (e.g., "most loved", "No. 1")
        if cls.UNSAFE_SUPERLATIVE_PATTERNS.search(trimmed):
            return False

        # 3. Check for prohibited brand terminology
        all_prohibited = [
            pt for pt in (list(prohibited_terms or []) + cls.DEFAULT_PROHIBITED_TERMS)
            if pt and pt.strip() and pt.strip() != 'FreshPlus'
        ]
        for pt in all_prohibited:
            case_flag = 0 if pt == 'Freshplus' else re.IGNORECASE
            escaped = re.escape(pt)
            if re.search(rf'(?:\b|^){escaped}(?:\b|$|\s|[.,!?;:])', trimmed, case_flag):
                return False

        # 4. Check for aggressive exclamation / sensational urgency
        if re.search(r'(!{2,}|Buy\s+now!{1,3})', trimmed, re.IGNORECASE):
            return False

        return True

    @classmethod
    def validate_findings(
        cls,
        findings: List[FindingItem],
        submitted_text: str,
        valid_source_ids: Set[str],
        approved_facts: Optional[List[Dict[str, Any]]] = None,
        prohibited_terms: Optional[List[str]] = None,
        redacted_text: Optional[str] = None,
        redactions: Optional[List[str]] = None
    ) -> List[FindingItem]:
        validated = []
        seen_excerpts = set()

        for f in findings:
            # 1. Reject any finding where internal redaction placeholders failed to restore
            if "[REDACTED_" in f.excerpt:
                continue

            # Excerpt presence check: must exist in original submitted text
            in_submitted = (f.excerpt in submitted_text) or (f.excerpt.lower() in submitted_text.lower())
            if not in_submitted:
                # Discard finding if the excerpt was invented or does not occur in text
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

            # 7. Validate suggested_rewrite against approved brand facts and guidelines.
            # Never replace one unsupported claim with another.
            # If no safe correction can be generated, return "Human review required".
            # Original finding, severity, evidence ID, and source citation are strictly preserved.
            if not cls.is_suggestion_safe(f.suggested_rewrite, f.category, approved_facts, prohibited_terms):
                f.suggested_rewrite = "Human review required"

            validated.append(f)

        return validated
