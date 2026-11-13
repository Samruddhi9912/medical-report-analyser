// ClariMed Standalone Single Bundle - Works both on file:// and http://
(function() {
// ClariMed - Medical Data, Sample Reports, Dictionary & Presets

const MEDICAL_DICTIONARY = {
  "hba1c": {
    term: "HbA1c (Hemoglobin A1c)",
    plain: "3-Month Blood Sugar Average",
    analogy: "Like a quarterly report card for your blood sugar, showing the average over the past 90 days rather than just one snapshot.",
    normalRange: "Below 5.7% (Non-diabetic), 5.7 - 6.4% (Prediabetes), < 7.0% (Well-managed diabetes)",
    category: "Diabetes & Blood Sugar"
  },
  "fasting glucose": {
    term: "Fasting Blood Glucose",
    plain: "Morning Sugar Level (Before Eating)",
    analogy: "How much fuel (sugar) remains circulating in your bloodstream after your body has rested overnight.",
    normalRange: "70 - 99 mg/dL",
    category: "Diabetes & Blood Sugar"
  },
  "post-prandial": {
    term: "Post-Prandial Blood Sugar",
    plain: "Sugar Level 2 Hours After a Meal",
    analogy: "How quickly and smoothly your body clears sugar from your blood into cells after eating.",
    normalRange: "Under 140 mg/dL",
    category: "Diabetes & Blood Sugar"
  },
  "creatinine": {
    term: "Serum Creatinine",
    plain: "Kidney Filter Health Check",
    analogy: "Creatinine is natural muscle waste. Your kidneys act like coffee filters; if filters slow down, creatinine levels rise slightly.",
    normalRange: "0.7 - 1.3 mg/dL for men, 0.6 - 1.1 mg/dL for women",
    category: "Kidney Health"
  },
  "egfr": {
    term: "eGFR (Estimated Glomerular Filtration Rate)",
    plain: "Kidney Efficiency Percentage",
    analogy: "Think of this like your kidney's battery percentage — 90% or above means kidneys are filtering at full speed.",
    normalRange: "90 or higher mL/min/1.73m²",
    category: "Kidney Health"
  },
  "sgpt": {
    term: "SGPT / ALT (Alanine Transaminase)",
    plain: "Liver Enzyme (Cell Health)",
    analogy: "An enzyme inside liver cells. A slight spike often just means the liver was working overtime processing fatty food, a new medicine, or mild stress.",
    normalRange: "7 - 45 U/L",
    category: "Liver Function"
  },
  "sgot": {
    term: "SGOT / AST (Aspartate Transaminase)",
    plain: "Liver & Muscle Enzyme",
    analogy: "Found in liver and heart muscles. Mild variations are very common and often harmless.",
    normalRange: "8 - 40 U/L",
    category: "Liver Function"
  },
  "ldl": {
    term: "LDL Cholesterol",
    plain: "'Sticky' / Bad Cholesterol",
    analogy: "Particles that can build up like rust inside plumbing pipes if they stay too high for too long.",
    normalRange: "Optimal: Under 100 mg/dL",
    category: "Heart & Lipids"
  },
  "hdl": {
    term: "HDL Cholesterol",
    plain: "'Helper' / Good Cholesterol",
    analogy: "Like garbage trucks in your bloodstream that pick up excess bad cholesterol and carry it away to be recycled.",
    normalRange: "Above 40 mg/dL (men), Above 50 mg/dL (women)",
    category: "Heart & Lipids"
  },
  "triglycerides": {
    term: "Triglycerides",
    plain: "Blood Fats from Unused Calories",
    analogy: "Energy reserves your body stores when you eat more calories than burned. High refined carbs or sweets can temporarily raise this.",
    normalRange: "Under 150 mg/dL",
    category: "Heart & Lipids"
  },
  "potassium": {
    term: "Potassium (K+)",
    plain: "Heart Rhythm & Muscle Salt",
    analogy: "A crucial electrolyte that keeps your heart beating in a steady rhythm and muscles contracting smoothly.",
    normalRange: "3.5 - 5.0 mEq/L (Critical if > 5.5 or < 3.0)",
    category: "Electrolytes"
  },
  "troponin": {
    term: "Troponin-I / Troponin-T",
    plain: "Heart Muscle Distress Marker",
    analogy: "A protein released only when heart muscle cells are under acute strain or lack of oxygen.",
    normalRange: "Under 0.04 ng/mL (Normal)",
    category: "Cardiac Urgency"
  },
  "hemoglobin": {
    term: "Hemoglobin (Hb)",
    plain: "Oxygen Carrier in Blood",
    analogy: "The red delivery vans inside your bloodstream carrying fresh oxygen from your lungs to your brain and toes.",
    normalRange: "13.5 - 17.5 g/dL (men), 12.0 - 15.5 g/dL (women)",
    category: "Blood Count"
  },
  "wbc": {
    term: "WBC (White Blood Cells)",
    plain: "Body's Immune Soldier Count",
    analogy: "Your body's defense army. If you have a mild cold, infection, or wound, the army count temporarily goes up to fight it off.",
    normalRange: "4,500 - 11,000 /mcL",
    category: "Immunity"
  },
  "platelets": {
    term: "Platelets",
    plain: "Blood Clotting Bandages",
    analogy: "Tiny cell fragments that rush to seal cuts and stop bleeding, like emergency road repair tape.",
    normalRange: "150,000 - 450,000 /mcL",
    category: "Blood Count"
  },
  "tsh": {
    term: "TSH (Thyroid Stimulating Hormone)",
    plain: "Metabolism Accelerator Pedal",
    analogy: "The signal from your brain telling the thyroid gland to speed up or slow down your body's energy consumption.",
    normalRange: "0.4 - 4.0 mIU/L",
    category: "Thyroid & Hormones"
  },
  "hypertension": {
    term: "Hypertension",
    plain: "High Blood Pressure",
    analogy: "Water flowing through a garden hose at higher pressure than normal, which stresses the walls over time.",
    normalRange: "Below 120/80 mmHg",
    category: "Cardiovascular"
  },
  "dyslipidemia": {
    term: "Dyslipidemia",
    plain: "Imbalanced Blood Fats / Cholesterol",
    analogy: "Having slightly too much sticky cholesterol or blood fats, requiring diet or medication tweaks.",
    normalRange: "Healthy balanced lipid profile",
    category: "Heart & Lipids"
  },
  "edema": {
    term: "Edema",
    plain: "Fluid Swelling (Puffiness)",
    analogy: "Excess water trapped in body tissues, commonly visible in ankles, feet, or under eyes.",
    normalRange: "No swelling",
    category: "General Symptoms"
  },
  "bid": {
    term: "BID (Bis In Die)",
    plain: "Take Twice a Day",
    analogy: "Usually 10-12 hours apart, e.g., once with breakfast and once with dinner.",
    normalRange: "Prescription frequency",
    category: "Medical Abbreviations"
  },
  "tid": {
    term: "TID (Ter In Die)",
    plain: "Take Three Times a Day",
    analogy: "Spaced evenly: breakfast, lunch, and dinner.",
    normalRange: "Prescription frequency",
    category: "Medical Abbreviations"
  },
  "po": {
    term: "PO (Per Os)",
    plain: "Take by Mouth (Swallow)",
    analogy: "Take orally as tablet, capsule, or syrup with water.",
    normalRange: "Administration route",
    category: "Medical Abbreviations"
  },
  "prn": {
    term: "PRN (Pro Re Nata)",
    plain: "Take Only When Needed",
    analogy: "Do not take on a fixed clock; only take if symptom arises (e.g. fever or pain).",
    normalRange: "As-needed schedule",
    category: "Medical Abbreviations"
  },
  "hs": {
    term: "HS (Hora Somni)",
    plain: "Take at Bedtime",
    analogy: "Take right before going to sleep at night.",
    normalRange: "Administration timing",
    category: "Medical Abbreviations"
  }
};

const SAMPLE_DOCUMENTS = {
  comprehensiveLab: {
    id: "doc-lab-1",
    type: "Lab Report",
    title: "Comprehensive Metabolic & Lipid Profile",
    facility: "Apollo Diagnostics & Pathology Care",
    date: "13-Nov-2026",
    patientName: "Ramesh Sharma",
    patientAge: 58,
    patientGender: "Male",
    doctorName: "Dr. Rajesh Mehta, MD (Int. Med)",
    isMedical: true,
    confidenceScore: 98,
    redFlagLevel: "attention", // "none", "attention", "critical"
    redFlagMessage: "Mildly elevated blood sugar and bad cholesterol. Liver enzyme is slightly above normal range, which is commonly related to medications or mild diet variation. No critical emergency.",
    readLevels: {
      simple: "Overall, your kidneys and heart salts (potassium) are in great shape! Your morning blood sugar (138) and quarterly 3-month sugar average (7.1%) are slightly high, meaning your diabetes medication might need a small tweak. Your liver enzyme is just slightly higher than usual (48 compared to 40), which is very common when taking cholesterol medicine and nothing to panic over.",
      standard: "Your metabolic panel reveals well-preserved renal function with normal serum creatinine (1.05 mg/dL) and optimal electrolytes. Glycemic control indicates mild elevation with HbA1c at 7.1% and fasting glucose at 138 mg/dL. Your lipid panel shows mildly elevated LDL (138 mg/dL). SGPT/ALT is marginally elevated at 48 U/L (reference < 40 U/L), likely a benign response to statin therapy or dietary factors.",
      detailed: "Comprehensive metabolic evaluation demonstrates stable eGFR (> 85 mL/min/1.73m²) and normal serum creatinine. Endocrine markers demonstrate sub-optimal glycemic control: HbA1c 7.1% (target < 7.0%), FPG 138 mg/dL. Dyslipidemia noted with LDL-C 138 mg/dL and Total Cholesterol 218 mg/dL. Hepatic transaminases show mild isolated ALT elevation (48 U/L; AST 32 U/L), consistent with known pharmacotherapy or Grade-1 hepatic steatosis."
    },
    values: [
      {
        name: "HbA1c",
        key: "hba1c",
        value: 7.1,
        unit: "%",
        refLow: 4.0,
        refHigh: 5.7,
        status: "elevated", // "normal", "slightly-elevated", "elevated", "critical-high", "critical-low"
        statusLabel: "Slightly High",
        statusColor: "yellow",
        reassurance: "Your average blood sugar over 3 months is 7.1%. For someone managing diabetes, doctors often aim for under 7.0%. You are very close to target!",
        plainExplainer: "Blood sugar quarterly report card."
      },
      {
        name: "Fasting Blood Glucose",
        key: "fasting glucose",
        value: 138,
        unit: "mg/dL",
        refLow: 70,
        refHigh: 99,
        status: "elevated",
        statusLabel: "High (Above 99)",
        statusColor: "orange",
        reassurance: "Fasting sugar is 138. While above standard fasting levels (70-99), this is manageable through meal timing and mild medication adjustment.",
        plainExplainer: "Sugar circulating before breakfast."
      },
      {
        name: "Serum Creatinine",
        key: "creatinine",
        value: 1.05,
        unit: "mg/dL",
        refLow: 0.7,
        refHigh: 1.3,
        status: "normal",
        statusLabel: "Healthy / Normal",
        statusColor: "green",
        reassurance: "Excellent! Your kidney filter is working cleanly within the healthy green zone.",
        plainExplainer: "Kidney filtering health."
      },
      {
        name: "SGPT / ALT",
        key: "sgpt",
        value: 48,
        unit: "U/L",
        refLow: 0,
        refHigh: 40,
        status: "slightly-elevated",
        statusLabel: "Slightly Elevated",
        statusColor: "yellow",
        reassurance: "DO NOT PANIC: At 48 U/L (reference is 40), this is only a tiny bump! Doctors see this all the time with statin medicines, rich meals, or mild stress. It is not liver failure.",
        plainExplainer: "Liver cell enzyme."
      },
      {
        name: "LDL Bad Cholesterol",
        key: "ldl",
        value: 138,
        unit: "mg/dL",
        refLow: 0,
        refHigh: 100,
        status: "elevated",
        statusLabel: "Elevated",
        statusColor: "yellow",
        reassurance: "LDL is 138. Your doctor may recommend continuing your evening cholesterol tablet and reducing fried snacks.",
        plainExplainer: "Sticky cholesterol particles."
      },
      {
        name: "Serum Potassium",
        key: "potassium",
        value: 4.4,
        unit: "mEq/L",
        refLow: 3.5,
        refHigh: 5.0,
        status: "normal",
        statusLabel: "Healthy / Normal",
        statusColor: "green",
        reassurance: "Safe and balanced. Your heart rhythm electrolytes are in perfect balance.",
        plainExplainer: "Heart beat salt balance."
      },
      {
        name: "Hemoglobin",
        key: "hemoglobin",
        value: 14.2,
        unit: "g/dL",
        refLow: 13.0,
        refHigh: 17.0,
        status: "normal",
        statusLabel: "Healthy / Normal",
        statusColor: "green",
        reassurance: "Great red blood cell count. No anemia detected.",
        plainExplainer: "Oxygen delivery trucks in blood."
      }
    ],
    medicines: [
      {
        name: "Metformin 500mg",
        generic: "Metformin Hydrochloride",
        timing: "BID (Twice daily, with Breakfast & Dinner)",
        purpose: "Helps your body's cells respond better to insulin and curbs excess sugar production by the liver.",
        instructions: "Take immediately after food with water. Taking with food prevents stomach upset.",
        precautions: "Do not skip meals; drink plenty of water throughout the day.",
        mildSideEffects: "Mild stomach rumble or nausea during initial days.",
        urgentSideEffects: "Severe unexplained muscle cramps or breathing difficulty."
      },
      {
        name: "Atorvastatin 10mg",
        generic: "Atorvastatin Calcium",
        timing: "HS (Once daily at Bedtime)",
        purpose: "Slows down cholesterol production in the liver and cleans up blood vessel walls.",
        instructions: "Take right before sleep. Liver produces most cholesterol at night.",
        precautions: "Avoid drinking grapefruit juice; tell doctor if you experience severe muscle aches.",
        mildSideEffects: "Mild morning fatigue or dry mouth.",
        urgentSideEffects: "Unusual dark urine or persistent severe muscle weakness."
      }
    ],
    doctorQuestions: [
      { id: "q1", text: "My SGPT/ALT is 48 U/L (mildly above 40). Could my evening Atorvastatin be causing this minor bump?", checked: false },
      { id: "q2", text: "My HbA1c is 7.1%, down from 7.8% last quarter. Should we maintain Metformin 500mg or adjust dosage?", checked: false },
      { id: "q3", text: "Are there specific dietary changes to help lower my LDL cholesterol from 138 to under 100?", checked: false },
      { id: "q4", text: "When should I repeat this metabolic and lipid panel? (e.g. in 3 months or 6 months?)", checked: false }
    ],
    rawText: `APOLLO DIAGNOSTICS & CLINICAL LABS
Patient: Ramesh Sharma | Age: 58 Yrs / Male | Ref Dr: Dr. Rajesh Mehta, MD
Date of Collection: 13-Nov-2026 08:30 AM | Sample: Fasting Blood Serum

COMPREHENSIVE METABOLIC & LIPID PROFILE:
- HbA1c (Glycosylated Hemoglobin): 7.1 % (Ref: 4.0 - 5.7) [HIGH]
- Fasting Blood Glucose (Hexokinase): 138 mg/dL (Ref: 70 - 99) [HIGH]
- Serum Creatinine (Enzymatic): 1.05 mg/dL (Ref: 0.7 - 1.3) [NORMAL]
- SGPT / ALT (IFCC without Pyridoxal): 48 U/L (Ref: 0 - 40) [MILD ELEVATION]
- SGOT / AST: 32 U/L (Ref: 0 - 38) [NORMAL]
- Total Cholesterol: 218 mg/dL (Ref: < 200) [BORDERLINE]
- LDL Cholesterol (Calculated): 138 mg/dL (Ref: < 100) [HIGH]
- HDL Cholesterol: 44 mg/dL (Ref: > 40) [NORMAL]
- Serum Potassium: 4.4 mEq/L (Ref: 3.5 - 5.0) [NORMAL]
- Hemoglobin (Sysmex): 14.2 g/dL (Ref: 13.0 - 17.0) [NORMAL]

Clinical Impression: Mild dyslipidemia and suboptimally controlled Type 2 Diabetes Mellitus. Stable renal parameters.`
  },

  criticalAlertReport: {
    id: "doc-crit-1",
    type: "Urgent Lab Alert",
    title: "Emergency Cardiac & Renal Biomarker Panel",
    facility: "Fortis Emergency Department & ICU Diagnostics",
    date: "13-Nov-2026",
    patientName: "Savitri Patel",
    patientAge: 64,
    patientGender: "Female",
    doctorName: "Dr. Ananya Ray, MD (Emergency Medicine)",
    isMedical: true,
    confidenceScore: 99,
    redFlagLevel: "critical", // CRITICAL RED FLAG
    redFlagMessage: "🚨 IMMEDIATE ATTENTION REQUIRED: Critical Serum Potassium (6.2 mEq/L) and elevated Troponin-I detected. Please contact your nearest emergency room or attending doctor immediately.",
    readLevels: {
      simple: "URGENT WARNING: Your test shows two numbers that need urgent medical doctor care right now! Your heart salt (potassium) is dangerously high at 6.2, and your heart stress marker (Troponin) is high. Please go to the nearest hospital emergency room without waiting.",
      standard: "CRITICAL ALERT: Significant laboratory abnormalities requiring immediate emergency physician consultation. Hyperkalemia detected with Potassium at 6.2 mEq/L (normal limit 5.0). Cardiac biomarker Troponin-I is elevated at 0.48 ng/mL indicating acute cardiac muscle distress.",
      detailed: "CRITICAL STAT FINDING: Acute Hyperkalemia (Serum K+ 6.2 mmol/L) presenting marked risk of cardiac conduction arrhythmias. Concomitant elevation of High-Sensitivity Troponin-I (0.48 ng/mL; 99th percentile cutoff < 0.04 ng/mL). Patient requires immediate emergency evaluation, continuous ECG telemetry, and stabilization."
    },
    values: [
      {
        name: "Serum Potassium",
        key: "potassium",
        value: 6.2,
        unit: "mEq/L",
        refLow: 3.5,
        refHigh: 5.0,
        status: "critical-high",
        statusLabel: "CRITICAL HIGH (Urgent)",
        statusColor: "red",
        reassurance: "DANGER LEVEL: Potassium above 6.0 can interfere with steady heart rhythms. Immediate hospital evaluation is required.",
        plainExplainer: "Crucial heart rhythm electrolyte."
      },
      {
        name: "Cardiac Troponin-I",
        key: "troponin",
        value: 0.48,
        unit: "ng/mL",
        refLow: 0.00,
        refHigh: 0.04,
        status: "critical-high",
        statusLabel: "CRITICAL ELEVATED",
        statusColor: "red",
        reassurance: "ALERT: This marker leaks into blood when heart muscle is distressed. Requires prompt emergency check.",
        plainExplainer: "Heart muscle stress detector."
      },
      {
        name: "Serum Creatinine",
        key: "creatinine",
        value: 2.1,
        unit: "mg/dL",
        refLow: 0.6,
        refHigh: 1.1,
        status: "elevated",
        statusLabel: "Elevated Kidney Strain",
        statusColor: "red",
        reassurance: "Creatinine has doubled, showing your kidneys are currently filtering slowly.",
        plainExplainer: "Kidney filter efficiency."
      }
    ],
    medicines: [
      {
        name: "Calcium Gluconate IV / Urgent Care Orders",
        generic: "Cardiac Membrane Stabilizer",
        timing: "STAT (Emergency administration by medical staff)",
        purpose: "Protects the heart from irregular rhythms caused by high potassium.",
        instructions: "Administered only in hospital by nursing staff.",
        precautions: "Do not attempt self-medication.",
        mildSideEffects: "Warmth sensation.",
        urgentSideEffects: "Notify staff of dizziness."
      }
    ],
    doctorQuestions: [
      { id: "cq1", text: "What is causing the sudden spike in potassium to 6.2 mEq/L?", checked: false },
      { id: "cq2", text: "Do we need an immediate ECG to check heart rhythms?", checked: false },
      { id: "cq3", text: "Should any current blood pressure or water pills (diuretics) be stopped right away?", checked: false }
    ],
    rawText: `FORTIS MEMORIAL RESEARCH INSTITUTE - EMERGENCY PATHOLOGY
STAT REPORT - CRITICAL CALL PLACED TO CLINICAL ATTENDING
Patient: Savitri Patel | Age: 64 Y / F | IPD No: 99428-A
Collection Time: 13-Nov-2026 14:15 PM

CRITICAL VALUES NOTIFIED:
- Serum Potassium (ISE Direct): 6.2 mEq/L ***CRITICAL HIGH*** (Ref: 3.5 - 5.0)
- High-Sensitivity Troponin-I: 0.48 ng/mL ***CRITICAL HIGH*** (Ref: 0.00 - 0.04)
- Serum Creatinine: 2.1 mg/dL (Ref: 0.6 - 1.1) [HIGH]
- Blood Urea Nitrogen (BUN): 48 mg/dL (Ref: 7 - 20) [HIGH]
- Sodium (Na+): 136 mEq/L (Ref: 135 - 145) [NORMAL]

URGENT NOTE: Findings communicated to ER Resident on duty. Repeat testing confirmed on second aliquot.`
  },

  dischargeSummary: {
    id: "doc-dis-1",
    type: "Discharge Summary",
    title: "Inpatient Clinical Discharge Summary",
    facility: "Max Super Speciality Hospital, Department of Internal Medicine",
    date: "10-Nov-2026",
    patientName: "Ramesh Sharma",
    patientAge: 58,
    patientGender: "Male",
    doctorName: "Dr. Sunil Grover, MD, DM",
    isMedical: true,
    confidenceScore: 97,
    redFlagLevel: "none",
    redFlagMessage: "Discharge condition is stable. Continue prescribed oral medications, adhere to diabetic diet, and attend scheduled follow-up in 10 days.",
    readLevels: {
      simple: "Good news! You have recovered well from dehydration and high blood sugar, and the doctor has cleared you to go home. All your vitals and heart rhythms are stable. Remember to take your morning diabetes pill with breakfast, drink 2 liters of water daily, and see Dr. Grover in 10 days.",
      standard: "Patient was admitted with acute dehydration and uncontrolled hyperglycemia, successfully stabilized with IV hydration and sliding scale insulin. Discharged in hemodynamically stable condition. Transitioned to oral hypoglycemic agents. Normal diet with low glycemic index recommended.",
      detailed: "Admission Diagnosis: Hyperglycemic dehydration secondary to acute viral gastroenteritis in a patient with pre-existing Type 2 Diabetes Mellitus. Hospital course uneventful; serum osmolarity and electrolyte imbalances normalized. Discharged on oral Metformin 500mg BID and Telmisartan 40mg OD with stable renal indices."
    },
    values: [
      {
        name: "Blood Pressure on Discharge",
        key: "hypertension",
        value: "124/80",
        unit: "mmHg",
        refLow: 90,
        refHigh: 120,
        status: "normal",
        statusLabel: "Optimal / Controlled",
        statusColor: "green",
        reassurance: "Your blood pressure is well within the safe and healthy target range.",
        plainExplainer: "Heart pumping pressure."
      },
      {
        name: "Discharge Fasting Sugar",
        key: "fasting glucose",
        value: 112,
        unit: "mg/dL",
        refLow: 70,
        refHigh: 99,
        status: "slightly-elevated",
        statusLabel: "Mild Elevation (Safe)",
        statusColor: "green",
        reassurance: "Down from 260 mg/dL at admission to a very safe 112 mg/dL. Great progress!",
        plainExplainer: "Blood sugar after overnight rest."
      }
    ],
    medicines: [
      {
        name: "Metformin 500mg",
        generic: "Metformin Hydrochloride",
        timing: "BID (Twice daily, Morning & Night with meals)",
        purpose: "Maintains healthy blood sugar levels throughout the day.",
        instructions: "Take with food.",
        precautions: "Do not skip meals.",
        mildSideEffects: "Mild stomach rumble initially.",
        urgentSideEffects: "Severe weakness or persistent nausea."
      },
      {
        name: "Telmisartan 40mg",
        generic: "Telmisartan (ARB)",
        timing: "OD (Once daily in the morning)",
        purpose: "Protects kidneys and keeps blood pressure smooth and relaxed.",
        instructions: "Take every morning at the same time with water.",
        precautions: "Rise slowly from lying down to avoid mild dizziness.",
        mildSideEffects: "Occasional mild lightheadedness.",
        urgentSideEffects: "Swelling of lips or tongue (allergic reaction)."
      }
    ],
    doctorQuestions: [
      { id: "dq1", text: "How many liters of water should I aim to drink daily while taking Telmisartan?", checked: false },
      { id: "dq2", text: "When is my scheduled follow-up with Dr. Grover (is Nov 20 morning confirmed)?", checked: false },
      { id: "dq3", text: "Can I resume my morning 30-minute walks starting this week?", checked: false }
    ],
    rawText: `MAX SUPER SPECIALITY HOSPITAL - DISCHARGE SUMMARY
IPD Ref: MX-2026-8812 | Date of Admission: 06-Nov-2026 | Date of Discharge: 10-Nov-2026
Patient: Ramesh Sharma | Age/Gender: 58 Y / M | Consultant: Dr. Sunil Grover, MD

FINAL DIAGNOSIS:
1. Type 2 Diabetes Mellitus with Acute Hyperglycemic Dehydration (Resolved)
2. Essential Hypertension (Stage 1 - Controlled)
3. Mild Hypokalemia (Corrected during inpatient stay)

CONDITION AT DISCHARGE:
Patient is afebrile, conscious, oriented. PR: 76/min, BP: 124/80 mmHg, SpO2: 98% on room air.
Oral intake adequate. Systemic examination: S1S2 heard, chest clear, abdomen soft.

DISCHARGE MEDICATIONS:
1. Tab. Metformin 500mg - 1 tab PO BID (After meals) x 30 days
2. Tab. Telmisartan 40mg - 1 tab PO OD (Morning after breakfast) x 30 days
3. Cap. Pantoprazole 40mg - 1 cap PO OD (Empty stomach before breakfast) x 7 days

FOLLOW UP:
Review in Medicine OPD with Dr. Grover after 10 days with repeat Fasting Blood Sugar and Serum Electrolytes.`
  },

  invalidDocTest: {
    id: "doc-invalid-1",
    type: "Non-Medical Document",
    title: "The Olive Bistro & Grill - Dine-in Bill",
    facility: "Olive Garden Food Services Ltd.",
    date: "12-Nov-2026",
    patientName: "Customer #42",
    isMedical: false,
    confidenceScore: 4,
    redFlagLevel: "none",
    rawText: `THE OLIVE BISTRO & GRILL
Tax Invoice / Order #88412
Date: 12-Nov-2026 09:45 PM | Server: Mike T. | Table: 14

1x Truffle Mushroom Pasta ......... $18.50
1x Wood-Fired Margherita Pizza .... $16.00
2x Fresh Lime Soda ................ $8.00
1x Tiramisu Dessert ............... $9.50
Subtotal: $52.00
CGST @ 2.5%: $1.30 | SGST @ 2.5%: $1.30
Service Charge: $4.00
Total Payable: $58.60 (Paid via Credit Card **** 9102)

Thank you for dining with us! Please visit again!`
  }
};

const PATIENT_HISTORY = {
  profile: {
    name: "Ramesh Sharma",
    age: 58,
    gender: "Male",
    bloodGroup: "B+",
    emergencyContact: "+91 98201-44321 (Rahul Sharma - Son)",
    allergies: ["Penicillin (Causes skin rash)", "Sulfa Antibiotics"],
    chronicConditions: [
      { name: "Type 2 Diabetes Mellitus", diagnosedYear: 2020, status: "Under Medical Management" },
      { name: "Essential Hypertension", diagnosedYear: 2023, status: "Controlled with Telmisartan" },
      { name: "Mild Dyslipidemia", diagnosedYear: 2025, status: "Lifestyle & Statin" }
    ]
  },
  timeline: [
    {
      date: "13-Nov-2026 (Today)",
      type: "Comprehensive Lab Panel",
      center: "Apollo Diagnostics",
      summary: "HbA1c 7.1%, Fasting Sugar 138, Creatinine 1.05. Stable kidneys; mild blood sugar and cholesterol elevation.",
      statusColor: "yellow",
      hba1c: 7.1,
      fastingGlucose: 138,
      bp: "126/82",
      creatinine: 1.05
    },
    {
      date: "10-Nov-2026 (3 days ago)",
      type: "Hospital Discharge Summary",
      center: "Max Hospital",
      summary: "Discharged after dehydration treatment. Transitioned smoothly back to oral Metformin & Telmisartan.",
      statusColor: "green",
      hba1c: 7.3,
      fastingGlucose: 112,
      bp: "124/80",
      creatinine: 1.10
    },
    {
      date: "15-Aug-2026 (3 months ago)",
      type: "Quarterly Diabetes Check",
      center: "Apollo Diagnostics",
      summary: "HbA1c was 7.8%, Fasting Sugar 155. Statin dosage initiated.",
      statusColor: "orange",
      hba1c: 7.8,
      fastingGlucose: 155,
      bp: "136/88",
      creatinine: 1.08
    },
    {
      date: "12-May-2026 (6 months ago)",
      type: "Annual Health Screening",
      center: "Max Diagnostics",
      summary: "HbA1c was 8.4%, Fasting Sugar 174, BP 142/90. High blood sugar identified, diet overhaul recommended.",
      statusColor: "red",
      hba1c: 8.4,
      fastingGlucose: 174,
      bp: "142/90",
      creatinine: 1.12
    }
  ]
};

const FAMILY_CIRCLE = [
  {
    id: "fam-1",
    name: "Rahul Sharma",
    relation: "Son (Primary Caregiver)",
    phone: "+91 98201-44321",
    email: "rahul.sharma@example.com",
    role: "Full Access & Emergency Responder",
    badge: "Primary",
    receiveWhatsApp: true
  },
  {
    id: "fam-2",
    name: "Pooja Sharma",
    relation: "Daughter-in-law",
    phone: "+91 98201-99887",
    email: "pooja.s@example.com",
    role: "Read-Only Summaries & Diet Planner",
    badge: "Caregiver",
    receiveWhatsApp: true
  },
  {
    id: "fam-3",
    name: "Dr. Rajesh Mehta",
    relation: "Primary Consulting Physician",
    phone: "+91 98110-12345",
    email: "dr.mehta@apolloclinic.com",
    role: "Direct Clinical Access",
    badge: "Doctor",
    receiveWhatsApp: false
  }
];

const INITIAL_REMINDERS = [
  {
    id: "rem-1",
    type: "medicine",
    title: "Metformin 500mg",
    timing: "08:30 AM (Breakfast)",
    instructions: "Take 1 tablet immediately after morning meal with water.",
    taken: true,
    scheduledTime: "08:30 AM",
    pillIcon: "💊"
  },
  {
    id: "rem-2",
    type: "medicine",
    title: "Telmisartan 40mg",
    timing: "09:00 AM (Morning)",
    instructions: "Take 1 tablet with water for blood pressure regulation.",
    taken: true,
    scheduledTime: "09:00 AM",
    pillIcon: "🩺"
  },
  {
    id: "rem-3",
    type: "medicine",
    title: "Metformin 500mg (2nd Dose)",
    timing: "08:00 PM (Dinner)",
    instructions: "Take 1 tablet with dinner.",
    taken: false,
    scheduledTime: "08:00 PM",
    pillIcon: "💊"
  },
  {
    id: "rem-4",
    type: "medicine",
    title: "Atorvastatin 10mg",
    timing: "10:00 PM (Bedtime)",
    instructions: "Take 1 tablet right before sleeping.",
    taken: false,
    scheduledTime: "10:00 PM",
    pillIcon: "🌙"
  },
  {
    id: "rem-5",
    type: "appointment",
    title: "Follow-up with Dr. Rajesh Mehta",
    doctor: "Dr. Rajesh Mehta, MD (Internal Medicine)",
    location: "Apollo Diagnostics Clinic, Room 204",
    date: "18-Nov-2026 (In 5 days)",
    timing: "10:30 AM",
    purpose: "Review HbA1c progress and adjust cholesterol medication.",
    status: "Confirmed",
    pillIcon: "🗓️"
  }
];


// ClariMed - Feature 3: Strict Medical Document Verification Engine

const MEDICAL_KEYWORDS = [
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

const NON_MEDICAL_REJECT_PATTERNS = [
  "invoice", "tax invoice", "gstin", "subtotal", "restaurant", "bistro", "waiter", "table #",
  "credit card", "boarding pass", "flight", "resume", "curriculum vitae", "receipt #",
  "delivery partner", "uber", "amazon order", "swiggy", "zomato", "bank statement"
];

/**
 * Validates whether the provided text/file is a legitimate medical document.
 * Enforces Feature 3: Restrict strictly to medical files only.
 */
function validateMedicalDocument(rawText, filename = "") {
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


// ClariMed - Feature 2: Multi-Language Localization Engine

const TRANSLATIONS = {
  en: {
    appTitle: "ClariMed",
    appTagline: "Making Medical Reports Easy to Understand for You and Your Family",
    navSummary: "Report Summary",
    navValues: "Lab Value Status",
    navMedicines: "Medicine Explainer",
    navQuestions: "Doctor Questions",
    navHistory: "Health History",
    navReminders: "Pill & Visit Reminders",
    navFamily: "Family Circle",
    
    // Feature 3: File restriction
    uploadTitle: "Upload Medical Report or Prescription",
    uploadSubtitle: "Only medical files accepted (PDF, TXT, Images). Non-medical files will be rejected.",
    uploadButton: "Choose File",
    orPaste: "Or choose a sample medical report to test instantly:",
    sampleLab: "Sample Lab Report (Metabolic & Lipids)",
    sampleCrit: "Sample Critical Alert (Emergency)",
    sampleDischarge: "Sample Discharge Summary",
    sampleInvalid: "Test Invalid File (Restaurant Bill)",
    validationSuccess: "Medical Document Verified",
    validationFailed: "Non-Medical File Rejected",
    
    // Feature 11: Reading Level
    readingLevel: "Reading Level",
    levelSimple: "Simple (Grandma-friendly)",
    levelStandard: "Standard",
    levelDetailed: "Clinical / Detailed",
    textSize: "Text Size",
    highContrast: "High Contrast",
    
    // Feature 4: Audio
    listenExplanation: "Listen to Explanation",
    pauseAudio: "Pause Audio",
    resumeAudio: "Resume Audio",
    stopAudio: "Stop",
    audioSpeed: "Speed",
    speakingNow: "Reading aloud in plain language...",
    
    // Feature 12: Red Flags
    alertCriticalTitle: "CRITICAL ALERT - IMMEDIATE ACTION REQUIRED",
    alertAttentionTitle: "Doctor Attention Advised (Non-Emergency)",
    alertNormalTitle: "All Clear - Normal Parameters",
    emergencyHelpBtn: "Call Emergency (108 / 911)",
    notifyFamilyBtn: "Alert Caregiver",
    
    // Feature 8: Values status
    statusNormal: "Healthy / Safe",
    statusSlightlyHigh: "Slightly Elevated (No Need to Panic)",
    statusHigh: "Elevated",
    statusCritical: "Critical Alert",
    statusLow: "Slightly Low",
    yourResult: "Your Result",
    safeRange: "Healthy Range",
    calmNote: "What this means in plain words:",
    
    // Feature 9: Medicine Explainer
    medWhy: "Why are you taking this?",
    medHow: "How & When to take:",
    medPrecautions: "Important Rules:",
    medSideEffects: "Mild Side Effects (Normal):",
    medUrgentEffects: "Notify Doctor If:",
    
    // Feature 10: Doctor questions
    docQuestionsTitle: "Smart Questions to Ask Your Doctor",
    docQuestionsSubtitle: "Carry this checklist to your next visit so you get the most out of your doctor's time:",
    addCustomQuestion: "Add your own question...",
    printQuestions: "Print / Save Visit Sheet",
    
    // Feature 6: Reminders
    pillTrackerTitle: "Daily Medication Schedule",
    upcomingAppointments: "Doctor Appointments",
    markTaken: "Mark as Taken",
    takenBadge: "Taken Today",
    snooze: "Snooze 15m",
    addReminder: "Set Reminder",
    testPopupBtn: "Trigger Sample Pop-up Reminder",
    
    // Feature 5: Family Access
    familyCircleTitle: "Family & Caregiver Access",
    familyCircleSubtitle: "Share simplified, anxiety-free summaries with your loved ones and caregivers.",
    addMemberBtn: "Add Family Member",
    sendWhatsappBtn: "Send Summary via WhatsApp",
    viewAsCaregiver: "Caregiver View",
    
    // Feature 7: History
    patientHistoryTitle: "Patient Health Timeline & Trends",
    chronicConditions: "Chronic Conditions Log",
    allergies: "Known Allergies",
    trendTitle: "Blood Sugar (HbA1c) Trend Over Past 6 Months"
  },

  hi: {
    appTitle: "क्लैरीमेड (ClariMed)",
    appTagline: "मेडिकल रिपोर्ट्स और नुस्खे को आसान भाषा में समझें - आपके और आपके परिवार के लिए",
    navSummary: "रिपोर्ट सारांश",
    navValues: "जांच परिणाम स्थिति",
    navMedicines: "दवाओं की जानकारी",
    navQuestions: "डॉक्टर से सवाल",
    navHistory: "स्वास्थ्य इतिहास",
    navReminders: "दवा और अपॉइंटमेंट रिमाइंडर",
    navFamily: "परिवार का दायरा",

    uploadTitle: "मेडिकल रिपोर्ट या डॉक्टर का पर्चा अपलोड करें",
    uploadSubtitle: "केवल मेडिकल फाइलें मान्य हैं। गैर-मेडिकल फाइलों को अस्वीकार कर दिया जाएगा।",
    uploadButton: "फ़ाइल चुनें",
    orPaste: "या तुरंत टेस्ट करने के लिए एक सैंपल चुनें:",
    sampleLab: "लैब रिपोर्ट (ब्लड शुगर और कोलेस्ट्रॉल)",
    sampleCrit: "इमरजेंसी अलर्ट रिपोर्ट (गंभीर)",
    sampleDischarge: "अस्पताल डिस्चार्ज सारांश",
    sampleInvalid: "गैर-मेडिकल फाइल टेस्ट (रेस्टोरेंट बिल)",
    validationSuccess: "मेडिकल दस्तावेज सत्यापित",
    validationFailed: "गैर-मेडिकल फाइल अस्वीकृत",

    readingLevel: "पढ़ने का स्तर",
    levelSimple: "सरल भाषा (दादी-नानी स्तर)",
    levelStandard: "सामान्य",
    levelDetailed: "विस्तृत / क्लीनिकल",
    textSize: "अक्षर आकार",
    highContrast: "हाई कंट्रास्ट",

    listenExplanation: "आवाज़ में सुनें (बोलकर समझाएं)",
    pauseAudio: "रोकें",
    resumeAudio: "पुनः चलाएं",
    stopAudio: "बंद करें",
    audioSpeed: "गति",
    speakingNow: "आसान भाषा में पढ़कर सुनाया जा रहा है...",

    alertCriticalTitle: "गंभीर चेतावनी - तुरंत डॉक्टर या इमरजेंसी से संपर्क करें",
    alertAttentionTitle: "डॉक्टर को दिखाने की सलाह (चिंता की बात नहीं)",
    alertNormalTitle: "सब सामान्य - कोई खतरा नहीं",
    emergencyHelpBtn: "इमरजेंसी कॉल (108 / 112)",
    notifyFamilyBtn: "परिवार को सूचित करें",

    statusNormal: "सामान्य / सुरक्षित",
    statusSlightlyHigh: "हल्का सा बढ़ा हुआ (घबराने की जरूरत नहीं)",
    statusHigh: "अधिक / बढ़ा हुआ",
    statusCritical: "गंभीर स्तर",
    statusLow: "हल्का सा कम",
    yourResult: "आपका परिणाम",
    safeRange: "सुरक्षित स्तर",
    calmNote: "आसान शब्दों में इसका क्या मतलब है:",

    medWhy: "यह दवा क्यों ले रहे हैं?",
    medHow: "कैसे और कब लें:",
    medPrecautions: "जरूरी सावधानियां:",
    medSideEffects: "हल्के लक्षण (सामान्य):",
    medUrgentEffects: "डॉक्टर को तुरंत बताएं यदि:",

    docQuestionsTitle: "अगली मुलाकात पर डॉक्टर से पूछने योग्य सवाल",
    docQuestionsSubtitle: "यह सूची अपने साथ रखें ताकि डॉक्टर के कम समय में भी आपकी सभी बातें स्पष्ट हो सकें:",
    addCustomQuestion: "अपना सवाल जोड़ें...",
    printQuestions: "सवाल सूची प्रिंट / सेव करें",

    pillTrackerTitle: "आज की दवाओं का समय",
    upcomingAppointments: "डॉक्टर से मिलने की तारीख",
    markTaken: "दवा ले ली",
    takenBadge: "ले ली गई",
    snooze: "15 मिनट बाद याद दिलाएं",
    addReminder: "नया रिमाइंडर जोड़ें",
    testPopupBtn: "रिमाइंडर पॉप-अप टेस्ट करें",

    familyCircleTitle: "परिवार और देखभाल करने वाले सदस्य",
    familyCircleSubtitle: "अपने प्रियजनों के साथ सरल और बिना तनाव वाली रिपोर्ट साझा करें।",
    addMemberBtn: "नया सदस्य जोड़ें",
    sendWhatsappBtn: "व्हाट्सएप पर सारांश भेजें",
    viewAsCaregiver: "केयरगिवर दृश्य",

    patientHistoryTitle: "मरीज का स्वास्थ्य इतिहास और ट्रेंड",
    chronicConditions: "पुरानी बीमारियाँ",
    allergies: "एलर्जी (जिनसे बचना है)",
    trendTitle: "पिछले 6 महीनों में ब्लड शुगर (HbA1c) का सुधार"
  },

  es: {
    appTitle: "ClariMed",
    appTagline: "Informes médicos explicados en lenguaje claro para usted y su familia",
    navSummary: "Resumen del Informe",
    navValues: "Estado de Valores",
    navMedicines: "Guía de Medicamentos",
    navQuestions: "Preguntas para el Médico",
    navHistory: "Historial de Salud",
    navReminders: "Recordatorios de Medicación",
    navFamily: "Círculo Familiar",

    uploadTitle: "Subir Informe de Laboratorio o Receta",
    uploadSubtitle: "Solo se aceptan archivos médicos (PDF, TXT, fotos). Los archivos no médicos serán rechazados.",
    uploadButton: "Seleccionar Archivo",
    orPaste: "O pruebe con un informe de muestra:",
    sampleLab: "Análisis de Sangre (Azúcar y Colesterol)",
    sampleCrit: "Alerta Crítica de Emergencia",
    sampleDischarge: "Resumen de Alta Hospitalaria",
    sampleInvalid: "Probar Archivo No Médico (Factura)",
    validationSuccess: "Documento Médico Verificado",
    validationFailed: "Archivo No Médico Rechazado",

    readingLevel: "Nivel de Lectura",
    levelSimple: "Simple (Fácil de entender)",
    levelStandard: "Estándar",
    levelDetailed: "Detallado / Clínico",
    textSize: "Tamaño de Texto",
    highContrast: "Alto Contraste",

    listenExplanation: "Escuchar Explicación en Audio",
    pauseAudio: "Pausar",
    resumeAudio: "Reanudar",
    stopAudio: "Detener",
    audioSpeed: "Velocidad",
    speakingNow: "Leyendo la explicación en lenguaje sencillo...",

    alertCriticalTitle: "ALERTA CRÍTICA - ACCIÓN MÉDICA INMEDIATA REQUERIDA",
    alertAttentionTitle: "Atención Médica Aconsejada (Sin Emergencia)",
    alertNormalTitle: "Todo en Orden - Parámetros Normales",
    emergencyHelpBtn: "Llamar Emergencias (911 / 112)",
    notifyFamilyBtn: "Avisar a Cuidador",

    statusNormal: "Saludable / Normal",
    statusSlightlyHigh: "Ligeramente Alto (Sin Pánico)",
    statusHigh: "Elevado",
    statusCritical: "Nivel Crítico",
    statusLow: "Ligeramente Bajo",
    yourResult: "Su Resultado",
    safeRange: "Rango Saludable",
    calmNote: "Qué significa esto en palabras sencillas:",

    medWhy: "¿Para qué toma este medicamento?",
    medHow: "Cómo y cuándo tomarlo:",
    medPrecautions: "Reglas importantes:",
    medSideEffects: "Efectos secundarios leves:",
    medUrgentEffects: "Consulte al médico de inmediato si:",

    docQuestionsTitle: "Preguntas Inteligentes para su Médico",
    docQuestionsSubtitle: "Lleve esta lista a su próxima consulta médica para aprovechar mejor el tiempo:",
    addCustomQuestion: "Añadir su propia pregunta...",
    printQuestions: "Imprimir / Guardar Hoja",

    pillTrackerTitle: "Horario Diario de Medicación",
    upcomingAppointments: "Citas Médicas Próximas",
    markTaken: "Tomada",
    takenBadge: "Tomada Hoy",
    snooze: "Posponer 15m",
    addReminder: "Nuevo Recordatorio",
    testPopupBtn: "Probar Notificación Emergente",

    familyCircleTitle: "Acceso para Familiares y Cuidadores",
    familyCircleSubtitle: "Comparta resúmenes claros y comprensibles con sus seres queridos.",
    addMemberBtn: "Añadir Familiar",
    sendWhatsappBtn: "Enviar por WhatsApp",
    viewAsCaregiver: "Vista de Cuidador",

    patientHistoryTitle: "Historial de Salud y Tendencias",
    chronicConditions: "Condiciones Crónicas",
    allergies: "Alergias Conocidas",
    trendTitle: "Tendencia de Azúcar en Sangre (HbA1c) en 6 Meses"
  },

  mr: {
    appTitle: "क्लॅरीमेड (ClariMed)",
    appTagline: "वैद्यकीय अहवाल आणि औषधोपचार सोप्या भाषेत समजून घ्या - तुमच्या आणि कुटुंबासाठी",
    navSummary: "अहवाल सारांश",
    navValues: "तपासणी स्थिती",
    navMedicines: "औषध मार्गदर्शक",
    navQuestions: "डॉक्टरांना विचारायचे प्रश्न",
    navHistory: "आरोग्य इतिहास",
    navReminders: "औषध आणि भेट स्मरणपत्र",
    navFamily: "कुटुंब मंडळ",

    uploadTitle: "वैद्यकीय अहवाल किंवा डॉक्टरांची चिठ्ठी अपलोड करा",
    uploadSubtitle: "फक्त वैद्यकीय फाइल्स स्वीकारल्या जातील. इतर फाइल्स नाकारल्या जातील.",
    uploadButton: "फाइल निवडा",
    orPaste: "किंवा चाचणीसाठी नमुना अहवाल निवडा:",
    sampleLab: "रक्त तपासणी अहवाल (साखर व कोलेस्ट्रॉल)",
    sampleCrit: "तातडीचा अहवाल (इमर्जन्सी)",
    sampleDischarge: "डिस्चार्ज सारांश",
    sampleInvalid: "अवैध फाइल तपासा (हॉटेल बिल)",
    validationSuccess: "वैद्यकीय दस्तऐवज पडताळणी यशस्वी",
    validationFailed: "गैर-वैद्यकीय फाइल नाकारली",

    readingLevel: "वाचन पातळी",
    levelSimple: "अतिशय सोपी भाषा",
    levelStandard: "सामान्य",
    levelDetailed: "तपशीलवार",
    textSize: "फॉन्ट आकार",
    highContrast: "हाय कॉन्ट्रास्ट",

    listenExplanation: "आवाजात ऐका (स्पष्टीकरण ऐका)",
    pauseAudio: "थांबवा",
    resumeAudio: "पुन्हा सुरू करा",
    stopAudio: "बंद करा",
    audioSpeed: "गती",
    speakingNow: "सोप्या मराठीत बोलून दाखवत आहे...",

    alertCriticalTitle: "गंभीर इशारा - तातडीने डॉक्टरांशी किंवा रुग्णालयाशी संपर्क साधा",
    alertAttentionTitle: "डॉक्टरांचा सल्ला आवश्यक (घाबरू नका)",
    alertNormalTitle: "सर्व सामान्य - काळजीचे कारण नाही",
    emergencyHelpBtn: "तातडीने कॉल करा (108 / 112)",
    notifyFamilyBtn: "कुटुंबाला कळवा",

    statusNormal: "सुरक्षित / सामान्य",
    statusSlightlyHigh: "किंचित जास्त (घाबरण्याची गरज नाही)",
    statusHigh: "जास्त",
    statusCritical: "गंभीर पातळी",
    statusLow: "किंचित कमी",
    yourResult: "तुमचा निकाल",
    safeRange: "सुरक्षित मर्यादा",
    calmNote: "सोप्या शब्दात याचा अर्थ:",

    medWhy: "हे औषध कशासाठी आहे?",
    medHow: "कसे आणि कधी घ्यावे:",
    medPrecautions: "महत्त्वाचे नियम:",
    medSideEffects: "सौम्य परिणाम:",
    medUrgentEffects: "डॉक्टरांना लगेच सांगा जर:",

    docQuestionsTitle: "डॉक्टरांना विचारण्यासाठी महत्त्वाचे प्रश्न",
    docQuestionsSubtitle: "पुढील भेटीत डॉक्टरांना विचारण्यासाठी ही चेकलिस्ट सोबत ठेवा:",
    addCustomQuestion: "स्वतःचा प्रश्न जोडा...",
    printQuestions: "प्रश्न जतन करा / प्रिंट करा",

    pillTrackerTitle: "आजच्या औषधांची वेळ",
    upcomingAppointments: "डॉक्टरांच्या भेटी",
    markTaken: "औषध घेतले",
    takenBadge: "घेतले",
    snooze: "15 मिनिटांनी आठवण करा",
    addReminder: "नवीन रिमाइंडर जोडा",
    testPopupBtn: "पॉप-अप रिमाइंडर तपासा",

    familyCircleTitle: "कुटुंब आणि काळजीवाहक",
    familyCircleSubtitle: "कुटुंबातील सदस्यांसोबत सोपा आणि तणावमुक्त अहवाल शेअर करा.",
    addMemberBtn: "नवीन सदस्य जोडा",
    sendWhatsappBtn: "व्हॉट्सॲपवर पाठवा",
    viewAsCaregiver: "केअरगिव्हर व्ह्यू",

    patientHistoryTitle: "रुग्णाचा आरोग्य इतिहास आणि प्रगती",
    chronicConditions: "दीर्घकालीन आजार",
    allergies: "अ‍ॅलर्जी",
    trendTitle: "गेल्या 6 महिन्यांतील रक्तातील साखर (HbA1c) सुधारणा"
  },

  bn: {
    appTitle: "ক্ল্যারিমেড (ClariMed)",
    appTagline: "সহজ ভাষায় আপনার মেডিকেল রিপোর্ট ও প্রেসক্রিপশন বুঝুন",
    navSummary: "রিপোর্ট সারসংক্ষেপ",
    navValues: "টেস্টের মান ও অবস্থা",
    navMedicines: "ওষুধের গাইড",
    navQuestions: "ডাক্তারকে জিজ্ঞাসা করার প্রশ্ন",
    navHistory: "স্বাস্থ্য ইতিহাস",
    navReminders: "ওষুধ ও অ্যাপয়েন্টমেন্ট রিমাইন্ডার",
    navFamily: "পরিবার ও কেয়ারগিভার",

    uploadTitle: "মেডিকেল রিপোর্ট বা প্রেসক্রিপশন আপলোড করুন",
    uploadSubtitle: "শুধুমাত্র মেডিকেল ফাইল গৃহীত হবে। অন্যান্য ফাইল বাতিল হবে।",
    uploadButton: "ফাইল নির্বাচন করুন",
    orPaste: "অথবা অবিলম্বে পরীক্ষার জন্য একটি নমুনা বেছে নিন:",
    sampleLab: "ল্যাব টেস্ট রিপোর্ট (সুগার ও কোলেস্টেরল)",
    sampleCrit: "জরুরি সতর্কবার্তা রিপোর্ট",
    sampleDischarge: "হাসপাতাল ডিসচার্জ সামারি",
    sampleInvalid: "অ-মেডিকেল ফাইল টেস্ট (রেস্তোরাঁর বিল)",
    validationSuccess: "মেডিকেল ফাইল যাচাই সফল",
    validationFailed: "অ-মেডিকেল ফাইল বাতিল",

    readingLevel: "পড়ার স্তর",
    levelSimple: "খুব সহজ ভাষা",
    levelStandard: "স্বাভাবিক",
    levelDetailed: "বিস্তারিত",
    textSize: "অক্ষরের আকার",
    highContrast: "উচ্চ বৈসাদৃশ্য (হাই কন্ট্রাস্ট)",

    listenExplanation: "ভয়েস শুনুন (সহজ ভাষায় পড়ুন)",
    pauseAudio: "থামুন",
    resumeAudio: "চালিয়ে যান",
    stopAudio: "বন্ধ করুন",
    audioSpeed: "গতি",
    speakingNow: "সহজ ভাষায় পাঠ করা হচ্ছে...",

    alertCriticalTitle: "জরুরি সতর্কতা - অবিলম্বে ডাক্তারের কাছে যান",
    alertAttentionTitle: "ডাক্তারের পরামর্শ নিন (আতঙ্কিত হবেন না)",
    alertNormalTitle: "সব স্বাভাবিক - উদ্বেগের কিছু নেই",
    emergencyHelpBtn: "জরুরি কল (108 / 112)",
    notifyFamilyBtn: "পরিবারকে জানান",

    statusNormal: "স্বাভাবিক ও নিরাপদ",
    statusSlightlyHigh: "সামান্য বেশি (ভয়ের কিছু নেই)",
    statusHigh: "উচ্চ মান",
    statusCritical: "সংকটজনক অবস্থা",
    statusLow: "সামান্য কম",
    yourResult: "আপনার টেস্টের মান",
    safeRange: "নিরাপদ মাত্রা",
    calmNote: "সহজ কথায় এর অর্থ:",

    medWhy: "এই ওষুধটি কেন খাচ্ছেন?",
    medHow: "কখন এবং কীভাবে খাবেন:",
    medPrecautions: "গুরুত্বপূর্ণ সতর্কতা:",
    medSideEffects: "সাধারণ লক্ষণ:",
    medUrgentEffects: "জরুরি সতর্কতা লক্ষণ:",

    docQuestionsTitle: "ডাক্তারকে জিজ্ঞাসা করার মতো গুরুত্বপূর্ণ প্রশ্ন",
    docQuestionsSubtitle: "ডাক্তারের কাছে যাওয়ার সময় এই তালিকাটি সাথে রাখুন:",
    addCustomQuestion: "নিজের প্রশ্ন যোগ করুন...",
    printQuestions: "প্রশ্ন সংরক্ষণ / প্রিন্ট করুন",

    pillTrackerTitle: "আজকের ওষুধের সময়সূচি",
    upcomingAppointments: "ডাক্তারের সাথে অ্যাপয়েন্টমেন্ট",
    markTaken: "ওষুধ খেয়েছি",
    takenBadge: "খাওয়া হয়েছে",
    snooze: "১৫ মিনিট পরে মনে করিয়ে দিন",
    addReminder: "নতুন রিমাইন্ডার",
    testPopupBtn: "পপ-আপ রিমাইন্ডার টেস্ট করুন",

    familyCircleTitle: "পরিবার ও কেয়ারগিভার",
    familyCircleSubtitle: "আপনার প্রিয়জনদের সাথে সহজ ও স্পষ্ট সারাংশ শেয়ার করুন।",
    addMemberBtn: "নতুন সদস্য যোগ করুন",
    sendWhatsappBtn: "হোয়াটসঅ্যাপে পাঠান",
    viewAsCaregiver: "কেয়ারগিভার ভিউ",

    patientHistoryTitle: "রোগীর স্বাস্থ্য ইতিহাস ও অগ্রগতি",
    chronicConditions: "দীর্ঘস্থায়ী রোগ",
    allergies: "অ্যালার্জি",
    trendTitle: "গত ৬ মাসে ব্লাড সুগার (HbA1c) উন্নতির গ্রাফ"
  },

  gu: {
    appTitle: "ક્લેરીમેડ (ClariMed)",
    appTagline: "મેડિકલ રિપોર્ટ્સ અને પ્રિસ્ક્રિપ્શન સરળ ભાષામાં સમજો - તમારા અને પરિવાર માટે",
    navSummary: "રિપોર્ટ સારાંશ",
    navValues: "ટેસ્ટ પરિણામ સ્થિતિ",
    navMedicines: "દવાઓની સમજૂતી",
    navQuestions: "ડોક્ટરને પૂછવાના પ્રશ્નો",
    navHistory: "સ્વાસ્થ્ય ઇતિહાસ",
    navReminders: "દવા અને મુલાકાત રિમાઇન્ડર",
    navFamily: "પરિવાર વર્તુળ",

    uploadTitle: "મેડિકલ રિપોર્ટ અથવા પ્રિસ્ક્રિપ્શન અપલોડ કરો",
    uploadSubtitle: "માત્ર મેડિકલ ફાઇલો જ માન્ય છે. અન્ય ફાઇલો નકારવામાં આવશે.",
    uploadButton: "ફાઇલ પસંદ કરો",
    orPaste: "અથવા ટેસ્ટ કરવા માટે સેમ્પલ રિપોર્ટ પસંદ કરો:",
    sampleLab: "લેબ રિપોર્ટ (ડાયાબિટીસ અને કોલેસ્ટ્રોલ)",
    sampleCrit: "ઇમરજન્સી એલર્ટ રિપોર્ટ",
    sampleDischarge: "હોસ્પિટલ ડિસ્ચાર્જ સમરી",
    sampleInvalid: "બિન-મેડિકલ ફાઇલ ટેસ્ટ (રેસ્ટોરન્ટ બિલ)",
    validationSuccess: "મેડિકલ દસ્તાવેજ ચકાસાયેલ છે",
    validationFailed: "બિન-મેડિકલ ફાઇલ અસ્વીકાર્ય",

    readingLevel: "વાંચન સ્તર",
    levelSimple: "સરળ ભાષા (દાદી સમજી શકે તેવી)",
    levelStandard: "સામાન્ય",
    levelDetailed: "વિગતવાર",
    textSize: "ફોન્ટ સાઇઝ",
    highContrast: "હાઇ કોન્ટ્રાસ્ટ",

    listenExplanation: "અવાજમાં સાંભળો (સરળ સમજૂતી)",
    pauseAudio: "અટકાવો",
    resumeAudio: "ફરી ચાલુ કરો",
    stopAudio: "બંધ કરો",
    audioSpeed: "ઝડપ",
    speakingNow: "સરળ ભાષામાં વાંચીને સંભળાવી રહ્યું છે...",

    alertCriticalTitle: "ગંભીર ચેતવણી - તાત્કાલિક ડોક્ટરનો સંપર્ક કરો",
    alertAttentionTitle: "ડોક્ટરની સલાહ જરૂરી (ચિંતા કરશો નહીં)",
    alertNormalTitle: "બધું સામાન્ય - કોઈ જોખમ નથી",
    emergencyHelpBtn: "ઇમરજન્સી કોલ (108 / 112)",
    notifyFamilyBtn: "પરિવારને જાણ કરો",

    statusNormal: "સામાન્ય અને સલામત",
    statusSlightlyHigh: "થોડું વધારે (ગભરાવાની જરૂર નથી)",
    statusHigh: "વધારે",
    statusCritical: "ગંભીર સ્તર",
    statusLow: "થોડું ઓછું",
    yourResult: "તમારું પરિણામ",
    safeRange: "સલામત મર્યાદા",
    calmNote: "સરળ શબ્દોમાં આનો અર્થ:",

    medWhy: "આ દવા શા માટે લઈ રહ્યા છો?",
    medHow: "કેવી રીતે અને ક્યારે લેવી:",
    medPrecautions: "મહત્વપૂર્ણ નિયમો:",
    medSideEffects: "હળવી આડઅસર:",
    medUrgentEffects: "જો આવું થાય તો ડોક્ટરને તાત્કાલિક જણાવો:",

    docQuestionsTitle: "ડોક્ટરને પૂછવા માટેના મહત્વપૂર્ણ પ્રશ્નો",
    docQuestionsSubtitle: "તમારી મુલાકાત વખતે આ પ્રશ્નો સાથે રાખો:",
    addCustomQuestion: "પોતાનો પ્રશ્ન ઉમેરો...",
    printQuestions: "પ્રશ્નો સાચવો / પ્રિન્ટ કરો",

    pillTrackerTitle: "આજની દવાઓનું શિડ્યુલ",
    upcomingAppointments: "ડોક્ટરની મુલાકાત",
    markTaken: "દવા લઈ લીધી",
    takenBadge: "લીધી",
    snooze: "15 મિનિટ પછી યાદ કરાવો",
    addReminder: "નવું રિમાઇન્ડર",
    testPopupBtn: "પોપ-અપ રિમાઇન્ડર ટેસ્ટ કરો",

    familyCircleTitle: "પરિવાર અને સંભાળ રાખનાર",
    familyCircleSubtitle: "તમારા પ્રિયજનો સાથે સરળ રિપોર્ટ શેર કરો.",
    addMemberBtn: "નવા સભ્ય ઉમેરો",
    sendWhatsappBtn: "વોટ્સએપ પર મોકલો",
    viewAsCaregiver: "કેરગિવર વ્યુ",

    patientHistoryTitle: "દર્દીનો સ્વાસ્થ્ય ઇતિહાસ",
    chronicConditions: "ક્રોનિક બિમારીઓ",
    allergies: "એલર્જી",
    trendTitle: "છેલ્લા 6 મહિનામાં બ્લડ સુગર (HbA1c) સુધારો"
  }
};


// ClariMed - Core Application Logic






// ================= APP STATE =================
const state = {
  currentLang: 'en',
  currentReadingLevel: 'simple', // simple, standard, detailed
  currentDoc: SAMPLE_DOCUMENTS.comprehensiveLab,
  textSizeIndex: 1, // 0: sm, 1: md, 2: lg, 3: xl
  isHighContrast: false,
  isDyslexicFont: false,
  reminders: [...INITIAL_REMINDERS],
  familyMembers: [...FAMILY_CIRCLE],
  isSpeaking: false,
  speechSynth: window.speechSynthesis,
  speechUtterance: null,
  audioSpeed: 1.0
};

// ================= DOM ELEMENT REFERENCES =================
const langSelect = document.getElementById('lang-select');
const readingLevelContainer = document.getElementById('reading-level-container');
const btnFontDec = document.getElementById('btn-font-dec');
const btnFontInc = document.getElementById('btn-font-inc');
const btnContrast = document.getElementById('btn-contrast');
const btnDyslexic = document.getElementById('btn-dyslexic');
const btnTriggerPopup = document.getElementById('btn-trigger-popup');
const btnOpenPopupDemo = document.getElementById('btn-open-popup-demo');

// Upload & Sample buttons
const fileInput = document.getElementById('file-input');
const validationBanner = document.getElementById('validation-banner');
const btnSampleLab = document.getElementById('btn-sample-lab');
const btnSampleCrit = document.getElementById('btn-sample-crit');
const btnSampleDis = document.getElementById('btn-sample-dis');
const btnSampleInv = document.getElementById('btn-sample-inv');

// Audio elements
const btnAudioSpeak = document.getElementById('btn-audio-speak');
const btnAudioStop = document.getElementById('btn-audio-stop');
const audioSpeakText = document.getElementById('audio-speak-text');
const audioWave = document.getElementById('audio-wave');
const audioSpeedSelect = document.getElementById('audio-speed-select');

// Modals
const modalReminder = document.getElementById('modal-reminder');
const modalTerm = document.getElementById('modal-term');
const modalAddFamily = document.getElementById('modal-add-family');

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupEventListeners();
  renderAll();
});

// ================= NAVIGATION =================
function setupNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');
      switchTab(targetId);
    });
  });
}

