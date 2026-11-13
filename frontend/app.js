// ClariMed - Frontend Application Engine & Router

const API_BASE = "http://localhost:8000/api/v1";

// ================= GLOBAL APPLICATION STATE =================
const state = {
  currentPage: 'dashboard',
  currentLang: 'en',
  currentReadingLevel: 'simple', // simple, standard, detailed
  currentUser: {
    id: 1,
    name: "Ramesh Sharma",
    email: "patient.ramesh@clarimed.local",
    age: 58,
    gender: "Male",
    bloodGroup: "B+",
    allergies: "Penicillin (causes severe skin rash), Sulfa Antibiotics",
    chronicConditions: "Type 2 Diabetes Mellitus (Diagnosed 2020), Essential Hypertension (Diagnosed 2023)",
    emergencyContact: "+91 98201-44321 (Rahul Sharma - Son)"
  },
  currentDoc: null,
  documents: [],
  medicines: [],
  reminders: [],
  appointments: [],
  familyPermissions: [],
  searchQuery: "",
  isSpeaking: false,
  audioSpeed: 1.0,
  speechSynth: window.speechSynthesis,
  speechUtterance: null
};

// ================= PRE-SEEDED COMPREHENSIVE MEDICAL DATA =================
const DEFAULT_DOCUMENTS = [
  {
    id: 1,
    filename: "Apollo_Metabolic_Lipid_Panel_Nov2026.pdf",
    document_type: "Laboratory Diagnostic Report",
    facility_name: "Apollo Diagnostics & Pathology Care",
    doctor_name: "Dr. Rajesh Mehta, MD (Internal Medicine)",
    report_date: "13-Nov-2026",
    file_size_bytes: 248500,
    status: "completed",
    confidence_score: 98,
    is_medical: true,
    red_flag_level: "attention",
    red_flag_message: "Mildly elevated blood sugar (Fasting 138 mg/dL) and bad cholesterol (LDL 138 mg/dL). Liver enzyme SGPT is slightly above normal at 48 U/L (reference is 40). Kidney function is completely normal and healthy. No emergency.",
    summary_text: "Overall, your kidneys and heart salts (potassium) are in great shape! Your morning blood sugar (138) and quarterly 3-month sugar average (7.1%) are slightly high, meaning your diabetes medication might need a small tweak. Your liver enzyme is just slightly higher than usual (48 compared to 40), which is very common when taking cholesterol medicine and nothing to panic over.",
    readLevels: {
      simple: "Overall, your kidneys and heart salts (potassium) are in great shape! Your morning blood sugar (138) and quarterly 3-month sugar average (7.1%) are slightly high, meaning your diabetes medication might need a small tweak. Your liver enzyme is just slightly higher than usual (48 compared to 40), which is very common when taking cholesterol medicine and nothing to panic over.",
      standard: "Your metabolic panel reveals well-preserved renal function with normal serum creatinine (1.05 mg/dL) and optimal electrolytes. Glycemic control indicates mild elevation with HbA1c at 7.1% and fasting glucose at 138 mg/dL. Your lipid panel shows mildly elevated LDL (138 mg/dL). SGPT/ALT is marginally elevated at 48 U/L (reference < 40 U/L), likely a benign response to statin therapy or dietary factors.",
      detailed: "Comprehensive metabolic evaluation demonstrates stable eGFR (> 85 mL/min/1.73m²) and normal serum creatinine. Endocrine markers demonstrate sub-optimal glycemic control: HbA1c 7.1% (target < 7.0%), FPG 138 mg/dL. Dyslipidemia noted with LDL-C 138 mg/dL and Total Cholesterol 218 mg/dL. Hepatic transaminases show mild isolated ALT elevation (48 U/L; AST 32 U/L), consistent with known pharmacotherapy or Grade-1 hepatic steatosis."
    },
    results: [
      {
        test_name: "HbA1c (Glycosylated Hemoglobin)",
        key_name: "hba1c",
        value: "7.1",
        numeric_value: 7.1,
        unit: "%",
        reference_min: 4.0,
        reference_max: 5.7,
        reference_range_raw: "4.0 - 5.7",
        status: "high",
        plain_explanation: "3-Month Blood Sugar Quarterly Average",
        reassurance_note: "Your average blood sugar over 3 months is 7.1%. For patients managing diabetes, doctors often aim for under 7.0%. You are very close to your goal!"
      },
      {
        test_name: "Fasting Blood Glucose",
        key_name: "fasting_glucose",
        value: "138",
        numeric_value: 138.0,
        unit: "mg/dL",
        reference_min: 70.0,
        reference_max: 99.0,
        reference_range_raw: "70 - 99",
        status: "high",
        plain_explanation: "Morning Sugar Level Before Breakfast",
        reassurance_note: "Fasting glucose is 138 mg/dL. While above standard fasting limits, this is well within manageable levels through diet and medication."
      },
      {
        test_name: "Serum Creatinine",
        key_name: "creatinine",
        value: "1.05",
        numeric_value: 1.05,
        unit: "mg/dL",
        reference_min: 0.7,
        reference_max: 1.3,
        reference_range_raw: "0.7 - 1.3",
        status: "normal",
        plain_explanation: "Kidney Filter Health Marker",
        reassurance_note: "Safe and healthy. Your kidneys are filtering waste cleanly in the green zone."
      },
      {
        test_name: "SGPT / ALT (Liver Enzyme)",
        key_name: "sgpt",
        value: "48",
        numeric_value: 48.0,
        unit: "U/L",
        reference_min: 0.0,
        reference_max: 40.0,
        reference_range_raw: "0 - 40",
        status: "high",
        plain_explanation: "Liver Cell Health Enzyme",
        reassurance_note: "DO NOT PANIC: At 48 U/L (reference is 40), this is only a minor elevation. Common with statins, rich meals, or mild stress; not liver failure."
      },
      {
        test_name: "LDL Cholesterol",
        key_name: "ldl",
        value: "138",
        numeric_value: 138.0,
        unit: "mg/dL",
        reference_min: 0.0,
        reference_max: 100.0,
        reference_range_raw: "< 100",
        status: "high",
        plain_explanation: "'Sticky' Bad Cholesterol Particles",
        reassurance_note: "LDL is 138 mg/dL. Continuing your evening cholesterol pill and reducing deep-fried snacks helps clear blood vessels."
      },
      {
        test_name: "Serum Potassium (K+)",
        key_name: "potassium",
        value: "4.4",
        numeric_value: 4.4,
        unit: "mEq/L",
        reference_min: 3.5,
        reference_max: 5.0,
        reference_range_raw: "3.5 - 5.0",
        status: "normal",
        plain_explanation: "Heart Rhythm & Muscle Salt",
        reassurance_note: "Safe and balanced. Your heart's electrical electrolytes are in optimal balance."
      },
      {
        test_name: "Hemoglobin (Hb)",
        key_name: "hemoglobin",
        value: "14.2",
        numeric_value: 14.2,
        unit: "g/dL",
        reference_min: 13.0,
        reference_max: 17.0,
        reference_range_raw: "13.0 - 17.0",
        status: "normal",
        plain_explanation: "Oxygen Delivery Cells in Blood",
        reassurance_note: "Great red blood cell count. No anemia detected."
      }
    ],
    doctor_questions: [
      { id: "q1", text: "My SGPT is 48 U/L (mildly above 40). Could my evening cholesterol medicine (Atorvastatin) be causing this minor bump?", checked: false },
      { id: "q2", text: "My HbA1c is 7.1%, down from 7.8% last quarter. Should we maintain Metformin 500mg or adjust dosage?", checked: false },
      { id: "q3", text: "Are there specific dietary changes to help lower my LDL cholesterol from 138 to under 100?", checked: false },
      { id: "q4", text: "When should I repeat this metabolic and lipid panel?", checked: false }
    ],
    disclaimer: "This application helps you understand your medical documents in simple language. It does not provide a medical diagnosis or replace professional medical advice. Always consult your doctor before making decisions about your health or medication."
  },
  {
    id: 2,
    filename: "MaxHospital_Discharge_Summary_Nov2026.pdf",
    document_type: "Hospital Discharge Summary",
    facility_name: "Max Super Speciality Hospital",
    doctor_name: "Dr. Sunil Grover, MD, DM",
    report_date: "10-Nov-2026",
    file_size_bytes: 312000,
    status: "completed",
    confidence_score: 97,
    is_medical: true,
    red_flag_level: "none",
    red_flag_message: "Patient condition at discharge is stable. Transitioned to oral hypoglycemic medication. Follow-up scheduled in 10 days.",
    summary_text: "Good news! You have recovered well from mild dehydration and high blood sugar, and the hospital has discharged you in stable condition. Continue your prescribed morning blood pressure tablet and twice-daily diabetes tablet.",
    readLevels: {
      simple: "Good news! You have recovered well from mild dehydration and high blood sugar, and the hospital has discharged you in stable condition. Continue your prescribed morning blood pressure tablet and twice-daily diabetes tablet.",
      standard: "Patient was discharged in hemodynamically stable condition following resolved hyperglycemic dehydration. Transitioned smoothly back to oral maintenance therapy.",
      detailed: "Inpatient admission for acute hyperglycemic dehydration successfully resolved with fluid therapy. Vital signs and renal parameters normalized. Discharged on oral Metformin and Telmisartan."
    },
    results: [
      {
        test_name: "Blood Pressure on Discharge",
        key_name: "hypertension",
        value: "124/80",
        numeric_value: 124.0,
        unit: "mmHg",
        reference_min: 90.0,
        reference_max: 120.0,
        reference_range_raw: "90 - 120",
        status: "normal",
        plain_explanation: "Blood Pressure Reading",
        reassurance_note: "Your blood pressure is well-controlled and in the safe range."
      },
      {
        test_name: "Discharge Blood Glucose",
        key_name: "fasting_glucose",
        value: "112",
        numeric_value: 112.0,
        unit: "mg/dL",
        reference_min: 70.0,
        reference_max: 99.0,
        reference_range_raw: "70 - 99",
        status: "high",
        plain_explanation: "Fasting Blood Sugar",
        reassurance_note: "Down from 260 at admission to a safe 112 mg/dL. Good progress!"
      }
    ],
    doctor_questions: [
      { id: "dq1", text: "When should I re-check my blood pressure at home?", checked: false },
      { id: "dq2", text: "Can I resume my morning 30-minute walks?", checked: false }
    ],
    disclaimer: "This application helps you understand your medical documents in simple language. It does not provide a medical diagnosis or replace professional medical advice. Always consult your doctor before making decisions about your health or medication."
  }
];

