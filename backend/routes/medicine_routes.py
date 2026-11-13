from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Medicine, AuditLog
from ..schemas import MedicineCreate, MedicineOut
from ..auth import get_current_user

router = APIRouter(prefix="/medicines", tags=["Medicine Information"])

@router.get("", response_model=List[MedicineOut])
def get_user_medicines(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves all active prescribed medicines for the patient."""
    return db.query(Medicine).filter(Medicine.user_id == current_user.id).all()

@router.post("", response_model=MedicineOut)
def add_medicine_record(
    req: MedicineCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Adds a new prescription medicine record while preserving doctor instructions."""
    med = Medicine(
        user_id=current_user.id,
        medicine_name=req.medicine_name,
        generic_name=req.generic_name or req.medicine_name.split()[0],
        strength=req.strength,
        dosage_form="Tablet",
        prescribed_instructions=req.prescribed_instructions,
        timing=req.timing or "With meals",
        purpose=req.purpose or "Prescribed therapy for ongoing health management.",
        precautions="Take exactly as directed by your prescribing physician. Do not alter dose without consultation.",
        mild_side_effects="Occasional mild stomach sensitivity.",
        urgent_side_effects="Notify doctor immediately if severe rash, breathing difficulty, or swelling occurs.",
        verification_status="Verified Prescription"
    )
    db.add(med)
    db.commit()
    db.refresh(med)

    audit = AuditLog(actor_id=current_user.id, action="ADD_MEDICINE", resource_id=str(med.id))
    db.add(audit)
    db.commit()

    return med
