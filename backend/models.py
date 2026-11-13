import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="patient") # patient, family_member, admin
    preferred_language = Column(String(20), default="en") # en, kn, hi, es, mr
    preferred_reading_level = Column(String(20), default="simple") # simple, standard, detailed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    profile = relationship("PatientProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="user", cascade="all, delete-orphan")
    medicines = relationship("Medicine", back_populates="user", cascade="all, delete-orphan")
    reminders = relationship("Reminder", back_populates="user", cascade="all, delete-orphan")
    appointments = relationship("Appointment", back_populates="user", cascade="all, delete-orphan")

class PatientProfile(Base):
    __tablename__ = "patient_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    date_of_birth = Column(String(30), nullable=True)
    age = Column(Integer, default=58)
    gender = Column(String(20), default="Male")
    blood_group = Column(String(10), default="B+")
    allergies = Column(Text, default="Penicillin (skin rash), Sulfa Antibiotics")
    chronic_conditions = Column(Text, default="Type 2 Diabetes Mellitus, Essential Hypertension")
    emergency_contact = Column(String(150), default="+91 98201-44321 (Rahul Sharma - Son)")

    user = relationship("User", back_populates="profile")

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    filename = Column(String(255), nullable=False)
    file_size_bytes = Column(Integer, default=0)
    file_type = Column(String(50), default="pdf")
    document_type = Column(String(100), default="Laboratory Diagnostic Report")
    facility_name = Column(String(150), default="Clinical Diagnostic Laboratory")
    doctor_name = Column(String(150), default="Attending Physician")
    report_date = Column(String(50), default=lambda: datetime.datetime.utcnow().strftime("%d-%b-%Y"))
    storage_path = Column(String(500), nullable=False)
    status = Column(String(50), default="completed") # pending, processing, completed, rejected, error
    confidence_score = Column(Integer, default=95)
    is_medical = Column(Boolean, default=True)
    red_flag_level = Column(String(30), default="none") # none, attention, critical
    red_flag_message = Column(Text, nullable=True)
    raw_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="documents")
    results = relationship("ExtractedResult", back_populates="document", cascade="all, delete-orphan")
    explanations = relationship("Explanation", back_populates="document", cascade="all, delete-orphan")

class ExtractedResult(Base):
    __tablename__ = "extracted_results"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"))
    test_name = Column(String(150), nullable=False)
    key_name = Column(String(100), nullable=True) # standardized key, e.g., hba1c
    value = Column(String(50), nullable=False) # original string representation preserved
    numeric_value = Column(Float, nullable=True)
    unit = Column(String(50), nullable=True)
    reference_min = Column(Float, nullable=True)
    reference_max = Column(Float, nullable=True)
    reference_range_raw = Column(String(100), nullable=True) # Original report range
    status = Column(String(30), default="normal") # normal, high, low, unknown
    plain_explanation = Column(Text, nullable=True)
    reassurance_note = Column(Text, nullable=True)

    document = relationship("Document", back_populates="results")

class Explanation(Base):
    __tablename__ = "explanations"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"))
    language = Column(String(20), default="en") # en, kn, hi, es, mr
    reading_level = Column(String(20), default="simple") # simple, standard, detailed
    summary_text = Column(Text, nullable=False)
    doctor_questions = Column(Text, nullable=True) # JSON array serialized
    disclaimer = Column(Text, default="This application helps you understand your medical documents in simple language. It does not provide a medical diagnosis or replace professional medical advice. Always consult your doctor before making decisions about your health or medication.")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    document = relationship("Document", back_populates="explanations")

class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="SET NULL"), nullable=True)
    medicine_name = Column(String(150), nullable=False)
    generic_name = Column(String(150), nullable=True)
    strength = Column(String(50), nullable=True)
    dosage_form = Column(String(50), default="Tablet")
    prescribed_instructions = Column(Text, nullable=False) # Preserved exactly from prescription
    timing = Column(String(100), default="With breakfast")
    purpose = Column(Text, nullable=True)
    precautions = Column(Text, nullable=True)
    mild_side_effects = Column(Text, nullable=True)
    urgent_side_effects = Column(Text, nullable=True)
    verification_status = Column(String(50), default="Verified Prescription") # Verified Prescription, Needs Clarification
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="medicines")

class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    medicine_id = Column(Integer, ForeignKey("medicines.id", ondelete="SET NULL"), nullable=True)
    reminder_type = Column(String(30), default="medicine") # medicine, appointment
    title = Column(String(150), nullable=False)
    scheduled_time = Column(String(50), nullable=False)
    timing_label = Column(String(100), default="Daily")
    instructions = Column(Text, nullable=True)
    taken_today = Column(Boolean, default=False)
    enabled = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="reminders")

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    doctor_name = Column(String(150), nullable=False)
    hospital_name = Column(String(150), nullable=False)
    appointment_datetime = Column(String(100), nullable=False)
    notes = Column(Text, nullable=True)
    reminder_enabled = Column(Boolean, default=True)
    status = Column(String(50), default="Confirmed")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="appointments")

class FamilyPermission(Base):
    __tablename__ = "family_permissions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    family_user_id = Column(Integer, nullable=True)
    family_member_name = Column(String(120), nullable=False)
    relationship_type = Column(String(80), nullable=False) # Son, Daughter, Spouse, Home Caregiver
    contact_number = Column(String(50), nullable=False)
    permission_level = Column(String(50), default="Read-Only Summaries") # Full Access, Read-Only Summaries, Reminders Only
    status = Column(String(30), default="active") # active, revoked, pending
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    actor_id = Column(Integer, nullable=False)
    action = Column(String(100), nullable=False) # UPLOAD_DOCUMENT, VIEW_REPORT, SHARE_FAMILY, REVOKE_FAMILY, DELETE_DOCUMENT
    resource_id = Column(String(100), nullable=True)
    details = Column(Text, nullable=True)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
