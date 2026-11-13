import re
import fitz # PyMuPDF
from typing import List, Dict, Any, Tuple

# Regular expressions for lab test lines: Name ... Value ... Unit ... Reference Range
LAB_LINE_PATTERN = re.compile(
    r'(?P<test>[A-Za-z0-9\s\(\)\-\/\.\+]{3,40}?)\s*[:=\t]\s*'
    r'(?P<val>[><]?\s*\d+(?:\.\d+)?)\s*'
    r'(?P<unit>[A-Za-z%µ\/]+)?\s*'
    r'(?:\((?:ref|reference|normal)?[:\s]*(?P<ref_min>\d+(?:\.\d+)?)\s*[-–]\s*(?P<ref_max>\d+(?:\.\d+)?)\s*(?:[A-Za-z%µ\/]+)?\))?',
    re.IGNORECASE
)

# Known test mapping dictionary for key normalization & default analogies
KNOWN_TESTS = {
    "hba1c": {"key": "hba1c", "plain": "3-Month Blood Sugar Average", "category": "Blood Sugar"},
    "fasting glucose": {"key": "fasting_glucose", "plain": "Morning Sugar Level Before Meals", "category": "Blood Sugar"},
    "blood glucose": {"key": "fasting_glucose", "plain": "Blood Sugar Level", "category": "Blood Sugar"},
    "creatinine": {"key": "creatinine", "plain": "Kidney Filtration Health Marker", "category": "Kidney Function"},
    "sgpt": {"key": "sgpt", "plain": "Liver Cell Enzyme", "category": "Liver Function"},
    "alt": {"key": "sgpt", "plain": "Liver Cell Enzyme", "category": "Liver Function"},
    "sgot": {"key": "sgot", "plain": "Liver & Muscle Enzyme", "category": "Liver Function"},
    "ast": {"key": "sgot", "plain": "Liver & Muscle Enzyme", "category": "Liver Function"},
    "ldl": {"key": "ldl", "plain": "'Sticky' Bad Cholesterol", "category": "Lipid Profile"},
    "hdl": {"key": "hdl", "plain": "'Helper' Good Cholesterol", "category": "Lipid Profile"},
    "triglycerides": {"key": "triglycerides", "plain": "Blood Fats from Unused Calories", "category": "Lipid Profile"},
    "potassium": {"key": "potassium", "plain": "Heart Rhythm & Muscle Salt Balance", "category": "Electrolytes"},
    "troponin": {"key": "troponin", "plain": "Heart Muscle Strain Biomarker", "category": "Cardiac Urgency"},
    "hemoglobin": {"key": "hemoglobin", "plain": "Oxygen Carrier in Red Blood Cells", "category": "Blood Count"},
    "wbc": {"key": "wbc", "plain": "Body Immune Soldier Count", "category": "Immunity"},
    "platelets": {"key": "platelets", "plain": "Blood Clotting Bandages", "category": "Blood Count"},
    "tsh": {"key": "tsh", "plain": "Thyroid Metabolism Speed Regulator", "category": "Hormones"}
}

def extract_text_from_pdf(file_path: str) -> str:
    """Uses PyMuPDF to extract text from a text-based or digital PDF."""
    text_content = []
    try:
        doc = fitz.open(file_path)
        for page in doc:
            text = page.get_text("text")
            if text:
                text_content.append(text)
        doc.close()
    except Exception as e:
        print(f"PyMuPDF extraction note: {e}")
    return "\n".join(text_content)

def parse_laboratory_results(text: str) -> List[Dict[str, Any]]:
    """
    Parses quantitative laboratory parameters from extracted text.
    Extracts test name, original value, numeric float, unit, and reference interval.
    Preserves exact original values.
    """
    results = []
    lines = text.split("\n")

    for line in lines:
        line_clean = line.strip()
        if not line_clean or len(line_clean) < 5:
            continue

        # Look for test name match
        line_lower = line_clean.lower()
        matched_key = None
        for key in KNOWN_TESTS:
            if key in line_lower:
                matched_key = key
                break

        if not matched_key:
            continue

        # Extract number in proximity
        num_match = re.search(r'([><]?\s*\d+(?:\.\d+)?)', line_clean)
        if not num_match:
            continue

        raw_val = num_match.group(1).replace(" ", "")
        try:
            numeric_val = float(re.sub(r'[><]', '', raw_val))
        except ValueError:
            numeric_val = None

        # Extract units
        unit = ""
        for u in ["mg/dL", "mg/dl", "mmol/L", "mEq/L", "U/L", "g/dL", "ng/mL", "%", "/mcL", "mIU/L", "mmHg"]:
            if u.lower() in line_lower:
                unit = u
                break

        # Extract reference range if present
        ref_min = None
        ref_max = None
        ref_raw = None
        ref_match = re.search(r'(?:ref|range|normal)?[:\s]*(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)', line_clean, re.IGNORECASE)
        if ref_match:
            try:
                ref_min = float(ref_match.group(1))
                ref_max = float(ref_match.group(2))
                ref_raw = f"{ref_min} - {ref_max}"
            except ValueError:
                pass

        test_info = KNOWN_TESTS[matched_key]
        results.append({
            "test_name": matched_key.upper() if len(matched_key) <= 5 else matched_key.title(),
            "key_name": test_info["key"],
            "value": raw_val,
            "numeric_value": numeric_val,
            "unit": unit or ("%" if matched_key == "hba1c" else "mg/dL"),
            "reference_min": ref_min,
            "reference_max": ref_max,
            "reference_range_raw": ref_raw,
            "plain_explanation": test_info["plain"]
        })

    return results

def parse_medicines_from_text(text: str) -> List[Dict[str, Any]]:
    """Extracts prescription medicine entries from text."""
    medicines = []
    med_pattern = re.compile(
        r'(?:Tab|Cap|Tablet|Capsule|Syp|Injection)?\.?\s*([A-Za-z0-9\-]+)\s+(\d+\s*(?:mg|mcg|ml|g)?)\s*[-–:]?\s*(.*?)(?=(?:\n|$))',
        re.IGNORECASE
    )

    for line in text.split("\n"):
        line_clean = line.strip()
        if any(term in line_clean.lower() for term in ["metformin", "atorvastatin", "telmisartan", "pantoprazole", "amoxicillin", "aspirin"]):
            match = med_pattern.search(line_clean)
            if match:
                name = match.group(1).title()
                strength = match.group(2)
                instructions = match.group(3).strip() or "As directed by physician"
                medicines.append({
                    "medicine_name": f"{name} {strength}",
                    "generic_name": name,
                    "strength": strength,
                    "dosage_form": "Tablet",
                    "prescribed_instructions": instructions,
                    "timing": "With meals" if "bid" in line_clean.lower() else "Morning"
                })
    return medicines
