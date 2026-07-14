const fs = require('fs');
const path = require('path');

const KNOWLEDGE_BASE = fs.readFileSync(
  path.join(__dirname, '../../data/knowledge-base.md'),
  'utf-8'
);

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 800;
const MAX_QUERY_LENGTH = 500;

const SYSTEM_PROMPT = `You recommend the most cost-efficient LLM for a task a user describes, based strictly on the knowledge base below. Do not use outside knowledge about models, prices, or benchmarks — only what's in the knowledge base.

Given the user's goal, do the following:
1. Identify which task(s) in the Task Taxonomy (T1-T21) it matches best.
2. Pick a Budget, Balanced, and Premium recommendation for that task from the Capability-to-Task Mapping tables, using the actual model names and prices listed there.
3. Write one short, plain-English sentence explaining why the budget pick is usually enough, referencing the task's insight/notes if useful.

Respond with ONLY a JSON object, no markdown code fences, no extra text, matching exactly this shape:
{
  "task": "short label for the identified task, e.g. 'Text summarization'",
  "budget": {"model": "...", "price": "...", "why": "..."},
  "balanced": {"model": "...", "price": "...", "why": "..."},
  "premium": {"model": "...", "price": "...", "why": "..."},
  "summary": "one sentence overall recommendation"
}

If the user's request is empty, nonsensical, or not about an AI/LLM task, respond with:
{"error": "Please describe a task you want to use AI for, e.g. 'summarize a transcript' or 'write code for a website'."}

Knowledge base:

${KNOWLEDGE_BASE}`;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let query;
  try {
    query = JSON.parse(event.body || '{}').query;
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  if (typeof query !== 'string' || !query.trim()) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Please describe what you want to achieve.' }) };
  }
  query = query.trim().slice(0, MAX_QUERY_LENGTH);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server misconfigured: missing API key.' }) };
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: query }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error', response.status, errText);
      return { statusCode: 502, body: JSON.stringify({ error: 'Recommendation service is temporarily unavailable.' }) };
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? '';
    const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '');

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('Failed to parse model output', text);
      return { statusCode: 502, body: JSON.stringify({ error: 'Could not parse a recommendation. Please try rephrasing your request.' }) };
    }

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(parsed),
    };
  } catch (err) {
    console.error('Unexpected error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Unexpected server error.' }) };
  }
};
