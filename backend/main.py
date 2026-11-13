import os
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import settings
from .database import engine, Base, SessionLocal
from .models import User, PatientProfile, Document, ExtractedResult, Explanation, Medicine, Reminder, Appointment, FamilyPermission
from .auth import hash_password

# Import routers
from .routes.auth_routes import router as auth_router
from .routes.document_routes import router as document_router
from .routes.history_routes import router as history_router
from .routes.medicine_routes import router as medicine_router
from .routes.reminder_routes import router as reminder_router
from .routes.family_routes import router as family_router

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API for Medical Report Understanding & Patient Assistance System",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers under /api/v1
app.include_router(auth_router, prefix=settings.API_V1_PREFIX)
app.include_router(document_router, prefix=settings.API_V1_PREFIX)
app.include_router(history_router, prefix=settings.API_V1_PREFIX)
app.include_router(medicine_router, prefix=settings.API_V1_PREFIX)
app.include_router(reminder_router, prefix=settings.API_V1_PREFIX)
app.include_router(family_router, prefix=settings.API_V1_PREFIX)

# Mount frontend static files for seamless single-server deployment
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
if os.path.exists(frontend_dir):
    app.mount("/app", StaticFiles(directory=frontend_dir, html=True), name="frontend_app")

@app.get("/")
def root():
    return {
        "project": settings.APP_NAME,
        "status": "online",
        "web_interface": "/app/",
        "api_docs": "/docs",
        "api_version": "v1"
    }

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "storage": settings.STORAGE_BACKEND,
        "ai_provider": settings.AI_PROVIDER,
        "upload_dir_ready": os.path.exists(settings.UPLOAD_DIR)
    }

