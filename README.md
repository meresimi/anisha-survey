# Anisa Medical Hazardous Waste Survey App
### Honiara Referral Hospital · Solomon Islands

A cross-platform survey application built with **React + Capacitor + Electron** for collecting and analysing medical waste management data from hospital personnel at Honiara Referral Hospital.

---

## Research Context

**Researcher:** Lorina Anisa
**Institution:** Solomon Islands National University (SINU)
**Faculty:** Agriculture, Fisheries and Forestry
**Course:** ENV607 Research Methods I
**Supervisor:** (as registered with SINU)

### Research Hypothesis
> *"Inadequate training, insufficient disposal infrastructure, and weak enforcement of waste management protocols in Honiara's medical centers are significantly contributing to increased risks of disease transmission, air pollution, soil degradation, and water contamination, thereby posing serious health and environmental threats to healthcare workers and surrounding communities in the Solomon Islands."*

---

## Features

- ✅ **8-section digital questionnaire** with validation/probing questions and social desirability bias detection
- ✅ **9 automated analysis reports** with interactive charts (pie, bar, area, radar, radial, line)
- ✅ **PDF export** — individual reports or all reports at once
- ✅ **Offline-first** — works without internet during data collection
- ✅ **100-respondent progress tracker** with department-level coverage
- ✅ **Key Informant Interview (KII) recorder** for administrator interviews
- ✅ **Field Observation Checklist** per department
- ✅ **Field Notes** with research phase tagging
- ✅ **Research Instruments** reference page (questionnaire, interview guide, checklist)
- ✅ **Research phase tracker** — 6 phases from Literature Review to Submission
- ✅ **Exit confirmation** on Android back button
- ✅ **Setup screen** for researcher name, supervisor, deadline, and target sample
- ✅ **Full JSON data backup** export
- ✅ Works on **Android** (phone/tablet), **Windows** (desktop/laptop), and **iOS** (simulator)

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 + Vite |
| Mobile — Android | Capacitor 6 |
| Mobile — iOS | Capacitor 6 + Xcode |
| Desktop — Windows | Electron 31 |
| Charts | Recharts |
| PDF Export | jsPDF + html2canvas |
| Data Storage | localStorage / Electron file system |
| Styling | CSS Modules |
| CI/CD | GitHub Actions (manual trigger) |

---

## App Structure

| Page | Description |
|---|---|
| **Dashboard** | Research phase tracker, hypothesis visual, dept coverage, composite risk score |
| **New Survey** | 8-section questionnaire with field validation and cancel-save flow |
| **Respondents** | 4 tabs — Completed, Incomplete, KII Interviews, Field Observations |
| **Reports** | 9 auto-generated reports with charts and hypothesis interpretation |
| **Field Notes** | Free-text research diary tagged by phase |
| **Instruments** | Read-only reference for questionnaire, interview guide, and checklist |

---

## The 9 Reports

| # | Report | Hypothesis Element |
|---|---|---|
| 1 | Demographic Profile | Data credibility |
| 2 | Training & Awareness | Cause 1 — Inadequate training |
| 3 | Disposal Practices | Cause 2 — Insufficient infrastructure |
| 4 | Disease Transmission | Effect 1 — Disease risk |
| 5 | Environmental Pollution | Effects 3 & 4 — Soil & water |
| 6 | Policy & Regulation | Cause 3 — Weak enforcement |
| 7 | Challenges & Recommendations | All three causes confirmed by staff |
| 8 | Safety Perception & Qualitative | Lived experience evidence |
| 9 | Composite Risk Score | Overall hypothesis verdict |

---

## GitHub Actions — Manual Build

Go to **Actions → Anisa Survey App — Build → Run workflow** and select:

| Option | What it builds |
|---|---|
| `android` | Android APK (`anisha-survey.apk`) → GitHub Release |
| `windows` | Windows installer (`.exe`) → GitHub Release |
| `ios` | iOS simulator build → GitHub Release |
| `react-only` | React `dist/` artifact only (no installer) |

> **iOS note:** Produces a simulator build. A signed IPA for real devices requires an Apple Developer account ($99/year) and signing certificates stored as GitHub Secrets.

---

## Icon Sizing

| Location | Size | Fill % |
|---|---|---|
| Android homescreen / APK icon | 192×192px frame | 72% (27px padding each side) |
| Windows `.exe` / installer icon | 256×256px (ICO) | 82% |
| App topbar floating icon | 53×53px | 85% of 62px topbar height |
| Splash screen | 1080×1920px | Photo centred at 320–480px |

All icons use the same source image (`public/icon.png`). To change the icon, replace that one file and re-run the build workflow.

---

## Getting Started Locally

```bash
# Install dependencies
npm install

# Run in browser (development)
npm run dev

# Run as Windows desktop app
npm run electron:dev

# Build Windows installer
npm run electron:build

# Build Android APK (first time)
npx cap add android
npx cap sync android
npx cap open android   # opens Android Studio
```

---

## Project Structure

```
anisa-survey-app/
├── public/
│   ├── icon.png          ← Single source icon (all platforms derive from this)
│   └── icon.ico          ← Auto-generated from icon.png for Windows
├── src/
│   ├── pages/            ← Dashboard, Survey, Respondents, Reports, FieldNotes, Instruments
│   ├── components/
│   │   ├── ui/           ← Layout, LoadingScreen, SplashScreen
│   │   ├── survey/       ← QuestionBlock, SectionNav
│   │   └── reports/      ← 9 report components
│   ├── hooks/
│   │   └── useStorage.js ← All data persistence (surveys, interviews, observations, notes)
│   ├── data/
│   │   └── questions.js  ← All 8 survey sections and questions
│   └── utils/
│       ├── reportEngine.js ← Computes all 9 reports from raw data
│       └── pdfExport.js    ← PDF generation
├── electron/             ← Electron main process and preload
├── .github/workflows/
│   └── build.yml         ← Manual GitHub Actions pipeline
└── capacitor.config.json
```

---

## License

Academic use only. Developed for Lorina Anisa's ENV607 research project at SINU, Solomon Islands.
