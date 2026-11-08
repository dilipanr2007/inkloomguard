import os
import json
import re
from typing import List, Dict, Any, Optional
from app.schemas.review import FindingItem

class LLMReviewer:
    """
    Orchestrates evidence-grounded review via Google Gemini API
    with strict system instructions enforcing source citations and fallback resiliency.
    """

    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")

    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 10)

    def analyze_content(
        self,
        submitted_text: str,
        content_type: str,
        retrieved_context: List[Dict[str, Any]],
        all_guidelines: List[Dict[str, Any]],
        all_facts: List[Dict[str, Any]]
    ) -> List[FindingItem]:
        """
        Sends grounded prompt to Gemini or runs intelligent heuristic review if API key is not present.
        """
        if not self.is_configured():
            return self._heuristic_fallback_review(submitted_text, all_guidelines, all_facts)

        try:
            return self._call_gemini_api(submitted_text, content_type, retrieved_context, all_guidelines, all_facts)
        except Exception as e:
            print(f"[Gemini API Call Exception: {e}] Falling back to heuristic governance analyzer.")
            return self._heuristic_fallback_review(submitted_text, all_guidelines, all_facts)

    def _call_gemini_api(
        self,
        text: str,
        content_type: str,
        retrieved_context: List[Dict[str, Any]],
        all_guidelines: List[Dict[str, Any]],
        all_facts: List[Dict[str, Any]]
    ) -> List[FindingItem]:
        import google.generativeai as genai
        genai.configure(api_key=self.api_key)

        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config={"response_mime_type": "application/json", "temperature": 0.2}
        )

        context_summary = "\n".join([
            f"[{c['source_id']}] {c['title']}: {c['content']}"
            for c in retrieved_context
        ])

        system_instruction = f"""
You are INKLOOM AI, an enterprise source-grounded Brand Governance Review Engine.
Your role is to review marketing content against APPROVED brand guidelines and facts.

STRICT OPERATIONAL RULES:
1. ONLY cite source IDs that are explicitly present in the provided Approved Knowledge. Never invent or hallucinate source IDs.
2. Distinguish EVIDENCE STATUS carefully:
   - "unsupported": A factual or medical or promotional claim made without supporting evidence in the approved facts library.
   - "contradicted": A claim that directly contradicts an approved guideline or approved fact.
   - "advisory": Tone, style, or subjective guidance where evidence suggests a softer correction.
3. Every finding MUST contain an exact substring "excerpt" from the submitted content.
4. STRICT SUGGESTED CORRECTION REQUIREMENTS:
   - Never replace one unsupported claim with another.
   - Every suggested correction MUST be strictly checked against approved brand facts and guidelines.
   - For unsupported medical or curative claims, REMOVE the medical benefit entirely unless approved clinical evidence exists in the Approved Knowledge. Never suggest ungrounded health or vitality claims (e.g. do NOT use "vitality", "natural vitality", "stamina", or "cure").
   - For unsupported rankings, superlatives, or popularity claims (such as "India's No. 1", "World's best"), use neutral promotional wording (e.g. "a refreshing fruit juice", "our quality beverage"). Never introduce unsupported popularity or consensus claims (e.g. do NOT use "most loved" or "beloved").
   - If no safe correction can be generated from approved evidence, you MUST return "Human review required" as the suggested_rewrite.
5. If the content complies with a rule, DO NOT generate a finding for it.

APPROVED KNOWLEDGE FOR THIS REVIEW:
{context_summary}

CONTENT TYPE: {content_type}
SUBMITTED CONTENT TO REVIEW:
\"\"\"{text}\"\"\"

Return a valid JSON array of findings adhering to this exact schema:
[
  {{
    "category": "Brand Terminology | Brand Tone | Messaging Consistency | Unsupported Claim | Contradicted Fact | Promotional Claim | Style and Communication",
    "severity": "high | medium | low | advisory",
    "excerpt": "Exact substring from content",
    "reason": "Clear explanation of the conflict",
    "evidence_status": "unsupported | contradicted | advisory | supported",
    "source_ids": ["GUIDE-XXX"],
    "source_excerpt": "Quote from approved guideline",
    "suggested_rewrite": "Clean corrected phrasing",
    "confidence": 0.95
  }}
]
"""

        response = model.generate_content(system_instruction)
        raw_json = response.text.strip()
        parsed = json.loads(raw_json)

        findings = []
        if isinstance(parsed, list):
            for item in parsed:
                findings.append(FindingItem(**item))
        elif isinstance(parsed, dict) and "findings" in parsed:
            for item in parsed["findings"]:
                findings.append(FindingItem(**item))

        return findings

    def _heuristic_fallback_review(
        self,
        text: str,
        guidelines: List[Dict[str, Any]],
        facts: List[Dict[str, Any]]
    ) -> List[FindingItem]:
        """
        Deterministic semantic heuristic fallback ensuring complete governance review
        even when offline or without Gemini API key.
        """
        findings = []

        # 1. Health and curative claims check
        health_pattern = re.compile(r'\b(cures?\s+fatigue(\s+instantly)?|cures?\s+\w+|prevents?\s+disease|miracle\s+cure|instant\s+energy)\b', re.IGNORECASE)
        health_match = health_pattern.search(text)
        if health_match:
            guide = next((g for g in guidelines if 'GUIDE-002' in g.get('id', '')), None) or {
                'id': 'GUIDE-002',
                'text': 'Do not use unsupported health benefit claims. All statements asserting curative, medicinal, or disease prevention properties are strictly prohibited unless substantiated by an active approved clinical fact.'
            }
            findings.append(FindingItem(
                category="Unsupported Claim",
                severity="high",
                excerpt=health_match.group(0),
                reason="Medical outcome or curative claim made without approved clinical fact in the brand knowledge library.",
                evidence_status="unsupported",
                source_ids=[guide['id']],
                source_excerpt=guide['text'],
                suggested_rewrite="delivers daily refreshment",
                confidence=0.94
            ))

        # 2. Superlative promotional claim check (e.g. India's No. 1, World's Best)
        superlative_pattern = re.compile(r"\b(India's\s+No\.?\s*1|World's\s+best|#1\s+juice|guaranteed\s+best)\b", re.IGNORECASE)
        sup_match = superlative_pattern.search(text)
        if sup_match:
            guide = next((g for g in guidelines if 'GUIDE-003' in g.get('id', '')), None) or {
                'id': 'GUIDE-003',
                'text': 'Promotional superlatives such as "India\'s No. 1" require documented, verified evidence in the brand repository before publication.'
            }
            findings.append(FindingItem(
                category="Promotional Claim",
                severity="medium",
                excerpt=sup_match.group(0),
                reason="Market leadership superlative claim requires documented verification in the facts repository.",
                evidence_status="unsupported",
                source_ids=[guide['id']],
                source_excerpt=guide['text'],
                suggested_rewrite="a refreshing fruit juice",
                confidence=0.91
            ))

        # 3. Aggressive promotional tone (e.g. "Buy now!!!")
        urgency_pattern = re.compile(r'\b(Buy\s+now!{1,3}|Hurry\s+now!*)\b', re.IGNORECASE)
        urgency_match = urgency_pattern.search(text)
        if urgency_match:
            guide = next((g for g in guidelines if 'GUIDE-004' in g.get('id', '')), None) or {
                'id': 'GUIDE-004',
                'text': 'Use a professional, friendly, and informative tone. Avoid sensationalist punctuation and aggressive urgency.'
            }
            findings.append(FindingItem(
                category="Brand Tone",
                severity="advisory",
                excerpt=urgency_match.group(0),
                reason="Aggressive commercial urgency conflicts with our approachable and informative brand tone.",
                evidence_status="advisory",
                source_ids=[guide['id']],
                source_excerpt=guide['text'],
                suggested_rewrite="Experience FreshPlus today.",
                confidence=0.87
            ))

        return findings
