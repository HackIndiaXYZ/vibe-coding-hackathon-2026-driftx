# RoadSense AI Project Brief

## One-Line Pitch
RoadSense AI predicts dangerous Indian road zones, warns drivers through voice and vibration, lets communities report fresh hazards, and generates official PWD repair notices to create government accountability.

## Core Differentiator
Google Maps helps people reach faster. RoadSense AI helps people travel safer.

Most existing systems do one thing: navigation, accident dashboards, black spot reporting, or government PDFs. RoadSense AI closes the loop:

1. Detect road risk.
2. Warn drivers before they reach danger.
3. Let citizens report fresh hazards.
4. AI-verifies and scores reports.
5. Generates legal PWD repair notices.
6. Tracks state-level black spot accountability.
7. Shows lives and economic loss that could be prevented.

## Target Users
- Two-wheeler riders
- Auto drivers
- Delivery workers
- Elderly people
- School and college students
- Low-literacy users
- Drivers who cannot read maps while moving
- District/PWD officials who need actionable repair summaries

## Tech Stack
- Frontend: React 18, Vite, Tailwind CSS
- Maps:
  - React-Leaflet + CartoDB dark tiles for all map views
  - No map API token required
  - Mock/UI fallback when location or network is unavailable
- Animation: Framer Motion
- Icons: lucide-react
- Charts: Recharts
- Backend: Python FastAPI
- PDF: fpdf2
- ML: scikit-learn GradientBoostingRegressor
- AI: Groq API
- Deploy target: Vercel frontend + Railway backend

## Environment Variables
Local `.env`:

```bash
GROQ_API_KEY=gsk_your_backend_groq_key
GROQ_MODEL=llama-3.3-70b-versatile
VITE_GROQ_API_KEY=gsk_your_frontend_groq_key
VITE_API_BASE=http://localhost:8000
```

Notes:
- `GROQ_API_KEY` is used by the FastAPI backend.
- `VITE_GROQ_API_KEY` is used by existing frontend streaming notice/landmark fallbacks.
- `.env` is ignored by git.

## Main Pages

### 1. Dashboard
The main command center.

Features:
- Dark premium dashboard.
- Death ticker on top.
- India risk map using React-Leaflet.
- CartoDB dark tile URL:
  `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
- 10 pulsing black spot markers.
- Click marker to open data panel.
- NH-48 Gurgaon-Manesar defaults to 91% risk.
- Stats for deaths, black spots, and prediction window.

### 2. Safety Map + Voice Driver Mode
Accessibility-first road safety layer for India.

Features:
- Safety zones:
  - Red: high danger
  - Amber: medium danger
  - Green: safe road
- Token-free React-Leaflet + CartoDB dark map.
- Mock/UI fallback if location or network fails.
- Full-screen driver mode with:
  - Large icon
  - Distance to risk
  - Simple warning
  - Recommended speed
  - Minimal text
- Voice alerts:
  - Hindi
  - Marathi
  - English
- Vibration alerts:
  - Red zone: strong vibration
  - Amber zone: light vibration
- Demo Drive:
  - Simulates Green -> Amber -> Red zones.
  - Moves marker.
  - Updates banner and danger card.
  - Triggers voice/vibration fallback.
- Accessibility modes:
  - Two-wheeler Mode
  - Auto Driver Mode
  - School Route Mode
  - Senior Citizen Mode
  - Night Travel Mode
  - Rain Mode

### 3. Community Reporting
This is the strongest differentiation feature.

Users can report:
- Pothole
- Waterlogging
- Broken Signal
- No Streetlight
- Accident Spot
- Wrong-side Driving
- Blind Turn
- School Zone Risk

RoadSense AI verifies and scores reports using:
- Hazard type
- Description keywords
- Photo evidence flag
- Number of nearby reports
- Night condition
- Rain/wet condition

Backend endpoint:
`POST /api/community-report`

Output:
- `verificationScore`
- `status`
- `confidence`
- `riskBand`
- `authoritySummary`
- `modelSignals`

Why it matters:
Google Maps cannot know every fresh pothole, broken signal, dark stretch, or school-zone risk. Community Reporting turns local driver knowledge into verified hazard intelligence.

### 4. Risk Pulse
Live risk grid of top black spots.

Features:
- Animated circular risk score SVG.
- Weather condition display.
- Risk formula:
  `baseScore + rain*25 + night*20 + fog*15 + weekend*10`
- Notice generation entry point.

### 5. Notice Generator
AI legal notice generator.

Features:
- Prefilled black spot form.
- Risk score slider.
- Contractor dropdown.
- Groq streaming notice generation.
- Mock notice fallback if Groq fails.
- Official letterhead preview.
- PDF download via FastAPI `fpdf2`.
- Notice history in localStorage.

Backend endpoint:
`POST /generate-pdf`

### 6. Parliament Tracker
State accountability view.

Features:
- `react-simple-maps` India choropleth.
- India TopoJSON:
  `https://cdn.jsdelivr.net/npm/india-topo-json/india.json`
- State-level black spot fixed/pending data.
- Hover tooltip with deaths and notices.
- Bottom accountability bar.

