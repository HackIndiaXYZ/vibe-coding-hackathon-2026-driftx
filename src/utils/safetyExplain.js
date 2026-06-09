const localTemplates = {
  en: {
    warning: (zone) => zone.languageWarnings.en,
    reason: (zone) => zone.riskReason,
    prevention: (zone) => zone.prevention,
    authoritySummary: (zone) => zone.authoritySummary || `${zone.severity.toUpperCase()} road hazard reported at ${zone.road}. Repair or field inspection recommended.`
  },
  hi: {
    warning: (zone) => zone.languageWarnings.hi,
    reason: (zone) => zone.riskReason || 'यह जगह चालकों के लिए खतरनाक हो सकती है।',
    prevention: (zone) => zone.prevention || 'गति कम करें और सावधानी से चलें।',
    authoritySummary: (zone) => zone.authoritySummary || `${zone.road} पर सड़क खतरा मिला। मरम्मत की जरूरत है।`
  },
  mr: {
    warning: (zone) => zone.languageWarnings.mr,
    reason: (zone) => zone.riskReason || 'ही जागा वाहनचालकांसाठी धोकादायक असू शकते.',
    prevention: (zone) => zone.prevention || 'गती कमी करा आणि सावधपणे चला.',
    authoritySummary: (zone) => zone.authoritySummary || `${zone.road} येथे रस्त्याचा धोका आढळला. दुरुस्ती शिफारस केली आहे.`
  }
};

export function fallbackSafetyExplanation(zone, language) {
  const templates = localTemplates[language] || localTemplates.en;
  return {
    warning: templates.warning(zone),
    voiceAlert: templates.warning(zone),
    reason: templates.reason(zone),
    prevention: templates.prevention(zone),
    authoritySummary: templates.authoritySummary(zone)
  };
}

export async function fetchSafetyExplanation(zone, mode, language) {
  const fallback = fallbackSafetyExplanation(zone, language);
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:8000'}/api/safety-explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dangerType: zone.type,
        severity: zone.severity,
        userMode: mode,
        language,
        roadContext: `${zone.road}, ${zone.city}. Risk ${zone.risk}. Recommended speed ${zone.recommendedSpeed} km/h. ${zone.riskReason}`
      })
    });
    if (!response.ok) return fallback;
    const parsed = await response.json();
    return {
      warning: parsed.warning || fallback.warning,
      voiceAlert: parsed.voiceAlert || parsed.warning || fallback.voiceAlert,
      reason: parsed.reason || fallback.reason,
      prevention: parsed.prevention || fallback.prevention,
      authoritySummary: parsed.authoritySummary || fallback.authoritySummary
    };
  } catch {
    return fallback;
  }
}
