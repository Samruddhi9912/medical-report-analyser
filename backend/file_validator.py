import re
from typing import Tuple, Dict, Any
from .config import settings

# Recognized magic byte headers
MAGIC_SIGNATURES = {
    "pdf": b"%PDF",
    "png": b"\x89PNG\r\n\x1a\n",
    "jpg": b"\xff\xd8\xff",
    "jpeg": b"\xff\xd8\xff"
}

# Extensive clinical markers & tests
MEDICAL_MARKERS = [
    # Clinical headers
    "patient", "physician", "doctor", "dr.", "hospital", "clinic", "pathology",
    "laboratory", "discharge summary", "prescription", "rx", "investigation",
    "biochemistry", "hematology", "clinical impression", "specimen", "serum",
    
    # Common laboratory biomarkers
    "hemoglobin", "hba1c", "glucose", "fasting", "post-prandial", "creatinine",
    "urea", "bun", "egfr", "sgpt", "sgot", "alt", "ast", "cholesterol",
    "ldl", "hdl", "triglycerides", "potassium", "sodium", "calcium", "wbc",
    "platelets", "tsh", "troponin", "bilirubin", "esr", "crp", "urine",
    
    # Units & clinical abbreviations
    "mg/dl", "mmol/l", "meq/l", "u/l", "g/dl", "mmhg", "mcg", "tab", "cap",
    "bid", "tid", "qid", "po", "od", "hs", "prn", "sos"
]

# Strict non-medical rejection triggers (e.g. food bills, travel tickets, invoices)
NON_MEDICAL_INDICATORS = [
    "tax invoice", "gstin", "subtotal", "restaurant", "bistro", "waiter", "table #",
    "credit card", "boarding pass", "flight ticket", "resume", "curriculum vitae",
    "amazon order", "swiggy", "zomato", "uber trip", "bank statement", "cashier"
]

def validate_file_signature(content_bytes: bytes, filename: str) -> Tuple[bool, str]:
    """Inspects raw byte headers to ensure file extension matches real binary type."""
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in settings.ALLOWED_EXTENSIONS:
        return False, f"Unsupported file extension .{ext}. Allowed: PDF, JPG, PNG."

    if len(content_bytes) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        return False, f"File size exceeds maximum allowed limit of {settings.MAX_UPLOAD_SIZE_MB}MB."

    if ext == "pdf":
        if not content_bytes.startswith(b"%PDF"):
            return False, "File header corrupted: File does not appear to be a genuine PDF."
    elif ext in ("jpg", "jpeg"):
        if not content_bytes.startswith(b"\xff\xd8"):
            return False, "File header corrupted: File does not appear to be a genuine JPEG image."
    elif ext == "png":
        if not content_bytes.startswith(b"\x89PNG"):
            return False, "File header corrupted: File does not appear to be a genuine PNG image."

    return True, "Valid file signature."

def validate_medical_content(text: str, filename: str = "") -> Dict[str, Any]:
    """
    Validates extracted text to determine if it is a genuine clinical document.
    Enforces Feature 3: Strict rejection of non-medical files.
    """
    if not text or len(text.strip()) < 15:
        return {
            "is_medical": False,
            "confidence_score": 0,
            "detected_type": "Unreadable / Empty Document",
            "reason": "Document has no readable text or text was too short to determine medical validity."
        }

    normalized = (text + " " + filename).lower()

    # Check non-medical triggers
    non_medical_hits = [p for p in NON_MEDICAL_INDICATORS if p in normalized]
    if non_medical_hits:
        return {
            "is_medical": False,
            "confidence_score": 5,
            "detected_type": "Non-Medical Document (Invoice / Receipt / Bill)",
            "matched_indicators": non_medical_hits,
            "reason": f"Document rejected: Contains commercial non-medical markers ({', '.join(non_medical_hits[:3])}). ClariMed only accepts medical lab reports, discharge summaries, and prescriptions."
        }

    # Count clinical hits
    medical_hits = [m for m in MEDICAL_MARKERS if re.search(r'\b' + re.escape(m) + r'\b', normalized)]
    
    # Calculate confidence score
    score = min(99, max(5, int((len(medical_hits) / 6.0) * 100)))

    # Determine medical category
    if any(k in normalized for k in ["discharge", "admission", "ipd"]):
        detected_type = "Hospital Discharge Summary"
    elif any(k in normalized for k in ["rx", "tab", "cap", "prescribed", "sig"]):
        detected_type = "Medical Prescription"
    elif any(k in normalized for k in ["pathology", "lab", "serum", "biochemistry", "hematology", "profile"]):
        detected_type = "Laboratory Diagnostic Report"
    else:
        detected_type = "Clinical Medical Document"

    is_medical = score >= 35 and len(medical_hits) >= 3

    if is_medical:
        return {
            "is_medical": True,
            "confidence_score": score,
            "detected_type": detected_type,
            "matched_indicators": medical_hits[:8],
            "message": f"Verified {detected_type} with {score}% confidence score. Identified {len(medical_hits)} clinical biomarkers."
        }
    else:
        return {
            "is_medical": False,
            "confidence_score": score,
            "detected_type": "Unrecognized Non-Medical Document",
            "matched_indicators": medical_hits,
            "reason": "Insufficient clinical parameters found. Please upload a valid laboratory report, doctor prescription, or hospital discharge summary."
        }
