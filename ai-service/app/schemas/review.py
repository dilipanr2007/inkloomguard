from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class FindingItem(BaseModel):
    category: str = Field(..., description="Classification of the brand issue")
    severity: str = Field(..., description="high | medium | low | advisory")
    excerpt: str = Field(..., description="Exact problematic text substring from submitted content")
    reason: str = Field(..., description="Why the content conflicts with approved rule or evidence")
    evidence_status: str = Field(..., description="supported | contradicted | unsupported | advisory")
    source_ids: List[str] = Field(default_factory=list, description="List of validated guideline or fact IDs")
    source_excerpt: str = Field(default="", description="Relevant approved guideline or fact text")
    suggested_rewrite: str = Field(default="", description="Proposed revision preserving creator intent")
    confidence: float = Field(default=0.9, ge=0.0, le=1.0, description="Confidence metric")

class GuidelineInput(BaseModel):
    id: str
    title: str
    text: str
    category: Optional[str] = "Style and Communication"
    severity: Optional[str] = "medium"

class TerminologyInput(BaseModel):
    id: str
    preferred_term: str
    prohibited_terms: List[str]
    explanation: Optional[str] = ""
    severity: Optional[str] = "high"
    case_sensitive: Optional[bool] = False

class FactInput(BaseModel):
    id: str
    statement: str
    source: Optional[str] = ""
    category: Optional[str] = "General"

class KnowledgePayload(BaseModel):
    guidelines: List[GuidelineInput] = Field(default_factory=list)
    terminology: List[TerminologyInput] = Field(default_factory=list)
    facts: List[FactInput] = Field(default_factory=list)

class ReviewRequest(BaseModel):
    content_id: str
    version_number: int = 1
    submitted_text: str
    content_type: Optional[str] = "General Marketing"
    knowledge: Optional[KnowledgePayload] = None

class ReviewResponse(BaseModel):
    content_id: str
    version_number: int
    governance_score: int
    findings: List[FindingItem]
    processing_metadata: Dict[str, Any] = Field(default_factory=dict)