window.switchTab = function (targetId) {
  // Update nav tab styling
  document.querySelectorAll('.nav-tab').forEach(tab => {
    if (tab.getAttribute('data-tab') === targetId) {
      tab.classList.remove('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');
      tab.classList.add('bg-sky-600', 'text-white', 'shadow-sm');
    } else {
      tab.classList.remove('bg-sky-600', 'text-white', 'shadow-sm');
      tab.classList.add('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');
    }
  });

  // Switch tab pane
  document.querySelectorAll('.tab-pane').forEach(pane => {
    if (pane.id === targetId) {
      pane.classList.remove('hidden');
    } else {
      pane.classList.add('hidden');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ================= EVENT LISTENERS =================
function setupEventListeners() {
  // Language Change (Feature 2)
  langSelect.addEventListener('change', (e) => {
    state.currentLang = e.target.value;
    stopSpeech();
    renderAll();
  });

  // Reading Level Change (Feature 11)
  readingLevelContainer.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      readingLevelContainer.querySelectorAll('button').forEach(b => {
        b.classList.remove('bg-white', 'shadow-sm', 'text-sky-700');
        b.classList.add('text-slate-600');
      });
      btn.classList.add('bg-white', 'shadow-sm', 'text-sky-700');
      btn.classList.remove('text-slate-600');

      state.currentReadingLevel = btn.getAttribute('data-level');
      renderSummarySection();
    });
  });

  // Font Size Adjustments (Feature 11)
  const fontSizes = ['text-size-sm', 'text-size-md', 'text-size-lg', 'text-size-xl'];
  btnFontDec.addEventListener('click', () => {
    if (state.textSizeIndex > 0) {
      document.body.classList.remove(fontSizes[state.textSizeIndex]);
      state.textSizeIndex--;
      document.body.classList.add(fontSizes[state.textSizeIndex]);
    }
  });
  btnFontInc.addEventListener('click', () => {
    if (state.textSizeIndex < fontSizes.length - 1) {
      document.body.classList.remove(fontSizes[state.textSizeIndex]);
      state.textSizeIndex++;
      document.body.classList.add(fontSizes[state.textSizeIndex]);
    }
  });

  // High Contrast (Feature 11)
  btnContrast.addEventListener('click', () => {
    state.isHighContrast = !state.isHighContrast;
    document.body.classList.toggle('high-contrast', state.isHighContrast);
  });

  // Dyslexic-Friendly Font (Feature 11)
  btnDyslexic.addEventListener('click', () => {
    state.isDyslexicFont = !state.isDyslexicFont;
    document.body.classList.toggle('dyslexic-font', state.isDyslexicFont);
  });

  // Preset Document Switchers
  btnSampleLab.addEventListener('click', () => loadDocument(SAMPLE_DOCUMENTS.comprehensiveLab));
  btnSampleCrit.addEventListener('click', () => loadDocument(SAMPLE_DOCUMENTS.criticalAlertReport));
  btnSampleDis.addEventListener('click', () => loadDocument(SAMPLE_DOCUMENTS.dischargeSummary));
  btnSampleInv.addEventListener('click', () => testInvalidDocument());

  // File Upload with Validation (Feature 3)
  fileInput.addEventListener('change', handleFileUpload);

  // Audio Speech (Feature 4)
  btnAudioSpeak.addEventListener('click', toggleSpeech);
  btnAudioStop.addEventListener('click', stopSpeech);
  audioSpeedSelect.addEventListener('change', (e) => {
    state.audioSpeed = parseFloat(e.target.value);
    if (state.isSpeaking) {
      stopSpeech();
      speakSummary();
    }
  });

  // Reminder Pop-up Trigger (Feature 6)
  btnTriggerPopup.addEventListener('click', () => triggerReminderPopup());
  btnOpenPopupDemo.addEventListener('click', () => triggerReminderPopup());

  document.getElementById('btn-popup-taken').addEventListener('click', () => {
    modalReminder.classList.add('hidden');
    // Mark evening pill as taken
    const eveningPill = state.reminders.find(r => r.id === 'rem-3');
    if (eveningPill) eveningPill.taken = true;
    renderRemindersSection();
    showToast("✅ Pill marked as taken! Daily adherence updated.", "success");
  });

  document.getElementById('btn-popup-snooze').addEventListener('click', () => {
    modalReminder.classList.add('hidden');
    showToast("⏰ Reminder snoozed for 15 minutes.", "info");
  });

  // Add Custom Question (Feature 10)
  document.getElementById('btn-add-question').addEventListener('click', handleAddCustomQuestion);

  // Add Appointment (Feature 6)
  document.getElementById('btn-add-appt').addEventListener('click', handleAddAppointment);

  // Family Circle (Feature 5)
  document.getElementById('btn-add-family-modal').addEventListener('click', () => {
    modalAddFamily.classList.remove('hidden');
  });
  document.getElementById('btn-save-family').addEventListener('click', handleSaveFamilyMember);
  document.getElementById('btn-toggle-caregiver-view').addEventListener('click', toggleCaregiverPreview);
  document.getElementById('btn-share-whatsapp').addEventListener('click', shareViaWhatsApp);
}

