from typing import Dict, Any, Tuple

# Pre-defined, clinician-reviewed critical red-flag alert rules
CRITICAL_THRESHOLDS = {
    "potassium": {
        "critical_high": 6.0,
        "critical_low": 2.8,
        "unit": "mEq/L",
        "emergency_message": "Critical Serum Potassium level detected. Potassium levels outside 3.0-5.8 mEq/L can cause life-threatening heart rhythm disturbances. Seek immediate hospital emergency evaluation."
    },
    "troponin": {
        "critical_high": 0.04,
        "unit": "ng/mL",
        "emergency_message": "Elevated Cardiac Troponin detected. This biomarker indicates acute strain or damage to heart muscle. Seek immediate emergency medical attention."
    },
    "fasting_glucose": {
        "critical_low": 50.0,
        "critical_high": 350.0,
        "unit": "mg/dL",
        "emergency_message": "Extreme blood glucose deviation detected. Risk of acute metabolic decompensation. Contact medical emergency immediately."
    },
    "platelets": {
        "critical_low": 25000.0,
        "unit": "/mcL",
        "emergency_message": "Severely low platelet count detected. High risk of spontaneous bleeding. Requires urgent medical care."
    }
}

def classify_value_status(
    key_name: str,
    val_num: float,
    ref_min: float = None,
    ref_max: float = None
) -> Tuple[str, str, str]:
    """
    Deterministically evaluates value status using the report's reference range.
    Returns: (status: 'normal'|'high'|'low'|'unknown', status_label, reassurance_note)
    Preserves medical safety rules: Does NOT invent reference ranges if missing.
    """
    if val_num is None:
        return "unknown", "Unknown / Non-numerical", "Value could not be parsed as a direct numerical quantity."

    if ref_min is None and ref_max is None:
        return "unknown", "Reference Range Unavailable", "The laboratory report did not provide a specific reference range for this parameter. Please consult your physician for interpretation."

    # Compare with report's printed reference range
    if ref_min is not None and val_num < ref_min:
        status = "low"
        status_label = "Below Reference Range (Low)"
        reassurance = f"Value ({val_num}) is below the report's normal lower bound ({ref_min}). Discuss with your doctor if this reflects dietary intake, medication effects, or needs re-testing."
    elif ref_max is not None and val_num > ref_max:
        status = "high"
        # Check if mildly elevated (up to 25% over upper limit is common mild variation)
        slight_threshold = ref_max * 1.25
        if val_num <= slight_threshold:
            status_label = "Slightly High (Mild Variation)"
            reassurance = f"DO NOT PANIC: At {val_num}, this is only marginally above the upper limit of {ref_max}. Mild fluctuations are very common due to hydration, diet, or mild stress. It rarely indicates a medical emergency."
        else:
            status_label = "Above Reference Range (High)"
            reassurance = f"Value ({val_num}) is elevated above the normal upper bound ({ref_max}). Your doctor will review this alongside your symptoms and other test results."
    else:
        status = "normal"
        status_label = "Within Healthy Reference Range"
        reassurance = "Safe and optimal. Your test value falls cleanly within the laboratory's standard reference bracket."

    return status, status_label, reassurance

def evaluate_document_red_flags(results: list) -> Tuple[str, str]:
    """
    Scans extracted lab results against clinician-reviewed deterministic rules.
    Returns: (red_flag_level: 'none'|'attention'|'critical', escalation_message)
    """
    critical_alerts = []
    attention_items = []

    for r in results:
        key = r.get("key_name") or ""
        num_val = r.get("numeric_value")

        if num_val is None:
            continue

        # Check critical thresholds
        if key in CRITICAL_THRESHOLDS:
            rule = CRITICAL_THRESHOLDS[key]
            if "critical_high" in rule and num_val >= rule["critical_high"]:
                critical_alerts.append(f"{r.get('test_name')}: {num_val} {r.get('unit')} (Critical High) - {rule['emergency_message']}")
            elif "critical_low" in rule and num_val <= rule["critical_low"]:
                critical_alerts.append(f"{r.get('test_name')}: {num_val} {r.get('unit')} (Critical Low) - {rule['emergency_message']}")

        # Track abnormal values for non-critical attention
        status = r.get("status")
        if status in ("high", "low"):
            attention_items.append(f"{r.get('test_name')} is outside standard reference brackets")

    if critical_alerts:
        return "critical", " | ".join(critical_alerts)
    elif attention_items:
        return "attention", f"Attention Advised: {len(attention_items)} test parameters outside reference ranges. Schedule a non-emergency routine consultation with your doctor."
    else:
        return "none", "All parameters within expected reference ranges. Continue regular health maintenance."
