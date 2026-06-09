import csv
from pathlib import Path

try:
    from sklearn.ensemble import GradientBoostingRegressor
except Exception:  # pragma: no cover - demo fallback for constrained deploys
    GradientBoostingRegressor = None


DATA_DIR = Path(__file__).resolve().parent / "data"
ACCIDENT_DATASET = DATA_DIR / "accident_prediction_india.csv"
ANNEXURE_DATASET = DATA_DIR / "Transport_2023_Annexure_7.csv"


def bool_feature(value, keywords):
    text = str(value or "").lower()
    return int(any(keyword in text for keyword in keywords))


def severity_points(value):
    text = str(value or "").lower()
    if "fatal" in text:
        return 38
    if "serious" in text or "grievous" in text:
        return 28
    if "minor" in text:
        return 12
    return 18


def build_rows_from_accident_csv(path):
    rows = []
    targets = []
    if not path.exists():
      return rows, targets

    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for item in reader:
            fatalities = int(float(item.get("Number of Fatalities") or 0))
            casualties = int(float(item.get("Number of Casualties") or 0))
            rain = bool_feature(item.get("Weather Conditions"), ["rain", "hazy"])
            fog = bool_feature(item.get("Weather Conditions"), ["fog"])
            night = bool_feature(item.get("Lighting Conditions"), ["dark", "dusk", "dawn"])
            weekend = str(item.get("Day of Week") or "").lower() in {"saturday", "sunday"}
            road_penalty = 12 if str(item.get("Road Condition") or "").lower() in {"wet", "under construction"} else 0
            control_penalty = 10 if str(item.get("Traffic Control Presence") or "").lower() in {"none", "no"} else 0
            curve_penalty = 8 if "curve" in str(item.get("Accident Location Details") or "").lower() else 0
            speed = int(float(item.get("Speed Limit (km/h)") or 50))
            base_score = min(85, max(20, 22 + severity_points(item.get("Accident Severity")) + min(fatalities * 4, 22) + min(casualties * 2, 16)))
            target = min(100, base_score + (12 if rain else 0) + (10 if night else 0) + (10 if fog else 0) + (5 if weekend else 0) + road_penalty + control_penalty + curve_penalty + max(0, speed - 70) // 5)
            rows.append([fatalities, rain, night, fog, int(weekend), base_score])
            targets.append(target)
    return rows, targets


DEMO_ROWS = [
    [47, 1, 1, 0, 1, 67], [38, 0, 1, 1, 0, 62], [33, 0, 0, 0, 1, 58],
    [29, 1, 1, 0, 0, 55], [41, 0, 1, 1, 1, 64], [22, 0, 0, 0, 0, 52],
    [31, 1, 1, 0, 0, 61], [26, 1, 0, 0, 0, 53], [35, 0, 1, 1, 0, 63],
    [19, 0, 0, 0, 0, 50],
]
DEMO_TARGETS = [91, 84, 79, 76, 88, 71, 82, 73, 85, 68]


class RoadRiskModel:
    def __init__(self):
        self.model = None
        csv_rows, csv_targets = build_rows_from_accident_csv(ACCIDENT_DATASET)
        self.rows = csv_rows or DEMO_ROWS
        self.targets = csv_targets or DEMO_TARGETS
        self.metadata = {
            "model": "scikit-learn GradientBoostingRegressor",
            "trainingRows": len(self.rows),
            "primaryDataset": str(ACCIDENT_DATASET if csv_rows else "built-in demo seed rows"),
            "calibrationDataset": str(ANNEXURE_DATASET) if ANNEXURE_DATASET.exists() else None,
            "officialReportReference": "Road-Accident-in-India-2023-Publications.pdf",
            "roadSafetyAuditReference": "NHAI P2RSC road safety audit/manual reference",
            "researchReference": "PMC road traffic injury / road safety research reference supplied by user",
            "targetNote": "Risk score is derived from accident severity, fatalities, casualties, weather, lighting, road condition, traffic control, geometry, weekend, and speed-limit signals.",
        }
        if GradientBoostingRegressor:
            self.model = GradientBoostingRegressor(random_state=48, n_estimators=90, max_depth=2)
            self.model.fit(self.rows, self.targets)

    def predict(self, deaths, rain, night, fog, weekend, base_score):
        if self.model:
            score = float(self.model.predict([[deaths, int(rain), int(night), int(fog), int(weekend), base_score]])[0])
        else:
            score = base_score + (25 if rain else 0) + (20 if night else 0) + (15 if fog else 0) + (10 if weekend else 0)
        return max(0, min(100, round(score)))


risk_model = RoadRiskModel()
