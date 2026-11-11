import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.preprocessor import TextPreprocessor
from app.rules.rule_engine import DeterministicRuleEngine
from app.retrieval.vector_store import VectorIndex
from app.validators.finding_validator import FindingValidator
from app.schemas.review import FindingItem

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["brand_identity"] == "InkloomGuard"
    assert data["domain"] == "https://inkloomguard.xyz"

def test_preprocessor_pii_redaction():
    sample_text = "Contact Priya at priya.sharma@freshplus.io or call +91-98765-43210 for details."
    redacted, items = TextPreprocessor.redact_pii(sample_text)
    assert "[REDACTED_EMAIL]" in redacted
    assert "priya.sharma@freshplus.io" not in redacted
    assert len(items) >= 1

def test_deterministic_terminology_violation():
    text = "Fresh+ cures fatigue instantly!"
    rules = [{
        "id": "TERM-001",
        "preferred_term": "FreshPlus",
        "prohibited_terms": ["Fresh+", "Fresh Plus"],
        "explanation": "Use CamelCase FreshPlus.",
        "severity": "high"
    }]
    findings = DeterministicRuleEngine.evaluate_terminology(text, rules)
    assert len(findings) == 1
    assert findings[0].excerpt == "Fresh+"
    assert findings[0].suggested_rewrite == "FreshPlus"
    assert findings[0].evidence_status == "contradicted"
    assert findings[0].source_ids == ["TERM-001"]

def test_vector_store_retrieval():
    index = VectorIndex()
    guidelines = [
        {"id": "GUIDE-001", "title": "Brand Name", "text": "Product name is FreshPlus.", "category": "Brand Terminology"},
        {"id": "GUIDE-002", "title": "Health Claims", "text": "Do not make unsubstantiated curative fatigue or disease claims.", "category": "Unsupported Claim"}
    ]
    facts = [
        {"id": "FACT-001", "statement": "FreshPlus contains 100% pasteurized orange juice.", "source": "Lab Report", "category": "Ingredients"}
    ]
    total_indexed = index.build_index(guidelines, facts)
    assert total_indexed == 3

    results = index.retrieve("curative fatigue remedy", top_k=2)
    assert len(results) > 0
    assert any(r["source_id"] == "GUIDE-002" for r in results)

def test_finding_validator_strips_hallucinated_citations():
    raw_findings = [
        FindingItem(
            category="Brand Terminology",
            severity="high",
            excerpt="Fresh+",
            reason="Violation",
            evidence_status="contradicted",
            source_ids=["GUIDE-001", "HALLUCINATED-999"],
            suggested_rewrite="FreshPlus"
        ),
        FindingItem(
            category="Unsupported Claim",
            severity="high",
            excerpt="FABRICATED_TEXT_NOT_IN_SUBMISSION",
            reason="Fake",
            evidence_status="unsupported",
            source_ids=["GUIDE-002"],
            suggested_rewrite="None"
        )
    ]
    valid_ids = {"GUIDE-001", "GUIDE-002"}
    validated = FindingValidator.validate_findings(
        findings=raw_findings,
        submitted_text="Fresh+ is our delicious beverage.",
        valid_source_ids=valid_ids
    )

    # Fabricated excerpt must be discarded
    assert len(validated) == 1
    # Hallucinated citation must be removed
    assert "HALLUCINATED-999" not in validated[0].source_ids
    assert "GUIDE-001" in validated[0].source_ids

