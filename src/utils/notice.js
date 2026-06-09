export const mockNotice = (road) => `To,
The District Collector, ${road.district}
The Chief Engineer, Public Works Department, ${road.state}

Subject: Emergency repair notice for notified road black spot ${road.blackSpotId || road.id} on ${road.name} under Section 138(1), Motor Vehicles Act, 1988.

Sir/Madam,

RoadSense AI has identified ${road.name} (${road.nhNumber}) as a critical accident-prone black spot with a ${road.riskScore || road.risk}% probability of severe crash occurrence in the next 48 hours. The location has recorded ${road.deaths} deaths in the last three years and requires immediate engineering intervention.

You are hereby directed to complete black spot rectification including crash barriers, rumble strips, lane marking, illumination, speed calming, drainage correction, and warning signage within 30 days of receipt of this notice.

This notice refers to MoRTH black spot rectification circulars, Section 138(1) of the Motor Vehicles Act, 1988, and applicable contractor accountability provisions under the Building and Other Construction Workers framework. Failure to comply may trigger recovery of public loss, contractor penalty proceedings, and escalation to the State Road Safety Council.

Contractor on record: ${road.contractor || 'PWD empanelled contractor'}.

Issued for immediate compliance.

Authorized Officer
Ministry of Road Transport & Highways`;

export async function streamGroqNotice(road, onChunk) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:8000'}/api/notice-stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(road)
  });
  if (!response.ok || !response.body) throw new Error('Groq failed');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    const content = decoder.decode(value, { stream: true });
    if (content) onChunk(content);
  }
}
