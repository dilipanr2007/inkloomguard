import re
from typing import List, Tuple

class TextPreprocessor:
    """
    Cleans, normalizes, segments, and sanitizes input text before LLM analysis.
    """
    
    EMAIL_REGEX = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b')
    PHONE_REGEX = re.compile(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b')
    AADHAAR_SSN_REGEX = re.compile(r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}\b|\b\d{3}-\d{2}-\d{4}\b')

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

        redacted = cls.EMAIL_REGEX.sub(replace_email, text)
        redacted = cls.PHONE_REGEX.sub(replace_phone, redacted)
        redacted = cls.AADHAAR_SSN_REGEX.sub(replace_id, redacted)
        return redacted, redactions

    @classmethod
    def segment_sentences(cls, text: str) -> List[str]:
        """
        Splits text into sentences based on punctuation.
        """
        if not text:
            return []
        sentences = re.split(r'(?<=[.!?])\s+', text)
        return [s.strip() for s in sentences if s.strip()]
