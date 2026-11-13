from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, FamilyPermission, AuditLog
from ..schemas import FamilyPermissionCreate, FamilyPermissionOut
from ..auth import get_current_user

router = APIRouter(prefix="/family", tags=["Family Access & Sharing"])

@router.get("/permissions", response_model=List[FamilyPermissionOut])
def list_family_permissions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves family members granted access to the patient's records."""
    return db.query(FamilyPermission).filter(
        FamilyPermission.patient_id == current_user.id,
        FamilyPermission.status == "active"
    ).all()

@router.post("/invitations", response_model=FamilyPermissionOut)
def invite_family_member(
    req: FamilyPermissionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Grants explicit, revocable access to a close family caregiver."""
    perm = FamilyPermission(
        patient_id=current_user.id,
        family_member_name=req.family_member_name,
        relationship_type=req.relationship_type,
        contact_number=req.contact_number,
        permission_level=req.permission_level or "Read-Only Summaries",
        status="active"
    )
    db.add(perm)
    db.commit()
    db.refresh(perm)

    audit = AuditLog(
        actor_id=current_user.id,
        action="SHARE_FAMILY",
        resource_id=str(perm.id),
        details=f"Granted {perm.permission_level} to {perm.family_member_name} ({perm.relationship_type})"
    )
    db.add(audit)
    db.commit()

    return perm

@router.delete("/permissions/{permission_id}")
def revoke_family_permission(
    permission_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Revokes a family member's access immediately."""
    perm = db.query(FamilyPermission).filter(
        FamilyPermission.id == permission_id,
        FamilyPermission.patient_id == current_user.id
    ).first()
    if not perm:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Permission not found.")

    perm.status = "revoked"
    audit = AuditLog(
        actor_id=current_user.id,
        action="REVOKE_FAMILY",
        resource_id=str(permission_id),
        details=f"Revoked access for {perm.family_member_name}"
    )
    db.add(audit)
    db.commit()

    return {"message": f"Access for {perm.family_member_name} has been revoked."}
