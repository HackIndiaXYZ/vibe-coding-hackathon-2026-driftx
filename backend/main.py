from datetime import datetime
from io import BytesIO
import base64
import json
import os
from urllib.error import URLError
from urllib.request import Request, urlopen

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fpdf import FPDF
from PIL import Image, ImageFilter, ImageStat
from pydantic import BaseModel
from backend.risk_model import risk_model


class NoticeRequest(BaseModel):
    road: str
    nhNumber: str = ""
    blackSpotId: str
    district: str
    state: str
    riskScore: int
    deaths: int
    contractor: str
    noticeText: str


class RiskRequest(BaseModel):
    deaths: int
    rain: bool = False
    night: bool = True
    fog: bool = False
    weekend: bool = False
    baseScore: int = 55


class SafetyExplainRequest(BaseModel):
    dangerType: str
    severity: str
    userMode: str
    language: str = "hi"
    roadContext: str


class CommunityReportRequest(BaseModel):
    reportType: str
    description: str = ""
    lat: float | None = None
    lng: float | None = None
    city: str = ""
    roadName: str = ""
    photoEvidence: bool = False
    userCount: int = 1
    timeOfDay: str = "day"
    weather: str = "clear"
    imageData: str | None = None


def severity_from_score(score: int):
    if score >= 75:
        return "High"
    if score >= 50:
        return "Medium"
    return "Low"


def decode_image_data(image_data: str):
    if not image_data:
        return None
    encoded = image_data.split(",", 1)[-1]
    raw = base64.b64decode(encoded, validate=False)
    return Image.open(BytesIO(raw)).convert("RGB")


def analyze_road_image(image_data: str | None, report_type: str):
    if not image_data:
        return {
            "imageVerified": False,
            "imageLabel": "No image uploaded",
            "imageConfidence": 0,
            "imageReason": "No image evidence was provided.",
        }
    try:
        image = decode_image_data(image_data)
        if image is None:
            raise ValueError("No image")
        image.thumbnail((180, 180))
        width, height = image.size
        lower = image.crop((0, int(height * 0.35), width, height))
        gray = lower.convert("L")
        stat = ImageStat.Stat(gray)
        mean = stat.mean[0]
        contrast = stat.stddev[0]
        dark_pixels = 0
        central_dark = 0
        total = lower.size[0] * lower.size[1]
        central_total = 0
        edge_image = gray.filter(ImageFilter.FIND_EDGES)
        edge_stat = ImageStat.Stat(edge_image)
        for y in range(lower.size[1]):
            for x in range(lower.size[0]):
                pixel = gray.getpixel((x, y))
                if pixel < 78:
                    dark_pixels += 1
                    if lower.size[0] * 0.22 <= x <= lower.size[0] * 0.78 and lower.size[1] * 0.15 <= y <= lower.size[1] * 0.88:
                        central_dark += 1
                if lower.size[0] * 0.22 <= x <= lower.size[0] * 0.78 and lower.size[1] * 0.15 <= y <= lower.size[1] * 0.88:
                    central_total += 1
        dark_ratio = dark_pixels / max(total, 1)
        central_ratio = central_dark / max(central_total, 1)
        edge_score = edge_stat.mean[0]
        pothole_confidence = round(min(100, max(0, dark_ratio * 260 + central_ratio * 240 + contrast * 0.65 + edge_score * 0.18 - max(0, mean - 110) * 0.35)))
        water_confidence = 0
        if report_type == "Waterlogging":
            blueish = 0
            for red, green, blue in lower.getdata():
                if blue >= red + 8 and blue >= green - 4 and max(red, green, blue) - min(red, green, blue) < 65:
                    blueish += 1
            water_confidence = round(min(100, (blueish / max(total, 1)) * 360 + (35 if mean > 95 else 0)))

        if report_type == "Pothole":
            verified = pothole_confidence >= 48
            label = "Large pothole" if pothole_confidence >= 72 else "Possible pothole" if verified else "Image unclear"
            reason = "Dark central road depression detected." if verified else "Uploaded image does not clearly match a pothole."
            confidence = pothole_confidence
        elif report_type == "Waterlogging":
            verified = water_confidence >= 45
            label = "Waterlogging" if verified else "Image unclear"
            reason = "Reflective/blue-gray wet road region detected." if verified else "Uploaded image does not clearly match waterlogging."
            confidence = water_confidence
        else:
            verified = pothole_confidence >= 55 or water_confidence >= 50
            label = "Road hazard evidence" if verified else "Image evidence unclear"
            reason = "Road-surface anomaly detected." if verified else "Image does not strongly confirm this report type."
            confidence = max(pothole_confidence, water_confidence)

        return {
            "imageVerified": verified,
            "imageLabel": label,
            "imageConfidence": confidence,
            "imageReason": reason,
            "imageSignals": {
                "darkRatio": round(dark_ratio, 3),
                "centralDarkRatio": round(central_ratio, 3),
                "contrast": round(contrast, 2),
                "edgeScore": round(edge_score, 2),
            },
        }
    except Exception:
        return {
            "imageVerified": False,
            "imageLabel": "Image unreadable",
            "imageConfidence": 0,
            "imageReason": "RoadSense could not read the uploaded image.",
        }


