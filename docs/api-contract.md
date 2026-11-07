# INKLOOM AI — API Contract Documentation

**Platform:** Inkloom AI  
**Identity:** InkloomGuard  
**Domain:** [https://inkloomguard.xyz](https://inkloomguard.xyz)  
**Base URL:** `/api`

All protected routes require an HTTP header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 1. Authentication & User Management

### `POST /api/auth/register`
Creates a new account.
- **Body:** `{ name, email, password, role, organization, department }`
- **Response (201):** `{ success: true, token, user }`

### `POST /api/auth/login`
Authenticates a user and returns a signed JWT.
- **Body:** `{ email, password }`
- **Response (200):** `{ success: true, token, user }`

### `GET /api/auth/me`
Returns the currently logged in user profile.
- **Headers:** `Authorization`
- **Response (200):** `{ success: true, user }`

### `GET /api/auth/users` *(Manager only)*
Lists registered organization users.

### `PATCH /api/auth/users/:id/role` *(Manager only)*
Updates a user's role (`creator`, `reviewer`, `manager`).

---

## 2. Brand Guidelines Library

### `GET /api/guidelines`
Retrieves all brand guidelines.
- **Query params:** `category`, `status`, `search`
- **Response (200):** `{ success: true, count, guidelines: [...] }`

### `POST /api/guidelines` *(Manager only)*
Creates a new guideline and triggers vector re-indexing.
- **Body:** `{ guidelineId, title, description, category, severity, status }`
- **Response (201):** `{ success: true, guideline }`

### `PUT /api/guidelines/:id` *(Manager only)*
Updates an existing guideline.

### `DELETE /api/guidelines/:id` *(Manager only)*
Removes a guideline from the repository.

---

## 3. Brand Terminology

### `GET /api/terminology`
Retrieves terminology rules.

### `POST /api/terminology` *(Manager only)*
Creates preferred vs prohibited terminology rules.
- **Body:** `{ terminologyId, preferredTerm, prohibitedTerms: [string], explanation, severity }`
- **Response (201):** `{ success: true, terminology }`

---

## 4. Approved Facts

### `GET /api/facts`
Retrieves active verified brand facts.

### `POST /api/facts` *(Manager only)*
Adds an approved verified fact.
- **Body:** `{ factId, statement, category, sourceDoc }`

---

## 5. Content Submissions & AI Review

### `POST /api/content`
Submits a new content piece.
- **Body:**
  ```json
  {
    "title": "Summer Launch Reel Copy",
    "contentType": "Social Media Post",
    "campaign": "Summer Launch 2026",
    "rawText": "Fresh+ cures fatigue instantly! India's No. 1 juice is finally here. Buy now!!!",
    "autoReview": true
  }
  ```
- **Response (201):** `{ success: true, content, version }`

### `GET /api/content`
Lists content submissions with optional filters (`status`, `contentType`, `search`).

### `GET /api/content/:id`
Retrieves full content document, including current version text, all versions summary, current findings, and comments.

### `POST /api/content/:id/review`
Triggers an AI governance review on the current version.
- **Response (200):** `{ success: true, findings: [...], governanceScore }`

### `POST /api/content/:id/revisions`
Creates version `N+1` of content without overwriting prior drafts.
- **Body:** `{ rawText, changeNotes, autoReview }`
- **Response (201):** `{ success: true, content, version }`

### `GET /api/content/:id/compare?v1=1&v2=2`
Compares two versions for side-by-side audit and diff analysis.

---

## 6. Findings & Human Decisions

### `PATCH /api/findings/:id/decision`
Records a human reviewer's action on an AI finding.
- **Body (Accept):** `{ "action": "accepted" }`
- **Body (Edit):** `{ "action": "edited", "editedRewrite": "Custom phrasing" }`
- **Body (Dismiss):** `{ "action": "dismissed", "dismissalReason": "Clear documented reason" }`
- **Response (200):** `{ success: true, message, finding }`

---

## 7. Approval Workflow

### `POST /api/content/:id/comments`
Posts a review feedback note to the submission thread.

### `POST /api/content/:id/request-changes` *(Reviewer & Manager only)*
Sets status to `changes_requested` and records required revisions.

### `POST /api/content/:id/approve` *(Reviewer & Manager only)*
Grants human publication approval. Creators attempting this route receive HTTP `403 Forbidden`.

---

## 8. Analytics & Audit

### `GET /api/analytics/overview`
Aggregated counts: total submissions, approved, in review, average governance score.

### `GET /api/analytics/findings`
Findings categorized by brand issue type and severity.

### `GET /api/analytics/rules`
Most frequently triggered rule source IDs and recent dismissed findings table.

### `GET /api/audit` *(Manager only)*
Complete immutable chronological audit log stream.

---

## 9. AI Microservice Contract (`POST /v1/review`)

- **Service:** FastAPI on port 8000
- **Request:**
  ```json
  {
    "content_id": "67...",
    "version_number": 1,
    "submitted_text": "...",
    "content_type": "Social Media Post",
    "knowledge": {
      "guidelines": [...],
      "terminology": [...],
      "facts": [...]
    }
  }
  ```
- **Response:**
  ```json
  {
    "content_id": "67...",
    "version_number": 1,
    "governance_score": 42,
    "findings": [
      {
        "category": "Brand Terminology",
        "severity": "high",
        "excerpt": "Fresh+",
        "reason": "The prohibited term 'Fresh+' violates brand guidelines. The approved name is 'FreshPlus'.",
        "evidence_status": "contradicted",
        "source_ids": ["GUIDE-001", "TERM-001"],
        "source_excerpt": "Preferred product name is FreshPlus.",
        "suggested_rewrite": "FreshPlus",
        "confidence": 0.98
      }
    ],
    "processing_metadata": {
      "engine": "inkloom_hybrid_rag",
      "processing_time_ms": 142.5,
      "brand_identity": "InkloomGuard"
    }
  }
  ```