def test_full_review_pipeline_on_master_prompt_test_scenario():
    """
    Exact scenario from Prompt Section 9:
    "Fresh+ cures fatigue instantly! India's No. 1 juice is finally here. Buy now!!!"
    """
    payload = {
        "content_id": "test_content_001",
        "version_number": 1,
        "submitted_text": "Fresh+ cures fatigue instantly! India's No. 1 juice is finally here. Buy now!!!",
        "content_type": "Social Media Post",
        "knowledge": {
            "guidelines": [
                {"id": "GUIDE-001", "title": "Product Name", "text": "Preferred product name is FreshPlus.", "category": "Brand Terminology", "severity": "high"},
                {"id": "GUIDE-002", "title": "Health Claims", "text": "Do not use unsupported health benefit claims.", "category": "Unsupported Claim", "severity": "high"},
                {"id": "GUIDE-003", "title": "Promotional Superlatives", "text": "Promotional superlatives such as India's No. 1 require approved evidence.", "category": "Promotional Claim", "severity": "medium"},
                {"id": "GUIDE-004", "title": "Brand Tone", "text": "Use a professional, friendly, and informative tone. Avoid Buy now!!!", "category": "Brand Tone", "severity": "advisory"}
            ],
            "terminology": [
                {
                    "id": "TERM-001",
                    "preferred_term": "FreshPlus",
                    "prohibited_terms": ["Fresh+", "Fresh Plus"],
                    "explanation": "Preferred product name is FreshPlus.",
                    "severity": "high"
                }
            ],
            "facts": [
                {"id": "FACT-001", "statement": "FreshPlus Orange Juice contains 100% pasteurized orange juice.", "source": "Lab #FP-2025", "category": "Ingredients"}
            ]
        }
    }

    response = client.post("/v1/review", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["content_id"] == "test_content_001"
    assert len(data["findings"]) >= 3
    # Check that governance score reflects penalties
    assert data["governance_score"] < 60

    # Verify terminology finding
    term_finding = next((f for f in data["findings"] if f["excerpt"] == "Fresh+"), None)
    assert term_finding is not None
    assert term_finding["suggested_rewrite"] == "FreshPlus"
    assert term_finding["evidence_status"] == "contradicted"

    # Verify unsupported claim finding
    claim_finding = next((f for f in data["findings"] if "fatigue" in f["excerpt"].lower()), None)
    assert claim_finding is not None
    assert claim_finding["evidence_status"] == "unsupported"

def test_regression_unsafe_suggested_corrections_rejected():
    """
    Regression Test:
    Problem 1: 'supports daily refreshment and natural vitality' must be rejected (ungrounded vitality).
    Problem 2: 'one of India's most loved fruit juices' must be rejected (unsupported popularity claim).
    Validator must replace them with 'Human review required' while strictly preserving original finding,
    severity, evidence status, and source IDs.
    """
    raw_findings = [
        FindingItem(
            category="Unsupported Claim",
            severity="high",
            excerpt="cures fatigue instantly",
            reason="Curative claim without clinical evidence",
            evidence_status="unsupported",
            source_ids=["GUIDE-002"],
            source_excerpt="Do not use unsupported health benefit claims.",
            suggested_rewrite="supports daily refreshment and natural vitality"
        ),
        FindingItem(
            category="Promotional Claim",
            severity="medium",
            excerpt="India's No. 1",
            reason="Superlative market claim",
            evidence_status="unsupported",
            source_ids=["GUIDE-003"],
            source_excerpt="Promotional superlatives require approved verification.",
            suggested_rewrite="one of India's most loved fruit juices"
        )
    ]

    validated = FindingValidator.validate_findings(
        findings=raw_findings,
        submitted_text="Fresh+ cures fatigue instantly! India's No. 1 juice is here.",
        valid_source_ids={"GUIDE-002", "GUIDE-003"}
    )

    assert len(validated) == 2

    # Problem 1 check: natural vitality rejected, replaced with Human review required
    finding_1 = validated[0]
    assert finding_1.category == "Unsupported Claim"
    assert finding_1.severity == "high"
    assert finding_1.evidence_status == "unsupported"
    assert finding_1.source_ids == ["GUIDE-002"]
    assert finding_1.suggested_rewrite == "Human review required"

    # Problem 2 check: most loved rejected, replaced with Human review required
    finding_2 = validated[1]
    assert finding_2.category == "Promotional Claim"
    assert finding_2.severity == "medium"
    assert finding_2.evidence_status == "unsupported"
    assert finding_2.source_ids == ["GUIDE-003"]
    assert finding_2.suggested_rewrite == "Human review required"

def test_full_review_suggests_safe_corrections_for_problematic_phrases():
    """
    Ensure the review engine outputs safe corrections:
    - Unsupported medical claim removes medical benefit completely (suggests 'delivers daily refreshment')
    - Unsupported superlative uses neutral promotional wording (suggests 'a refreshing fruit juice')
    - Neither contains 'vitality' nor 'most loved'
    """
    payload = {
        "content_id": "test_regression_content",
        "version_number": 1,
        "submitted_text": "Fresh+ cures fatigue instantly! India's No. 1 juice is finally here. Buy now!!!",
        "content_type": "Social Media Post",
        "knowledge": {
            "guidelines": [
                {"id": "GUIDE-001", "title": "Product Name", "text": "Preferred product name is FreshPlus.", "category": "Brand Terminology", "severity": "high"},
                {"id": "GUIDE-002", "title": "Health Claims", "text": "Do not use unsupported health benefit claims.", "category": "Unsupported Claim", "severity": "high"},
                {"id": "GUIDE-003", "title": "Promotional Superlatives", "text": "Promotional superlatives require approved evidence.", "category": "Promotional Claim", "severity": "medium"},
                {"id": "GUIDE-004", "title": "Brand Tone", "text": "Use friendly tone.", "category": "Brand Tone", "severity": "advisory"}
            ],
            "terminology": [
                {
                    "id": "TERM-001",
                    "preferred_term": "FreshPlus",
                    "prohibited_terms": ["Fresh+", "Fresh Plus"],
                    "explanation": "Use FreshPlus.",
                    "severity": "high"
                }
            ],
            "facts": [
                {"id": "FACT-001", "statement": "FreshPlus Orange Juice contains 100% pasteurized orange juice.", "source": "Lab #FP-2025", "category": "Ingredients"}
            ]
        }
    }

    response = client.post("/v1/review", json=payload)
    assert response.status_code == 200
    data = response.json()

    health_finding = next((f for f in data["findings"] if "fatigue" in f["excerpt"].lower()), None)
    assert health_finding is not None
    assert "vitality" not in health_finding["suggested_rewrite"].lower()
    assert "cure" not in health_finding["suggested_rewrite"].lower()
    assert "stamina" not in health_finding["suggested_rewrite"].lower()
    assert health_finding["suggested_rewrite"] in ["delivers daily refreshment", "Human review required"]

    sup_finding = next((f for f in data["findings"] if "no. 1" in f["excerpt"].lower() or "no 1" in f["excerpt"].lower()), None)
    assert sup_finding is not None
    assert "most loved" not in sup_finding["suggested_rewrite"].lower()
    assert "beloved" not in sup_finding["suggested_rewrite"].lower()
    assert "no. 1" not in sup_finding["suggested_rewrite"].lower()
    assert sup_finding["suggested_rewrite"] in ["a refreshing fruit juice", "Human review required"]


# ==========================================
# STAGE 1: PII PROTECTION AUTOMATED TESTS
# ==========================================

def test_pii_redaction_email_addresses():
    """Test redaction of single and multiple email addresses across formats."""
    text = "For inquiries contact support@freshplus.io or priya.sharma@partner.co.in."
    redacted, items = TextPreprocessor.redact_pii(text)
    assert "support@freshplus.io" not in redacted
    assert "priya.sharma@partner.co.in" not in redacted
    assert redacted == "For inquiries contact [REDACTED_EMAIL] or [REDACTED_EMAIL]."
    assert len(items) == 2
    assert any("support@freshplus.io" in r for r in items)
    assert any("priya.sharma@partner.co.in" in r for r in items)

def test_pii_redaction_phone_numbers():
    """Test redaction of international, Indian, and US phone number formats."""
    text = "Call customer service at +91-98765-43210, +91 98765 43210, or 123-456-7890."
    redacted, items = TextPreprocessor.redact_pii(text)
    assert "+91-98765-43210" not in redacted
    assert "123-456-7890" not in redacted
    assert "[REDACTED_PHONE]" in redacted
    assert len(items) == 3

def test_pii_redaction_names_and_id_patterns():
    """Test redaction of Aadhaar/SSN IDs and honorific/labeled personal names while preserving brand terms."""
    text = "Signed by Dr. Rajesh Kumar (ID: 123-45-6789). Contact Person: Priya Sharma. FreshPlus is India's No. 1 juice."
    redacted, items = TextPreprocessor.redact_pii(text)
    assert "Dr. Rajesh Kumar" not in redacted
    assert "123-45-6789" not in redacted
    assert "Contact Person: Priya Sharma" not in redacted
    assert "[REDACTED_NAME]" in redacted
    assert "[REDACTED_ID]" in redacted
    # Verify brand names and country/general words are strictly NOT redacted
    assert "FreshPlus" in redacted
    assert "India's No. 1" in redacted

def test_pii_redaction_content_with_no_pii():
    """Ensure content without PII is not altered and returns zero redacted items."""
    text = "Fresh+ cures fatigue instantly! India's No. 1 juice is finally here. Buy now!!!"
    cleaned = TextPreprocessor.clean_and_normalize(text)
    redacted, items = TextPreprocessor.redact_pii(cleaned)
    assert redacted == cleaned
    assert len(items) == 0

def test_finding_excerpt_validation_after_redaction():
    """
    Ensure excerpts containing redaction tokens from LLM analysis are safely restored
    to match the original submitted text and pass validation without being dropped.
    """
    original_text = "Fresh+ cures fatigue instantly! Contact Dr. Rajesh Kumar at rajesh@freshplus.io for inquiries."
    redacted_text, redactions = TextPreprocessor.redact_pii(original_text)

    # Simulate an LLM finding generated against the redacted text
    simulated_llm_findings = [
        FindingItem(
            category="Unsupported Claim",
            severity="high",
            excerpt="Contact [REDACTED_NAME] at [REDACTED_EMAIL]",
            reason="Unsupported testimonial claim",
            evidence_status="unsupported",
            source_ids=["GUIDE-002"],
            source_excerpt="Do not use unsupported health benefit claims.",
            suggested_rewrite="delivers daily refreshment"
        )
    ]

    # Preprocessor restores finding excerpts before validation
    restored = TextPreprocessor.restore_pii_in_findings(
        findings=simulated_llm_findings,
        original_text=original_text,
        redactions=redactions
    )

    # Validate findings with restoration
    validated = FindingValidator.validate_findings(
        findings=restored,
        submitted_text=original_text,
        valid_source_ids={"GUIDE-002"},
        redacted_text=redacted_text,
        redactions=redactions
    )

    assert len(validated) == 1
    # Excerpt must be restored to original substring
    assert validated[0].excerpt == "Contact Dr. Rajesh Kumar at rajesh@freshplus.io"
    assert validated[0].excerpt in original_text
    assert "[REDACTED_" not in validated[0].excerpt

def test_review_pipeline_gemini_receives_only_redacted_text(monkeypatch):
    """
    End-to-end integration test verifying that:
    1. Gemini/LLM reviewer receives ONLY redacted text, never unredacted PII.
    2. Vector retrieval runs on redacted text.
    3. Final API response contains restored excerpts matching submitted text, even when LLM cites [REDACTED_*].
    4. Processing metadata reports accurate pii_redacted_count.
    """
    from app import main as main_module

    received_text_by_reviewer = []

    def mock_analyze_content(submitted_text, content_type, retrieved_context, all_guidelines, all_facts):
        received_text_by_reviewer.append(submitted_text)
        return [
            FindingItem(
                category="Unsupported Claim",
                severity="high",
                excerpt="Contact [REDACTED_NAME]",
                reason="Medical testimonial claim without approved clinical evidence.",
                evidence_status="unsupported",
                source_ids=["GUIDE-002"],
                source_excerpt="Do not use unsupported health benefit claims.",
                suggested_rewrite="delivers daily refreshment"
            )
        ]

    monkeypatch.setattr(main_module.llm_reviewer, "analyze_content", mock_analyze_content)

    payload = {
        "content_id": "test_pii_content",
        "version_number": 1,
        "submitted_text": "Fresh+ cures fatigue instantly! Contact Dr. Priya Sharma at priya@freshplus.io or call +91-98765-43210 (SSN: 123-45-6789).",
        "content_type": "Social Media Post",
        "knowledge": {
            "guidelines": [
                {"id": "GUIDE-001", "title": "Brand Name", "text": "Product name is FreshPlus.", "category": "Brand Terminology", "severity": "high"},
                {"id": "GUIDE-002", "title": "Health Claims", "text": "Do not use unsupported health benefit claims.", "category": "Unsupported Claim", "severity": "high"}
            ],
            "terminology": [
                {"id": "TERM-001", "preferred_term": "FreshPlus", "prohibited_terms": ["Fresh+"], "explanation": "Use FreshPlus.", "severity": "high"}
            ],
            "facts": []
        }
    }

    response = client.post("/v1/review", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Verify reviewer received ONLY redacted text
    assert len(received_text_by_reviewer) == 1
    llm_input = received_text_by_reviewer[0]
    assert "priya@freshplus.io" not in llm_input
    assert "+91-98765-43210" not in llm_input
    assert "123-45-6789" not in llm_input
    assert "Dr. Priya Sharma" not in llm_input
    assert "[REDACTED_EMAIL]" in llm_input
    assert "[REDACTED_PHONE]" in llm_input
    assert "[REDACTED_ID]" in llm_input
    assert "[REDACTED_NAME]" in llm_input

    # Verify processing metadata reflects PII redactions
    assert data["processing_metadata"]["pii_redacted_count"] >= 4

    # Verify finding with [REDACTED_NAME] excerpt was restored to match original text
    restored_finding = next((f for f in data["findings"] if "Priya Sharma" in f["excerpt"]), None)
    assert restored_finding is not None
    assert restored_finding["excerpt"] == "Contact Dr. Priya Sharma"

    # Verify all excerpts in returned findings exist in original submitted text
    for finding in data["findings"]:
        assert finding["excerpt"] in payload["submitted_text"]
        assert "[REDACTED_" not in finding["excerpt"]

def test_pii_redaction_does_not_falsely_redact_marketing_metrics():
    """Ensure quantitative marketing metrics, sales volumes, and impressions are not falsely redacted as phone/ID."""
    text = "Over 1000000000 cans sold! We achieved 1234567890 impressions across 50000 cities in India! Total 100000000000 views in 2026."
    redacted, items = TextPreprocessor.redact_pii(text)
    assert "1000000000 cans sold" in redacted
    assert "1234567890 impressions" in redacted
    assert "50000" in redacted
    assert "100000000000" in redacted
    assert "2026" in redacted
    assert len(items) == 0

def test_pii_redaction_does_not_falsely_redact_brand_or_product_names():
    """Ensure Brand Name: and Product Name: labels do not get falsely redacted as personal names."""
    text = "Brand Name: FreshPlus is premium. Product Name: Fresh Plus is prohibited. Company Name: Fresh Drink."
    redacted, items = TextPreprocessor.redact_pii(text)
    assert "Brand Name: FreshPlus" in redacted
    assert "Product Name: Fresh Plus" in redacted
    assert "Company Name: Fresh Drink" in redacted
    assert "[REDACTED_NAME]" not in redacted
    assert len(items) == 0

def test_pii_redaction_contextual_personal_names():
    """Ensure Name: Test User and explicit personal roles are redacted while preserving prefix labels."""
    text = "Reviewed by Name: Test User and Contact Person: Priya Sharma and Dr. Rajesh Kumar."
    redacted, items = TextPreprocessor.redact_pii(text)
    assert "Name: [REDACTED_NAME]" in redacted
    assert "Contact Person: [REDACTED_NAME]" in redacted
    assert "[REDACTED_NAME]" in redacted
    assert "Test User" not in redacted
    assert "Priya Sharma" not in redacted
    assert "Dr. Rajesh Kumar" not in redacted
    assert len(items) == 3

def test_pii_multiple_identical_pii_values():
    """Ensure multiple identical PII items are handled cleanly without error or mis-alignment."""
    text = "Email us at support@freshplus.io or backup support@freshplus.io anytime."
    redacted, items = TextPreprocessor.redact_pii(text)
    assert "support@freshplus.io" not in redacted
    assert redacted.count("[REDACTED_EMAIL]") == 2
    assert len(items) == 2

    # Verify restoration of excerpt containing one of the placeholders
    finding = FindingItem(
        category="Style and Communication",
        severity="low",
        excerpt="backup [REDACTED_EMAIL]",
        reason="Redundant email",
        evidence_status="advisory"
    )
    restored = TextPreprocessor.restore_pii_in_findings([finding], text, items)
    assert restored[0].excerpt == "backup support@freshplus.io"
    assert restored[0].excerpt in text

def test_pii_placeholder_like_text_in_original_submission():
    """Ensure placeholder-like text in original submissions terminates gracefully and does not loop."""
    text = "Review template with [REDACTED_EMAIL] and contact support@freshplus.io"
    redacted, items = TextPreprocessor.redact_pii(text)
    # The actual email is redacted, existing placeholder-like text is preserved
    assert "support@freshplus.io" not in redacted
    assert "[REDACTED_EMAIL]" in redacted

    finding = FindingItem(
        category="Style and Communication",
        severity="low",
        excerpt="contact [REDACTED_EMAIL]",
        reason="Support contact",
        evidence_status="advisory"
    )
    restored = TextPreprocessor.restore_pii_in_findings([finding], text, items)
    assert restored[0].excerpt in text

def test_pii_restoration_does_not_inject_pii_into_suggested_rewrites():
    """Ensure suggested rewrites containing placeholders are neutralized to Human review required, not populated with raw PII."""
    original_text = "Contact priya@freshplus.io for inquiries."
    redacted_text, redactions = TextPreprocessor.redact_pii(original_text)

    finding = FindingItem(
        category="Style and Communication",
        severity="medium",
        excerpt="[REDACTED_EMAIL]",
        reason="Direct personal contact",
        evidence_status="advisory",
        suggested_rewrite="Email [REDACTED_EMAIL] for inquiries"
    )

    restored = TextPreprocessor.restore_pii_in_findings([finding], original_text, redactions)
    assert restored[0].suggested_rewrite == "Human review required"
    assert "priya@freshplus.io" not in restored[0].suggested_rewrite

def test_pii_restoration_bounded_loop_resilience():
    """Ensure restore_pii_text is mathematically bounded and cannot enter an infinite loop."""
    original = "Contact us"
    # Placeholder present in text but candidate value also contains placeholder
    cyclic_redactions = ["email:[REDACTED_EMAIL]"]
    result = TextPreprocessor.restore_pii_text("Reach [REDACTED_EMAIL]", original, cyclic_redactions)
    assert isinstance(result, str)

