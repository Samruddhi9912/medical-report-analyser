from typing import List, Optional
from pydantic import BaseModel

# Auth Schemas
class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    preferred_language: Optional[str] = "en"
    preferred_reading_level: Optional[str] = "simple"

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    preferred_language: str
    preferred_reading_level: str

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# Profile Schemas
class PatientProfileOut(BaseModel):
    age: int
    gender: str
    blood_group: str
    allergies: str
    chronic_conditions: str
    emergency_contact: str

    class Config:
        from_attributes = True

# Extracted Result & Lab Value Schemas
class ExtractedResultOut(BaseModel):
    id: int
    test_name: str
    key_name: Optional[str] = None
    value: str
    numeric_value: Optional[float] = None
    unit: Optional[str] = None
    reference_min: Optional[float] = None
    reference_max: Optional[float] = None
    reference_range_raw: Optional[str] = None
    status: str # normal, high, low, unknown
    plain_explanation: Optional[str] = None
    reassurance_note: Optional[str] = None

    class Config:
        from_attributes = True

class DoctorQuestionOut(BaseModel):
    id: str
    text: str
    checked: bool = False

class ExplanationOut(BaseModel):
    language: str
    reading_level: str
    summary_text: str
    doctor_questions: List[DoctorQuestionOut] = []
    disclaimer: str

# Document Schemas
class DocumentUploadResponse(BaseModel):
    id: int
    filename: str
    document_type: str
    status: str
    confidence_score: int
    is_medical: bool
    message: str

class DocumentDetailOut(BaseModel):
    id: int
    filename: str
    document_type: str
    facility_name: str
    doctor_name: str
    report_date: str
    file_size_bytes: int
    status: str
    confidence_score: int
    is_medical: bool
    red_flag_level: str
    red_flag_message: Optional[str] = None
    summary_text: Optional[str] = None
    results: List[ExtractedResultOut] = []
    doctor_questions: List[DoctorQuestionOut] = []
    disclaimer: str

    class Config:
        from_attributes = True

# Medicine Schemas
class MedicineCreate(BaseModel):
    medicine_name: str
    generic_name: Optional[str] = None
    strength: Optional[str] = None
    prescribed_instructions: str
    timing: Optional[str] = "With food"
    purpose: Optional[str] = None

class MedicineOut(BaseModel):
    id: int
    medicine_name: str
    generic_name: Optional[str]
    strength: Optional[str]
    dosage_form: str
    prescribed_instructions: str
    timing: str
    purpose: Optional[str]
    precautions: Optional[str]
    mild_side_effects: Optional[str]
    urgent_side_effects: Optional[str]
    verification_status: str

    class Config:
        from_attributes = True

# Reminder Schemas
class ReminderCreate(BaseModel):
    title: str
    scheduled_time: str
    timing_label: Optional[str] = "Daily"
    instructions: Optional[str] = None
    reminder_type: Optional[str] = "medicine"

class ReminderUpdate(BaseModel):
    taken_today: Optional[bool] = None
    enabled: Optional[bool] = None

class ReminderOut(BaseModel):
    id: int
    reminder_type: str
    title: str
    scheduled_time: str
    timing_label: str
    instructions: Optional[str]
    taken_today: bool
    enabled: bool

    class Config:
        from_attributes = True

# Appointment Schemas
class AppointmentCreate(BaseModel):
    doctor_name: str
    hospital_name: str
    appointment_datetime: str
    notes: Optional[str] = None
    reminder_enabled: Optional[bool] = True

class AppointmentOut(BaseModel):
    id: int
    doctor_name: str
    hospital_name: str
    appointment_datetime: str
    notes: Optional[str]
    status: str
    reminder_enabled: bool

    class Config:
        from_attributes = True

# Family Sharing Schemas
class FamilyPermissionCreate(BaseModel):
    family_member_name: str
    relationship_type: str
    contact_number: str
    permission_level: Optional[str] = "Read-Only Summaries"

class FamilyPermissionOut(BaseModel):
    id: int
    family_member_name: str
    relationship_type: str
    contact_number: str
    permission_level: str
    status: str

    class Config:
        from_attributes = True
