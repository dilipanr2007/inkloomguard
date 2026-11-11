import re
from typing import List, Tuple, Any

class TextPreprocessor:
    """
    Cleans, normalizes, segments, and sanitizes input text before LLM analysis.
    """
    
    EMAIL_REGEX = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b')
    # Standard telecom formats: US formatted (123) 456-7890 / 123-456-7890, or Indian mobile [6-9]xxxx-xxxxx
    # Does not match arbitrary unformatted 10-digit quantities (e.g. 1000000000 cans, 1234567890 impressions, timestamps)
    PHONE_REGEX = re.compile(
        r'(?:(?:\+?\d{1,3}[-.\s]?)?(?:\(\d{3}\)\s*|\d{3}[-.\s])\d{3}[-.\s]\d{4}\b|(?:\b\+?91[-.\s]?|\b)[6-9]\d{4}[-.\s]?\d{5}\b)'
    )
    # Requires standard space/hyphen separators to avoid matching commercial serials or view counts
    AADHAAR_SSN_REGEX = re.compile(r'\b\d{4}[-\s]\d{4}[-\s]\d{4}\b|\b\d{3}-\d{2}-\d{4}\b')
    
    # Specific personal role labels (with negative lookbehind to avoid 'Brand Name:', 'Product Name:', 'Company Name:')
    LABEL_NAME_REGEX = re.compile(
        r'(?<![Bb]rand )(?<![Pp]roduct )(?<![Cc]ompany )(?<![Cc]ampaign )(?<![Ff]ile )\b((?:Name|Author|Representative|Contact Person):\s*)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b'
    )
    # Professional honorific names
    HONORIFIC_NAME_REGEX = re.compile(
        r'\b((?:Mr\.|Mrs\.|Ms\.|Dr\.)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b'
    )

    @classmethod
    def clean_and_normalize(cls, text: str) -> str:
        if not text:
            return ""
        # Normalize multiple spaces, tabs, and newlines
        cleaned = re.sub(r'[ \t]+', ' ', text)
        cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)
        return cleaned.strip()

    @classmethod
    def redact_pii(cls, text: str) -> Tuple[str, List[str]]:
        """
        Redacts personal identifiers before external LLM transmission.
        Returns (redacted_text, list_of_redactions).
        """
        redactions = []
        
        def replace_email(match):
            val = match.group(0)
            redactions.append(f"email:{val}")
            return "[REDACTED_EMAIL]"

        def replace_phone(match):
            val = match.group(0)
            redactions.append(f"phone:{val}")
            return "[REDACTED_PHONE]"

        def replace_id(match):
            val = match.group(0)
            redactions.append(f"id_number:{val}")
            return "[REDACTED_ID]"

        def replace_label_name(match):
            prefix = match.group(1)
            name = match.group(2)
            redactions.append(f"name:{name}")
            return f"{prefix}[REDACTED_NAME]"

        def replace_honorific_name(match):
            name = match.group(1)
            redactions.append(f"name:{name}")
            return "[REDACTED_NAME]"

        redacted = cls.EMAIL_REGEX.sub(replace_email, text)
        redacted = cls.PHONE_REGEX.sub(replace_phone, redacted)
        redacted = cls.AADHAAR_SSN_REGEX.sub(replace_id, redacted)
        redacted = cls.LABEL_NAME_REGEX.sub(replace_label_name, redacted)
        redacted = cls.HONORIFIC_NAME_REGEX.sub(replace_honorific_name, redacted)
        return redacted, redactions

    @classmethod
    def restore_pii_text(cls, text: str, original_text: str, redactions: List[str]) -> str:
        """
        Restores redaction placeholders back to original text substrings for excerpt matching.
        Bounded loop guarantees termination even with cyclic/placeholder-like input.
        """
        if not text or not redactions:
            return text

        placeholders = {
            "email": "[REDACTED_EMAIL]",
            "phone": "[REDACTED_PHONE]",
            "id_number": "[REDACTED_ID]",
            "name": "[REDACTED_NAME]"
        }

        if not any(ph in text for ph in placeholders.values()):
            return text

        restored = text
        for kind, ph in placeholders.items():
            count = restored.count(ph)
            if not count:
                continue

            candidates = [
                r.split(":", 1)[1] for r in redactions
                if r.startswith(f"{kind}:") and len(r.split(":", 1)) > 1
            ]
            if not candidates:
                continue

            # Bounded iteration: executes at most the number of initial occurrences
            for _ in range(count):
                if ph not in restored:
                    break
                matched = False
                for cand in candidates:
                    if cand == ph:
                        continue
                    replaced = restored.replace(ph, cand, 1)
                    if replaced in original_text or replaced.lower() in original_text.lower():
                        restored = replaced
                        matched = True
                        break
                if not matched:
                    safe_cand = next((c for c in candidates if c != ph), None)
                    if safe_cand:
                        restored = restored.replace(ph, safe_cand, 1)
                    else:
                        break

        return restored

    @classmethod
    def restore_pii_in_findings(
        cls,
        findings: List[Any],
        original_text: str,
        redactions: List[str]
    ) -> List[Any]:
        """
        Restores redaction placeholders in finding excerpts for accurate frontend highlighting.
        Sanitizes suggested rewrites so raw PII is never re-injected into recommendations.
        """
        if not findings:
            return findings

        placeholders = ["[REDACTED_EMAIL]", "[REDACTED_PHONE]", "[REDACTED_ID]", "[REDACTED_NAME]"]

        for f in findings:
            # ONLY restore PII into excerpt for frontend in-line text matching
            if hasattr(f, 'excerpt') and f.excerpt and redactions:
                f.excerpt = cls.restore_pii_text(f.excerpt, original_text, redactions)
            # NEVER restore PII into suggested_rewrite; sanitize any placeholders
            if hasattr(f, 'suggested_rewrite') and f.suggested_rewrite:
                for ph in placeholders:
                    if ph in f.suggested_rewrite:
                        f.suggested_rewrite = "Human review required"
                        break

        return findings

    @classmethod
    def segment_sentences(cls, text: str) -> List[str]:
        """
        Splits text into sentences based on punctuation.
        """
        if not text:
            return []
        sentences = re.split(r'(?<=[.!?])\s+', text)
        return [s.strip() for s in sentences if s.strip()]
