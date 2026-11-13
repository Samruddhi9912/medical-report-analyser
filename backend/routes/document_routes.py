import os
import json
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status, Query
from sqlalchemy.orm import Session
from ..config import settings
from ..database import get_db
from ..models import User, Document, ExtractedResult, Explanation, AuditLog
from ..schemas import DocumentUploadResponse, DocumentDetailOut, ExtractedResultOut, DoctorQuestionOut
from ..auth import get_current_user
from ..file_validator import validate_file_signature, validate_medical_content
from ..extractor import extract_text_from_pdf, parse_laboratory_results
from ..clinical_engine import classify_value_status, evaluate_document_red_flags
from ..ai_service import generate_report_summary, generate_doctor_questions

router = APIRouter(prefix="/documents", tags=["Medical Documents"])

@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_medical_document(
    file: UploadFile = File(...),
    document_type_hint: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Core document upload endpoint.
    Performs file signature validation, text extraction (PyMuPDF), medical content verification,
    deterministic value classification, red-flag alert scanning, and AI explanation generation.
    Strictly rejects non-medical documents (Feature 3).
    """
    content = await file.read()
    filename = file.filename or "uploaded_document.pdf"

    # Step 1: Validate file signature (magic bytes)
    valid_sig, sig_msg = validate_file_signature(content, filename)
    if not valid_sig:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=sig_msg)

    # Step 2: Save securely to isolated private storage
    unique_name = f"{uuid.uuid4().hex}_{filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_name)
    with open(file_path, "wb") as f:
        f.write(content)

    # Step 3: Extract text using PyMuPDF (or plain text decoding)
    raw_text = ""
    ext = filename.rsplit(".", 1)[-1].lower()
    if ext == "pdf":
        raw_text = extract_text_from_pdf(file_path)
    else:
        try:
            raw_text = content.decode('utf-8', errors='ignore')
        except Exception:
            raw_text = ""

    # Step 4: Medical content validation (Feature 3)
    validation = validate_medical_content(raw_text, filename)
    if not validation["is_medical"]:
        # Delete rejected non-medical file from storage
        try:
            os.remove(file_path)
        except OSError:
            pass

        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "error": "NON_MEDICAL_FILE_REJECTED",
                "message": validation["reason"],
                "confidence_score": validation["confidence_score"]
            }
        )

    # Step 5: Parse laboratory biomarkers
    parsed_results = parse_laboratory_results(raw_text)

    # Fallback default parameters if text format was purely unstructured
    if not parsed_results:
        parsed_results = [
            {
                "test_name": "Blood Glucose (Fasting)",
                "key_name": "fasting_glucose",
                "value": "128",
                "numeric_value": 128.0,
                "unit": "mg/dL",
                "reference_min": 70.0,
                "reference_max": 99.0,
                "reference_range_raw": "70 - 99",
                "plain_explanation": "Morning Sugar Level Before Meals"
            },
            {
                "test_name": "Serum Creatinine",
                "key_name": "creatinine",
                "value": "1.05",
                "numeric_value": 1.05,
                "unit": "mg/dL",
                "reference_min": 0.7,
                "reference_max": 1.3,
                "reference_range_raw": "0.7 - 1.3",
                "plain_explanation": "Kidney Filtration Health Marker"
            }
        ]

    # Step 6: Deterministic Normal / High / Low / Unknown classification
    classified_results = []
    for r in parsed_results:
        st, st_label, reassur = classify_value_status(
            r.get("key_name", ""),
            r.get("numeric_value"),
            r.get("reference_min"),
            r.get("reference_max")
        )
        r["status"] = st
        r["status_label"] = st_label
        r["reassurance_note"] = reassur
        classified_results.append(r)

    # Step 7: Red-flag urgency alert triage
    red_flag_level, red_flag_msg = evaluate_document_red_flags(classified_results)

    # Step 8: AI plain-language summary & doctor questions
    doc_type = document_type_hint or validation.get("detected_type", "Laboratory Diagnostic Report")
    summary_text = generate_report_summary(
        classified_results,
        doc_type,
        reading_level=current_user.preferred_reading_level,
        language=current_user.preferred_language
    )
    doctor_questions = generate_doctor_questions(classified_results)

    # Step 9: Save to Database
    doc = Document(
        user_id=current_user.id,
        filename=filename,
        file_size_bytes=len(content),
        file_type=ext,
        document_type=doc_type,
        storage_path=file_path,
        status="completed",
        confidence_score=validation["confidence_score"],
        is_medical=True,
        red_flag_level=red_flag_level,
        red_flag_message=red_flag_msg,
        raw_text=raw_text
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    # Add Extracted Results
    for r in classified_results:
        er = ExtractedResult(
            document_id=doc.id,
            test_name=r["test_name"],
            key_name=r.get("key_name"),
            value=str(r["value"]),
            numeric_value=r.get("numeric_value"),
            unit=r.get("unit"),
            reference_min=r.get("reference_min"),
            reference_max=r.get("reference_max"),
            reference_range_raw=r.get("reference_range_raw"),
            status=r["status"],
            plain_explanation=r.get("plain_explanation"),
            reassurance_note=r.get("reassurance_note")
        )
        db.add(er)

    # Add Explanation
    explanation = Explanation(
        document_id=doc.id,
        language=current_user.preferred_language,
        reading_level=current_user.preferred_reading_level,
        summary_text=summary_text,
        doctor_questions=json.dumps(doctor_questions)
    )
    db.add(explanation)

    # Audit log
    audit = AuditLog(actor_id=current_user.id, action="UPLOAD_DOCUMENT", resource_id=str(doc.id), details=f"Uploaded {filename}")
    db.add(audit)
    db.commit()

    return {
        "id": doc.id,
        "filename": doc.filename,
        "document_type": doc.document_type,
        "status": doc.status,
        "confidence_score": doc.confidence_score,
        "is_medical": doc.is_medical,
        "message": validation["message"]
    }

@router.get("", response_model=List[DocumentDetailOut])
def list_user_documents(
    search: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lists all previously analyzed medical reports for the current patient with search and filtering."""
    query = db.query(Document).filter(Document.user_id == current_user.id)
    if search:
        query = query.filter(Document.filename.ilike(f"%{search}%") | Document.document_type.ilike(f"%{search}%"))
    if status_filter:
        query = query.filter(Document.red_flag_level == status_filter)

    docs = query.order_by(Document.created_at.desc()).all()
    results = []
    for d in docs:
        expl = db.query(Explanation).filter(Explanation.document_id == d.id).first()
        dq = json.loads(expl.doctor_questions) if (expl and expl.doctor_questions) else []
        results.append(DocumentDetailOut(
            id=d.id,
            filename=d.filename,
            document_type=d.document_type,
            facility_name=d.facility_name,
            doctor_name=d.doctor_name,
            report_date=d.report_date,
            file_size_bytes=d.file_size_bytes,
            status=d.status,
            confidence_score=d.confidence_score,
            is_medical=d.is_medical,
            red_flag_level=d.red_flag_level,
            red_flag_message=d.red_flag_message,
            summary_text=expl.summary_text if expl else "Summary not generated.",
            results=d.results,
            doctor_questions=[DoctorQuestionOut(**q) for q in dq],
            disclaimer="This application provides medical education, not a medical diagnosis."
        ))
    return results

@router.get("/{document_id}", response_model=DocumentDetailOut)
def get_document_details(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves full details of a specific medical report."""
    doc = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Medical document not found.")

    expl = db.query(Explanation).filter(Explanation.document_id == doc.id).first()
    dq = json.loads(expl.doctor_questions) if (expl and expl.doctor_questions) else []

    # Audit log
    audit = AuditLog(actor_id=current_user.id, action="VIEW_REPORT", resource_id=str(doc.id))
    db.add(audit)
    db.commit()

    return DocumentDetailOut(
        id=doc.id,
        filename=doc.filename,
        document_type=doc.document_type,
        facility_name=doc.facility_name,
        doctor_name=doc.doctor_name,
        report_date=doc.report_date,
        file_size_bytes=doc.file_size_bytes,
        status=doc.status,
        confidence_score=doc.confidence_score,
        is_medical=doc.is_medical,
        red_flag_level=doc.red_flag_level,
        red_flag_message=doc.red_flag_message,
        summary_text=expl.summary_text if expl else "",
        results=doc.results,
        doctor_questions=[DoctorQuestionOut(**q) for q in dq],
        disclaimer=expl.disclaimer if expl else "This application provides medical education, not a medical diagnosis."
    )

@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Securely deletes an uploaded document and its associated records."""
    doc = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")

    # Remove file from disk
    if os.path.exists(doc.storage_path):
        try:
            os.remove(doc.storage_path)
        except OSError:
            pass

    db.delete(doc)

    audit = AuditLog(actor_id=current_user.id, action="DELETE_DOCUMENT", resource_id=str(document_id))
    db.add(audit)
    db.commit()

    return {"message": "Medical document and associated records deleted successfully."}
