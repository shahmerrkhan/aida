export async function generatePromptWithGroq(payload) {
  const response = await fetch('/api/generate-prompt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 429) throw new Error('RATE_LIMIT');
    if (data.error === 'SERVER_MISCONFIGURED' || data.error === 'UPSTREAM_KEY_INVALID') throw new Error('INVALID_KEY');
    throw new Error(data.error || 'API Error');
  }

  if (!data.prompt) throw new Error('No prompt generated');
  return data.prompt;
}