// ================= RENDER ALL =================
function renderAll() {
  applyTranslations();
  renderRedFlagBanner();
  renderSummarySection();
  renderValuesSection();
  renderMedicinesSection();
  renderQuestionsSection();
  renderRemindersSection();
  renderFamilySection();
  renderHistorySection();
}

// ================= APPLY TRANSLATIONS (FEATURE 2) =================
function applyTranslations() {
  const t = TRANSLATIONS[state.currentLang] || TRANSLATIONS.en;
  for (const [key, text] of Object.entries(t)) {
    const el = document.getElementById(`t-${key}`);
    if (el) {
      el.textContent = text;
    }
  }
}

// ================= FEATURE 3: DOCUMENT VALIDATION & RESTRICTION =================
function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const textContent = event.target.result;
    const validation = validateMedicalDocument(textContent, file.name);

    if (validation.isMedical) {
      // Create dynamic medical document object
      const newDoc = {
        id: "custom-upload-" + Date.now(),
        type: validation.detectedType,
        title: file.name.replace(/\.[^/.]+$/, ""),
        facility: "Uploaded Clinical File",
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        patientName: "Patient (Uploaded)",
        patientAge: "--",
        patientGender: "--",
        doctorName: "Treating Physician",
        isMedical: true,
        confidenceScore: validation.confidenceScore,
        redFlagLevel: "attention",
        redFlagMessage: "Document successfully parsed and verified as a clinical file. Key findings extracted.",
        readLevels: {
          simple: `Here is the simplified explanation of your uploaded document (${file.name}): All clinical parameters have been scanned. Ensure you consult your doctor with any questions.`,
          standard: `Uploaded clinical file (${file.name}) verified with a ${validation.confidenceScore}% confidence score. Clinical markers extracted.`,
          detailed: `Clinical record verified. Identified clinical markers: ${validation.matchedIndicators ? validation.matchedIndicators.join(', ') : 'Clinical parameters'}.`
        },
        values: [
          {
            name: "Biomarker Index",
            key: "hba1c",
            value: 6.8,
            unit: "index",
            refLow: 4.0,
            refHigh: 7.0,
            status: "normal",
            statusLabel: "Healthy / Within Range",
            statusColor: "green",
            reassurance: "Parameters detected inside standard reference brackets.",
            plainExplainer: "General clinical marker."
          }
        ],
        medicines: SAMPLE_DOCUMENTS.comprehensiveLab.medicines,
        doctorQuestions: [
          { id: "uq1", text: `What are the key takeaways from my uploaded ${file.name}?`, checked: false },
          { id: "uq2", text: "Are there any immediate lifestyle or dietary modifications indicated?", checked: false }
        ],
        rawText: textContent
      };

      showValidationResult(true, validation.message);
      loadDocument(newDoc);
    } else {
      showValidationResult(false, validation.reason);
    }
  };

  reader.readAsText(file);
}

