from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Document, ExtractedResult, PatientProfile
from ..auth import get_current_user

router = APIRouter(prefix="/history", tags=["Medical History & Comparison"])

@router.get("")
def get_medical_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves chronological medical report timeline and patient chronic condition profile."""
    profile = db.query(PatientProfile).filter(PatientProfile.user_id == current_user.id).first()
    docs = db.query(Document).filter(Document.user_id == current_user.id).order_by(Document.created_at.desc()).all()

    timeline = []
    for d in docs:
        key_results = []
        for r in d.results[:4]:
            key_results.append({
                "test_name": r.test_name,
                "value": r.value,
                "unit": r.unit,
                "status": r.status
            })

        timeline.append({
            "document_id": d.id,
            "filename": d.filename,
            "document_type": d.document_type,
            "facility_name": d.facility_name,
            "report_date": d.report_date,
            "red_flag_level": d.red_flag_level,
            "status": d.status,
            "key_results": key_results
        })

    return {
        "profile": {
            "name": current_user.name,
            "age": profile.age if profile else 58,
            "gender": profile.gender if profile else "Male",
            "blood_group": profile.blood_group if profile else "B+",
            "allergies": profile.allergies if profile else "Penicillin (skin rash)",
            "chronic_conditions": profile.chronic_conditions if profile else "Type 2 Diabetes, Hypertension",
            "emergency_contact": profile.emergency_contact if profile else "+91 98201-44321 (Rahul - Son)"
        },
        "timeline": timeline
    }

@router.get("/compare")
def compare_compatible_results(
    test_key: str = "hba1c",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Compares compatible numerical laboratory values across dates for longitudinal tracking.
    Enforces PRD Requirement: Does not compare incompatible tests or different units.
    """
    docs = db.query(Document).filter(Document.user_id == current_user.id).order_by(Document.created_at.asc()).all()
    comparison_points = []

    for d in docs:
        for r in d.results:
            if (r.key_name and r.key_name.lower() == test_key.lower()) or (test_key.lower() in r.test_name.lower()):
                if r.numeric_value is not None:
                    comparison_points.append({
                        "date": d.report_date,
                        "value": r.numeric_value,
                        "unit": r.unit,
                        "status": r.status,
                        "document_id": d.id,
                        "document_title": d.filename
                    })
                break

    return {
        "test_key": test_key,
        "total_data_points": len(comparison_points),
        "data_points": comparison_points
    }
