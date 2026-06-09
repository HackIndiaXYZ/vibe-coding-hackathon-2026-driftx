const fallbackLandmark = 'पेट्रोल पंप के बाद';

export async function generateHindiLandmark(spot) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) return fallbackLandmark;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Return one short Hindi driving landmark phrase only. No punctuation, no explanation.' },
          { role: 'user', content: `Generate a recognizable roadside landmark warning phrase for ${spot.name}, ${spot.district}, India. Example style: पेट्रोल पंप के बाद` }
        ],
        max_tokens: 32,
        stream: true
      })
    });
    if (!response.ok || !response.body) return fallbackLandmark;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let landmark = '';
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
        landmark += parsed.choices?.[0]?.delta?.content || '';
      }
    }
    return landmark.trim() || fallbackLandmark;
  } catch {
    return fallbackLandmark;
  }
}