def seed_demo_data():
    """Initializes rich, realistic sample patient data for seamless demonstration."""
    db = SessionLocal()
    try:
        # Check if demo patient exists
        patient = db.query(User).filter(User.email == "patient.ramesh@clarimed.local").first()
        if not patient:
            patient = User(
                name="Ramesh Sharma",
                email="patient.ramesh@clarimed.local",
                password_hash=hash_password("Demo@1234"),
                role="patient",
                preferred_language="en",
                preferred_reading_level="simple"
            )
            db.add(patient)
            db.commit()
            db.refresh(patient)

            # Profile
            profile = PatientProfile(
                user_id=patient.id,
                age=58,
                gender="Male",
                blood_group="B+",
                allergies="Penicillin (causes severe skin rash), Sulfa Antibiotics",
                chronic_conditions="Type 2 Diabetes Mellitus (Diagnosed 2020), Essential Hypertension (Diagnosed 2023)",
                emergency_contact="+91 98201-44321 (Rahul Sharma - Son)"
            )
            db.add(profile)

            # Initial Document 1: Comprehensive Metabolic & Lipid Lab Report
            doc1 = Document(
                user_id=patient.id,
                filename="Apollo_Metabolic_Lipid_Panel_Nov2026.pdf",
                file_size_bytes=248500,
                file_type="pdf",
                document_type="Laboratory Diagnostic Report",
                facility_name="Apollo Diagnostics & Pathology Care",
                doctor_name="Dr. Rajesh Mehta, MD (Internal Medicine)",
                report_date="13-Nov-2026",
                storage_path="Apollo_Metabolic_Lipid_Panel_Nov2026.pdf",
                status="completed",
                confidence_score=98,
                is_medical=True,
                red_flag_level="attention",
                red_flag_message="Mildly elevated blood sugar (Fasting 138 mg/dL) and borderline cholesterol. SGPT is marginally elevated at 48 U/L (reference is 40). Kidney function is normal and stable. No emergency.",
                raw_text="HbA1c: 7.1 % (Ref: 4.0 - 5.7). Fasting Blood Glucose: 138 mg/dL (Ref: 70 - 99). Serum Creatinine: 1.05 mg/dL (Ref: 0.7 - 1.3). SGPT / ALT: 48 U/L (Ref: 0 - 40). LDL: 138 mg/dL (Ref: < 100). Serum Potassium: 4.4 mEq/L (Ref: 3.5 - 5.0). Hemoglobin: 14.2 g/dL (Ref: 13.0 - 17.0)."
            )
            db.add(doc1)
            db.commit()
            db.refresh(doc1)

            # Results for Doc 1
            sample_results = [
                ExtractedResult(
                    document_id=doc1.id,
                    test_name="HbA1c (Glycosylated Hemoglobin)",
                    key_name="hba1c",
                    value="7.1",
                    numeric_value=7.1,
                    unit="%",
                    reference_min=4.0,
                    reference_max=5.7,
                    reference_range_raw="4.0 - 5.7",
                    status="high",
                    plain_explanation="3-Month Blood Sugar Quarterly Average",
                    reassurance_note="Your average blood sugar over 3 months is 7.1%. For patients managing diabetes, doctors often aim for under 7.0%. You are very close to your goal!"
                ),
                ExtractedResult(
                    document_id=doc1.id,
                    test_name="Fasting Blood Glucose",
                    key_name="fasting_glucose",
                    value="138",
                    numeric_value=138.0,
                    unit="mg/dL",
                    reference_min=70.0,
                    reference_max=99.0,
                    reference_range_raw="70 - 99",
                    status="high",
                    plain_explanation="Morning Sugar Level Before Breakfast",
                    reassurance_note="Fasting glucose is 138 mg/dL. While above standard fasting limits, this is well within manageable levels through diet and medication."
                ),
                ExtractedResult(
                    document_id=doc1.id,
                    test_name="Serum Creatinine",
                    key_name="creatinine",
                    value="1.05",
                    numeric_value=1.05,
                    unit="mg/dL",
                    reference_min=0.7,
                    reference_max=1.3,
                    reference_range_raw="0.7 - 1.3",
                    status="normal",
                    plain_explanation="Kidney Filter Health Marker",
                    reassurance_note="Safe and healthy. Your kidneys are filtering waste cleanly in the green zone."
                ),
                ExtractedResult(
                    document_id=doc1.id,
                    test_name="SGPT / ALT (Liver Enzyme)",
                    key_name="sgpt",
                    value="48",
                    numeric_value=48.0,
                    unit="U/L",
                    reference_min=0.0,
                    reference_max=40.0,
                    reference_range_raw="0 - 40",
                    status="high",
                    plain_explanation="Liver Cell Health Enzyme",
                    reassurance_note="DO NOT PANIC: At 48 U/L (reference is 40), this is only a minor elevation. Common with statins, rich meals, or mild stress; not liver failure."
                ),
                ExtractedResult(
                    document_id=doc1.id,
                    test_name="Serum Potassium (K+)",
                    key_name="potassium",
                    value="4.4",
                    numeric_value=4.4,
                    unit="mEq/L",
                    reference_min=3.5,
                    reference_max=5.0,
                    reference_range_raw="3.5 - 5.0",
                    status="normal",
                    plain_explanation="Heart Rhythm & Muscle Salt",
                    reassurance_note="Safe and balanced. Your heart's electrical electrolytes are in optimal balance."
                )
            ]
            for r in sample_results:
                db.add(r)

            # Doctor Questions for Doc 1
            questions = [
                {"id": "q1", "text": "My SGPT is 48 U/L (mildly above 40). Could my evening cholesterol medicine be causing this minor bump?", "checked": False},
                {"id": "q2", "text": "My HbA1c is 7.1%, down from 7.8% last quarter. Should we maintain Metformin 500mg or adjust dosage?", "checked": False},
                {"id": "q3", "text": "Are there specific dietary changes to help lower my LDL cholesterol from 138 to under 100?", "checked": False},
                {"id": "q4", "text": "When should I repeat this metabolic panel?", "checked": False}
            ]

            expl = Explanation(
                document_id=doc1.id,
                language="en",
                reading_level="simple",
                summary_text="Overall, your kidneys and heart salts (potassium) are in great shape! Your morning blood sugar (138) and quarterly 3-month sugar average (7.1%) are slightly high, meaning your diabetes medication might need a small tweak. Your liver enzyme is just slightly higher than usual (48 compared to 40), which is very common when taking cholesterol medicine and nothing to panic over.",
                doctor_questions=json.dumps(questions)
            )
            db.add(expl)

            # Prescribed Medicines
            med1 = Medicine(
                user_id=patient.id,
                document_id=doc1.id,
                medicine_name="Metformin 500mg",
                generic_name="Metformin Hydrochloride",
                strength="500mg",
                dosage_form="Tablet",
                prescribed_instructions="1 tablet PO BID (Twice daily with breakfast & dinner)",
                timing="With meals",
                purpose="Helps body cells respond smoothly to insulin and prevents liver sugar spikes.",
                precautions="Take immediately after food with water. Do not skip meals.",
                mild_side_effects="Mild stomach rumble during initial days.",
                urgent_side_effects="Severe muscle aches or persistent vomiting."
            )
            med2 = Medicine(
                user_id=patient.id,
                document_id=doc1.id,
                medicine_name="Atorvastatin 10mg",
                generic_name="Atorvastatin Calcium",
                strength="10mg",
                dosage_form="Tablet",
                prescribed_instructions="1 tablet PO HS (Once daily at bedtime)",
                timing="Bedtime",
                purpose="Slows down bad cholesterol production and keeps blood vessels clear.",
                precautions="Avoid grapefruit juice; take consistently at night.",
                mild_side_effects="Mild morning fatigue or dry mouth.",
                urgent_side_effects="Unusual dark urine or persistent severe muscle weakness."
            )
            db.add(med1)
            db.add(med2)

            # Reminders
            rem1 = Reminder(
                user_id=patient.id,
                title="Metformin 500mg",
                scheduled_time="08:30 AM",
                timing_label="Breakfast",
                instructions="Take 1 tablet with breakfast and a glass of water.",
                taken_today=True,
                enabled=True
            )
            rem2 = Reminder(
                user_id=patient.id,
                title="Metformin 500mg (2nd Dose)",
                scheduled_time="08:00 PM",
                timing_label="Dinner",
                instructions="Take 1 tablet with dinner.",
                taken_today=False,
                enabled=True
            )
            rem3 = Reminder(
                user_id=patient.id,
                title="Atorvastatin 10mg",
                scheduled_time="10:00 PM",
                timing_label="Bedtime",
                instructions="Take 1 tablet right before sleeping.",
                taken_today=False,
                enabled=True
            )
            db.add(rem1)
            db.add(rem2)
            db.add(rem3)

            # Appointment
            appt1 = Appointment(
                user_id=patient.id,
                doctor_name="Dr. Rajesh Mehta, MD",
                hospital_name="Apollo Diagnostics Clinic, Room 204",
                appointment_datetime="18-Nov-2026 at 10:30 AM",
                notes="Review HbA1c progress and cholesterol profile"
            )
            db.add(appt1)

            # Family Circle
            fam1 = FamilyPermission(
                patient_id=patient.id,
                family_member_name="Rahul Sharma",
                relationship_type="Son (Primary Caregiver)",
                contact_number="+91 98201-44321",
                permission_level="Full Access & Emergency Responder",
                status="active"
            )
            fam2 = FamilyPermission(
                patient_id=patient.id,
                family_member_name="Pooja Sharma",
                relationship_type="Daughter-in-law",
                contact_number="+91 98201-99887",
                permission_level="Read-Only Summaries",
                status="active"
            )
            db.add(fam1)
            db.add(fam2)

            db.commit()
            print("Successfully initialized demo patient data!")
    finally:
        db.close()

seed_demo_data()
