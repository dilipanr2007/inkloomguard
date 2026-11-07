# INKLOOM AI — Intelligent Brand Governance Platform

> **Brand Identity:** InkloomGuard  
> **Official Registered Domain:** [https://inkloomguard.xyz](https://inkloomguard.xyz)  
> **Built for:** CodeNexus India 2026 Hackathon (Round 2 Implementation)

---

## 🌟 Executive Summary

**Inkloom AI** is an enterprise-grade, source-grounded brand governance and pre-publication review platform. 

In the modern enterprise, content is produced rapidly across distributed regional teams, agencies, freelancers, and generative AI tools. Brand guidelines often languish in static, unread PDF documents, resulting in inconsistent messaging, unauthorized terminology, and legally risky unverified claims.

Inkloom AI solves this by:
- Ingesting approved guidelines, preferred/prohibited terminology, and verified clinical facts into dynamic vector memory.
- Executing a hybrid evaluation engine (deterministic regex + Gemini LLM claim & tone analysis).
- Explaining every violation with its exact supporting source ID and excerpt.
- Distinguishing **unsupported** from **contradicted** claims.
- Assisting the human decision-maker with intent-preserving corrections without ever overwriting or publishing content automatically.
- Providing role-based approval governance (Creator → Reviewer → Manager) and continuous version auditing.

**Core Principle:** AI assists the decision. Humans retain final authority.

---

## 🛡️ Brand & Domain Configuration

| Attribute | Official Specification |
|---|---|
| **Website Name** | Inkloom AI |
| **Brand Identity** | InkloomGuard |
| **Registered Domain** | `https://inkloomguard.xyz` |
| **Logo Text** | InkloomGuard |
| **Browser Title** | `Inkloom AI \| Intelligent Brand Governance` |
| **Tagline** | Intelligent Brand Governance |

---

## 👥 Seeded Demo Accounts (One-Click Judge Sign-In)

For instant evaluation, the platform comes pre-seeded with three distinct roles for the fictional brand **FreshPlus**:

| Role | Email | Password | Primary Workflow |
|---|---|---|---|
| **Creator** | `creator@freshplus.io` | `Creator123!` | Drafts content, inspects highlights, accepts/edits suggestions, submits revisions |
| **Reviewer** | `reviewer@freshplus.io` | `Reviewer123!` | Audits AI citations, collaborates with comments, requests changes, issues final approval |
| **Manager** | `manager@freshplus.io` | `Manager123!` | Manages guidelines, terminology & facts, monitors analytics, oversees user roles |

*Judges can also use the **Role Switcher** in the top navigation bar to switch between roles on the fly without logging out!*

---

## 🧪 Master Prompt Test Scenario

The system includes pre-seeded test data matching the exact hackathon prompt scenario:

**Submitted Copy:**
> *"Fresh+ cures fatigue instantly! India's No. 1 juice is finally here. Buy now!!!"*

**Expected & Delivered Governance Analysis:**
1. `"Fresh+"` → **Brand Terminology Violation** (Contradicted, High Severity). Cites `GUIDE-001` / `TERM-001`. Suggested rewrite: `"FreshPlus"`.
2. `"cures fatigue instantly"` → **Unsupported Claim** (Unsupported, High Severity). Cites `GUIDE-002`. Suggested rewrite: `"supports daily refreshment and natural energy"`. (Labelled unsupported rather than contradicted, preserving evidentiary accuracy).
3. `"India's No. 1"` → **Promotional Claim** (Unsupported, Medium Severity). Cites `GUIDE-003`. Suggested rewrite: `"one of India’s most loved fruit juices"`.
4. `"Buy now!!!"` → **Brand Tone Finding** (Advisory, Advisory Severity). Cites `GUIDE-004`. Suggested rewrite: `"Try FreshPlus today."`.

---

## 🏗️ Technology Stack

- **Frontend:** React.js 18, Vite, Tailwind CSS, React Router v6, Axios, Recharts, Lucide React.
- **Backend:** Node.js, Express.js, MongoDB / Mongoose, JWT authentication, bcryptjs, RBAC middleware.
- **AI Service:** Python 3.13, FastAPI, Pydantic, Scikit-learn (TF-IDF vector retrieval), Google Gemini API (`gemini-1.5-flash`), Pytest.
- **Testing:** Jest + Supertest (Backend), Pytest (AI Microservice).
- **Deployment Ready:** Vercel (Frontend), Render (Backend & AI Service), MongoDB Atlas (Database).

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- Node.js v18+ (tested on Node v26)
- Python 3.10+ (tested on Python 3.13)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone & Install Dependencies

```bash
# Clone repository
git clone https://github.com/your-org/inkloomguard.git
cd inkloomguard

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Setup AI service virtual environment
cd ../ai-service
python -m venv venv
.\venv\Scripts\pip install -r requirements.txt   # Windows
# source venv/bin/activate && pip install -r requirements.txt  # macOS/Linux
```

### 2. Configure Environment Variables

Create `.env` files in each service directory (see `.env.example` in each folder):

**Backend (`backend/.env`):**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/inkloom
JWT_SECRET=inkloom_guard_super_secret_jwt_key_2026
AI_SERVICE_URL=http://localhost:8000
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://inkloomguard.xyz,https://www.inkloomguard.xyz
FRONTEND_URL=https://inkloomguard.xyz
```

**AI Service (`ai-service/.env`):**
```env
PORT=8000
HOST=0.0.0.0
# Add your Gemini API Key (optional - system includes deterministic fallback)
GEMINI_API_KEY=""
BRAND_IDENTITY="InkloomGuard"
DOMAIN="https://inkloomguard.xyz"
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME="Inkloom AI"
VITE_BRAND_IDENTITY="InkloomGuard"
VITE_DOMAIN="https://inkloomguard.xyz"
```

### 3. Seed Demo Database

```bash
cd backend
npm run seed
```

### 4. Run the Services

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server running at http://localhost:5000
```

**Terminal 2 — AI Service:**
```bash
cd ai-service
.\venv\Scripts\uvicorn app.main:app --port 8000 --reload
# Service running at http://localhost:8000
```

**Terminal 3 — Frontend:**
```bash
cd frontend
npm run dev
# Vite dev server running at http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser!

---

## 🧪 Running Automated Tests

### Backend Test Suite (Jest + Supertest):
```bash
cd backend
npm test
```
*Validates API branding, JWT authentication, RBAC authorization, creator approval restriction, and real analytics calculations.*

### AI Service Test Suite (Pytest):
```bash
cd ai-service
.\venv\Scripts\pytest
```
*Validates text preprocessing, PII redaction, deterministic terminology rule matching, vector retrieval, citation anti-hallucination validation, and end-to-end review on the master scenario.*

---

## 🌐 Custom Domain & Production Deployment

### Frontend (Vercel)
1. Import repository and set root directory to `frontend`.
2. Add environment variable: `VITE_API_URL=https://api.inkloomguard.xyz/api`.
3. In Vercel Project Settings → Domains, bind `inkloomguard.xyz` and `www.inkloomguard.xyz`.
4. DNS: Point `@` (A record) to `76.76.21.21` and `www` (CNAME) to `cname.vercel-dns.com`.
5. `frontend/vercel.json` and `frontend/public/CNAME` are pre-configured.

### Backend (Render)
1. Create a Web Service pointing to `backend/`.
2. Build command: `npm install`. Start command: `npm start`.
3. Set environment variables (`MONGO_URI`, `JWT_SECRET`, `AI_SERVICE_URL`, `ALLOWED_ORIGINS`).
4. Custom domain: `api.inkloomguard.xyz`.

### AI Service (Render)
1. Create a Web Service pointing to `ai-service/`.
2. Build command: `pip install -r requirements.txt`. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
3. Set environment variables (`GEMINI_API_KEY`).

---

## 📋 Hackathon Round 2 Scope & Roadmap

### Fully Implemented in Round 2:
- ✅ Three-role architecture (Creator, Reviewer, Manager) with enforced backend RBAC.
- ✅ Dynamic Brand Knowledge Library (Guidelines, Terminology, Approved Facts, Assets).
- ✅ Text submission and versioning pipeline (v1, v2, ...).
- ✅ Hybrid AI review engine (Deterministic regex + Gemini LLM).
- ✅ Grounded findings citing exact source IDs and excerpts.
- ✅ Distinction between contradicted, unsupported, and advisory claims.
- ✅ Interactive finding controls: Accept, Edit custom rewrite, Dismiss with required reason.
- ✅ Human-in-the-loop approval workflow (creators strictly forbidden from self-approving).
- ✅ Side-by-side version comparison & diff audit view.
- ✅ Real database analytics visualizations (Recharts).
- ✅ Sensitive data (PII) redaction.
- ✅ Automated tests (Jest + Pytest).
- ✅ Custom domain configuration for `inkloomguard.xyz`.

### Planned Future Phase:
- PDF/DOCX file extraction with formatting preservation.
- Automated visual brand checks (palette hex extraction from images, color contrast WCAG ratios).
- CMS & Social Media webhook integrations.

---

## ⚖️ License & Hackathon Notice

Developed for **CodeNexus India 2026 Hackathon (Round 2)**.  
All demo brand data (FreshPlus) is fictional and created solely for demonstration of brand governance mechanisms.