app = FastAPI(title="RoadSense AI PDF Service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def fallback_safety_explanation(payload: SafetyExplainRequest):
    warning_map = {
        "hi": "आगे खतरा है। गाड़ी धीरे करें।",
        "mr": "पुढे धोका आहे. गाडी हळू करा.",
        "en": "Danger ahead. Slow down.",
    }
    reason_map = {
        "hi": "यह जगह सड़क उपयोगकर्ताओं के लिए खतरनाक हो सकती है।",
        "mr": "ही जागा वाहनचालकांसाठी धोकादायक असू शकते.",
        "en": "This road point may be dangerous for drivers and riders.",
    }
    prevention_map = {
        "hi": "गति कम करें, दूरी रखें, और अचानक मोड़ न लें।",
        "mr": "गती कमी करा, अंतर ठेवा, आणि अचानक वळू नका.",
        "en": "Slow down, keep distance, and avoid sudden swerving.",
    }
    lang = payload.language if payload.language in warning_map else "en"
    return {
        "warning": warning_map[lang],
        "voiceAlert": warning_map[lang],
        "reason": reason_map[lang],
        "prevention": prevention_map[lang],
        "authoritySummary": f"{payload.severity.title()} {payload.dangerType} risk reported. Field inspection and priority repair recommended. Context: {payload.roadContext}",
    }


def parse_json_object(text: str):
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("No JSON object found")
    return json.loads(text[start : end + 1])


class PWDNotice(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 16)
        self.cell(0, 9, "GOVERNMENT OF INDIA", align="C", new_x="LMARGIN", new_y="NEXT")
        self.set_font("Helvetica", "", 11)
        self.cell(0, 7, "Ministry of Road Transport & Highways", align="C", new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 7, "PUBLIC WORKS DEPARTMENT - REPAIR NOTICE", align="C", new_x="LMARGIN", new_y="NEXT")
        self.line(12, 36, 198, 36)
        self.ln(8)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.cell(0, 10, f"RoadSense AI generated notice | Page {self.page_no()}", align="C")


@app.post("/generate-pdf")
def generate_pdf(payload: NoticeRequest):
    pdf = PWDNotice()
    pdf.set_auto_page_break(auto=True, margin=16)
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, f"Notice ID: {payload.blackSpotId}", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 7, f"Generated: {datetime.now().strftime('%d %b %Y, %I:%M %p IST')}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 7, f"Road: {payload.road} {payload.nhNumber}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 7, f"District/State: {payload.district}, {payload.state}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 7, f"Risk Score: {payload.riskScore}% | Deaths last 3 years: {payload.deaths}", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 7, f"Contractor: {payload.contractor}", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)
    pdf.set_font("Helvetica", "", 10.5)
    for paragraph in payload.noticeText.split("\n"):
        if paragraph.strip():
            pdf.multi_cell(0, 6, paragraph.encode("latin-1", "replace").decode("latin-1"))
            pdf.ln(2)
    out = BytesIO(bytes(pdf.output()))
    filename = f"PWD-Notice-{payload.blackSpotId}.pdf"
    return StreamingResponse(
        out,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@app.post("/predict-risk")
def predict_risk(payload: RiskRequest):
    score = risk_model.predict(
        deaths=payload.deaths,
        rain=payload.rain,
        night=payload.night,
        fog=payload.fog,
        weekend=payload.weekend,
        base_score=payload.baseScore,
    )
    return {"riskScore": score, **risk_model.metadata}


@app.get("/api/model-metadata")
def model_metadata():
    return risk_model.metadata


@app.post("/api/community-report")
def community_report(payload: CommunityReportRequest):
    type_weights = {
        "Pothole": 26,
        "Waterlogging": 22,
        "Broken Signal": 24,
        "No Streetlight": 20,
        "Accident Spot": 34,
        "Wrong-side Driving": 30,
        "Blind Turn": 25,
        "School Zone Risk": 28,
    }
    base = type_weights.get(payload.reportType, 18)
    image_analysis = analyze_road_image(payload.imageData, payload.reportType)
    has_image = bool(payload.imageData)
    image_matches_report = bool(image_analysis["imageVerified"])
    evidence_boost = 18 if image_matches_report else 6 if payload.photoEvidence or has_image else 0
    crowd_boost = min(payload.userCount * 4, 20)
    night_boost = 10 if payload.timeOfDay.lower() in {"night", "dark"} else 0
    rain_boost = 10 if payload.weather.lower() in {"rain", "rainy", "wet"} else 0
    description_boost = 8 if any(word in payload.description.lower() for word in ["death", "accident", "crash", "school", "deep", "dark"]) else 0
    mismatch_penalty = 18 if has_image and not image_matches_report and payload.reportType in {"Pothole", "Waterlogging"} else 0
    score = max(5, min(100, base + evidence_boost + crowd_boost + night_boost + rain_boost + description_boost - mismatch_penalty))
    severity = severity_from_score(score)
    if image_matches_report and payload.userCount >= 3 and score >= 70:
        status = "Verified by AI"
    elif has_image and not image_matches_report:
        status = "Image Review Required"
    else:
        status = "Verified High Priority" if score >= 75 else "Needs Field Check" if score >= 50 else "Community Watch"
    return {
        "verificationScore": score,
        "status": status,
        "severity": severity,
        "confidence": "High" if image_matches_report and payload.userCount >= 3 else "Medium" if payload.photoEvidence or payload.userCount >= 3 else "Low",
        "riskBand": "red" if score >= 75 else "amber" if score >= 50 else "green",
        "displayTitle": image_analysis["imageLabel"] if image_analysis["imageVerified"] else f"{payload.reportType} report",
        "driverConfirmations": payload.userCount,
        "aiImageVerification": image_analysis,
        "authoritySummary": f"{payload.reportType} reported at {payload.roadName or payload.city or 'unknown road'} with score {score}. {status}. Image check: {image_analysis['imageLabel']} ({image_analysis['imageConfidence']}%).",
        "modelSignals": {
            "typeWeight": base,
            "photoEvidence": payload.photoEvidence or has_image,
            "imageVerified": image_matches_report,
            "imageConfidence": image_analysis["imageConfidence"],
            "communityReports": payload.userCount,
            "nightBoost": night_boost,
            "weatherBoost": rain_boost,
            "mismatchPenalty": mismatch_penalty,
        },
    }


@app.post("/api/safety-explain")
def safety_explain(payload: SafetyExplainRequest):
    api_key = os.getenv("GROQ_API_KEY")
    model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    fallback = fallback_safety_explanation(payload)
    if not api_key:
        return fallback

    language_name = {"hi": "Hindi", "mr": "Marathi", "en": "simple English"}.get(payload.language, "simple English")
    body = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are RoadSense AI, an India road safety assistant for low-literacy users, "
                    "two-wheeler riders, auto drivers, school students, elders, and delivery workers. "
                    "Return ONLY valid compact JSON with keys: warning, voiceAlert, reason, prevention, authoritySummary. "
                    "Use simple words. No technical jargon."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Language: {language_name}\n"
                    f"Danger type: {payload.dangerType}\n"
                    f"Severity: {payload.severity}\n"
                    f"User mode: {payload.userMode}\n"
                    f"Road context: {payload.roadContext}\n"
                    "Make warning and voiceAlert short enough to speak while driving."
                ),
            },
        ],
        "max_tokens": 512,
        "temperature": 0.2,
    }
    request = Request(
        "https://api.groq.com/openai/v1/chat/completions",
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urlopen(request, timeout=8) as response:
            data = json.loads(response.read().decode("utf-8"))
        content = data["choices"][0]["message"]["content"]
        parsed = parse_json_object(content)
        return {
            "warning": parsed.get("warning") or fallback["warning"],
            "voiceAlert": parsed.get("voiceAlert") or parsed.get("warning") or fallback["voiceAlert"],
            "reason": parsed.get("reason") or fallback["reason"],
            "prevention": parsed.get("prevention") or fallback["prevention"],
            "authoritySummary": parsed.get("authoritySummary") or fallback["authoritySummary"],
        }
    except (URLError, TimeoutError, KeyError, ValueError, json.JSONDecodeError):
        return fallback
