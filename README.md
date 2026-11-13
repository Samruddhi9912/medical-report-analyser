# 🩺 Medical Report Understanding & Patient Assistance System (ClariMed)

> **College Final-Year Capstone Project**  
> An AI-powered healthcare informational assistant that simplifies complex medical laboratory reports, hospital discharge summaries, and prescriptions into easy-to-understand plain language for patients and their families.

---

## 1. Project Objective

Ordinary patients frequently receive laboratory reports, prescriptions, and discharge summaries filled with complicated clinical jargon, abbreviations (e.g. *HbA1c, SGPT, eGFR, BID, PO, HS*), and numeric reference brackets. Because doctors have only a few minutes per consultation, patients often leave clinics without understanding their health condition.

**ClariMed** solves this by providing:
- **Plain-Language Explanations** of medical terms with relatable analogies (e.g., *"Creatinine: like coffee grounds caught in a kidney filter"*).
- **Report-Specific Laboratory Value Status** (🟢 Normal, 🟠 High, 🔴 Low, ⚪ Unknown when reference intervals are missing).
- **Reassuring Context Notes** to prevent unnecessary panic over slight borderline elevations.
- **Multilingual Support** (English, Kannada, Hindi, Spanish, Marathi).
- **Text-to-Speech (TTS)** voice explanation for elderly and visually impaired users.
- **Prescription Medicine Explainer** detailing purpose, timing, and food precautions without altering doctor instructions.
- **Doctor Questions Checklist** to prepare patients for their next consultation.
- **Historical Comparison & Trend Charts** for compatible biomarkers across dates.
- **Medication & Appointment Reminders** with daily adherence tracking.
- **Family / Caregiver Access** with consent-based, revocable report sharing.
- **Clinician-Reviewed Red-Flag Alerts** for critical emergency biomarkers (e.g., Critical Potassium > 6.0 mEq/L, Cardiac Troponin spikes).

> [!IMPORTANT]
> **Medical Safety Disclaimer (PRD SR-09):**  
> This application helps you understand your medical documents in simple language. It does not provide a medical diagnosis or replace professional medical advice. Always consult your doctor before making decisions about your health or medication.

---

## 2. Technology Decision Summary & Reconciled Architecture

| Layer | PRD Specification (Doc 1) | Tech Stack PDF (Doc 2) | Implemented Final Decision | Rationale |
|---|---|---|---|---|
| **Frontend** | React.js | React.js | **React.js + Tailwind CSS** | Clean healthcare design, responsive on desktop/tablet/mobile, soft teal & light blue palette. |
| **Backend** | Python FastAPI | Python FastAPI | **Python FastAPI** | Asynchronous high-performance REST APIs, PyMuPDF, and clinical rule engine in unified Python runtime. |
| **Database** | PostgreSQL (SQLAlchemy) | PostgreSQL | **SQLAlchemy with Dual Engine** | Defaults to zero-config SQLite (`medical_app.db`) for instant local testing; ready for PostgreSQL (`postgresql://...`) via `.env`. |
| **Authentication** | Custom JWT + Argon2id | Supabase Auth | **FastAPI JWT + Salted Hashing** | Self-hosted role-based auth (Patient, Family Caregiver) with zero vendor lock-in. Compatible with Supabase JWT headers. |
| **Storage** | Private Local Storage | Supabase Storage | **Secure Private Storage** | Stored outside public web root (`./backend/storage/private_uploads/`) with magic byte verification; adapter ready for Supabase. |
| **AI / LLM** | Ollama (Local open-weight) | Gemini API or OpenAI API | **Multi-Provider AI Service** | Configurable via `.env` (`AI_PROVIDER`): Supports Gemini API, local Ollama, and a grounded **Deterministic Medical Knowledge Base** for 100% offline reliability. |
| **Document Processing**| PyMuPDF + PaddleOCR | PyMuPDF + PaddleOCR | **PyMuPDF (`fitz`) Engine** | Native digital PDF extraction with fallback pattern parser and strict non-medical file rejection. |
| **Speech (TTS)** | Piper (Local TTS) | Google Cloud TTS | **Web Speech API + Backend Voice** | Zero-latency, browser-native audio playback supporting multiple languages without cloud costs. |
| **Deployment** | Docker Compose | Render or Railway | **Docker & Single-Server FastAPI** | Standalone runner (`python run_project.py`), Dockerfile, and Render/Railway deployment readiness. |

---

## 3. Project Folder Structure