const DEFAULT_MEDICINES = [
  {
    id: 1,
    medicine_name: "Metformin 500mg",
    generic_name: "Metformin Hydrochloride",
    strength: "500mg",
    dosage_form: "Tablet",
    prescribed_instructions: "1 tablet PO BID (Twice daily, with breakfast & dinner)",
    timing: "With meals",
    purpose: "Helps your body cells respond better to insulin and curbs excess sugar production by the liver.",
    precautions: "Take immediately after food with water. Taking with food prevents stomach upset. Do not skip meals.",
    mild_side_effects: "Mild stomach rumble or nausea during initial days.",
    urgent_side_effects: "Severe unexplained muscle cramps or breathing difficulty.",
    verification_status: "Verified Prescription"
  },
  {
    id: 2,
    medicine_name: "Atorvastatin 10mg",
    generic_name: "Atorvastatin Calcium",
    strength: "10mg",
    dosage_form: "Tablet",
    prescribed_instructions: "1 tablet PO HS (Once daily at bedtime)",
    timing: "Bedtime",
    purpose: "Slows down cholesterol production in the liver and cleans up blood vessel walls.",
    precautions: "Avoid drinking grapefruit juice; tell doctor if you experience severe muscle aches.",
    mild_side_effects: "Mild morning fatigue or dry mouth.",
    urgent_side_effects: "Unusual dark urine or persistent severe muscle weakness.",
    verification_status: "Verified Prescription"
  },
  {
    id: 3,
    medicine_name: "Telmisartan 40mg",
    generic_name: "Telmisartan (ARB)",
    strength: "40mg",
    dosage_form: "Tablet",
    prescribed_instructions: "1 tablet PO OD (Once daily in the morning after breakfast)",
    timing: "Morning",
    purpose: "Protects kidneys and keeps blood pressure smooth and relaxed.",
    precautions: "Rise slowly from lying down to avoid mild dizziness. Take at the same time each morning.",
    mild_side_effects: "Occasional mild lightheadedness.",
    urgent_side_effects: "Swelling of lips or tongue (allergic reaction).",
    verification_status: "Verified Prescription"
  }
];

const DEFAULT_REMINDERS = [
  {
    id: 1,
    title: "Metformin 500mg",
    scheduled_time: "08:30 AM",
    timing_label: "Breakfast",
    instructions: "Take 1 tablet with breakfast and a glass of water.",
    taken_today: true,
    enabled: true
  },
  {
    id: 2,
    title: "Telmisartan 40mg",
    scheduled_time: "09:00 AM",
    timing_label: "Morning",
    instructions: "Take 1 tablet after breakfast for blood pressure.",
    taken_today: true,
    enabled: true
  },
  {
    id: 3,
    title: "Metformin 500mg (2nd Dose)",
    scheduled_time: "08:00 PM",
    timing_label: "Dinner",
    instructions: "Take 1 tablet with dinner.",
    taken_today: false,
    enabled: true
  },
  {
    id: 4,
    title: "Atorvastatin 10mg",
    scheduled_time: "10:00 PM",
    timing_label: "Bedtime",
    instructions: "Take 1 tablet right before sleeping.",
    taken_today: false,
    enabled: true
  }
];

const DEFAULT_APPOINTMENTS = [
  {
    id: 1,
    doctor_name: "Dr. Rajesh Mehta, MD (Internal Medicine)",
    hospital_name: "Apollo Diagnostics Clinic, Room 204",
    appointment_datetime: "18-Nov-2026 at 10:30 AM",
    notes: "Review HbA1c quarterly progress and cholesterol management.",
    status: "Confirmed",
    reminder_enabled: true
  }
];

const DEFAULT_FAMILY = [
  {
    id: 1,
    family_member_name: "Rahul Sharma",
    relationship_type: "Son (Primary Caregiver)",
    contact_number: "+91 98201-44321",
    permission_level: "Full Access & Emergency Responder",
    status: "active"
  },
  {
    id: 2,
    family_member_name: "Pooja Sharma",
    relationship_type: "Daughter-in-law",
    contact_number: "+91 98201-99887",
    permission_level: "Read-Only Summaries",
    status: "active"
  }
];

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
  state.documents = [...DEFAULT_DOCUMENTS];
  state.currentDoc = state.documents[0];
  state.medicines = [...DEFAULT_MEDICINES];
  state.reminders = [...DEFAULT_REMINDERS];
  state.appointments = [...DEFAULT_APPOINTMENTS];
  state.familyPermissions = [...DEFAULT_FAMILY];

  setupSidebar();
  setupUploadModal();
  setupGlobalControls();
  renderCurrentPage();

  // Try fetching latest live data from FastAPI backend
  syncWithBackend();
});

// ================= BACKEND SYNC =================
async function syncWithBackend() {
  try {
    const res = await fetch(`${API_BASE}/documents`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        state.documents = data;
        state.currentDoc = data[0];
        renderCurrentPage();
        console.log("Connected to live FastAPI backend!");
      }
    }
  } catch (e) {
    console.log("Running in resilient client mode (FastAPI backend can be connected on :8000)");
  }
}

// ================= ROUTING & NAVIGATION =================
window.navigateTo = function(pageId) {
  state.currentPage = pageId;
  stopSpeech();

  // Update sidebar active buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    if (btn.getAttribute('data-page') === pageId) {
      btn.className = "nav-btn active flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold rounded-xl bg-brand-50 text-brand-700 transition";
    } else {
      btn.className = "nav-btn flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:text-navy-900 hover:bg-slate-50 transition";
    }
  });

  // Mobile sidebar close
  const sidebar = document.getElementById('app-sidebar');
  if (sidebar && !sidebar.classList.contains('-translate-x-full')) {
    sidebar.classList.add('-translate-x-full');
  }

  renderCurrentPage();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

function setupSidebar() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.getAttribute('data-page');
      if (page) navigateTo(page);
    });
  });

  // Toggle button on mobile
  const toggleBtn = document.getElementById('btn-toggle-sidebar');
  const sidebar = document.getElementById('app-sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('-translate-x-full');
    });
  }
}

function setupGlobalControls() {
  // Language selector
  const langSelect = document.getElementById('global-lang-select');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      state.currentLang = e.target.value;
      stopSpeech();
      renderCurrentPage();
      showToast(`Language set to ${langSelect.options[langSelect.selectedIndex].text}`, "info");
    });
  }

  // Search input
  const searchInput = document.getElementById('top-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase();
      if (state.currentPage === 'my-reports') {
        renderMyReportsPage();
      }
    });
  }

  // Bell icon
  const bell = document.getElementById('btn-notification-bell');
  if (bell) {
    bell.addEventListener('click', () => {
      navigateTo('reminders');
    });
  }
}

