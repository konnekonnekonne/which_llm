const fs = require('fs');
const path = require('path');

const KNOWLEDGE_BASE = fs.readFileSync(
  path.join(__dirname, '../../data/knowledge-base.md'),
  'utf-8'
);

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 1024;
const MAX_QUERY_LENGTH = 500;

const SYSTEM_PROMPT = `You recommend the most cost-efficient LLM for a task a user describes, based strictly on the knowledge base below. Do not use outside knowledge about models, prices, or benchmarks — only what's in the knowledge base.

Given the user's goal, do the following:
1. Identify which task in the Task Taxonomy (T1-T21) it matches best. If the request spans multiple tasks (e.g. "build a website with auth, backend, and deployment"), pick the single most complex/dominant task it implies — that's usually the one that should drive the model choice.
2. Pick a Budget, Balanced, and Premium recommendation for that task from the Capability-to-Task Mapping tables, using the actual model names and prices listed there.
3. Write ONE short sentence per tier explaining the pick (not a paragraph, not multiple sentences).

Call the provide_recommendation tool with your answer. Keep every field brief — this is a quick-glance UI, not a report.

If the user's request is empty, nonsensical, or not about an AI/LLM task, call the tool with only the "error" field set.

Knowledge base:

${KNOWLEDGE_BASE}`;

// Flat schema (no nested objects) — smaller/faster models are more reliable
// filling flat fields than deeply nested tool-use inputs.
const TOOLS = [
  {
    name: 'provide_recommendation',
    description: "Return the budget/balanced/premium model recommendation for the user's task, or an error if the input isn't a usable AI-task request.",
    input_schema: {
      type: 'object',
      properties: {
        error: {
          type: 'string',
          description: 'Set only when the request is empty, nonsensical, or not about an AI/LLM task. Omit this field entirely otherwise.',
        },
        task: { type: 'string', description: "Short label for the identified task, e.g. 'Text summarization'" },
        budget_model: { type: 'string' },
        budget_price: { type: 'string' },
        budget_why: { type: 'string', description: 'One short sentence.' },
        balanced_model: { type: 'string' },
        balanced_price: { type: 'string' },
        balanced_why: { type: 'string', description: 'One short sentence.' },
        premium_model: { type: 'string' },
        premium_price: { type: 'string' },
        premium_why: { type: 'string', description: 'One short sentence.' },
        summary: { type: 'string', description: 'One sentence overall recommendation.' },
      },
    },
  },
];

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
        tools: TOOLS,
        tool_choice: { type: 'tool', name: 'provide_recommendation' },
        messages: [{ role: 'user', content: query }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error', response.status, errText);
      return { statusCode: 502, body: JSON.stringify({ error: 'Recommendation service is temporarily unavailable.' }) };
    }

    const data = await response.json();
    const toolUse = data.content?.find((block) => block.type === 'tool_use');

    if (!toolUse) {
      console.error('No tool_use block in response', JSON.stringify(data));
      return { statusCode: 502, body: JSON.stringify({ error: 'Could not parse a recommendation. Please try rephrasing your request.' }) };
    }

    const input = toolUse.input || {};

    if (input.error) {
      return {
        statusCode: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: input.error }),
      };
    }

    const result = {
      task: input.task,
      budget: { model: input.budget_model, price: input.budget_price, why: input.budget_why },
      balanced: { model: input.balanced_model, price: input.balanced_price, why: input.balanced_why },
      premium: { model: input.premium_model, price: input.premium_price, why: input.premium_why },
      summary: input.summary,
    };

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(result),
    };
  } catch (err) {
    console.error('Unexpected error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Unexpected server error.' }) };
  }
};