### 7. Before / After Simulator
Emotional impact page.

Features:
- Select black spot.
- Choose repair year.
- Shows:
  - People who would be alive today.
  - Economic loss prevented.
  - Actual vs repaired accident trend.
- Emergency notice button.

## Dataset Usage

### Primary ML Dataset
File:
`backend/data/accident_prediction_india.csv`

Rows used:
3,000

Why this dataset is used:
It is row-level and has features that can power the prediction model:
- Weather conditions
- Road type
- Road condition
- Lighting conditions
- Traffic control presence
- Speed limit
- Accident severity
- Casualties
- Fatalities
- Location details
- Day/time context

### Calibration / Context Dataset
File:
`backend/data/Transport_2023_Annexure_7.csv`

Why this is context-only:
It is state-level aggregate data, useful for dashboard calibration and official context, but not detailed enough for hazard-level model training.

### MoRTH 2023 PDF
File:
`Road-Accident-in-India-2023-Publications.pdf`

Use:
Official reference context for India road accident statistics and black spot framing.

Not used directly for ML because it is a PDF report, not row-level structured training data.

## ML Model
Backend file:
`backend/risk_model.py`

Model:
`scikit-learn GradientBoostingRegressor`

Endpoint:
`GET /api/model-metadata`

Training features:
- Fatalities
- Rain/hazy condition
- Night/dark/dusk/dawn condition
- Fog
- Weekend
- Derived base score

Target:
Derived risk score from:
- Accident severity
- Fatalities
- Casualties
- Weather
- Lighting
- Road condition
- Traffic control
- Curve/geometry
- Weekend
- Speed limit

Important honesty point:
The current target is a derived risk score because the dataset contains accident records, not official pre-accident risk labels. For production, train on verified pre-crash near-miss/black spot outcomes from iRAD/MoRTH/PWD repair status.

## Groq AI Usage

Backend safety explanation endpoint:
`POST /api/safety-explain`

Environment:
- `GROQ_API_KEY`
- `GROQ_MODEL`
- Default: `llama-3.3-70b-versatile`

Input:
- Danger type
- Severity
- User mode
- Language
- Road context

Output:
- Simple warning text
- Voice alert text
- Reason why dangerous
- Prevention advice
- Authority-ready issue summary

Frontend notice generation also uses Groq with streaming and fallback.

## Reliability Strategy
The product must never show a broken state during demo.

Fallbacks:
- No map token is needed; CartoDB dark tiles are used.
- No Groq key: deterministic local safety explanation and notice text.
- No speech synthesis: visual warning remains.
- No vibration: voice/visual warning remains.
- Location denied: Demo Drive still works.
- Map tiles fail: fallback map remains usable.
- PDF backend unavailable: text download fallback.

## Demo Script

1. Open Dashboard.
2. Show death ticker and NH-48 91% risk.
3. Open Safety Map.
4. Start Demo Drive.
5. Show Green -> Amber -> Red transition.
6. Let Hindi/Marathi/English voice warning play.
7. Show vibration + bottom red alert banner.
8. Click Community.
9. Submit pothole report.
10. Show AI verification score and authority summary.
11. Open Notice Generator.
12. Generate legal PWD notice.
13. Download PDF.
14. Open Parliament Tracker.
15. Show black spot accountability by state.
16. Open Simulator.
17. Show “X people would be alive today.”

## Judge Q&A

### Does this already exist?
Individual parts exist. Google Maps has navigation, iRAD stores accident records, and governments identify black spots. RoadSense AI connects prediction, driver warning, community reporting, legal notice generation, and accountability tracking in one closed loop.

### What makes RoadSense different from Google Maps?
Google Maps optimizes routes. RoadSense optimizes safety and accountability. It tells low-literacy users, two-wheeler riders, students, and elders how to avoid danger using voice, vibration, and simple warnings.

### What is the strongest feature?
Community Reporting. It lets people report fresh hazards, AI-verifies them, scores them, adds them to safety intelligence, and creates authority-ready summaries.

### Is the ML production-ready?
No. It is demo-ready and dataset-backed, but production needs official iRAD/MoRTH/PWD data, repair completion labels, weather history, road geometry, traffic volume, and verified incident outcomes.

### Why will this win?
Because it is not another dashboard. It prevents accidents, helps drivers immediately, empowers citizens, and creates legal/government accountability.

## Local Setup

Install frontend dependencies:

```bash
npm install
```

Run frontend:

```bash
npx vite --host 127.0.0.1 --port 5173
```

Install backend dependencies:

```bash
python3 -m pip install -r backend/requirements.txt
```

Run backend:

```bash
python3 -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

Build frontend:

```bash
npm run build
```

## Current Verification Status
- Frontend production build passes.
- FastAPI backend compiles.
- `/api/model-metadata` reports 3,000 training rows.
- `/api/community-report` scores community hazards.
- `/api/safety-explain` returns Groq output or local fallback.
- Safety Map demo works without any map API key.
- Community Reporting UI works.
- Notice PDF endpoint works when backend is running.
