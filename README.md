# Anisa Medical Hazardous Waste Survey App
### Honiara Referral Hospital · Solomon Islands

A cross-platform survey application built with **React + Capacitor + Electron** for collecting and analyzing medical waste management data from hospital personnel.

---

## Research Context

**Researcher:** Lorina Anisa  
**Institution:** Solomon Islands National University (SINU)  
**Course:** ENV607 Research Methods I

**Hypothesis:**
> *"Inadequate training, insufficient disposal infrastructure, and weak enforcement of waste management protocols in Honiara's medical centers are significantly contributing to increased risks of disease transmission, air pollution, soil degradation, and water contamination, thereby posing serious health and environmental threats to healthcare workers and surrounding communities in the Solomon Islands."*

---

## Features

- ✅ 7-section digital questionnaire with validation/probing questions
- ✅ 8 automated analysis reports with interactive charts
- ✅ PDF export (per report or all reports at once)
- ✅ Offline-first — no internet required during data collection
- ✅ 100-respondent progress tracker
- ✅ CSV export of respondent list
- ✅ Works on Android (phone/tablet) and Windows (desktop/laptop)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 + Vite |
| Mobile (Android) | Capacitor 6 |
| Desktop (Windows) | Electron 31 |
| Charts | Recharts |
| PDF Export | jsPDF + html2canvas |
| Data Storage | localStorage (browser/Android) / File system (Electron) |
| Styling | CSS Modules |
| CI/CD | GitHub Actions |

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+
- For Android: Android Studio + Android SDK
- For Windows build: Windows machine or GitHub Actions

### Run in Browser (Development)
```bash
npm install
npm run dev
```
Open http://localhost:5173

### Run as Windows Desktop App
```bash
npm install
npm run electron:dev
```

### Build Windows Installer
```bash
npm run electron:build
# Output: dist-electron/Anisa Medical Survey Setup.exe
```

### Build Android APK
```bash
npm install
npm run build
npx cap add android        # first time only
npx cap sync android
npx cap open android       # opens Android Studio
# In Android Studio: Build > Generate APK
```

---

## GitHub Actions (Automated Builds)

Push to `main` and GitHub Actions will automatically:

1. Build the React app
2. Build the Windows `.exe` installer (on `windows-latest`)
3. Build the Android `.apk` (on `ubuntu-latest` with Android SDK)
4. Create a GitHub Release with both files attached

**Setup steps:**
1. Push this repo to GitHub
2. Go to **Settings > Actions > General** → Enable Actions
3. Push to `main` — the workflow runs automatically
4. Find your files under **Releases** or **Actions > Artifacts**

No secrets needed — uses built-in `GITHUB_TOKEN`.

---

## The 8 Reports

| # | Report | Tests Hypothesis Element |
|---|--------|--------------------------|
| 1 | Demographic Profile | Data credibility |
| 2 | Training & Awareness | Inadequate training (cause) |
| 3 | Disposal Practices | Insufficient infrastructure (cause) |
| 4 | Disease Transmission | Disease risk (effect) |
| 5 | Environmental Pollution | Air, soil, water risk (effect) |
| 6 | Policy & Regulation | Weak enforcement (cause) |
| 7 | Challenges & Recommendations | Practical implications |
| 8 | Composite Risk Score | Overall hypothesis validation |

---

## Project Structure

```
anisa-survey-app/
├── src/
│   ├── components/
│   │   ├── survey/        ← Questionnaire components
│   │   ├── reports/       ← All 8 report components
│   │   └── ui/            ← Layout, navigation
│   ├── data/
│   │   └── questions.js   ← All 7 survey sections + questions
│   ├── hooks/
│   │   └── useStorage.js  ← Offline data persistence
│   ├── pages/             ← Dashboard, Survey, Respondents, Reports
│   └── utils/
│       ├── reportEngine.js ← Computes all 8 reports from raw data
│       └── pdfExport.js   ← PDF generation logic
├── electron/
│   ├── main.js            ← Electron main process
│   └── preload.js         ← Secure IPC bridge
├── .github/workflows/
│   └── build.yml          ← Android + Windows CI/CD pipeline
├── capacitor.config.json
└── package.json
```

---

## License
Academic use only. Developed for Lorina Anisa's ENV607 research project at SINU.
