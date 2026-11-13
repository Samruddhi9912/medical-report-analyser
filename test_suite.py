import unittest
from backend.file_validator import validate_file_signature, validate_medical_content
from backend.clinical_engine import classify_value_status, evaluate_document_red_flags
from backend.ai_service import generate_deterministic_summary, generate_doctor_questions
from backend.auth import hash_password, verify_password, create_access_token, decode_access_token

class TestMedicalAssistanceSystem(unittest.TestCase):

    def test_01_file_signature_validation(self):
        """Test file signature and format validation."""
        valid_pdf = b"%PDF-1.4 sample content"
        ok, msg = validate_file_signature(valid_pdf, "report.pdf")
        self.assertTrue(ok)

        # Corrupted PDF (wrong magic bytes)
        fake_pdf = b"NOT_A_PDF_CONTENT"
        ok, msg = validate_file_signature(fake_pdf, "report.pdf")
        self.assertFalse(ok)
        self.assertIn("File header corrupted", msg)

        # Unsupported extension
        exe_file = b"MZ\x90\x00"
        ok, msg = validate_file_signature(exe_file, "malware.exe")
        self.assertFalse(ok)
        self.assertIn("Unsupported file extension", msg)

    def test_02_medical_content_validation_rejection(self):
        """Test strict medical-only validation (Feature 3): Rejects non-medical files."""
        # Non-medical document (Restaurant bill)
        invoice_text = "The Olive Bistro & Grill Tax Invoice Order #42 Truffle Pasta $18.50 Subtotal: $52.00 Table 14"
        res = validate_medical_content(invoice_text, "Bistro_Bill.txt")
        self.assertFalse(res["is_medical"])
        self.assertIn("rejected", res["reason"].lower())

        # Genuine medical document
        medical_text = "Apollo Diagnostics Patient: Ramesh Sharma Fasting Blood Glucose: 138 mg/dL Serum Creatinine: 1.05 mg/dL HbA1c: 7.1 % Ref Dr: Dr. Mehta"
        res2 = validate_medical_content(medical_text, "Apollo_Lab.pdf")
        self.assertTrue(res2["is_medical"])
        self.assertGreaterEqual(res2["confidence_score"], 35)

    def test_03_value_status_classification(self):
        """Test deterministic value classification using report reference ranges."""
        # Value within range
        st, label, note = classify_value_status("creatinine", 1.05, 0.7, 1.3)
        self.assertEqual(st, "normal")
        self.assertIn("Within Healthy", label)

        # Slightly elevated (reassurance given, prevents panic)
        st, label, note = classify_value_status("sgpt", 48.0, 0.0, 40.0)
        self.assertEqual(st, "high")
        self.assertIn("Slightly High", label)
        self.assertIn("DO NOT PANIC", note)

        # Value missing reference range -> status MUST be unknown (SR-03)
        st, label, note = classify_value_status("novel_biomarker", 55.0, None, None)
        self.assertEqual(st, "unknown")
        self.assertIn("Unavailable", label)

    def test_04_red_flag_alert_detection(self):
        """Test deterministic critical red-flag alerts (Feature 12)."""
        # Critical Hyperkalemia
        critical_results = [
            {"test_name": "Serum Potassium", "key_name": "potassium", "numeric_value": 6.2, "unit": "mEq/L", "status": "high"}
        ]
        level, msg = evaluate_document_red_flags(critical_results)
        self.assertEqual(level, "critical")
        self.assertIn("Critical Serum Potassium", msg)

        # Normal results -> no red flag
        normal_results = [
            {"test_name": "Serum Potassium", "key_name": "potassium", "numeric_value": 4.4, "unit": "mEq/L", "status": "normal"},
            {"test_name": "Creatinine", "key_name": "creatinine", "numeric_value": 1.0, "unit": "mg/dL", "status": "normal"}
        ]
        level, msg = evaluate_document_red_flags(normal_results)
        self.assertEqual(level, "none")

    def test_05_auth_password_and_jwt(self):
        """Test password hashing and JWT token issuance."""
        pw = "SecurePassword@123"
        hashed = hash_password(pw)
        self.assertTrue(verify_password(pw, hashed))
        self.assertFalse(verify_password("WrongPassword", hashed))

        token = create_access_token({"sub": "42", "role": "patient"})
        payload = decode_access_token(token)
        self.assertIsNotNone(payload)
        self.assertEqual(payload["sub"], "42")

    def test_06_doctor_questions_generation(self):
        """Test generation of smart, grounded doctor questions."""
        results = [
            {"test_name": "Fasting Glucose", "value": "138", "unit": "mg/dL", "status": "high"},
            {"test_name": "Serum Creatinine", "value": "1.05", "unit": "mg/dL", "status": "normal"}
        ]
        questions = generate_doctor_questions(results)
        self.assertGreater(len(questions), 0)
        self.assertTrue(any("Fasting Glucose" in q["text"] for q in questions))

if __name__ == "__main__":
    unittest.main()
