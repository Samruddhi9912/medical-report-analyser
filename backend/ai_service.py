import json
import requests
from typing import Dict, Any, List
from .config import settings

# Grounded Medical Knowledge Base for Deterministic Fallback & Grounding
KNOWLEDGE_BASE = {
    "hba1c": {
        "simple": "Your 3-month blood sugar average (HbA1c) reflects your body's quarterly report card for blood sugar. Normal is below 5.7%, while for diabetes management under 7.0% is common.",
        "standard": "HbA1c (Glycosylated Hemoglobin) measures the percentage of blood sugar attached to hemoglobin over the prior 90-day cycle.",
        "detailed": "Glycated hemoglobin concentration indicates mean plasma glucose over erythrocyte lifespan (~120 days). Target is generally < 7.0% for non-pregnant diabetic adults.",
        "analogy": "Like a quarterly bank statement showing total spending habits rather than just yesterday's balance."
    },
    "fasting_glucose": {
        "simple": "Your morning sugar before breakfast shows how much fuel remains circulating in your bloodstream after resting overnight.",
        "standard": "Fasting blood glucose measures basal glycemic equilibrium following an 8 to 12-hour overnight fast.",
        "detailed": "FPG reflects basal hepatic gluconeogenesis and baseline peripheral insulin sensitivity in the post-absorptive state.",
        "analogy": "Like checking how much water is in the tank before turning the engine on."
    },
    "creatinine": {
        "simple": "Creatinine is a waste product from your muscles that your kidneys filter out. Healthy filters keep this number in the safe green zone.",
        "standard": "Serum creatinine is a byproduct of muscle metabolism cleared almost exclusively by glomerular filtration in the kidneys.",
        "detailed": "Serum creatinine level is inversely related to Glomerular Filtration Rate (GFR). Used to assess chronic kidney disease staging.",
        "analogy": "Think of creatinine like coffee grounds trapped by a clean coffee filter."
    },
    "sgpt": {
        "simple": "SGPT is an enzyme inside liver cells. A small elevation is very common with rich meals, new medicines (like cholesterol tablets), or mild stress.",
        "standard": "Alanine Aminotransferase (ALT/SGPT) is a hepatic intracellular enzyme released into circulation upon cellular stress or injury.",
        "detailed": "Isolated mild ALT elevation (< 2-3x ULN) is frequently observed in benign non-alcoholic hepatic steatosis, statin pharmacotherapy, or vigorous exertion.",
        "analogy": "Like a smoke detector that chirps when toast is slightly burned — a small bump does not mean a house fire."
    },
    "potassium": {
        "simple": "Potassium is an essential salt that controls your heart's electrical rhythm and helps muscles squeeze smoothly.",
        "standard": "Serum potassium (K+) is the primary intracellular cation responsible for resting membrane potential in cardiac myocytes.",
        "detailed": "Hyperkalemia (> 5.5 mEq/L) impairs cardiac repolarization, causing peaked T-waves, PR prolongation, and lethal ventricular arrhythmias.",
        "analogy": "Like the electrical metronome keeping your heart beating in perfect time."
    },
    "troponin": {
        "simple": "Troponin is a protein found only inside heart muscle cells. It is released into the bloodstream when the heart muscle is under strain.",
        "standard": "Cardiac Troponin-I/T is a highly sensitive biomarker of acute myocardial necrosis or ischemic strain.",
        "detailed": "High-sensitivity Troponin elevation (> 99th percentile upper reference limit) indicates ongoing myocardial injury requiring immediate clinical triage.",
        "analogy": "Like an emergency alarm that sounds only when heart cells are under acute oxygen shortage."
    }
}

# Regional language greetings & headers
LANGUAGE_TRANSLATIONS = {
    "en": {"summary": "Report Summary", "questions": "Doctor Questions", "disclaimer": "This application provides medical education, not a medical diagnosis."},
    "kn": {"summary": "ವರದಿ ಸಾರಾಂಶ (Report Summary)", "questions": "ವೈದ್ಯರಿಗೆ ಕೇಳಬೇಕಾದ ಪ್ರಶ್ನೆಗಳು (Doctor Questions)", "disclaimer": "ಈ ಅಪ್ಲಿಕೇಶನ್ ಶೈಕ್ಷಣಿಕ ಮಾಹಿತಿಯನ್ನು ಮಾತ್ರ ನೀಡುತ್ತದೆ. ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ."},
    "hi": {"summary": "रिपोर्ट सारांश (Report Summary)", "questions": "डॉक्टर से पूछने योग्य सवाल (Doctor Questions)", "disclaimer": "यह एप्लिकेशन केवल शैक्षिक जानकारी देता है, डॉक्टरी निदान नहीं।"},
    "es": {"summary": "Resumen del Informe", "questions": "Preguntas para el Médico", "disclaimer": "Esta aplicación proporciona información médica educativa, no un diagnóstico clínico."},
    "mr": {"summary": "अहवाल सारांश (Report Summary)", "questions": "डॉक्टरांना विचारायचे प्रश्न (Doctor Questions)", "disclaimer": "हे ॲप्लिकेशन केवळ माहितीसाठी आहे. वैद्यकीय सल्ल्यासाठी डॉक्टरांशी संपर्क साधा."}
}

