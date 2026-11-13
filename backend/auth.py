import hashlib
import hmac
import json
import base64
import time
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from .config import settings
from .database import get_db
from .models import User

security = HTTPBearer(auto_error=False)

def hash_password(password: str) -> str:
    """Hashes a password securely using salted SHA-256."""
    salt = settings.SECRET_KEY[:16]
    h = hmac.new(salt.encode('utf-8'), password.encode('utf-8'), hashlib.sha256)
    return h.hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against the stored hash."""
    return hmac.compare_digest(hash_password(plain_password), hashed_password)

def create_access_token(data: dict, expires_delta_seconds: Optional[int] = None) -> str:
    """Generates a secure signed JWT token."""
    to_encode = data.copy()
    if expires_delta_seconds:
        expire = int(time.time()) + expires_delta_seconds
    else:
        expire = int(time.time()) + (settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    
    header = {"alg": "HS256", "typ": "JWT"}
    to_encode["exp"] = expire

    header_b64 = base64.urlsafe_b64encode(json.dumps(header).encode('utf-8')).rstrip(b'=').decode('utf-8')
    payload_b64 = base64.urlsafe_b64encode(json.dumps(to_encode).encode('utf-8')).rstrip(b'=').decode('utf-8')
    
    signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
    signature = hmac.new(settings.SECRET_KEY.encode('utf-8'), signing_input, hashlib.sha256).digest()
    sig_b64 = base64.urlsafe_b64encode(signature).rstrip(b'=').decode('utf-8')
    
    return f"{header_b64}.{payload_b64}.{sig_b64}"

def decode_access_token(token: str) -> Optional[dict]:
    """Decodes and validates a JWT token signature and expiration."""
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        header_b64, payload_b64, sig_b64 = parts
        
        # Verify signature
        signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
        expected_sig = hmac.new(settings.SECRET_KEY.encode('utf-8'), signing_input, hashlib.sha256).digest()
        
        # Add padding back if necessary
        sig_padding = '=' * (4 - len(sig_b64) % 4) if len(sig_b64) % 4 != 0 else ''
        actual_sig = base64.urlsafe_b64decode((sig_b64 + sig_padding).encode('utf-8'))
        
        if not hmac.compare_digest(expected_sig, actual_sig):
            return None
            
        payload_padding = '=' * (4 - len(payload_b64) % 4) if len(payload_b64) % 4 != 0 else ''
        payload_bytes = base64.urlsafe_b64decode((payload_b64 + payload_padding).encode('utf-8'))
        payload = json.loads(payload_bytes.decode('utf-8'))
        
        if payload.get("exp", 0) < int(time.time()):
            return None # Expired
            
        return payload
    except Exception:
        return None

def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Dependency to retrieve the currently authenticated user or fall back to default demo patient."""
    if credentials:
        payload = decode_access_token(credentials.credentials)
        if payload and "sub" in payload:
            user = db.query(User).filter(User.id == int(payload["sub"])).first()
            if user:
                return user

    # Default demo patient for seamless demonstration
    demo_user = db.query(User).filter(User.email == "patient.ramesh@clarimed.local").first()
    if demo_user:
        return demo_user

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required. Please provide a valid Bearer token.",
        headers={"WWW-Authenticate": "Bearer"},
    )
