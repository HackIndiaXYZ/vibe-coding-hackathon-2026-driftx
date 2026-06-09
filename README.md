# RoadSense AI

RoadSense AI is an AI-powered road safety and accountability platform for India. It predicts dangerous road zones, warns drivers through voice and vibration, verifies community-reported hazards, and generates official PWD repair notices so unsafe roads can be fixed faster.

## Pitch

Google Maps helps people reach faster. RoadSense AI helps people reach alive.

RoadSense AI is not another navigation app. It is a road safety layer for India that combines accident risk prediction, accessibility-first driver alerts, community hazard verification, legal repair notices, and public accountability tracking.

## Key Features

- **Dashboard**: live black spot map, death ticker, risk KPIs, NH-48 91% risk demo.
- **Safety Map + Voice Driver Mode**: token-free React-Leaflet map with red, amber, and green road risk zones.
- **Voice Alerts**: Hindi, Marathi, and English warnings using browser SpeechSynthesis.
- **Vibration Alerts**: strong red-zone and lighter amber-zone phone vibration.
- **Community Reporting**: users report potholes, waterlogging, broken signals, no streetlights, wrong-side driving, blind turns, school-zone risks, and accident spots.
- **AI Image Verification**: uploaded road images are analyzed to verify hazards and prevent fake reports.
- **Verified Hazard Card**: shows `Large pothole`, `Verified by AI`, `12 drivers confirmed`, and severity.
- **Notice Generator**: Groq-powered legal PWD notice generation with PDF download.
- **Parliament Tracker**: state-wise black spot repair accountability.
- **Before/After Simulator**: shows lives and economic loss that could have been saved.

## Tech Stack

- Frontend: React 18, Vite, Tailwind CSS
- Maps: React-Leaflet + CartoDB dark tiles
- Animation: Framer Motion
- Icons: lucide-react
- Charts: Recharts
- Backend: FastAPI
- PDF: fpdf2
- ML: scikit-learn GradientBoostingRegressor
- AI: Groq API

## Environment Variables

Create `.env` in the project root:

```bash
GROQ_API_KEY=your_groq_key
GROQ_MODEL=llama-3.3-70b-versatile
VITE_API_BASE=http://localhost:8000
```

No map API key is required. Do not add a `VITE_` Groq key because Vite variables are visible in browser code.

## Install

```bash
npm install
python3 -m pip install -r backend/requirements.txt
```

## Run Locally

Backend:

```bash
python3 -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --env-file .env
```

Frontend:

```bash
npx vite --host 127.0.0.1 --port 5173
```

Open:

```bash
http://127.0.0.1:5173/
```

## Backend APIs

- `GET /api/model-metadata`
- `POST /predict-risk`
- `POST /api/safety-explain`
- `POST /api/community-report`
- `POST /generate-pdf`

## Datasets

Primary model dataset:

```text
backend/data/accident_prediction_india.csv
```

Used for row-level accident risk modeling with weather, lighting, road condition, accident severity, casualties, fatalities, geometry, traffic control, and speed-limit signals.

State-level context dataset:

```text
backend/data/Transport_2023_Annexure_7.csv
```

Used as official state-level accident context.

Official report reference:

```text
Road-Accident-in-India-2023-Publications.pdf
```

## Demo Flow

1. Open Dashboard.
2. Show NH-48 Gurgaon-Manesar at 91% risk.
3. Open Safety Map.
4. Start Demo Drive.
5. Show voice/vibration alert.
6. Open Community Reporting.
7. Submit/verify pothole report.
8. Show `Large pothole`, `Verified by AI`, `12 drivers confirmed`, `Severity: High`.
9. Open Notice Generator.
10. Generate and download PWD notice PDF.
11. Open Parliament Tracker.
12. Show state accountability.
13. Open Simulator.
14. Show lives that could have been saved.

## Judging Track Fit

Best fit: **Startup Prototype**

Also fits:

- AI Native Apps
- Student Innovation

## What Makes RoadSense AI Different

Most apps stop at maps or dashboards. RoadSense AI closes the loop:

1. Predict danger.
2. Warn the driver.
3. Verify citizen reports.
4. Score severity.
5. Generate repair notice.
6. Track government accountability.
7. Show lives saved.

RoadSense AI turns road danger into action.

## Future Enhancements — When Data & Tech Becomes Available

### Phase 1 — iRAD Real-Time API

When iRAD real-time access becomes public, RoadSense can retrain weekly on fresh crash data, predict risk with 100-meter precision, detect live accident spikes within minutes, and learn seasonal patterns such as fog-risk corridors on specific NH stretches.

### Phase 2 — e-DAR Integration

When e-DAR opens public/partner access, police accident FIRs can feed the risk model directly. PWD notices can include real case numbers, hit-and-run patterns can be detected, and victim families can track case progress through the platform.

### Phase 3 — NHAI Sensor Network

As NHAI road sensors expand, RoadSense can ingest live pothole reports, speed violation data, highway weather station feeds, fog/rain readings, and automatic black spot repair status updates.

### Phase 4 — FASTag & Vehicle Telematics

With anonymized FASTag and vehicle telematics data, RoadSense can detect sudden braking, swerving, fatigue risk, dangerous vehicle patterns, and per-route commercial fleet risk. This can unlock insurance and logistics revenue models.

### Phase 5 — Satellite Road Condition Mapping

With ISRO/Bhuvan road imagery, RoadSense can detect road degradation, monsoon damage, flooding, cracks, and landslide-prone stretches before citizens or agencies file reports.

### Phase 6 — Self-Improving AI Notices

Future Groq/Llama-class models can learn which legal notices actually get roads repaired, improve notice language automatically, generate multilingual PWD notices, and support predictive government budget allocation.

### Future Vision

Today RoadSense predicts accidents and generates notices. When iRAD goes real-time and NHAI sensors go live, RoadSense can become the operating system for India’s road safety infrastructure: automatic detection, automatic warning, automatic notice generation, and machine-backed government accountability.