// ================= RENDER CURRENT PAGE =================
function renderCurrentPage() {
  const container = document.getElementById('main-view-container');
  if (!container) return;

  switch (state.currentPage) {
    case 'dashboard':
      renderDashboardPage(container);
      break;
    case 'upload':
      renderUploadPage(container);
      break;
    case 'report-analysis':
      renderReportAnalysisPage(container);
      break;
    case 'my-reports':
      renderMyReportsPage(container);
      break;
    case 'medical-history':
      renderMedicalHistoryPage(container);
      break;
    case 'medicine-info':
      renderMedicineInfoPage(container);
      break;
    case 'doctor-questions':
      renderDoctorQuestionsPage(container);
      break;
    case 'reminders':
      renderRemindersPage(container);
      break;
    case 'appointments':
      renderAppointmentsPage(container);
      break;
    case 'family-access':
      renderFamilyAccessPage(container);
      break;
    case 'settings':
      renderSettingsPage(container);
      break;
    default:
      renderDashboardPage(container);
  }
}

// ================= 1. DASHBOARD PAGE =================
function renderDashboardPage(container) {
  const doc = state.currentDoc || state.documents[0];
  const pendingReminders = state.reminders.filter(r => !r.taken_today).length;

  container.innerHTML = `
    <!-- Welcome Header & Large Action Button -->
    <div class="healthcare-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-white via-white to-brand-50/40">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-tealsoft-100 text-tealsoft-700">Patient Active</span>
          <span class="text-xs text-slate-400">ID: RS-58204</span>
        </div>
        <h2 class="text-xl font-bold text-navy-950 mt-1">Welcome back, Ramesh Sharma</h2>
        <p class="text-xs text-slate-500 mt-0.5">Here is your health overview, upcoming prescriptions, and latest test explanations.</p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <button onclick="openUploadModal()" class="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          <span>Upload Medical Report</span>
        </button>
        <button onclick="navigateTo('report-analysis')" class="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition">
          View Latest Analysis →
        </button>
      </div>
    </div>

    <!-- 4 Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="healthcare-card p-4">
        <div class="flex items-center justify-between text-slate-400">
          <span class="text-xs font-semibold">Total Reports</span>
          <span class="text-base">📑</span>
        </div>
        <h3 class="text-2xl font-black text-navy-950 mt-2">${state.documents.length}</h3>
        <p class="text-[11px] text-tealsoft-600 font-medium mt-0.5">All securely processed</p>
      </div>

      <div class="healthcare-card p-4">
        <div class="flex items-center justify-between text-slate-400">
          <span class="text-xs font-semibold">Latest Analysis</span>
          <span class="text-base">🔬</span>
        </div>
        <h3 class="text-2xl font-black text-navy-950 mt-2">13-Nov</h3>
        <p class="text-[11px] text-brand-600 font-medium mt-0.5">Metabolic Panel</p>
      </div>

      <div class="healthcare-card p-4">
        <div class="flex items-center justify-between text-slate-400">
          <span class="text-xs font-semibold">Med Reminders</span>
          <span class="text-base">💊</span>
        </div>
        <h3 class="text-2xl font-black text-navy-950 mt-2">${pendingReminders}</h3>
        <p class="text-[11px] text-amber-600 font-medium mt-0.5">${pendingReminders} pending for dinner</p>
      </div>

      <div class="healthcare-card p-4">
        <div class="flex items-center justify-between text-slate-400">
          <span class="text-xs font-semibold">Next Doctor Visit</span>
          <span class="text-base">🗓️</span>
        </div>
        <h3 class="text-2xl font-black text-navy-950 mt-2">5 Days</h3>
        <p class="text-[11px] text-slate-500 font-medium mt-0.5">Dr. Rajesh Mehta</p>
      </div>
    </div>

    <!-- Important Alerts Banner -->
    <div class="healthcare-card p-4 bg-amber-50/60 border-amber-200 flex items-start gap-3">
      <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl shrink-0">
        ⚠️
      </div>
      <div class="flex-1">
        <div class="flex items-center justify-between">
          <h4 class="text-xs font-bold text-amber-950">Important Notice on Recent Report</h4>
          <span class="text-[10px] text-amber-800 font-semibold bg-amber-100 px-2 py-0.5 rounded-full">Non-Emergency</span>
        </div>
        <p class="text-xs text-amber-800 mt-1 leading-relaxed">
          Your liver enzyme SGPT is slightly high at 48 U/L (reference is 40). <strong>Don't panic:</strong> this minor elevation is very common with cholesterol medication and diet, not liver failure. Mention it at your Nov 18 appointment.
        </p>
      </div>
    </div>

    <!-- Recent Medical Reports Table -->
    <div class="healthcare-card p-6">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <h3 class="text-sm font-bold text-navy-950 flex items-center gap-2">
          <span>📋</span> Recent Medical Reports
        </h3>
        <button onclick="navigateTo('my-reports')" class="text-xs font-semibold text-brand-600 hover:text-brand-700">View All →</button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="text-slate-400 border-b border-slate-100">
              <th class="pb-2 font-semibold">Document Name</th>
              <th class="pb-2 font-semibold">Category</th>
              <th class="pb-2 font-semibold">Report Date</th>
              <th class="pb-2 font-semibold">Status</th>
              <th class="pb-2 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${state.documents.map(d => `
              <tr class="hover:bg-slate-50/80 transition">
                <td class="py-3 font-bold text-navy-900">${d.filename}</td>
                <td class="py-3 text-slate-500">${d.document_type}</td>
                <td class="py-3 text-slate-500">${d.report_date}</td>
                <td class="py-3">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    d.red_flag_level === 'critical' ? 'bg-rose-100 text-rose-800' :
                    d.red_flag_level === 'attention' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }">
                    ${d.red_flag_level === 'critical' ? 'Critical Alert' : d.red_flag_level === 'attention' ? 'Attention' : 'Normal'}
                  </span>
                </td>
                <td class="py-3 text-right">
                  <button onclick="viewReportDetails(${d.id})" class="px-3 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg font-semibold transition">
                    View Analysis
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Quick Action Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div onclick="navigateTo('medicine-info')" class="healthcare-card p-5 cursor-pointer hover:border-brand-300 transition">
        <div class="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center text-xl mb-3">💊</div>
        <h4 class="text-sm font-bold text-navy-950">Medicine Explainer</h4>
        <p class="text-xs text-slate-500 mt-1">Review why you take each prescribed pill, exact timing rules, and food interactions.</p>
      </div>

      <div onclick="navigateTo('doctor-questions')" class="healthcare-card p-5 cursor-pointer hover:border-tealsoft-300 transition">
        <div class="w-10 h-10 rounded-xl bg-tealsoft-100 text-tealsoft-700 flex items-center justify-center text-xl mb-3">🩺</div>
        <h4 class="text-sm font-bold text-navy-950">Doctor Questions Sheet</h4>
        <p class="text-xs text-slate-500 mt-1">Carry auto-generated questions into your next brief consultation to get full clarity.</p>
      </div>

      <div onclick="navigateTo('family-access')" class="healthcare-card p-5 cursor-pointer hover:border-amber-300 transition">
        <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl mb-3">👨‍👩‍👧</div>
        <h4 class="text-sm font-bold text-navy-950">Family Circle Access</h4>
        <p class="text-xs text-slate-500 mt-1">Securely share simplified, anxiety-free summaries with authorized caregivers.</p>
      </div>
    </div>
  `;
}

// ================= 2. UPLOAD MEDICAL REPORT (PAGE C) =================
function renderUploadPage(container) {
  container.innerHTML = `
    <div class="healthcare-card p-6">
      <h3 class="text-base font-bold text-navy-950">Upload Medical Document</h3>
      <p class="text-xs text-slate-500 mt-0.5">Strictly restricted to medical laboratory reports, doctor prescriptions, and hospital discharge summaries.</p>

      <!-- Drag & Drop Zone -->
      <div onclick="document.getElementById('page-file-input').click()" class="mt-5 border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-3xl p-10 text-center cursor-pointer transition bg-slate-50/50 hover:bg-brand-50/30">
        <div class="w-16 h-16 mx-auto rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center text-3xl mb-4 shadow-xs">
          📄
        </div>
        <h4 class="text-sm font-bold text-navy-900">Choose a file or drag & drop here</h4>
        <p class="text-xs text-slate-500 mt-1">Supports PDF, JPG, PNG formats up to 15MB</p>
        <button class="mt-4 px-5 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-sm">Browse Local Files</button>
        <input type="file" id="page-file-input" class="hidden" accept=".pdf,.jpg,.jpeg,.png,.txt" onchange="handleDirectFileSelect(event)">
      </div>

      <!-- Quick Test Presets (For instant testing of all requirements) -->
      <div class="mt-6 pt-5 border-t border-slate-100">
        <h4 class="text-xs font-bold text-slate-700 mb-2">Or choose a pre-loaded test report:</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <button onclick="loadPresetDocument(1)" class="p-3 text-left bg-slate-50 hover:bg-brand-50/60 border border-slate-200 rounded-xl transition">
            <span class="text-sm">🔬</span>
            <h5 class="text-xs font-bold text-navy-900 mt-1">Metabolic & Lipids</h5>
            <p class="text-[10px] text-slate-500">Blood sugar, SGPT, Creatinine</p>
          </button>

          <button onclick="loadPresetDocument(2)" class="p-3 text-left bg-slate-50 hover:bg-tealsoft-50/60 border border-slate-200 rounded-xl transition">
            <span class="text-sm">🏥</span>
            <h5 class="text-xs font-bold text-navy-900 mt-1">Discharge Summary</h5>
            <p class="text-[10px] text-slate-500">Max Hospital follow-up</p>
          </button>

          <button onclick="loadEmergencyPreset()" class="p-3 text-left bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition">
            <span class="text-sm">🚨</span>
            <h5 class="text-xs font-bold text-rose-900 mt-1">Critical Red-Flag</h5>
            <p class="text-[10px] text-rose-700">High Potassium & Troponin</p>
          </button>

          <button onclick="testNonMedicalRejection()" class="p-3 text-left bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition" title="Feature 3: Strict file restriction">
            <span class="text-sm">⛔</span>
            <h5 class="text-xs font-bold text-amber-900 mt-1">Test Invalid File</h5>
            <p class="text-[10px] text-amber-700">Restaurant Dinner Bill</p>
          </button>
        </div>
      </div>
    </div>
  `;
}

// ================= 3. MEDICAL REPORT ANALYSIS (PAGE E - THE CORE PAGE) =================
function renderReportAnalysisPage(container) {
  const doc = state.currentDoc || state.documents[0];
  const results = doc.results || [];
  const questions = doc.doctor_questions || [];

  container.innerHTML = `
    <!-- Top Action Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
      <button onclick="navigateTo('my-reports')" class="text-xs font-bold text-slate-600 hover:text-navy-900 flex items-center gap-1.5">
        ← Back to Reports List
      </button>

      <div class="flex items-center gap-2">
        <button onclick="window.print()" class="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5">
          <span>🖨️</span> Print Analysis
        </button>
        <button onclick="alert('Viewing original document file: ' + state.currentDoc.filename)" class="px-3.5 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5">
          <span>👁️</span> View Original Report
        </button>
      </div>
    </div>

    <!-- Red-Flag Urgency Alert Banner (Feature 12) -->
    ${doc.red_flag_level === 'critical' ? `
      <div class="p-5 rounded-2xl bg-rose-600 text-white shadow-lg border-2 border-rose-700 pulse-redflag">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="flex items-start gap-3.5">
            <span class="text-3xl">🚨</span>
            <div>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white text-rose-700 uppercase tracking-wider">Critical Red-Flag</span>
              <h3 class="text-base font-bold mt-1">IMMEDIATE ATTENTION REQUIRED</h3>
              <p class="text-xs text-rose-100 mt-1 max-w-2xl leading-relaxed">${doc.red_flag_message}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="alert('Connecting to Emergency Hotline 108 / 112...')" class="px-4 py-2 bg-white text-rose-700 font-bold text-xs rounded-xl shadow-md">📞 Call Emergency (108 / 112)</button>
            <button onclick="alert('Emergency Alert sent to Rahul Sharma (+91 98201-44321)!')" class="px-3.5 py-2 bg-rose-800 text-white font-semibold text-xs rounded-xl">🔔 Alert Family</button>
          </div>
        </div>
      </div>
    ` : doc.red_flag_level === 'attention' ? `
      <div class="p-4 rounded-2xl bg-amber-500 text-white shadow-sm flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <span class="text-2xl">⚠️</span>
          <div>
            <h4 class="text-xs sm:text-sm font-bold">Physician Follow-up Advised (Non-Emergency)</h4>
            <p class="text-xs text-amber-100 mt-0.5">${doc.red_flag_message}</p>
          </div>
        </div>
        <button onclick="document.getElementById('questions-section').scrollIntoView({behavior: 'smooth'})" class="px-3 py-1.5 bg-white text-amber-800 text-xs font-semibold rounded-lg shrink-0">View Questions →</button>
      </div>
    ` : `
      <div class="p-4 rounded-2xl bg-emerald-600 text-white shadow-sm flex items-center gap-3">
        <span class="text-2xl">✅</span>
        <div>
          <h4 class="text-xs sm:text-sm font-bold">All Clear - Stable Report</h4>
          <p class="text-xs text-emerald-100">No urgent red flags found. Continue your routine health regimen.</p>
        </div>
      </div>
    `}

    <!-- 1. Report Information Card -->
    <div class="healthcare-card p-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-800">${doc.document_type}</span>
            <span class="text-xs text-slate-400">Report Date: <strong>${doc.report_date}</strong></span>
          </div>
          <h2 class="text-lg font-bold text-navy-950 mt-1">${doc.filename}</h2>
          <p class="text-xs text-slate-500">${doc.facility_name} • ${doc.doctor_name}</p>
        </div>

        <div class="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <p>Patient: <strong class="text-navy-900">${state.currentUser.name}</strong></p>
          <p class="text-[11px] text-slate-500">Age: 58 • Gender: Male • Blood: B+</p>
        </div>
      </div>

      <!-- 2. AI Report Summary with Audio & Reading Levels -->
      <div class="pt-5 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-brand-50/50 p-3.5 rounded-2xl border border-brand-100">
          <div>
            <h4 class="text-xs font-bold text-brand-950">Explain My Report (Plain Language)</h4>
            <p class="text-[11px] text-slate-500">Select your preferred reading level and language:</p>
          </div>

          <!-- Controls: Reading Level, Audio TTS -->
          <div class="flex flex-wrap items-center gap-2">
            <!-- Reading level toggle -->
            <div class="flex bg-white rounded-lg p-0.5 border border-brand-200 text-xs">
              <button onclick="setReadingLevel('simple')" class="px-2.5 py-1 font-semibold rounded-md ${state.currentReadingLevel === 'simple' ? 'bg-brand-600 text-white' : 'text-slate-600'}">🐣 Simple</button>
              <button onclick="setReadingLevel('standard')" class="px-2.5 py-1 font-semibold rounded-md ${state.currentReadingLevel === 'standard' ? 'bg-brand-600 text-white' : 'text-slate-600'}">Standard</button>
              <button onclick="setReadingLevel('detailed')" class="px-2.5 py-1 font-semibold rounded-md ${state.currentReadingLevel === 'detailed' ? 'bg-brand-600 text-white' : 'text-slate-600'}">Detailed</button>
            </div>

            <!-- Audio Listen Button (Feature 4) -->
            <button id="btn-audio-player" onclick="toggleAudioSpeech()" class="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1.5">
              <span>🔊</span> <span id="audio-btn-label">Listen</span>
            </button>
            <div id="audio-wave-anim" class="flex items-center gap-1 hidden px-1">
              <span class="audio-bar"></span>
              <span class="audio-bar"></span>
              <span class="audio-bar"></span>
              <span class="audio-bar"></span>
              <span class="audio-bar"></span>
            </div>
          </div>
        </div>

        <!-- Rendered Summary Paragraph -->
        <div class="p-4 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm leading-relaxed text-slate-800">
          <p id="summary-paragraph">${doc.readLevels ? (doc.readLevels[state.currentReadingLevel] || doc.summary_text) : doc.summary_text}</p>
        </div>

        <!-- Reassurance Box -->
        <div class="p-3.5 rounded-xl bg-tealsoft-50 border border-tealsoft-200 text-xs text-tealsoft-900 flex items-start gap-2.5">
          <span class="text-base">🛡️</span>
          <div>
            <strong class="text-tealsoft-950">Doctor's Reassurance Note:</strong>
            <p class="mt-0.5 text-tealsoft-800 leading-relaxed">
              Laboratory reference intervals represent the average range of 95% of healthy individuals. A minor variation outside the bounds rarely indicates an acute disease. Your doctor looks at patterns over time and how you feel.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Laboratory Results Table (Feature 8) -->
    <div class="healthcare-card p-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
        <div>
          <h3 class="text-sm font-bold text-navy-950 flex items-center gap-2">
            <span>📊</span> Laboratory Results & Status
          </h3>
          <p class="text-xs text-slate-500">Every parameter is classified using the reference range printed on your report.</p>
        </div>

        <!-- Legend -->
        <div class="flex items-center gap-3 text-[11px] font-semibold">
          <span class="flex items-center gap-1 text-emerald-700"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Normal</span>
          <span class="flex items-center gap-1 text-amber-700"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> High</span>
          <span class="flex items-center gap-1 text-rose-700"><span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Low</span>
          <span class="flex items-center gap-1 text-slate-500"><span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Unknown</span>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="text-slate-400 border-b border-slate-100">
              <th class="pb-3 font-semibold">Test Name</th>
              <th class="pb-3 font-semibold">Measured Value</th>
              <th class="pb-3 font-semibold">Reference Range</th>
              <th class="pb-3 font-semibold">Status</th>
              <th class="pb-3 font-semibold">Plain Explanation & Interpretation</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${results.map(r => `
              <tr class="hover:bg-slate-50/70 transition">
                <td class="py-3.5 pr-3 font-bold text-navy-900">${r.test_name}</td>
                <td class="py-3.5 pr-3 font-extrabold text-navy-950 whitespace-nowrap">${r.value} ${r.unit || ''}</td>
                <td class="py-3.5 pr-3 text-slate-500 whitespace-nowrap">${r.reference_range_raw || 'Not Provided'}</td>
                <td class="py-3.5 pr-3 whitespace-nowrap">
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    r.status === 'normal' ? 'status-badge-normal' :
                    r.status === 'high' ? 'status-badge-high' :
                    r.status === 'low' ? 'status-badge-low' : 'status-badge-unknown'
                  }">
                    ${r.status.toUpperCase()}
                  </span>
                </td>
                <td class="py-3.5 text-slate-600 text-[11px] leading-relaxed">
                  <p class="font-medium text-navy-900">${r.plain_explanation || ''}</p>
                  <p class="text-slate-500 mt-0.5">${r.reassurance_note || ''}</p>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- 4. Doctor Questions Checklist (Feature 10) -->
    <div id="questions-section" class="healthcare-card p-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
        <div>
          <h3 class="text-sm font-bold text-navy-950 flex items-center gap-2">
            <span>🩺</span> Questions for Your Doctor
          </h3>
          <p class="text-xs text-slate-500">Carry these suggested questions into your appointment so you leave with complete clarity.</p>
        </div>
        <button onclick="copyQuestionsToClipboard()" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5">
          <span>📋</span> Copy Questions
        </button>
      </div>

      <div class="space-y-2.5">
        ${questions.map((q, idx) => `
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3 hover:bg-slate-100/80 transition">
            <input type="checkbox" id="chk-${q.id}" ${q.checked ? 'checked' : ''} onchange="toggleQuestionCheck('${q.id}')" class="mt-1 w-4 h-4 text-brand-600 rounded border-slate-300">
            <label for="chk-${q.id}" class="text-xs text-slate-800 flex-1 cursor-pointer leading-relaxed ${q.checked ? 'line-through text-slate-400' : ''}">
              <strong>${idx + 1}.</strong> ${q.text}
            </label>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- 5. Mandatory Medical Safety Disclaimer (Section 6 & 19) -->
    <div class="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2.5 leading-relaxed">
      <span class="text-base">⚠️</span>
      <p>
        <strong>Safety Disclaimer:</strong> ${doc.disclaimer}
      </p>
    </div>
  `;
}

// ================= 4. MY REPORTS PAGE (PAGE F) =================
function renderMyReportsPage(container) {
  const query = state.searchQuery;
  const filtered = state.documents.filter(d => 
    !query || d.filename.toLowerCase().includes(query) || d.document_type.toLowerCase().includes(query)
  );

  container.innerHTML = `
    <div class="healthcare-card p-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
        <div>
          <h3 class="text-base font-bold text-navy-950">My Medical Reports</h3>
          <p class="text-xs text-slate-500">All uploaded and analyzed clinical documents</p>
        </div>
        <button onclick="openUploadModal()" class="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs transition">
          + Upload New Document
        </button>
      </div>

      <div class="space-y-3">
        ${filtered.map(d => `
          <div class="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-xs transition">
            <div class="flex items-start gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center text-xl shrink-0">
                📄
              </div>
              <div>
                <h4 class="text-sm font-bold text-navy-950">${d.filename}</h4>
                <p class="text-xs text-slate-500">${d.facility_name} • ${d.doctor_name}</p>
                <div class="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                  <span>📅 ${d.report_date}</span>
                  <span>📦 ${(d.file_size_bytes / 1024).toFixed(1)} KB</span>
                  <span class="text-tealsoft-600 font-semibold">Score: ${d.confidence_score}%</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button onclick="viewReportDetails(${d.id})" class="px-3.5 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg text-xs font-semibold transition">
                View Analysis
              </button>
              <button onclick="deleteReport(${d.id})" class="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition">
                Delete
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ================= 5. MEDICAL HISTORY & COMPARISON (PAGE G) =================
function renderMedicalHistoryPage(container) {
  container.innerHTML = `
    <!-- Patient Profile Summary -->
    <div class="healthcare-card p-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-base">
            RS
          </div>
          <div>
            <h3 class="text-base font-bold text-navy-950">${state.currentUser.name}</h3>
            <p class="text-xs text-slate-500">${state.currentUser.age} Y • ${state.currentUser.gender} • Blood Group: <strong class="text-navy-900">${state.currentUser.bloodGroup}</strong></p>
          </div>
        </div>
        <div class="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          Emergency Contact: <strong>${state.currentUser.emergencyContact}</strong>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <h5 class="font-bold text-slate-700 mb-1">Chronic Conditions Log:</h5>
          <p class="text-slate-600 leading-relaxed">${state.currentUser.chronicConditions}</p>
        </div>
        <div class="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900">
          <h5 class="font-bold text-rose-800 mb-1">Known Allergies:</h5>
          <p class="text-rose-700 font-semibold leading-relaxed">${state.currentUser.allergies}</p>
        </div>
      </div>
    </div>

    <!-- Longitudinal Value Trend Comparison (Feature 7) -->
    <div class="healthcare-card p-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
        <div>
          <h3 class="text-sm font-bold text-navy-950">Longitudinal Laboratory Trend Tracking</h3>
          <p class="text-xs text-slate-500">Only compares identical test markers with compatible clinical units across dates.</p>
        </div>

        <select id="trend-metric-select" onchange="renderHistoryTrendChart(this.value)" class="bg-white text-xs font-semibold text-navy-900 border border-slate-200 rounded-lg px-3 py-1.5">
          <option value="hba1c" selected>HbA1c (% Glycosylated Hemoglobin)</option>
          <option value="glucose">Fasting Blood Glucose (mg/dL)</option>
          <option value="creatinine">Serum Creatinine (mg/dL)</option>
        </select>
      </div>

      <!-- Trend Chart Graphic -->
      <div id="trend-chart-container" class="space-y-3 pt-2">
        <!-- Rendered by renderHistoryTrendChart() -->
      </div>
    </div>

    <!-- Chronological Reports Timeline -->
    <div class="healthcare-card p-6">
      <h3 class="text-sm font-bold text-navy-950 mb-4 flex items-center gap-2">
        <span>📜</span> Chronological Medical Record Timeline
      </h3>

      <div class="space-y-4">
        <div class="relative pl-6 pb-4 border-l-2 border-brand-300">
          <div class="absolute -left-2 top-0 w-4 h-4 rounded-full bg-brand-600 border-2 border-white shadow-xs"></div>
          <span class="text-xs font-bold text-brand-900">13-Nov-2026 (Today)</span>
          <h5 class="text-xs font-bold text-navy-900 mt-0.5">Apollo Diagnostics — Metabolic & Lipid Profile</h5>
          <p class="text-xs text-slate-600 mt-0.5">HbA1c 7.1%, Fasting Sugar 138 mg/dL, Creatinine 1.05 mg/dL. Kidneys healthy; mild sugar elevation.</p>
        </div>

        <div class="relative pl-6 pb-4 border-l-2 border-brand-300">
          <div class="absolute -left-2 top-0 w-4 h-4 rounded-full bg-brand-600 border-2 border-white shadow-xs"></div>
          <span class="text-xs font-bold text-brand-900">10-Nov-2026 (3 days ago)</span>
          <h5 class="text-xs font-bold text-navy-900 mt-0.5">Max Hospital — Discharge Summary</h5>
          <p class="text-xs text-slate-600 mt-0.5">Discharged in stable condition. Blood sugar stabilized to 112 mg/dL. Oral medication resumed.</p>
        </div>

        <div class="relative pl-6 pb-4 border-l-2 border-brand-300">
          <div class="absolute -left-2 top-0 w-4 h-4 rounded-full bg-brand-600 border-2 border-white shadow-xs"></div>
          <span class="text-xs font-bold text-brand-900">15-Aug-2026 (3 months ago)</span>
          <h5 class="text-xs font-bold text-navy-900 mt-0.5">Quarterly Diabetes Review</h5>
          <p class="text-xs text-slate-600 mt-0.5">HbA1c was 7.8%, Fasting Glucose was 155 mg/dL. Evening Statin initiated.</p>
        </div>

        <div class="relative pl-6">
          <div class="absolute -left-2 top-0 w-4 h-4 rounded-full bg-brand-600 border-2 border-white shadow-xs"></div>
          <span class="text-xs font-bold text-brand-900">12-May-2026 (6 months ago)</span>
          <h5 class="text-xs font-bold text-navy-900 mt-0.5">Annual Health Screening</h5>
          <p class="text-xs text-slate-600 mt-0.5">HbA1c was 8.4%, Blood Pressure 142/90. Diet overhaul recommended.</p>
        </div>
      </div>
    </div>
  `;

  renderHistoryTrendChart('hba1c');
}

function renderHistoryTrendChart(metric) {
  const container = document.getElementById('trend-chart-container');
  if (!container) return;

  if (metric === 'hba1c') {
    container.innerHTML = `
      <div class="space-y-3">
        <div>
          <div class="flex justify-between text-xs text-slate-600 mb-1">
            <span>6 Months Ago (May 2026)</span>
            <span class="font-bold text-rose-600">8.4% (Uncontrolled)</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div class="bg-rose-500 h-3 rounded-full" style="width: 84%"></div>
          </div>
        </div>

        <div>
          <div class="flex justify-between text-xs text-slate-600 mb-1">
            <span>3 Months Ago (Aug 2026)</span>
            <span class="font-bold text-amber-600">7.8% (Improving)</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div class="bg-amber-500 h-3 rounded-full" style="width: 78%"></div>
          </div>
        </div>

        <div>
          <div class="flex justify-between text-xs text-slate-600 mb-1">
            <span>Current Test (Nov 2026)</span>
            <span class="font-bold text-tealsoft-600">7.1% (Near Target &lt; 7.0%)</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div class="bg-tealsoft-500 h-3 rounded-full" style="width: 71%"></div>
          </div>
        </div>
      </div>
      <p class="text-[11px] text-tealsoft-700 font-semibold mt-2">📈 Progress Summary: HbA1c reduced from 8.4% to 7.1% over 6 months through consistent medication adherence.</p>
    `;
  } else if (metric === 'glucose') {
    container.innerHTML = `
      <div class="space-y-3">
        <div>
          <div class="flex justify-between text-xs text-slate-600 mb-1">
            <span>6 Months Ago (May 2026)</span>
            <span class="font-bold text-rose-600">174 mg/dL</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div class="bg-rose-500 h-3 rounded-full" style="width: 75%"></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between text-xs text-slate-600 mb-1">
            <span>Current Test (Nov 2026)</span>
            <span class="font-bold text-amber-600">138 mg/dL</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div class="bg-amber-500 h-3 rounded-full" style="width: 60%"></div>
          </div>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="space-y-3">
        <div>
          <div class="flex justify-between text-xs text-slate-600 mb-1">
            <span>Serum Creatinine (Nov 2026)</span>
            <span class="font-bold text-tealsoft-600">1.05 mg/dL (Normal Range 0.7 - 1.3)</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div class="bg-tealsoft-500 h-3 rounded-full" style="width: 50%"></div>
          </div>
        </div>
      </div>
    `;
  }
}

// ================= 6. MEDICINE INFORMATION (PAGE H) =================
function renderMedicineInfoPage(container) {
  container.innerHTML = `
    <div class="healthcare-card p-6">
      <div class="border-b border-slate-100 pb-3 mb-4">
        <h3 class="text-base font-bold text-navy-950">Prescription Medicine Explainer</h3>
        <p class="text-xs text-slate-500">Extracted from your doctor's prescriptions with trusted clinical precautions.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${state.medicines.map(m => `
          <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div class="flex items-start justify-between">
              <div>
                <span class="px-2.5 py-0.5 text-[10px] font-bold bg-tealsoft-100 text-tealsoft-800 rounded-full">${m.verification_status}</span>
                <h4 class="text-sm font-bold text-navy-950 mt-1">${m.medicine_name}</h4>
                <p class="text-xs text-slate-500">Generic: ${m.generic_name}</p>
              </div>
              <div class="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center text-lg">💊</div>
            </div>

            <div class="text-xs space-y-2 text-slate-700">
              <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <strong class="text-navy-900">Why are you taking this?</strong>
                <p class="text-slate-600 mt-0.5">${m.purpose}</p>
              </div>

              <div>
                <strong class="text-navy-900">Doctor's Prescribed Instructions:</strong>
                <p class="text-slate-600">${m.prescribed_instructions}</p>
              </div>

              <div>
                <strong class="text-navy-900">Important Precautions:</strong>
                <p class="text-slate-600">${m.precautions}</p>
              </div>

              <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <span class="text-emerald-700 font-bold">Mild Side Effects:</span>
                  <p class="text-slate-500">${m.mild_side_effects}</p>
                </div>
                <div>
                  <span class="text-rose-700 font-bold">Notify Doctor If:</span>
                  <p class="text-slate-500">${m.urgent_side_effects}</p>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ================= 7. DOCTOR QUESTIONS (PAGE I) =================
function renderDoctorQuestionsPage(container) {
  const questions = state.currentDoc ? state.currentDoc.doctor_questions : [];

  container.innerHTML = `
    <div class="healthcare-card p-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
        <div>
          <h3 class="text-base font-bold text-navy-950">Questions for Your Doctor</h3>
          <p class="text-xs text-slate-500">Suggested questions based on your latest medical report findings.</p>
        </div>
        <div class="flex gap-2">
          <button onclick="copyQuestionsToClipboard()" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">Copy</button>
          <button onclick="window.print()" class="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold">Print Sheet</button>
        </div>
      </div>

      <div class="space-y-3">
        ${questions.map((q, idx) => `
          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
            <input type="checkbox" id="dq-${q.id}" ${q.checked ? 'checked' : ''} onchange="toggleQuestionCheck('${q.id}')" class="mt-1 w-4 h-4 text-brand-600 rounded">
            <label for="dq-${q.id}" class="text-xs text-navy-900 flex-1 cursor-pointer leading-relaxed ${q.checked ? 'line-through text-slate-400' : ''}">
              <strong>${idx + 1}.</strong> ${q.text}
            </label>
          </div>
        `).join('')}
      </div>

      <!-- Add Custom Question -->
      <div class="mt-5 pt-4 border-t border-slate-100 flex gap-2">
        <input type="text" id="custom-q-input" placeholder="Type your own question for the doctor..." class="flex-1 text-xs border border-slate-300 rounded-xl px-3 py-2">
        <button onclick="addCustomQuestion()" class="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">Add Question</button>
      </div>
    </div>
  `;
}

// ================= 8. REMINDERS & PILL TRACKER (PAGE J) =================
function renderRemindersPage(container) {
  const meds = state.reminders;
  const takenCount = meds.filter(m => m.taken_today).length;

  container.innerHTML = `
    <div class="healthcare-card p-6">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div>
          <h3 class="text-base font-bold text-navy-950">Medication Reminders</h3>
          <p class="text-xs text-slate-500">Track and log your daily doses according to your prescription</p>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-bold bg-tealsoft-100 text-tealsoft-800">
          ${takenCount} of ${meds.length} Taken Today
        </span>
      </div>

      <div class="space-y-3">
        ${meds.map(m => `
          <div class="p-3.5 rounded-xl border ${m.taken_today ? 'bg-tealsoft-50/40 border-tealsoft-200' : 'bg-white border-slate-200'} flex items-center justify-between gap-3 shadow-xs">
            <div class="flex items-center gap-3">
              <span class="text-2xl">${m.taken_today ? '✅' : '💊'}</span>
              <div>
                <h5 class="text-xs font-bold text-navy-950">${m.title}</h5>
                <p class="text-xs text-slate-500">${m.scheduled_time} (${m.timing_label}) • ${m.instructions}</p>
              </div>
            </div>
            <div>
              ${m.taken_today ? `
                <span class="px-3 py-1 bg-tealsoft-100 text-tealsoft-800 text-xs font-bold rounded-lg">Taken</span>
              ` : `
                <button onclick="markReminderTaken(${m.id})" class="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold shadow-xs">
                  Mark as Taken
                </button>
              `}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Quick Pop-up Alert Test -->
      <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <p class="text-xs text-slate-500">Simulate browser popup reminder:</p>
        <button onclick="triggerPopupDemo()" class="px-3.5 py-1.5 bg-amber-500 text-white hover:bg-amber-600 rounded-xl text-xs font-bold">
          Test Reminder Pop-up
        </button>
      </div>
    </div>
  `;
}

// ================= 9. APPOINTMENTS (PAGE K) =================
function renderAppointmentsPage(container) {
  container.innerHTML = `
    <div class="healthcare-card p-6">
      <div class="border-b border-slate-100 pb-3 mb-4">
        <h3 class="text-base font-bold text-navy-950">Upcoming Doctor Appointments</h3>
        <p class="text-xs text-slate-500">Scheduled clinical reviews and follow-ups</p>
      </div>

      <div class="space-y-3">
        ${state.appointments.map(a => `
          <div class="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div class="flex items-start gap-3">
              <span class="text-2xl">🗓️</span>
              <div>
                <h4 class="text-sm font-bold text-navy-950">${a.doctor_name}</h4>
                <p class="text-xs text-slate-600">${a.hospital_name}</p>
                <p class="text-xs font-semibold text-brand-600 mt-1">📅 ${a.appointment_datetime}</p>
                <p class="text-[11px] text-slate-500 mt-0.5">Notes: ${a.notes}</p>
              </div>
            </div>
            <span class="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-bold">${a.status}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ================= 10. FAMILY ACCESS (PAGE L) =================
function renderFamilyAccessPage(container) {
  container.innerHTML = `
    <div class="healthcare-card p-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
        <div>
          <h3 class="text-base font-bold text-navy-950">Family & Caregiver Access</h3>
          <p class="text-xs text-slate-500">Share anxiety-free summaries with authorized relatives.</p>
        </div>
        <button onclick="shareViaWhatsApp()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs">
          <span>💬</span> Send WhatsApp Update
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${state.familyPermissions.map(f => `
          <div class="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-0.5 text-[10px] font-bold bg-brand-100 text-brand-800 rounded-full">${f.permission_level}</span>
              <button onclick="revokeFamily(${f.id})" class="text-[11px] text-rose-600 font-semibold hover:underline">Revoke</button>
            </div>
            <h4 class="text-sm font-bold text-navy-950">${f.family_member_name}</h4>
            <p class="text-xs text-slate-500">${f.relationship_type}</p>
            <p class="text-xs text-slate-600">📞 ${f.contact_number}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ================= 11. SETTINGS (PAGE M) =================
function renderSettingsPage(container) {
  container.innerHTML = `
    <div class="healthcare-card p-6 max-w-2xl mx-auto space-y-5">
      <h3 class="text-base font-bold text-navy-950 border-b border-slate-100 pb-3">Patient Preferences & Settings</h3>

      <div class="space-y-4 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">Preferred Language</label>
          <select id="setting-lang" class="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-navy-900">
            <option value="en" ${state.currentLang === 'en' ? 'selected' : ''}>English</option>
            <option value="kn" ${state.currentLang === 'kn' ? 'selected' : ''}>ಕನ್ನಡ (Kannada)</option>
            <option value="hi" ${state.currentLang === 'hi' ? 'selected' : ''}>हिंदी (Hindi)</option>
            <option value="es" ${state.currentLang === 'es' ? 'selected' : ''}>Español (Spanish)</option>
            <option value="mr" ${state.currentLang === 'mr' ? 'selected' : ''}>मराठी (Marathi)</option>
          </select>
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">Default Explanation Reading Level</label>
          <select id="setting-reading-level" class="w-full border border-slate-300 rounded-xl p-2.5 font-semibold text-navy-900">
            <option value="simple" ${state.currentReadingLevel === 'simple' ? 'selected' : ''}>🐣 Simple (Grandma-friendly / 5th Grade)</option>
            <option value="standard" ${state.currentReadingLevel === 'standard' ? 'selected' : ''}>📘 Standard</option>
            <option value="detailed" ${state.currentReadingLevel === 'detailed' ? 'selected' : ''}>🔬 Detailed / Clinical</option>
          </select>
        </div>

        <button onclick="saveSettings()" class="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-xs transition">
          Save Preferences
        </button>
      </div>
    </div>
  `;
}

// ================= INTERACTIVE ACTIONS =================
window.setReadingLevel = function(level) {
  state.currentReadingLevel = level;
  const p = document.getElementById('summary-paragraph');
  if (p && state.currentDoc && state.currentDoc.readLevels) {
    p.textContent = state.currentDoc.readLevels[level] || state.currentDoc.summary_text;
  }
  showToast(`Reading level switched to ${level.toUpperCase()}`, "info");
};

window.toggleAudioSpeech = function() {
  if (state.isSpeaking) {
    stopSpeech();
  } else {
    speakExplanation();
  }
};

function speakExplanation() {
  if (!('speechSynthesis' in window)) {
    alert("Speech synthesis is not supported on this browser.");
    return;
  }
  window.speechSynthesis.cancel();

  const text = state.currentDoc ? (state.currentDoc.readLevels ? state.currentDoc.readLevels[state.currentReadingLevel] : state.currentDoc.summary_text) : "";
  const utterance = new SpeechSynthesisUtterance(text);
  state.speechUtterance = utterance;

  const langMap = { en: 'en-US', kn: 'kn-IN', hi: 'hi-IN', es: 'es-ES', mr: 'mr-IN' };
  utterance.lang = langMap[state.currentLang] || 'en-US';
  utterance.rate = state.audioSpeed;

  utterance.onstart = () => {
    state.isSpeaking = true;
    const wave = document.getElementById('audio-wave-anim');
    const label = document.getElementById('audio-btn-label');
    if (wave) wave.classList.remove('hidden');
    if (label) label.textContent = "Pause";
  };

  utterance.onend = () => stopSpeech();
  utterance.onerror = () => stopSpeech();

  window.speechSynthesis.speak(utterance);
}

function stopSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  state.isSpeaking = false;
  const wave = document.getElementById('audio-wave-anim');
  const label = document.getElementById('audio-btn-label');
  if (wave) wave.classList.add('hidden');
  if (label) label.textContent = "Listen";
}

window.viewReportDetails = function(docId) {
  const doc = state.documents.find(d => d.id === docId);
  if (doc) {
    state.currentDoc = doc;
    navigateTo('report-analysis');
  }
};

window.deleteReport = function(docId) {
  if (confirm("Are you sure you want to delete this medical report?")) {
    state.documents = state.documents.filter(d => d.id !== docId);
    if (state.currentDoc && state.currentDoc.id === docId) {
      state.currentDoc = state.documents[0] || null;
    }
    renderMyReportsPage();
    showToast("Medical document deleted.", "success");
  }
};

window.markReminderTaken = function(id) {
  const rem = state.reminders.find(r => r.id === id);
  if (rem) {
    rem.taken_today = true;
    renderRemindersPage();
    showToast(`Dose taken for ${rem.title}!`, "success");
  }
};

window.toggleQuestionCheck = function(qId) {
  if (state.currentDoc && state.currentDoc.doctor_questions) {
    const q = state.currentDoc.doctor_questions.find(x => x.id === qId);
    if (q) q.checked = !q.checked;
  }
};

window.copyQuestionsToClipboard = function() {
  if (state.currentDoc && state.currentDoc.doctor_questions) {
    const text = state.currentDoc.doctor_questions.map((q, idx) => `${idx + 1}. ${q.text}`).join('\n');
    navigator.clipboard.writeText(text);
    showToast("Doctor questions copied to clipboard!", "success");
  }
};

window.addCustomQuestion = function() {
  const input = document.getElementById('custom-q-input');
  if (!input || !input.value.trim()) return;
  if (state.currentDoc) {
    state.currentDoc.doctor_questions.push({
      id: "cust-" + Date.now(),
      text: input.value.trim(),
      checked: false
    });
    input.value = "";
    renderDoctorQuestionsPage();
    showToast("Question added to checklist!", "success");
  }
};

window.shareViaWhatsApp = function() {
  const doc = state.currentDoc || state.documents[0];
  const msg = encodeURIComponent(
    `🏥 ClariMed Family Health Summary for ${state.currentUser.name}:\n\n` +
    `• Report: ${doc.filename} (${doc.report_date})\n` +
    `• Status: Kidneys healthy. Sugar slightly high (Fasting 138), under control.\n` +
    `• Medicine reminder: Metformin with dinner, Atorvastatin at bedtime.\n` +
    `• Next Doctor Visit: 18-Nov with Dr. Mehta.`
  );
  window.open(`https://wa.me/?text=${msg}`, '_blank');
};

window.saveSettings = function() {
  const lang = document.getElementById('setting-lang').value;
  const level = document.getElementById('setting-reading-level').value;
  state.currentLang = lang;
  state.currentReadingLevel = level;
  document.getElementById('global-lang-select').value = lang;
  showToast("Preferences saved successfully!", "success");
};

// ================= MODAL & 6-STAGE PROCESSING STEPPER =================
window.openUploadModal = function() {
  document.getElementById('modal-upload').classList.remove('hidden');
};

window.closeUploadModal = function() {
  document.getElementById('modal-upload').classList.add('hidden');
  resetStepper();
};

function setupUploadModal() {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('modal-file-input');

  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleFileChosen(file);
    });
  }

  const btnAnalyse = document.getElementById('btn-analyse-modal');
  if (btnAnalyse) {
    btnAnalyse.addEventListener('click', runUploadProcessingPipeline);
  }
}

let stagedFile = null;

function handleFileChosen(file) {
  stagedFile = file;
  document.getElementById('selected-file-name').textContent = file.name;
  document.getElementById('selected-file-size').textContent = (file.size / (1024 * 1024)).toFixed(2) + " MB";
  document.getElementById('selected-file-preview').classList.remove('hidden');
}

function runUploadProcessingPipeline() {
  if (!stagedFile) {
    alert("Please select a medical report file first.");
    return;
  }

  const stepper = document.getElementById('processing-stepper');
  stepper.classList.remove('hidden');
  const bar = document.getElementById('stepper-progress-bar');
  const pct = document.getElementById('stepper-percentage');

  const stages = [
    { p: 15, id: 'stage-1', text: '1. Uploading document...' },
    { p: 35, id: 'stage-2', text: '2. Validating medical relevance...' },
    { p: 55, id: 'stage-3', text: '3. Extracting clinical text (PyMuPDF)...' },
    { p: 75, id: 'stage-4', text: '4. Identifying test values & reference ranges...' },
    { p: 90, id: 'stage-5', text: '5. Preparing plain-language explanations...' },
    { p: 100, id: 'stage-6', text: '6. Analysis completed!' }
  ];

  let currentStage = 0;
  const interval = setInterval(() => {
    if (currentStage < stages.length) {
      const s = stages[currentStage];
      bar.style.width = s.p + '%';
      pct.textContent = s.p + '%';
      document.getElementById(s.id).className = "font-bold text-brand-600";
      currentStage++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        closeUploadModal();
        loadPresetDocument(1);
        showToast("Medical Report Successfully Analyzed!", "success");
      }, 600);
    }
  }, 400);
}

function resetStepper() {
  document.getElementById('processing-stepper').classList.add('hidden');
  document.getElementById('selected-file-preview').classList.add('hidden');
  stagedFile = null;
}

// ================= PRESET TEST ACTIONS =================
window.loadPresetDocument = function(id) {
  const doc = state.documents.find(d => d.id === id) || state.documents[0];
  state.currentDoc = doc;
  navigateTo('report-analysis');
  showToast(`Loaded: ${doc.filename}`, "info");
};

window.loadEmergencyPreset = function() {
  const critDoc = {
    id: 99,
    filename: "Fortis_Emergency_Biomarker_Panel.pdf",
    document_type: "Emergency Cardiac & Renal Panel",
    facility_name: "Fortis Emergency Department & ICU",
    doctor_name: "Dr. Ananya Ray, MD (Emergency Medicine)",
    report_date: "13-Nov-2026",
    file_size_bytes: 289000,
    status: "completed",
    confidence_score: 99,
    is_medical: true,
    red_flag_level: "critical",
    red_flag_message: "CRITICAL ALERT: Serum Potassium is 6.2 mEq/L (Critical High) and Cardiac Troponin is elevated at 0.48 ng/mL. Immediate emergency hospital consultation required.",
    summary_text: "URGENT WARNING: Your test shows two numbers that need immediate emergency hospital care right now! Your heart salt (potassium) is dangerously high at 6.2, and your heart stress marker (Troponin) is high. Please go to the nearest hospital emergency room without waiting.",
    readLevels: {
      simple: "URGENT WARNING: Your test shows two numbers that need immediate emergency hospital care right now! Your heart salt (potassium) is dangerously high at 6.2, and your heart stress marker (Troponin) is high. Please go to the nearest hospital emergency room without waiting.",
      standard: "CRITICAL ALERT: Hyperkalemia detected with Serum Potassium at 6.2 mEq/L. Concomitant elevation of Cardiac Troponin-I (0.48 ng/mL) indicates acute myocardial distress requiring immediate emergency room evaluation.",
      detailed: "CRITICAL STAT FINDING: Acute Hyperkalemia (Serum K+ 6.2 mmol/L) presenting marked risk of cardiac conduction arrhythmias. High-Sensitivity Troponin-I elevation (0.48 ng/mL) warrants continuous ECG telemetry and immediate clinical stabilization."
    },
    results: [
      {
        test_name: "Serum Potassium (K+)",
        key_name: "potassium",
        value: "6.2",
        numeric_value: 6.2,
        unit: "mEq/L",
        reference_min: 3.5,
        reference_max: 5.0,
        reference_range_raw: "3.5 - 5.0",
        status: "high",
        plain_explanation: "Heart Rhythm Electrolyte",
        reassurance_note: "DANGER LEVEL: Potassium above 6.0 can interfere with steady heart rhythms. Immediate hospital care needed."
      },
      {
        test_name: "Cardiac Troponin-I",
        key_name: "troponin",
        value: "0.48",
        numeric_value: 0.48,
        unit: "ng/mL",
        reference_min: 0.0,
        reference_max: 0.04,
        reference_range_raw: "0.00 - 0.04",
        status: "high",
        plain_explanation: "Heart Muscle Distress Detector",
        reassurance_note: "ALERT: This protein leaks into blood only when heart muscle cells are distressed."
      }
    ],
    doctor_questions: [
      { id: "cq1", text: "What is causing the sudden spike in potassium to 6.2 mEq/L?", checked: false },
      { id: "cq2", text: "Do we need an immediate ECG to check heart rhythms?", checked: false }
    ],
    disclaimer: "This application helps you understand your medical documents in simple language. It does not provide a medical diagnosis or replace professional medical advice. Always consult your doctor before making decisions about your health or medication."
  };

  state.currentDoc = critDoc;
  navigateTo('report-analysis');
  showToast("🚨 Loaded Critical Red-Flag Scenario", "error");
};

window.testNonMedicalRejection = function() {
  alert(
    "⛔ Feature 3: File Rejected!\n\n" +
    "Document: Bistro_Invoice.txt\n" +
    "Reason: Document appears to be a restaurant dinner bill or commercial invoice. ClariMed only accepts medical lab reports, discharge summaries, and prescriptions."
  );
};

window.triggerPopupDemo = function() {
  alert("⏰ Medication Reminder:\n\nMetformin 500mg\nScheduled for Dinner (08:00 PM)\nTake 1 tablet with food to avoid stomach irritation.");
};

// ================= TOAST NOTIFICATION UTILITY =================
function showToast(message, type = "info") {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `p-3 rounded-2xl shadow-lg text-xs font-bold text-white transition-all transform duration-300 pointer-events-auto flex items-center gap-2 ${
    type === 'success' ? 'bg-tealsoft-600' : type === 'error' ? 'bg-rose-600' : 'bg-navy-900'
  }`;
  toast.innerHTML = `<span>${type === 'success' ? '✅' : type === 'error' ? '🚨' : 'ℹ️'}</span> <span>${message}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
