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
