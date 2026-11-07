import re
from typing import List, Dict, Any
from app.schemas.review import FindingItem

class DeterministicRuleEngine:
    """
    Executes precise deterministic rules against submitted content.
    Guarantees that hard terminology violations and prohibited words
    are always caught regardless of LLM availability.
    """

    @classmethod
    def evaluate_terminology(cls, text: str, terminology_rules: List[Dict[str, Any]]) -> List[FindingItem]:
        findings = []

        for rule in terminology_rules:
            term_id = rule.get('id', 'TERM-001')
            preferred = rule.get('preferred_term', '')
            prohibited_list = rule.get('prohibited_terms', [])
            explanation = rule.get('explanation', f"Use preferred brand term '{preferred}'.")
            severity = rule.get('severity', 'high')
            case_sensitive = rule.get('case_sensitive', False)

            flags = 0 if case_sensitive else re.IGNORECASE

            for prohibited in prohibited_list:
                if not prohibited.strip():
                    continue

                # Escape special characters in prohibited term for regex, ensuring word boundaries where applicable
                escaped = re.escape(prohibited)
                # If term ends with '+' or symbol, \b won't match after non-word characters
                if prohibited.endswith('+') or not prohibited[-1].isalnum():
                    pattern = rf'(?:\b|^){escaped}(?:\b|$|\s|[.,!?;:])'
                else:
                    pattern = rf'\b{escaped}\b'

                for match in re.finditer(pattern, text, flags):
                    matched_str = match.group(0).rstrip(' .,!?;:')
                    
                    finding = FindingItem(
                        category="Brand Terminology",
                        severity=severity,
                        excerpt=matched_str,
                        reason=explanation or f"'{matched_str}' is a prohibited brand term. The approved standard is '{preferred}'.",
                        evidence_status="contradicted",
                        source_ids=[term_id],
                        source_excerpt=f"Preferred brand term: '{preferred}'. Prohibited variations: {', '.join(prohibited_list)}.",
                        suggested_rewrite=preferred,
                        confidence=0.99
                    )
                    findings.append(finding)

        return findings

    @classmethod
    def evaluate_formatting_and_tone_heuristics(cls, text: str, guidelines: List[Dict[str, Any]]) -> List[FindingItem]:
        """
        Lightweight deterministic heuristics for aggressive punctuation and urgency.
        """
        findings = []

        # Find GUIDE-004 if present
        tone_guide = next((g for g in guidelines if g.get('id') == 'GUIDE-004'), None)
        tone_id = tone_guide.get('id') if tone_guide else 'GUIDE-004'
        tone_text = tone_guide.get('text') if tone_guide else 'Use a professional, friendly, and informative tone.'

        # Multiple exclamation marks (e.g. !!!, !!)
        excl_matches = list(re.finditer(r'!{2,}', text))
        for m in excl_matches:
            # Expand context around exclamation marks to include preceding word if available
            start = max(0, m.start() - 15)
            snippet = text[start:m.end()].strip()
            findings.append(FindingItem(
                category="Brand Tone",
                severity="advisory",
                excerpt=snippet,
                reason="Excessive exclamation marks create an aggressive or sensationalist tone contrary to brand guidelines.",
                evidence_status="advisory",
                source_ids=[tone_id],
                source_excerpt=tone_text,
                suggested_rewrite=re.sub(r'!{2,}', '.', snippet),
                confidence=0.88
            ))

        return findings
