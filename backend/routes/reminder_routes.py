from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Reminder, Appointment
from ..schemas import ReminderCreate, ReminderUpdate, ReminderOut, AppointmentCreate, AppointmentOut
from ..auth import get_current_user

router = APIRouter(prefix="/reminders", tags=["Reminders & Appointments"])

@router.get("", response_model=List[ReminderOut])
def list_reminders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves all medication reminders for the patient."""
    return db.query(Reminder).filter(Reminder.user_id == current_user.id).all()

@router.post("", response_model=ReminderOut)
def create_reminder(
    req: ReminderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Creates a new scheduled medication reminder."""
    rem = Reminder(
        user_id=current_user.id,
        reminder_type=req.reminder_type or "medicine",
        title=req.title,
        scheduled_time=req.scheduled_time,
        timing_label=req.timing_label or "Daily",
        instructions=req.instructions or "Take with water.",
        taken_today=False,
        enabled=True
    )
    db.add(rem)
    db.commit()
    db.refresh(rem)
    return rem

@router.patch("/{reminder_id}", response_model=ReminderOut)
def update_reminder(
    reminder_id: int,
    req: ReminderUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Updates pill taken status or reminder enabled flag."""
    rem = db.query(Reminder).filter(Reminder.id == reminder_id, Reminder.user_id == current_user.id).first()
    if not rem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reminder not found.")

    if req.taken_today is not None:
        rem.taken_today = req.taken_today
    if req.enabled is not None:
        rem.enabled = req.enabled

    db.commit()
    db.refresh(rem)
    return rem

@router.delete("/{reminder_id}")
def delete_reminder(
    reminder_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deletes a reminder."""
    rem = db.query(Reminder).filter(Reminder.id == reminder_id, Reminder.user_id == current_user.id).first()
    if not rem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reminder not found.")
    db.delete(rem)
    db.commit()
    return {"message": "Reminder deleted successfully."}

# ================= APPOINTMENTS =================
@router.get("/appointments", response_model=List[AppointmentOut])
def list_appointments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lists scheduled doctor appointments."""
    return db.query(Appointment).filter(Appointment.user_id == current_user.id).all()

@router.post("/appointments", response_model=AppointmentOut)
def create_appointment(
    req: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Schedules a new doctor appointment."""
    appt = Appointment(
        user_id=current_user.id,
        doctor_name=req.doctor_name,
        hospital_name=req.hospital_name,
        appointment_datetime=req.appointment_datetime,
        notes=req.notes or "Routine clinical consultation",
        reminder_enabled=req.reminder_enabled if req.reminder_enabled is not None else True,
        status="Confirmed"
    )
    db.add(appt)
    db.commit()
    db.refresh(appt)
    return appt
