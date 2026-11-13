import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "Medical Report Understanding & Patient Assistance System"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    API_V1_PREFIX: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "college_demo_jwt_secret_key_medical_assistance_2026")
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./medical_app.db")
    
    # Storage
    STORAGE_BACKEND: str = os.getenv("STORAGE_BACKEND", "local")
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", os.path.join(os.path.dirname(__file__), "storage", "private_uploads"))
    MAX_UPLOAD_SIZE_MB: int = int(os.getenv("MAX_UPLOAD_SIZE_MB", "15"))
    ALLOWED_EXTENSIONS: set = {"pdf", "jpg", "jpeg", "png"}
    
    # AI Provider: 'gemini', 'ollama', 'openai', 'deterministic'
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "deterministic")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3")
    
    # Auth
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "120"))
    ALGORITHM: str = "HS256"

settings = Settings()

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
