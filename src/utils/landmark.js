const fallbackLandmark = 'पेट्रोल पंप के बाद';

export async function generateHindiLandmark(spot) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:8000'}/api/landmark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: spot.name, district: spot.district })
    });
    if (!response.ok) return fallbackLandmark;
    const data = await response.json();
    return data.landmark?.trim() || fallbackLandmark;
  } catch {
    return fallbackLandmark;
  }
}
