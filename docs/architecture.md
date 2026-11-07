# INKLOOM AI — Architectural Specification

**Brand Identity:** InkloomGuard  
**Official Domain:** [https://inkloomguard.xyz](https://inkloomguard.xyz)  
**Platform Name:** Inkloom AI – Intelligent Brand Governance Platform  
**Target Event:** CodeNexus India 2026 Hackathon (Round 2)

---

## 1. System Architecture Overview

Inkloom AI is built as a three-tier decoupled microservice architecture:

```
[ Web Browser ]
      │
      ▼ (HTTPS)
[ React.js + Vite Frontend ]
(Served on https://inkloomguard.xyz via Vercel)
      │
      ▼ (REST / JSON / JWT)
[ Express.js Backend API Gateway ]
(Node.js on Render / port 5000)
 ├── MongoDB Atlas (Source of Truth)
 ├── Authentication & RBAC Layer (Creator, Reviewer, Manager)
 ├── Revision & Audit Logging Engine
 └── Deterministic Terminology Fallback Engine
      │
      ▼ (REST / JSON)
[ FastAPI AI & Retrieval Service ]
(Python on Render / port 8000)
 ├── Text Preprocessing & PII Redactor
 ├── Deterministic Brand Rule Engine
 ├── In-Memory TF-IDF / Vector RAG Retrieval
 ├── Google Gemini LLM Inference (Tone, Claims & Messaging)
 └── Finding & Citation Validator (Strict Anti-Hallucination)
```

---

## 2. Core Governance & Design Principles

1. **Source-Grounded Only:** Findings must cite existing, validated guideline IDs (`GUIDE-XXX`, `TERM-XXX`, `FACT-XXX`) from the active database.
2. **AI Assists, Humans Decide:** AI highlights violations, classifies evidence status, and suggests rewrites. The platform never publishes or approves content automatically.
3. **Evidence Status Distinction:**
   - **Contradicted:** Explicit contradiction with an approved guideline or fact.
   - **Unsupported:** A factual, promotional, or curative claim made without substantiating evidence in the facts library.
   - **Advisory:** Subjective stylistic or tone guidance (e.g. aggressive urgency punctuation).
   - **Supported:** Validated against approved factual claims.
4. **Version Immutability:** Revision history is append-only. Creating a revised version creates a new `ContentVersion` document and never deletes previous drafts.
5. **Role-Based Authorization:**
   - **Creator:** Drafts copy, reviews AI findings, applies or modifies suggestions, dismisses with written justifications, submits revisions.
   - **Reviewer:** Inspects AI evidence citations, posts comments, requests changes, and issues human publication approval.
   - **Manager:** Full administrative control over guidelines, preferred/prohibited terminology, verified facts, assets, audit trails, and user roles.

---

## 3. Data Model Hierarchy (MongoDB)

- **User:** Authentication credentials, role (`creator`, `reviewer`, `manager`), department, and organization.
- **Guideline:** Unique ID (`GUIDE-001`), title, full description, category, severity, status (`active`/`inactive`), version.
- **Terminology:** Unique ID (`TERM-001`), preferred term (`FreshPlus`), prohibited terms (`['Fresh+', 'Fresh Plus']`), explanation, severity.
- **ApprovedFact:** Unique ID (`FACT-001`), verified statement, category, source documentation certification.
- **BrandAsset:** Visual standards, color palette hex codes, typography rules.
- **Content:** Container for a marketing asset (`title`, `contentType`, `campaign`, `creator`, `currentVersion`, `status`).
- **ContentVersion:** Snapshot of text for version `N`, governance score, total findings count, timestamp, change notes.
- **Finding:** Specific issue identified by AI review:
  - `excerpt`: Problematic text substring.
  - `reason`: Explanation of violation.
  - `evidenceStatus`: `supported | contradicted | unsupported | advisory`.
  - `sourceIds`: Array of cited rule/fact IDs.
  - `suggestedRewrite`: Intent-preserving correction.
  - `decision`: `pending | accepted | edited | dismissed`.
  - `dismissalReason`: Documented human reason if dismissed.
- **Comment:** Version-linked feedback thread.
- **AuditLog:** Complete chronological event trail of all logins, submissions, rule creations, finding overrides, and approvals.

---

## 4. AI & Retrieval Pipeline

```
Submitted Copy
     │
     ▼
[ Preprocessor ] ──> Cleans whitespace, segments sentences, redacts PII (emails, phone numbers)
     │
     ▼
[ Vector Store Sync ] ──> Chunks active guidelines & facts, updates TF-IDF/cosine similarity index
     │
     ▼
[ Deterministic Engine ] ──> Regex matches prohibited terminology & brand spelling violations
     │
     ▼
[ Context Retrieval ] ──> Pulls top-K most semantically relevant guidelines & facts
     │
     ▼
[ Gemini LLM Analysis ] ──> Analyzes tone, extracts claims, compares against retrieved facts
     │
     ▼
[ Finding Validator ] ──> Discards hallucinated citations, checks substring matches in raw text
     │
     ▼
[ Governance Scorer ] ──> Computes 0-100 brand compliance score based on severity penalties
```

---

## 5. Domain & Production Topology

- **Registered Custom Domain:** `https://inkloomguard.xyz`
- **DNS / SSL:** Managed with automatic HTTPS certificates.
- **Frontend Hosting:** Vercel with single-page app rewrite configuration (`vercel.json`) and `CNAME` binding.
- **Backend API Hosting:** Render Web Service (`https://api.inkloomguard.xyz` or Render default URL).
- **AI Microservice Hosting:** Render Web Service (`https://ai.inkloomguard.xyz` or Render default URL).
- **Database:** MongoDB Atlas M0/M10 Cluster.