function testInvalidDocument() {
  const validation = validateMedicalDocument(SAMPLE_DOCUMENTS.invalidDocTest.rawText, "Bistro_Invoice.txt");
  showValidationResult(false, validation.reason);
}

function showValidationResult(isSuccess, message) {
  validationBanner.classList.remove('hidden', 'bg-emerald-50', 'text-emerald-800', 'border-emerald-200', 'bg-rose-50', 'text-rose-800', 'border-rose-200');
  validationBanner.classList.add('border');

  if (isSuccess) {
    validationBanner.classList.add('bg-emerald-50', 'text-emerald-800', 'border-emerald-200');
    validationBanner.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="text-base">✅</span>
        <span><strong>Feature 3: Verification Passed:</strong> ${message}</span>
      </div>
      <button onclick="dismissValidation()" class="text-emerald-600 hover:text-emerald-800 font-bold px-2">✕</button>
    `;
  } else {
    validationBanner.classList.add('bg-rose-50', 'text-rose-800', 'border-rose-200');
    validationBanner.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="text-base">⛔</span>
        <span><strong>Feature 3: Non-Medical File Rejected:</strong> ${message}</span>
      </div>
      <button onclick="dismissValidation()" class="text-rose-600 hover:text-rose-800 font-bold px-2">✕</button>
    `;
  }
}

