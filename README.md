# Which LLM?

A tiny site that recommends the cheapest LLM that's good enough for a task you describe — and what to use if you need more quality.

**Live:** https://whichllm.netlify.app

## How it works

1. You type what you want to do with AI (e.g. "summarize a transcript", "build a website with auth").
2. The frontend sends that text to a Netlify Function (`/api/recommend`).
3. The function calls Claude Haiku 4.5, grounding it in [`data/knowledge-base.md`](data/knowledge-base.md) — a snapshot of model pricing, benchmarks, and a task taxonomy (T1–T21) with pre-researched budget/balanced/premium picks per task.
4. Claude classifies the request into a task category and returns a **Budget**, **Balanced**, and **Premium** model recommendation via a forced tool call (structured output, not freehand text — see notes below on why).
5. The frontend renders the three picks as cards.

Everything is stateless — no database, no user accounts, no request logging. Each query is a single, independent API call.

## Stack

- **Frontend:** plain HTML/CSS/JS (`index.html`, `styles.css`, `script.js`), no framework or build step.
- **Backend:** one Netlify Function (`netlify/functions/recommend.js`), no dependencies — uses Node's built-in `fetch` to call the Anthropic API directly.
- **Hosting:** Netlify, auto-deploying from `main`.

## Project structure

```
index.html                     # page markup
styles.css                     # styling
script.js                      # form handling, example chips, rendering results
netlify.toml                   # Netlify build/function/redirect config
netlify/functions/recommend.js # serverless function that calls the Anthropic API
data/knowledge-base.md         # the model/pricing/task knowledge base, bundled with the function
```

## Running locally

```bash
npx netlify-cli dev
```

This serves the static site and the function together at `http://localhost:8888`. You'll need an `ANTHROPIC_API_KEY` environment variable available to the function (e.g. via `netlify env:set` or a local `.env`, which is gitignored) for real API calls to succeed — without it, the function returns a clean "Server misconfigured" error instead of crashing.

## Deployment

Connected to Netlify with auto-deploy on push to `main`. The only required environment variable in the Netlify dashboard (Site configuration → Environment variables) is:

- `ANTHROPIC_API_KEY` — your Anthropic API key. Never committed to the repo.

## Design notes

- **Structured output via tool use, not freehand JSON:** early versions asked Claude to reply with raw JSON text, which occasionally broke on longer/compound queries (truncation, stray prose). Switching to a forced tool call (`tool_choice`) makes the API return pre-parsed structured input instead, removing that failure mode.
- **Flat tool schema:** the tool's input schema uses flat fields (`budget_model`, `budget_price`, `budget_why`, etc.) rather than nested objects — smaller/faster models are more reliable filling flat schemas than deeply nested ones.
- **No rate limiting yet:** this is a low-traffic personal project; if the link gets shared widely, keep an eye on the [Anthropic Console usage dashboard](https://platform.claude.com) and add per-IP rate limiting if needed.
- **Knowledge base is a static snapshot** (dated July 2026) bundled into the repo, not fetched live — prices and benchmarks drift, so treat it as a point-in-time reference and refresh `data/knowledge-base.md` periodically.
