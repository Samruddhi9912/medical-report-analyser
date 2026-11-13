// ClariMed - Feature 3: Strict Medical Document Verification Engine

export const MEDICAL_KEYWORDS = [
  // Clinical markers & headers
  "patient", "diagnosis", "doctor", "dr.", "physician", "hospital", "clinic", "pathology",
  "laboratory", "discharge summary", "prescription", "rx", "investigation", "biochemistry",
  "hematology", "clinical impression", "ipd", "opd", "specimen", "serum", "vitals",

  // Common lab tests
  "hba1c", "glucose", "creatinine", "sgpt", "sgot", "alt", "ast", "cholesterol",
  "ldl", "hdl", "triglycerides", "potassium", "sodium", "calcium", "hemoglobin",
  "wbc", "platelets", "tsh", "troponin", "bilirubin", "urea", "bun", "egfr", "esr", "crp",

  // Medical units & abbreviations
  "mg/dl", "mmol/l", "meq/l", "u/l", "g/dl", "mmhg", "mcg", "tab", "cap", "bid", "tid", "qid",
  "po", "od", "prn", "sos", "hs", "ac", "pc", "stat", "iv", "im"
];

export const NON_MEDICAL_REJECT_PATTERNS = [
  "invoice", "tax invoice", "gstin", "subtotal", "restaurant", "bistro", "waiter", "table #",
  "credit card", "boarding pass", "flight", "resume", "curriculum vitae", "receipt #",
  "delivery partner", "uber", "amazon order", "swiggy", "zomato", "bank statement"
];

/**
 * Validates whether the provided text/file is a legitimate medical document.
 * Enforces Feature 3: Restrict strictly to medical files only.
 */
export function validateMedicalDocument(rawText, filename = "") {
  if (!rawText || typeof rawText !== "string") {
    return {
      isMedical: false,
      confidenceScore: 0,
      detectedType: "Unknown / Empty",
      reason: "No readable text found in document. Please upload a clear medical document."
    };
  }

  const normalized = (rawText + " " + filename).toLowerCase();

  // Check for explicit non-medical rejection triggers
  let nonMedicalHits = 0;
  for (const pattern of NON_MEDICAL_REJECT_PATTERNS) {
    if (normalized.includes(pattern)) {
      nonMedicalHits += 1;
    }
  }

  // Count medical matches
  let medicalHits = [];
  for (const keyword of MEDICAL_KEYWORDS) {
    // Word boundary or substring match
    if (normalized.includes(keyword)) {
      medicalHits.push(keyword);
    }
  }

  // Calculate score (0 to 100)
  let rawScore = (medicalHits.length / 8) * 100;
  if (nonMedicalHits > 0) {
    rawScore = rawScore / (nonMedicalHits * 3 + 1);
  }
  const confidenceScore = Math.min(99, Math.max(2, Math.round(rawScore)));

  // Determine medical category
  let detectedType = "Clinical Document";
  if (normalized.includes("discharge") || normalized.includes("ipd") || normalized.includes("admission")) {
    detectedType = "Hospital Discharge Summary";
  } else if (normalized.includes("rx") || normalized.includes("tab") || normalized.includes("prescription") || normalized.includes("take 1")) {
    detectedType = "Prescription";
  } else if (normalized.includes("pathology") || normalized.includes("lab") || normalized.includes("serum") || normalized.includes("biochemistry")) {
    detectedType = "Laboratory Diagnostic Report";
  }

  const isMedical = confidenceScore >= 35 && medicalHits.length >= 3 && nonMedicalHits === 0;

  if (isMedical) {
    return {
      isMedical: true,
      confidenceScore,
      detectedType,
      matchedIndicators: medicalHits.slice(0, 8),
      message: `Verified Medical Document (${detectedType}). Identified ${medicalHits.length} verified clinical test & prescription markers.`
    };
  } else {
    return {
      isMedical: false,
      confidenceScore,
      detectedType: nonMedicalHits > 0 ? "Non-Medical Document (Bill / Invoice / General)" : "Unrecognized File Type",
      matchedIndicators: medicalHits,
      reason: nonMedicalHits > 0
        ? "Document appears to be a commercial bill, receipt, or non-medical document. ClariMed only accepts medical lab reports, discharge summaries, and prescriptions."
        : "Insufficient clinical biomarkers or medical indicators found. Please upload a legitimate medical test report, doctor's prescription, or discharge summary."
    };
  }
}