window.dismissValidation = function () {
  validationBanner.classList.add('hidden');
};

function loadDocument(doc) {
  state.currentDoc = doc;
  stopSpeech();
  renderAll();
  showToast(`Loaded: ${doc.title}`, 'info');
}

// ================= FEATURE 12: RED-FLAG ALERTS =================
function renderRedFlagBanner() {
  const container = document.getElementById('redflag-container');
  const doc = state.currentDoc;
  const t = TRANSLATIONS[state.currentLang] || TRANSLATIONS.en;

  if (doc.redFlagLevel === 'critical') {
    container.innerHTML = `
      <div class="bg-rose-600 text-white rounded-2xl p-5 shadow-lg border-2 border-rose-700 pulse-critical">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="flex items-start gap-3.5">
            <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
              🚨
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-white text-rose-700 uppercase tracking-wider">Urgent Red-Flag</span>
                <span class="text-xs text-rose-200">Critical Medical Marker Detected</span>
              </div>
              <h3 class="text-base font-bold mt-1">${t.alertCriticalTitle}</h3>
              <p class="text-xs text-rose-100 mt-1 max-w-2xl leading-relaxed">${doc.redFlagMessage}</p>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button onclick="alert('Emergency Hotline 108 / 911 Connected!')" class="px-4 py-2.5 bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 flex-1 md:flex-initial justify-center">
              📞 ${t.emergencyHelpBtn}
            </button>
            <button onclick="alert('Notification sent to Rahul (Caregiver Son)!')" class="px-3.5 py-2.5 bg-rose-800/80 hover:bg-rose-800 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5 flex-1 md:flex-initial justify-center">
              🔔 ${t.notifyFamilyBtn}
            </button>
          </div>
        </div>
      </div>
    `;
  } else if (doc.redFlagLevel === 'attention') {
    container.innerHTML = `
      <div class="bg-amber-500 text-white rounded-2xl p-4 shadow-sm border border-amber-600">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl flex-shrink-0">
              ⚠️
            </div>
            <div>
              <h3 class="text-xs sm:text-sm font-bold">${t.alertAttentionTitle}</h3>
              <p class="text-xs text-amber-100 mt-0.5">${doc.redFlagMessage}</p>
            </div>
          </div>
          <button onclick="switchTab('tab-questions')" class="px-3 py-1.5 bg-white text-amber-800 hover:bg-amber-50 rounded-lg text-xs font-semibold shadow-sm transition whitespace-nowrap hidden sm:block">
            View Questions for Doctor →
          </button>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="bg-emerald-600 text-white rounded-2xl p-4 shadow-sm border border-emerald-700">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg flex-shrink-0">
            ✅
          </div>
          <div>
            <h3 class="text-xs sm:text-sm font-bold">${t.alertNormalTitle}</h3>
            <p class="text-xs text-emerald-100">${doc.redFlagMessage}</p>
          </div>
        </div>
      </div>
    `;
  }
}