```
medisimplify/
├── backend/
│   ├── __init__.py
│   ├── config.py                 # Configuration & environment variable loader (.env)
│   ├── database.py               # SQLAlchemy engine & session maker
│   ├── models.py                 # Database models (users, documents, extracted_results, explanations, etc.)
│   ├── schemas.py                # Pydantic v2 schemas for request/response validation
│   ├── auth.py                   # JWT creation, token decoding, salted password hashing
│   ├── file_validator.py         # MIME check, magic byte inspection, medical-only classifier
│   ├── extractor.py              # PyMuPDF text & table extraction engine
│   ├── clinical_engine.py        # Deterministic Normal/High/Low/Unknown classification & red flags
│   ├── ai_service.py             # Grounded AI explanation generator (Gemini / Ollama / Knowledge Base)
│   ├── main.py                   # FastAPI application, CORS, static mount & pre-seeded demo patient
│   ├── routes/
│   │   ├── auth_routes.py        # /api/v1/auth (register, login, me)
│   │   ├── document_routes.py    # /api/v1/documents (upload, process, list, get, delete)
│   │   ├── history_routes.py     # /api/v1/history (timeline, longitudinal trend comparison)
│   │   ├── medicine_routes.py    # /api/v1/medicines (prescriptions, instructions)
│   │   ├── reminder_routes.py    # /api/v1/reminders (pills, appointments, mark taken)
│   │   └── family_routes.py      # /api/v1/family (caregiver invitations, permissions, audit log)
│   └── storage/
│       └── private_uploads/      # Isolated document file repository
├── frontend/
│   ├── index.html                # Healthcare web interface with 10-item left sidebar
│   ├── styles.css                # Professional design system (soft teal, light blue, soft shadows)
│   └── app.js                    # React-style application router & interactive view components
├── test_suite.py                 # Automated unit tests covering all safety & processing rules
├── run_project.py                # Single-command application server launcher
├── requirements.txt              # Backend dependencies
├── .env.example                  # Environment configuration template
└── README.md                     # Comprehensive project documentation
```

---

## 4. Phase-by-Phase Development & Test Plan

| Phase | Module | Completed Features | Test Case Reference |
|---|---|---|---|
| **Phase 1** | **Frontend Design** | 10-item Left Navigation, Top bar, Professional Healthcare Palette (Light blue, soft teal, dark navy text). | Verified on desktop, tablet, and mobile layouts. |
| **Phase 2** | **Core Upload & Validation** | File signature check (%PDF, \xFF\xD8, \x89PNG), medical relevance score, non-medical file rejection (Feature 3). | `test_01_file_signature_validation`, `test_02_medical_content_validation_rejection` |
| **Phase 3** | **Clinical Extraction & Classification**| PyMuPDF text extraction, deterministic Normal/High/Low/Unknown classification using report reference ranges. | `test_03_value_status_classification` |
| **Phase 4** | **Red-Flag Urgency Triage** | Clinician-reviewed critical thresholds (Potassium > 6.0, Troponin > 0.04), emergency call & family alert shortcuts. | `test_04_red_flag_alert_detection` |
| **Phase 5** | **AI Plain Language & Accessibility** | 3 Reading Levels (Simple, Standard, Detailed), Multilingual (EN, KN, HI, ES, MR), Web Speech TTS audio readout. | Interactive speech synthesis & reading level switch tested. |
| **Phase 6** | **Patient Management & Reminders** | Longitudinal trend comparison (HbA1c 8.4% → 7.1%), pill tracker, appointments, revocable family access. | `test_05_auth_password_and_jwt`, `test_06_doctor_questions_generation` |

---

## 5. How to Run the Application

### Option A: Complete Full-Stack Server (Recommended)
Make sure you are in the project folder:
```powershell
cd C:\Users\SAMRUDDHI\.gemini\antigravity\scratch\medisimplify
python run_project.py
```
Then open your web browser:
- **Web Application Interface:** [http://localhost:8000/app/](http://localhost:8000/app/)
- **Swagger Interactive API Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **API Health Check:** [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

### Option B: Run Automated Unit Tests
```powershell
cd C:\Users\SAMRUDDHI\.gemini\antigravity\scratch\medisimplify
python -m unittest test_suite.py
```
*Result: 6/6 tests passing (File signatures, medical rejection, value status, red flags, auth, doctor questions).*

---

## 6. Demonstration Scenarios for College Presentation

1. **Dashboard & Navigation Overview (Page B):**
   - Left-side navigation menu with 10 structured sections.
   - 4 summary stat cards, upcoming reminders, and recent reports table.

2. **Flagship Medical Report Analysis (Page E):**
   - Click **"View Analysis"** on the Apollo Metabolic Panel report.
   - Point out **SGPT / ALT (48 U/L)**: Observe the reassuring note: *"At 48 U/L, this is only a minor bump. Common with statin medication or food; not liver failure."*
   - Test **Reading Level**: Switch between **🐣 Simple**, **Standard**, and **Detailed**.
   - Test **Audio Explanation**: Click **"Listen"** to trigger speech synthesis.
   - Show the **Doctor Questions Checklist** and **Safety Disclaimer**.

3. **Medical-Only File Upload Restriction (Feature 3):**
   - Navigate to **"2. Upload Report"** and click **"Test Invalid File (Restaurant Dinner Bill)"**.
   - Observe the system's prompt rejection: *"Non-Medical Document Detected. ClariMed only accepts medical lab reports, discharge summaries, and prescriptions."*

4. **Critical Red-Flag Urgency Alert (Feature 12):**
   - Click **"Critical Red-Flag (High Potassium & Troponin)"**.
   - Notice the pulsing red alert banner, emergency hotline shortcut (108/112), and instant caregiver alert.

5. **Medical History & Compatible Trend Comparison (Page G):**
   - Navigate to **"4. Medical History"**.
   - View the 6-month visual improvement in HbA1c from **8.4% → 7.8% → 7.1%**.
#   m e d i c a l - r e p o r t - a n a l y s e r  
 