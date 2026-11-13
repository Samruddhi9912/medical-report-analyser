// ClariMed - Core Application Logic

import {
  MEDICAL_DICTIONARY,
  SAMPLE_DOCUMENTS,
  PATIENT_HISTORY,
  FAMILY_CIRCLE,
  INITIAL_REMINDERS
} from './medicalData.js';

import { validateMedicalDocument } from './validator.js';
import { TRANSLATIONS } from './translations.js';

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