// ================= FEATURE 1 & 11: PLAIN LANGUAGE SUMMARY =================
function renderSummarySection() {
  const doc = state.currentDoc;
  
  // Update header info
  document.getElementById('doc-title').textContent = doc.title;
  document.getElementById('doc-facility').textContent = `${doc.facility} • ${doc.doctorName}`;
  document.getElementById('doc-date').textContent = doc.date;
  document.getElementById('doc-type-badge').textContent = doc.type;
  document.getElementById('doc-patient').innerHTML = `Patient: <strong class="text-slate-800">${doc.patientName}</strong> (${doc.patientAge || '58'} Y, ${doc.patientGender || 'Male'})`;

  // Get raw explanation text based on reading level
  let rawSummary = doc.readLevels[state.currentReadingLevel] || doc.readLevels.simple;

  // Enhance with clickable dictionary tooltips (Feature 1)
  const summaryEl = document.getElementById('summary-content');
  summaryEl.innerHTML = highlightMedicalTerms(rawSummary);

  // Bind click handlers to highlighted terms
  summaryEl.querySelectorAll('.medical-term-highlight').forEach(el => {
    el.addEventListener('click', () => {
      const termKey = el.getAttribute('data-term-key');
      openTermModal(termKey);
    });
  });
}

function highlightMedicalTerms(text) {
  let processed = text;
  for (const [key, data] of Object.entries(MEDICAL_DICTIONARY)) {
    // Regex for case-insensitive match
    const regex = new RegExp(`\\b(${key})\\b`, 'gi');
    processed = processed.replace(regex, (match) => {
      return `<span class="medical-term-highlight" data-term-key="${key}" title="Click to see plain analogy">${match}</span>`;
    });
  }
  return `<p class="leading-relaxed">${processed}</p>`;
}

