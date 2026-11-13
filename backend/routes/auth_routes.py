from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, PatientProfile, AuditLog
from ..schemas import UserRegister, UserLogin, UserOut, TokenResponse
from ..auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register_user(req: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    user = User(
        name=req.name,
        email=req.email.lower(),
        password_hash=hash_password(req.password),
        role="patient",
        preferred_language=req.preferred_language or "en",
        preferred_reading_level=req.preferred_reading_level or "simple"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Initialize patient profile
    profile = PatientProfile(user_id=user.id)
    db.add(profile)

    # Audit log
    audit = AuditLog(actor_id=user.id, action="USER_REGISTER", details=f"User registered: {user.email}")
    db.add(audit)
    db.commit()

    token = create_access_token({"sub": str(user.id), "role": user.role, "email": user.email})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.post("/login", response_model=TokenResponse)
def login_user(req: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    # Audit log
    audit = AuditLog(actor_id=user.id, action="USER_LOGIN", details=f"User logged in: {user.email}")
    db.add(audit)
    db.commit()

    token = create_access_token({"sub": str(user.id), "role": user.role, "email": user.email})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.get("/me", response_model=UserOut)
def get_user_profile(current_user: User = Depends(get_current_user)):
    return current_user
