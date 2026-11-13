// ClariMed - Medical Data, Sample Reports, Dictionary & Presets

export const MEDICAL_DICTIONARY = {
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

export const SAMPLE_DOCUMENTS = {
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

export const PATIENT_HISTORY = {
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

export const FAMILY_CIRCLE = [
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

export const INITIAL_REMINDERS = [
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