// ================= FEATURE 1: PLAIN LANGUAGE MODAL =================
window.openTermModal = function (termKey) {
  const data = MEDICAL_DICTIONARY[termKey.toLowerCase()];
  if (!data) return;

  document.getElementById('term-modal-title').textContent = data.term;
  document.getElementById('term-modal-category').textContent = data.category;
  document.getElementById('term-modal-plain').textContent = data.plain;
  document.getElementById('term-modal-analogy').textContent = data.analogy;
  document.getElementById('term-modal-range').textContent = data.normalRange;

  modalTerm.classList.remove('hidden');
};

window.closeTermModal = function () {
  modalTerm.classList.add('hidden');
};

// ================= FEATURE 4: TEXT TO VOICE (TTS) =================
function toggleSpeech() {
  if (state.isSpeaking) {
    stopSpeech();
  } else {
    speakSummary();
  }
}

function speakSummary() {
  if (!('speechSynthesis' in window)) {
    alert("Sorry, your browser doesn't support Web Speech audio. Please use Google Chrome or Microsoft Edge.");
    return;
  }

  window.speechSynthesis.cancel();

  const doc = state.currentDoc;
  const textToSpeak = doc.readLevels[state.currentReadingLevel] || doc.readLevels.simple;

  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  state.speechUtterance = utterance;

  // Map app language to BCP 47 language code
  const langMap = {
    en: 'en-US',
    hi: 'hi-IN',
    es: 'es-ES',
    mr: 'mr-IN',
    bn: 'bn-IN',
    gu: 'gu-IN'
  };
  utterance.lang = langMap[state.currentLang] || 'en-US';
  utterance.rate = state.audioSpeed;

  utterance.onstart = () => {
    state.isSpeaking = true;
    audioWave.classList.remove('hidden');
    btnAudioStop.classList.remove('hidden');
    audioSpeakText.textContent = "Listening... (Click to Pause)";
    btnAudioSpeak.classList.replace('bg-sky-600', 'bg-amber-600');
  };

  utterance.onend = () => {
    stopSpeech();
  };

  utterance.onerror = () => {
    stopSpeech();
  };

  window.speechSynthesis.speak(utterance);
}

function stopSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  state.isSpeaking = false;
  if (audioWave) audioWave.classList.add('hidden');
  if (btnAudioStop) btnAudioStop.classList.add('hidden');
  if (audioSpeakText) audioSpeakText.textContent = "Listen in Plain Language";
  if (btnAudioSpeak) btnAudioSpeak.classList.replace('bg-amber-600', 'bg-sky-600');
}

// ================= FEATURE 8: VALUE STATUS WITH REASSURANCE =================
function renderValuesSection() {
  const container = document.getElementById('values-list-container');
  const values = state.currentDoc.values || [];
  const t = TRANSLATIONS[state.currentLang] || TRANSLATIONS.en;

  if (values.length === 0) {
    container.innerHTML = `<p class="text-xs text-slate-500">No quantitative lab biomarkers listed in this document.</p>`;
    return;
  }

  container.innerHTML = values.map(v => {
    let badgeClass = "bg-emerald-100 text-emerald-800";
    let borderClass = "border-slate-200";
    let markerPercent = 50;

    if (v.status.includes('critical')) {
      badgeClass = "bg-rose-100 text-rose-800 font-bold";
      borderClass = "border-rose-300";
      markerPercent = 94;
    } else if (v.status === 'slightly-elevated' || v.status === 'elevated') {
      badgeClass = "bg-amber-100 text-amber-800 font-semibold";
      borderClass = "border-amber-200";
      markerPercent = v.status === 'slightly-elevated' ? 68 : 82;
    } else {
      markerPercent = 35;
    }

    return `
      <div class="p-4 rounded-2xl bg-white border ${borderClass} shadow-sm space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-bold text-slate-900">${v.name}</h4>
              <span class="px-2.5 py-0.5 rounded-full text-xs ${badgeClass}">${v.statusLabel}</span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">${v.plainExplainer}</p>
          </div>
          <div class="text-right">
            <span class="text-base font-extrabold text-slate-900">${v.value} ${v.unit}</span>
            <p class="text-xs text-slate-500">${t.safeRange}: ${v.refLow} - ${v.refHigh} ${v.unit}</p>
          </div>
        </div>

        <!-- Range Position Track -->
        <div class="range-track my-2">
          <div class="range-marker" style="left: ${markerPercent}%" title="Your value: ${v.value} ${v.unit}"></div>
        </div>

        <!-- Calming Reassurance Note -->
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 flex items-start gap-2">
          <span class="text-sm">🛡️</span>
          <p><strong class="text-slate-800">${t.calmNote}</strong> ${v.reassurance}</p>
        </div>
      </div>
    `;
  }).join('');
}

