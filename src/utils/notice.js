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
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error('Missing Groq key');
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are a senior government legal officer drafting official PWD repair notices under the Motor Vehicles Act 1988. Write formal, legally precise language. Include section references, penalty clauses, and 30-day compliance deadlines.' },
        { role: 'user', content: `Generate an official PWD repair notice for Road: ${road.name} (${road.nhNumber}), Location: ${road.lat},${road.lng}, Black Spot ID: ${road.id}, Risk Score: ${road.riskScore || road.risk}%, Deaths last 3 years: ${road.deaths}, District: ${road.district}, State: ${road.state}, PWD Division: ${road.division}, Contractor: ${road.contractor}. Include MoRTH circular reference, Section 138(1) MV Act, BCCW Act penalty clause, 30-day deadline, auto-addressed to District Collector + PWD Chief Engineer.` }
      ],
      max_tokens: 2048,
      stream: true
    })
  });
  if (!response.ok || !response.body) throw new Error('Groq failed');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      const trimmed = line.replace(/^data:\s*/, '').trim();
      if (!trimmed || trimmed === '[DONE]') continue;
      const parsed = JSON.parse(trimmed);
      const content = parsed.choices?.[0]?.delta?.content || '';
      if (content) onChunk(content);
    }
  }
}