def generate_report_summary(
    results: List[Dict[str, Any]],
    doc_type: str,
    reading_level: str = "simple",
    language: str = "en"
) -> str:
    """
    Generates a medically grounded, structured summary based on verified extracted results.
    Adheres to PRD Section 13 & 31: AI explains verified results without inventing values.
    """
    # Check if Gemini API is configured
    if settings.AI_PROVIDER == "gemini" and settings.GEMINI_API_KEY:
        try:
            return call_gemini_summary(results, doc_type, reading_level, language)
        except Exception as e:
            print(f"Gemini API fallback to deterministic KB: {e}")

    # Check if local Ollama is configured
    if settings.AI_PROVIDER == "ollama":
        try:
            return call_ollama_summary(results, doc_type, reading_level, language)
        except Exception as e:
            print(f"Ollama API fallback to deterministic KB: {e}")

    # Deterministic Grounded Engine (Guaranteed 100% reliable)
    return generate_deterministic_summary(results, doc_type, reading_level, language)

def generate_deterministic_summary(
    results: List[Dict[str, Any]],
    doc_type: str,
    reading_level: str = "simple",
    language: str = "en"
) -> str:
    """Produces verified, reassuring plain-language summaries based on actual extracted findings."""
    normal_count = sum(1 for r in results if r.get("status") == "normal")
    high_count = sum(1 for r in results if r.get("status") == "high")
    low_count = sum(1 for r in results if r.get("status") == "low")
    total_count = len(results)

    high_tests = [r.get("test_name") for r in results if r.get("status") == "high"]
    low_tests = [r.get("test_name") for r in results if r.get("status") == "low"]

    if reading_level == "simple":
        lines = [
            f"Here is your easy-to-understand summary for this {doc_type}.",
            f"Overall, {normal_count} out of {total_count} tested parameters are in the healthy normal range."
        ]
        if high_tests:
            lines.append(f"A few items ({', '.join(high_tests[:3])}) were slightly higher than the standard laboratory range.")
        if low_tests:
            lines.append(f"Items below the standard range include: {', '.join(low_tests[:2])}.")
        lines.append("Remember: slight elevations are often temporary and related to food or hydration. Your doctor will review them with how you are feeling.")
        return " ".join(lines)

    elif reading_level == "detailed":
        lines = [
            f"Comprehensive Clinical Evaluation of {doc_type}:",
            f"Out of {total_count} quantitative biomarkers analyzed, {normal_count} demonstrate physiological homeostasis within verified laboratory intervals."
        ]
        if high_tests:
            lines.append(f"Identified elevated parameters: {', '.join(high_tests)}.")
        if low_tests:
            lines.append(f"Identified decreased parameters: {', '.join(low_tests)}.")
        lines.append("Correlation with clinical history, medication compliance, and repeat interval testing is recommended.")
        return " ".join(lines)

    else: # Standard
        lines = [
            f"Report Summary ({doc_type}):",
            f"The majority of your laboratory findings ({normal_count} of {total_count}) are within the standard reference brackets."
        ]
        if high_tests:
            lines.append(f"Notable elevations: {', '.join(high_tests)}.")
        if low_tests:
            lines.append(f"Notable low values: {', '.join(low_tests)}.")
        lines.append("These findings provide useful guidance for your attending physician during your next scheduled consultation.")
        return " ".join(lines)

def generate_doctor_questions(results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Generates targeted, clinically sensible questions for the patient to ask their doctor."""
    questions = []
    q_id = 1

    for r in results:
        status = r.get("status")
        test_name = r.get("test_name")
        val = r.get("value")
        unit = r.get("unit") or ""

        if status == "high":
            questions.append({
                "id": f"q_{q_id}",
                "text": f"My {test_name} is {val} {unit} (above the reference range). Could my current diet, stress, or medications be contributing to this?",
                "checked": False
            })
            q_id += 1
        elif status == "low":
            questions.append({
                "id": f"q_{q_id}",
                "text": f"My {test_name} is {val} {unit} (below standard range). Do you recommend any dietary supplements or repeat testing?",
                "checked": False
            })
            q_id += 1

    # Standard follow-up questions
    questions.append({
        "id": f"q_{q_id}",
        "text": "When do you recommend repeating this test to check if my numbers have normalized?",
        "checked": False
    })
    questions.append({
        "id": f"q_{q_id + 1}",
        "text": "Are there specific lifestyle or dietary changes that will help improve these results before our next visit?",
        "checked": False
    })

    return questions

def call_gemini_summary(results: list, doc_type: str, reading_level: str, language: str) -> str:
    """Invokes Google Gemini API if a valid key is provided in settings."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
    prompt = f"You are a medical report explainer. Summarize these lab results in {language} language at a {reading_level} reading level for an ordinary patient. Do not diagnose. Reassure the patient if values are slightly high. Results: {json.dumps(results)}"
    
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    res = requests.post(url, json=payload, timeout=8)
    if res.status_code == 200:
        data = res.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]
    raise Exception(f"Gemini API returned {res.status_code}")

def call_ollama_summary(results: list, doc_type: str, reading_level: str, language: str) -> str:
    """Invokes local Ollama server if available."""
    url = f"{settings.OLLAMA_BASE_URL}/api/generate"
    prompt = f"Summarize these verified lab results in plain language for a patient. Reading level: {reading_level}. Results: {json.dumps(results)}"
    payload = {"model": settings.OLLAMA_MODEL, "prompt": prompt, "stream": False}
    res = requests.post(url, json=payload, timeout=8)
    if res.status_code == 200:
        return res.json().get("response", "")
    raise Exception(f"Ollama returned {res.status_code}")