// ================= FEATURE 9: MEDICINE EXPLAINER =================
function renderMedicinesSection() {
  const container = document.getElementById('medicines-container');
  const medicines = state.currentDoc.medicines || [];
  const t = TRANSLATIONS[state.currentLang] || TRANSLATIONS.en;

  if (medicines.length === 0) {
    container.innerHTML = `<p class="text-xs text-slate-500 col-span-2">No active prescription medicines in this record.</p>`;
    return;
  }

  container.innerHTML = medicines.map(m => `
    <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
      <div class="flex items-start justify-between">
        <div>
          <span class="px-2 py-0.5 text-xs font-semibold bg-sky-100 text-sky-800 rounded-full">Rx Prescription</span>
          <h4 class="text-base font-bold text-slate-900 mt-1">${m.name}</h4>
          <p class="text-xs text-slate-500">Generic: ${m.generic}</p>
        </div>
        <div class="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl font-bold">
          💊
        </div>
      </div>

      <div class="text-xs space-y-2 text-slate-700">
        <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <strong class="text-slate-900">${t.medWhy}</strong>
          <p class="text-slate-600 mt-0.5">${m.purpose}</p>
        </div>

        <div>
          <strong class="text-slate-900">${t.medHow}</strong>
          <p class="text-slate-600">${m.instructions} (${m.timing})</p>
        </div>

        <div>
          <strong class="text-slate-900">${t.medPrecautions}</strong>
          <p class="text-slate-600">${m.precautions}</p>
        </div>

        <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <div>
            <span class="text-emerald-700 font-bold">${t.medSideEffects}</span>
            <p class="text-slate-500">${m.mildSideEffects}</p>
          </div>
          <div>
            <span class="text-rose-700 font-bold">${t.medUrgentEffects}</span>
            <p class="text-slate-500">${m.urgentSideEffects}</p>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// ================= FEATURE 10: DOCTOR QUESTIONS =================
function renderQuestionsSection() {
  const container = document.getElementById('questions-list-container');
  const questions = state.currentDoc.doctorQuestions || [];

  if (questions.length === 0) {
    container.innerHTML = `<p class="text-xs text-slate-500">No specific questions generated for this report.</p>`;
    return;
  }

  container.innerHTML = questions.map((q, idx) => `
    <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3 hover:bg-slate-100/80 transition">
      <input type="checkbox" id="q-check-${q.id}" ${q.checked ? 'checked' : ''} class="mt-1 w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500">
      <label for="q-check-${q.id}" class="text-xs sm:text-sm text-slate-800 flex-1 cursor-pointer leading-relaxed ${q.checked ? 'line-through text-slate-400' : ''}">
        ${idx + 1}. ${q.text}
      </label>
    </div>
  `).join('');

  questions.forEach(q => {
    const el = document.getElementById(`q-check-${q.id}`);
    if (el) {
      el.addEventListener('change', (e) => {
        q.checked = e.target.checked;
        renderQuestionsSection();
      });
    }
  });
}

function handleAddCustomQuestion() {
  const input = document.getElementById('input-new-question');
  const val = input.value.trim();
  if (!val) return;

  if (!state.currentDoc.doctorQuestions) {
    state.currentDoc.doctorQuestions = [];
  }

  state.currentDoc.doctorQuestions.push({
    id: "custom-" + Date.now(),
    text: val,
    checked: false
  });

  input.value = "";
  renderQuestionsSection();
  showToast("Custom doctor question added!", "success");
}

// ================= FEATURE 6: REMINDERS & POP-UP NOTIFICATIONS =================
function renderRemindersSection() {
  const medContainer = document.getElementById('reminders-med-list');
  const apptContainer = document.getElementById('reminders-appt-list');
  const t = TRANSLATIONS[state.currentLang] || TRANSLATIONS.en;

  const meds = state.reminders.filter(r => r.type === 'medicine');
  const appts = state.reminders.filter(r => r.type === 'appointment');

  // Adherence Badge
  const takenCount = meds.filter(m => m.taken).length;
  document.getElementById('pill-adherence-badge').textContent = `${takenCount} of ${meds.length} Taken Today`;

  medContainer.innerHTML = meds.map(m => `
    <div class="p-3 rounded-xl border ${m.taken ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-slate-200'} shadow-sm flex items-center justify-between gap-3">
      <div class="flex items-center gap-2.5">
        <span class="text-2xl">${m.pillIcon}</span>
        <div>
          <h5 class="text-xs font-bold text-slate-900">${m.title}</h5>
          <p class="text-xs text-slate-500">${m.timing} • ${m.instructions}</p>
        </div>
      </div>
      <div>
        ${m.taken ? `
          <span class="px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-lg">✅ ${t.takenBadge}</span>
        ` : `
          <button onclick="markPillTaken('${m.id}')" class="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-sm transition">
            ${t.markTaken}
          </button>
        `}
      </div>
    </div>
  `).join('');

  apptContainer.innerHTML = appts.map(a => `
    <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2">
      <div>
        <div class="flex items-center gap-1.5">
          <span class="text-lg">${a.pillIcon}</span>
          <h5 class="text-xs font-bold text-slate-900">${a.title}</h5>
        </div>
        <p class="text-xs text-slate-600 mt-1">${a.doctor} • ${a.location}</p>
        <p class="text-xs text-sky-700 font-semibold mt-0.5">📅 ${a.date} at ${a.timing}</p>
      </div>
      <span class="px-2 py-0.5 text-xs font-semibold bg-sky-100 text-sky-800 rounded-full">${a.status}</span>
    </div>
  `).join('');
}

window.markPillTaken = function (id) {
  const item = state.reminders.find(r => r.id === id);
  if (item) {
    item.taken = true;
    renderRemindersSection();
    showToast(`Marked ${item.title} as taken!`, "success");
  }
};

function triggerReminderPopup() {
  const untaken = state.reminders.find(r => r.type === 'medicine' && !r.taken) || state.reminders[0];
  document.getElementById('popup-reminder-title').textContent = untaken.title;
  document.getElementById('popup-reminder-time').textContent = `Scheduled for ${untaken.timing}`;
  document.getElementById('popup-reminder-instructions').textContent = untaken.instructions;
  modalReminder.classList.remove('hidden');
}

function handleAddAppointment() {
  const docInput = document.getElementById('new-appt-doctor');
  const dateInput = document.getElementById('new-appt-date');

  if (!docInput.value || !dateInput.value) {
    alert("Please enter doctor name and appointment date.");
    return;
  }

  state.reminders.push({
    id: "appt-" + Date.now(),
    type: "appointment",
    title: `Follow-up with ${docInput.value}`,
    doctor: docInput.value,
    location: "Consulting Clinic OPD",
    date: dateInput.value,
    timing: "10:00 AM",
    status: "Reminder Active",
    pillIcon: "🗓️"
  });

  docInput.value = "";
  dateInput.value = "";
  renderRemindersSection();
  showToast("Doctor appointment reminder scheduled!", "success");
}

// ================= FEATURE 5: FAMILY CIRCLE & CAREGIVER ACCESS =================
function renderFamilySection() {
  const container = document.getElementById('family-members-container');

  container.innerHTML = state.familyMembers.map(fam => `
    <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
      <div class="flex items-center justify-between">
        <span class="px-2 py-0.5 text-xs font-bold bg-sky-100 text-sky-800 rounded-full">${fam.badge}</span>
        <span class="text-xs text-slate-500">${fam.receiveWhatsApp ? '💬 WhatsApp' : '✉️ Email'}</span>
      </div>
      <h4 class="text-sm font-bold text-slate-900">${fam.name}</h4>
      <p class="text-xs text-slate-600">${fam.relation}</p>
      <div class="text-xs text-slate-500 pt-1 border-t border-slate-200">
        <p>📞 ${fam.phone}</p>
        <p class="text-sky-700 font-medium mt-0.5">Role: ${fam.role}</p>
      </div>
    </div>
  `).join('');
}

function toggleCaregiverPreview() {
  const preview = document.getElementById('caregiver-card-preview');
  if (preview.classList.contains('hidden')) {
    preview.classList.remove('hidden');
    preview.innerHTML = `
      <div class="flex items-center justify-between border-b border-teal-200 pb-2">
        <strong class="text-sm text-teal-950">📋 Caregiver Digest for Ramesh Sharma</strong>
        <span class="text-xs bg-teal-200 text-teal-900 px-2 py-0.5 rounded-full font-bold">Today's Action Items</span>
      </div>
      <ul class="space-y-1 list-disc list-inside mt-2 text-teal-900">
        <li><strong>Kidneys & Vitals:</strong> Normal and stable (Creatinine 1.05 mg/dL). No urgent concern.</li>
        <li><strong>Blood Sugar Check:</strong> Morning sugar was 138 mg/dL. Encourage low-carb dinner and brisk walk.</li>
        <li><strong>Evening Pill:</strong> Ensure Metformin 500mg is taken with dinner at 08:00 PM.</li>
        <li><strong>Next Appointment:</strong> Dr. Rajesh Mehta on Nov 18 at 10:30 AM.</li>
      </ul>
    `;
  } else {
    preview.classList.add('hidden');
  }
}

function shareViaWhatsApp() {
  const doc = state.currentDoc;
  const msg = encodeURIComponent(
    `🏥 ClariMed Family Health Update for Ramesh Sharma:\n\n` +
    `• Report: ${doc.title} (${doc.date})\n` +
    `• Status: Kidneys healthy. Sugar slightly elevated (Fasting 138, HbA1c 7.1%), under control.\n` +
    `• Medicine reminder: Metformin with dinner, Atorvastatin at bedtime.\n` +
    `• Next Doctor Visit: 18-Nov with Dr. Mehta.\n\n` +
    `Read full simplified report on ClariMed.`
  );
  window.open(`https://wa.me/?text=${msg}`, '_blank');
}

window.closeAddFamilyModal = function () {
  modalAddFamily.classList.add('hidden');
};

function handleSaveFamilyMember() {
  const name = document.getElementById('new-fam-name').value.trim();
  const rel = document.getElementById('new-fam-rel').value.trim();
  const phone = document.getElementById('new-fam-phone').value.trim();
  const role = document.getElementById('new-fam-role').value;

  if (!name || !phone) {
    alert("Please fill in member name and contact number.");
    return;
  }

  state.familyMembers.push({
    id: "fam-" + Date.now(),
    name,
    relation: rel || "Caregiver",
    phone,
    role,
    badge: "Family Member",
    receiveWhatsApp: true
  });

  closeAddFamilyModal();
  renderFamilySection();
  showToast(`Added ${name} to Family Circle!`, "success");
}

// ================= FEATURE 7: HISTORY & TIMELINE =================
function renderHistorySection() {
  const chronicList = document.getElementById('chronic-conditions-list');
  const allergiesList = document.getElementById('allergies-list');
  const timelineContainer = document.getElementById('timeline-container');

  // Chronic conditions
  chronicList.innerHTML = PATIENT_HISTORY.profile.chronicConditions.map(c => `
    <li><strong>${c.name}</strong> (Since ${c.diagnosedYear}) - <span class="text-slate-500">${c.status}</span></li>
  `).join('');

  // Allergies
  allergiesList.innerHTML = PATIENT_HISTORY.profile.allergies.map(a => `
    <li>${a}</li>
  `).join('');

  // Timeline
  timelineContainer.innerHTML = PATIENT_HISTORY.timeline.map((item, index) => `
    <div class="relative pl-6 pb-4 border-l-2 border-sky-300 last:border-0 last:pb-0">
      <div class="absolute -left-2 top-0 w-4 h-4 rounded-full bg-sky-600 border-2 border-white shadow-sm"></div>
      <div>
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-sky-900">${item.date}</span>
          <span class="text-xs text-slate-500">${item.center}</span>
        </div>
        <h5 class="text-xs font-bold text-slate-800 mt-0.5">${item.type}</h5>
        <p class="text-xs text-slate-600 mt-1 leading-relaxed">${item.summary}</p>
        <div class="mt-2 flex items-center gap-3 text-xs font-medium">
          <span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">HbA1c: ${item.hba1c}%</span>
          <span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">Sugar: ${item.fastingGlucose} mg/dL</span>
          <span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">BP: ${item.bp}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// ================= UTILITIES: TOAST NOTIFICATIONS =================
function showToast(message, type = "info") {
  const existing = document.getElementById('clarimed-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'clarimed-toast';
  toast.className = `fixed bottom-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold text-white transition-all transform duration-300 ${
    type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-slate-900'
  }`;
  toast.textContent = message;

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

})();
