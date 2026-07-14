# The Cost-Efficient LLM Knowledge Base (July 2026)

**Data gathered: July 14, 2026.** All pricing is USD per million tokens (input/output) at standard list rates unless noted. Pricing and model rosters change weekly — treat every number as "verify before production." Fields flagged ⚠️ are contested between sources or self-reported by vendors. This document is structured for machine parsing (consistent tables + field names) while preserving the reasoning behind each capability tier.

## TL;DR

- **The cheapest "good enough" model beats the frontier for most everyday tasks.** For summarization, proofreading, classification, extraction, simple Q&A and email drafting — which dominate real usage — sub-$0.50/M models (Gemini Flash-Lite, DeepSeek V4 Flash, GPT-5.6 Luna, Claude Haiku 4.5, Amazon Nova Micro/Lite) deliver ~90–95% of frontier quality at 10–100× lower cost. Reserve premium models (Claude Opus 4.8, GPT-5.6 Sol, Gemini 3.1 Pro) for complex software engineering, hard math/reasoning, agentic workflows and high-stakes analysis.
- **A three-tier routing architecture (budget → mid → premium) typically cuts spend 50–80%** versus defaulting every call to a flagship, because output-token prices span a ~144× range within a single vendor (OpenAI GPT-5.4-nano output $1.25/M vs GPT-5.5-pro output $180/M).
- **Chinese open-weight models (DeepSeek V4, Qwen, Kimi, GLM, MiniMax) reset the price-performance frontier in 2026** — DeepSeek V4 Pro scores 80.6% SWE-bench Verified at $0.435/$0.87, roughly 30× cheaper than Claude Opus 4.8 output for a ~8-point capability gap. The core cost-efficiency insight of this site: capability and price no longer track linearly; the last 7–15 benchmark points cost 20–50× more.

## Key Findings

1. **Usage is heavily concentrated in a few task types.** Anthropic's fourth Economic Index report (published January 15, 2026, analyzing ~2M November 2025 conversations) found that "computer and mathematical tasks—like modifying software to correct errors—continue to dominate Claude usage overall, representing a third of conversations on Claude.ai and nearly half of 1P API traffic" (API 52% vs Claude.ai 36%), and that "'modifying software to correct errors' alone is 6% of consumer usage and 10% of enterprise API usage." OpenAI's NBER Working Paper 34255, "How People Use ChatGPT" (Chatterji, Cunningham, Deming, Hitzig, Ong, Shan & Wadman; published Sept 15 2025; 1.5M messages from 130,000 users, May 2024–July 2025), found that "nearly 80% of all ChatGPT usage falls into three broad categories, which we call Practical Guidance, Seeking Information, and Writing." Per the same paper: "Practical Guidance has remained constant at roughly 29% of overall usage. Writing has declined from 36% of all usage in July 2024 to 24% a year later. Seeking Information has grown from 14% to 24% of all usage over the same period." Writing is the most common *work* task: "Writing is the most common use case at work, accounting for 40% of work-related messages on average in June 2025. About two-thirds of all Writing messages ask ChatGPT to modify user text (editing, critiquing, translating, etc.) rather than creating new text from scratch." Notably, "computer programming is only about 4.2% of all ChatGPT messages" among consumers, even though coding dominates API/enterprise use. This validates prioritizing cheap models for summarization/editing/Q&A.

2. **Within-vendor price ladders are enormous.** OpenAI spans GPT-5.4-nano ($0.20/$1.25) to GPT-5.5-pro ($30/$180) — a 144× output spread. Anthropic spans Haiku 4.5 ($1/$5) to Fable 5 ($10/$50). Google spans Gemini 3.1 Flash-Lite ($0.25/$1.50) to Gemini 3.1 Pro ($2/$12, doubling above 200K tokens). Matching task to tier is the single biggest cost lever.

3. **Caching and batch discounts are underused and huge.** Prompt caching cuts repeated input by 90% on most providers; batch APIs cut everything 50%. DeepSeek's automatic cache-hit pricing drops V4 Flash input to $0.0028/M. Agentic coding loops with stable prefixes routinely see >70% cache hit rates.

4. **Open-weight models are now a genuine default, not a fallback.** GLM 5.2, MiniMax M3, Kimi K2.6/K2.7, DeepSeek V4 and Qwen 3.6 are MIT/Apache licensed and priced a fraction of closed frontier. The open-vs-closed gap has narrowed to single digits on coding/reasoning but persists (5–18 pts) on graduate science (GPQA), long-context retrieval and hardest reasoning.

5. **Benchmark caveats matter.** GPQA Diamond is saturated (top models cluster 90–94%), so SWE-bench Pro and HLE are now the better discriminators. Vendor-reported scores run higher than independent harnesses (GPT-5.5 SWE-bench Verified: 88.7% vendor vs 82.6% Vals.ai). Several June 2026 models (Kimi K2.7, GPT-5.6) withheld traditional benchmarks. SWE-bench Verified (500 tasks) and SWE-bench Pro (Scale AI's harder 1,865-task set) are not interchangeable — Pro runs 10–30 pts lower.

## Task Taxonomy

Ordered simple → complex, refined from the Anthropic Economic Index and OpenAI usage studies:

| ID | Task | Complexity | Notes on what it demands |
|----|------|-----------|--------------------------|
| T1 | Text summarization (transcripts, docs) | Simple–Medium | Cheap models excel; long docs need big context |
| T2 | Simple Q&A / factual lookup | Simple | Cheap models fine; grounding/search helps accuracy |
| T3 | Grammar / proofreading / editing | Simple | Highest-volume writing subtask; cheap models excel |
| T4 | Translation | Simple–Medium | Multilingual models (Qwen, Gemini) strong |
| T5 | Email / message drafting | Simple | Cheap models fine |
| T6 | Content writing (blog, marketing) | Medium | Mid-tier sweet spot; style matters |
| T7 | Creative writing (fiction, poetry) | Medium–Complex | Premium models notably better on voice/coherence |
| T8 | Brainstorming / ideation | Simple–Medium | Cheap–mid fine |
| T9 | Data extraction / structuring (JSON) | Simple–Medium | Cheap models with structured output fine |
| T10 | Classification / sentiment | Simple | Cheapest models excel; the canonical budget task |
| T11 | Code generation (simple scripts) | Medium | Mid-tier or cheap coding specialists fine |
| T12 | Complex software engineering / agentic coding | Complex | Premium; SWE-bench is the discriminator |
| T13 | Math / quantitative reasoning | Medium–Complex | Reasoning mode essential; small models weak |
| T14 | Scientific / research analysis | Complex | Premium reasoning models |
| T15 | Long-document analysis (large context) | Medium–Complex | Context window + recall; Gemini/Grok/DeepSeek |
| T16 | Image understanding / OCR | Medium | Multimodal models; Nova Lite, Gemini Flash cheap |
| T17 | Image generation | Medium | Separate model class (Gemini Flash Image, GPT Image) |
| T18 | Audio transcription | Simple–Medium | Per-minute pricing; Whisper/GPT-4o-transcribe/Parakeet |
| T19 | Audio / voice generation & realtime | Medium | TTS + realtime speech models |
| T20 | Agentic / tool-use workflows | Complex | Tool-calling reliability + long-horizon stability |
| T21 | Role-play / conversational companionship | Simple–Medium | Cheap–mid fine; niche in usage data (~2–4%) |

## Model Database

Access-type flags: **api** = per-token API; **chat** = consumer app; **self** = open weights self-hostable. Speed tiers are relative (fast/medium/slow). Prices USD per 1M tokens (input/output).

### Anthropic (Claude)

| Model | API ID | Access | Price in/out | Context / max out | Modalities | Reasoning | Speed | Released | Optimized for |
|-------|--------|--------|--------------|-------------------|-----------|-----------|-------|----------|---------------|
| Claude Opus 4.8 | claude-opus-4-8 | api, chat | $5 / $25 | 1M / — | text, image | Yes (adaptive, effort low/high/xhigh/max) | slow | May 28 2026 | Hardest agentic coding, reasoning |
| Claude Fable 5 | (fable-5) | api, chat | $10 / $50 | 1M | text, image | Yes | slow | Jun 9 2026 | Flagship max quality, coding (95% SWE-bench ⚠️) |
| Claude Sonnet 5 | claude-sonnet-5 | api, chat | $2 / $10 (intro thru Aug 31 2026; then $3/$15) | 1M | text, image | Yes | medium | ~Jun 2026 | Balanced production, Opus-class coding cheaper |
| Claude Sonnet 4.6 | claude-sonnet-4-6 | api, chat | $3 / $15 | 1M | text, image | Yes | medium | Feb 2026 | Balanced workhorse |
| Claude Haiku 4.5 | claude-haiku-4-5 | api, chat | $1 / $5 | 200K | text, image | Yes | fast | Oct 2025 | Cheapest Claude: classification, routing, extraction |

**Benchmarks (Anthropic system cards / llm-stats):** Opus 4.8 — SWE-bench Verified 88.6%, SWE-bench Pro 69.2%, GPQA Diamond 93.6%, HLE (tools) 57.9%. Sonnet 5 — SWE-bench Verified 85.2%, Pro 63.2%. Sonnet 4.6 — SWE-bench Verified 79.6%, GPQA 89.9%. Haiku 4.5 — SWE-bench Verified 73.3%, AIME 2025 80.7%.

Notes: Batch API −50%; prompt caching cache-reads at 10% of input. Opus 4.7+/Fable 5/Sonnet 5 use a newer tokenizer generating ~30–35% more tokens per text — budget for it on migration. Opus 4.8 Fast Mode $10/$50. Legacy Opus 4.1 $15/$75, Opus 3 $15/$— (migrate). Mythos 5 ($10/$50) is trusted-access only.

### OpenAI

| Model | API ID | Access | Price in/out | Context | Modalities | Reasoning | Speed | Released | Optimized for |
|-------|--------|--------|--------------|---------|-----------|-----------|-------|----------|---------------|
| GPT-5.6 Sol | gpt-5.6-sol | api, chat | $5 / $30 | 1M | text, image | Yes | slow | Jun 2026 | Hardest coding, research, cybersecurity, agents |
| GPT-5.6 Terra | gpt-5.6-terra | api | $2.50 / $15 | 1M | text, image | Yes | medium | Jun 2026 | Default production coding, assistants |
| GPT-5.6 Luna | gpt-5.6-luna | api | $1 / $6 | 1M | text, image | Yes | fast | Jun 2026 | Extraction, classification, summarization, routing |
| GPT-5.5 | gpt-5.5 | api, chat | $5 / $30 | 1M (922K in/128K out) | text, image | Yes | slow | Apr 24 2026 | Frontier reasoning/coding (prior flagship) |
| GPT-5.5 Pro | gpt-5.5-pro | api, chat | $30 / $180 | 1M | text, image | Yes | slow | Apr 2026 | Max accuracy, extended reasoning |
| GPT-5.4 | gpt-5.4 | api | $2.50 / $15 | 1M+ | text, image | Yes | medium | Mar 2026 | Mid-tier production (legacy-ish) |
| GPT-5.4 mini | gpt-5.4-mini | api | $0.75 / $4.50 | 400K | text, image | Yes | fast | Mar 2026 | Cheap capable tier |
| GPT-5.4 nano | gpt-5.4-nano | api | $0.20 / $1.25 | — | text | limited | fast | Mar 2026 | Cheapest capable: routing, extraction |
| GPT-4.1 nano | gpt-4.1-nano | api | $0.10 / $0.40 | — | text | No | fast | 2025 | Cheapest overall: routing, classification |
| GPT-5.3-Codex | gpt-5.3-codex | api | $1.75 / $14 | — | text | Yes | medium | Feb 2026 | Code review / Codex |

**Benchmarks:** GPT-5.5 — SWE-bench Verified 88.7% vendor / 82.6% Vals.ai independent, SWE-bench Pro 58.6%, GPQA Diamond ~93.6%, AIME 2025 100%. GPT-5.6 Sol — SWE-bench Pro 64.6%, GPQA 94.6% ⚠️ (disputed provenance; OpenAI foregrounded only agentic benchmarks — Terminal-Bench 2.1 88.8%), AA Intelligence Index 58.9 (leads AA leaderboard). OpenAI withheld standard benchmarks for the 5.6 family.

Multimodal & audio (OpenAI): **GPT Image** (image gen, per-image/token); **Sora 2** video $0.10/sec @720p, **Sora 2 Pro** $0.30–$0.70/sec; **gpt-4o-transcribe** $0.006/min, **gpt-4o-mini-transcribe** $0.003/min, **whisper-1** $0.006/min; **gpt-realtime-whisper** $0.017/min streaming; **gpt-realtime-2** audio $32/$64 per 1M tokens; **gpt-realtime-translate** $0.034/min; **tts-1** $15/1M chars. Batch −50%; cached input −90%. Note reasoning models bill hidden thinking tokens at output rate (3–10× cost multiplier).

### Google (Gemini + Gemma)

| Model | API ID | Access | Price in/out | Context | Modalities | Reasoning | Speed | Released | Optimized for |
|-------|--------|--------|--------------|---------|-----------|-----------|-------|----------|---------------|
| Gemini 3.1 Pro | gemini-3.1-pro-preview | api, chat | $2 / $12 (≤200K); $4 / $18 (>200K) | 1M–2M ⚠️ | text, image, audio, video | Yes | slow | Feb 19 2026 | Frontier reasoning, multimodal, vibe-coding |
| Gemini 3.5 Flash | gemini-3.5-flash | api, chat | $1.50 / $9 ($0.15 cached) | 1M / 64K | text, image, audio, video | Yes | fast | May 19 2026 | Premium Flash: coding+agentic, multimodal |
| Gemini 3 Flash | gemini-3-flash | api | $0.50 / $3 | 1M | text, image, audio, video | Yes | fast | 2026 | Prior Flash, cheaper workhorse |
| Gemini 3.1 Flash-Lite | gemini-3.1-flash-lite | api | $0.25 / $1.50 | 1M | text, image, video | limited | fast | Mar 3 2026 | Cheapest current: classification, routing, volume |
| Gemini 2.5 Flash-Lite | gemini-2.5-flash-lite | api | $0.10 / $0.40 | 1M | text, image | No | fast | 2025 | Absolute budget floor (legacy) |
| Gemini 2.5 Pro | gemini-2.5-pro | api | $1.25 / $10 | 2M | text, image, audio, video | Yes | medium | 2025 | Legacy flagship, still strong |

**Benchmarks:** Gemini 3.1 Pro — SWE-bench Verified 80.6%, Pro 54.2%, GPQA Diamond 94.3%, AA Index 57. Gemini 3.5 Flash — SWE-bench Pro 55.1%, GPQA 92.2%, AA Index 55.3 (beats 3.1 Pro on agentic/coding; 3.1 Pro wins pure reasoning).

Gemma open models (**self**, Apache 2.0, released Mar 31 2026): Gemma 4 E2B (2.3B eff), E4B (4.5B eff), 26B MoE (3.8B active), 31B Dense. Multimodal (text+image all; audio on E2B/E4B), 256K context, 140+ languages. 31B ranked ~#3 open on Arena text; runs on single 80GB H100 or (quantized) RTX 4090. Image/video: Gemini 3.1 Flash Image ($0.045–$0.15/image by resolution), Gemini 3 Pro Image, Veo 3.1 (video), Gemini Omni Flash (video $0.10/sec). Batch −50%, caching −90%.

### xAI (Grok)

| Model | API ID | Access | Price in/out | Context | Modalities | Reasoning | Speed | Released | Optimized for |
|-------|--------|--------|--------------|---------|-----------|-----------|-------|----------|---------------|
| Grok 4.5 | grok-4.5 | api, chat | $2 / $6 ($0.50 cached) | 500K | text, image | Yes (non-reasoning + reasoning) | medium | Jul 8 2026 | Flagship: coding, agentic tool-calling, low hallucination |
| Grok 4.3 | grok-4.3 | api, chat | $1.25 / $2.50 ($0.20 cached) | 1M | text, image | Yes (reasoning_effort) | medium | 2026 | Cheaper long-context option |
| Grok 4.1 Fast | grok-4.1-fast | api | $0.20 / $0.50 | 2M | text | Yes | fast | 2026 | Cheapest frontier-adjacent, huge context |
| grok-build-0.1 | grok-build-0.1 | api | $1 / $2 | 256K | text | Yes | medium | May 29 2026 | Dedicated coding agent |

**Benchmarks:** Grok 4.5 — SWE-bench Pro 64.7%, Terminal-Bench 2.1 83.3%; standout token efficiency (~15,954 output tokens/SWE-Pro task vs 67,020 for Opus 4.8). xAI published only coding/efficiency benchmarks; GPQA/AIME not published for 4.5 (predecessor Grok 4.3 ~90.1% GPQA). Knowledge cutoff Feb 1 2026.

Notes: xAI free API credits up to $175/mo via data-sharing (⚠️ treat as possibly ended for new accounts). Real-time X/web search grounding is a differentiator. Server tools billed separately ($5/1K web-search calls). Batch −50%.

### DeepSeek

| Model | API ID | Access | Price in/out | Context | Modalities | Reasoning | Speed | Released | Optimized for |
|-------|--------|--------|--------------|---------|-----------|-----------|-------|----------|---------------|
| DeepSeek V4 Pro | deepseek-v4-pro | api, self | $0.435 / $0.87 ($0.0036 cached) | 1M / 384K | text | Yes (thinking toggle) | medium | Apr 24 2026 | Frontier-class coding/reasoning at rock-bottom cost |
| DeepSeek V4 Flash | deepseek-v4-flash | api, self | $0.14 / $0.28 ($0.0028 cached) | 1M | text | Yes (thinking toggle) | fast | Apr 2026 | High-volume: chat, extraction, agent subtasks |

**Benchmarks:** V4 Pro — SWE-bench Verified 80.6% (highest open-weight, tied w/ Gemini 3.1 Pro), SWE-bench Pro 55.4%, GPQA Diamond 90.1%, MMLU-Pro 87.5%, AIME/HMMT 2026 95.2%, Codeforces 3206. ⚠️ Scores are official self-reported (SWE-Verified independently confirmed via llm-stats). Knowledge/other benchmarks weaker (SimpleQA-Verified 57.9%).

Notes: MIT license (Pro 1.6T/49B active; Flash 284B/13B active), weights on HuggingFace. Legacy `deepseek-chat`/`deepseek-reasoner` deprecate Jul 24 2026. Self-host: Flash on single H200 (141GB); Pro needs multi-GPU. Cache-hit pricing is automatic and the load-bearing cost lever. ⚠️ Serverless third-party hosts often fp8-quantize, degrading quality below reference weights.

### Alibaba (Qwen)

| Model | API ID | Access | Price in/out | Context | Modalities | Reasoning | Speed | Released | Optimized for |
|-------|--------|--------|--------------|---------|-----------|-----------|-------|----------|---------------|
| Qwen3.7-Max | qwen3.7-max | api | $1.25–$2.50 / $3.75–$7.50 ⚠️ | 1M | text | Yes | medium | May 2026 | Closed flagship: agentic coding, long-horizon |
| Qwen3.5-Plus | qwen3.5-plus | api | $0.40 / $2.40 (steps up >256K) | 262K–1M | text, image | Yes | medium | Feb 16 2026 | Balanced MoE workhorse |
| Qwen3.6 Plus | qwen3.6-plus | api | ~$0.33 / $1.95 | 1M | text, image | Yes | medium | Apr 2 2026 | Agentic coding, front-end |
| Qwen3.6-35B-A3B | (open) | api, self | ~$0.15 / $1.00 | 262K–1M | text, image | Yes (toggle) | fast | Apr 16 2026 | Cheapest hosted; open-weight; edge/RTX 4090 |
| Qwen3.6-27B | (open) | self | free (self-host) | 262K | text, image | Yes | medium | Apr 22 2026 | Best local coding on single consumer GPU |
| Qwen3-Coder 480B-A35B | (open) | api, self | varies | 262K | text | No | medium | Jul 2025 | Dedicated agentic coding |

**Benchmarks:** Qwen3.7-Max — SWE-bench Verified 80.4%, SWE-bench Pro 60.6% (highest *proprietary*), GPQA Diamond 92.4%, math avg ~97.1%. Qwen3.6-27B — SWE-bench Verified 77.2% (beats the much larger 3.5 flagship on coding). Qwen3.6-35B-A3B — SWE-bench Verified 73.4%.

Notes: Open models Apache 2.0 (35B and below, plus the 397B exception); Qwen3.7/3.6-Max closed. 201 languages. Qwen3.5-9B runs on 16GB VRAM; strong small-model line (0.8B–9B) for edge. ⚠️ Token-verbose (higher effective cost); China-hosted API has data-residency considerations.

### Meta (Llama / Muse Spark)

| Model | Access | Price (hosted) | Context | Modalities | Reasoning | Released | Optimized for |
|-------|--------|---------------|---------|-----------|-----------|----------|---------------|
| Llama 4 Maverick | api, self | ~$0.80 out (Bedrock) | 1M | text, image | No | Apr 2025 | Open generalist (a generation behind) |
| Llama 4 Scout | api, self | low | 10M | text, image | No | Apr 2025 | Largest context; single-GPU (Int4 on H100) |
| Muse Spark | chat ⚠️ | proprietary | — | text, image | Yes (Contemplating mode) | Apr 2026 | Meta's first closed multimodal reasoning model |

**Benchmarks:** Llama 4 Maverick — SWE-bench Verified ~74.2% ⚠️ (disputed; Llama 4 launch was criticized for benchmark gaming), GPQA Diamond 65.8% (well below all frontier models), MMLU 91.8%. Not a reasoning model; a generation behind.

Notes: Llama 4 uses the Llama 4 Community License (commercial use with MAU threshold conditions), not true open-source. Meta shipped no new open-weight Llama through mid-2026; Behemoth (~2T) shelved; no Llama 5 as of July 2026 despite unverified reports. ⚠️ A widely-circulated "Llama 5" April 2026 article appears to be speculative/unreliable. Muse Spark marks Meta's pivot to proprietary.

### Other significant providers

| Model | Provider | Access | Price in/out | Context | Notes |
|-------|----------|--------|--------------|---------|-------|
| Kimi K2.6 | Moonshot | api, self | $0.95 / $4.00 (DeepInfra $0.75/$3.50) | 256K | 1T/32B active, Modified MIT, multimodal, Agent Swarm (300 sub-agents), 13-hr autonomous runs; #1 open AA Index (54) at launch. SWE-bench Verified 80.2%, Pro 58.6%, GPQA 90.5%, AIME 2026 96.4% |
| Kimi K2.7 Code | Moonshot | api, self | $0.74 / $3.50 (OpenRouter) | 256K | Jun 12 2026; coding-specialized, ~30% fewer thinking tokens; ⚠️ no independent public benchmarks yet — tier provisional |
| GLM 5.2 | Zhipu / Z.ai | api, self | $1.40 / $4.40 | 1M | Jun 13 2026; 744B/40B active, MIT; top open AA Index (51); SWE-bench Pro 62.1%, GPQA 91.2% ⚠️ (consensus value; conflicting 80–88% figures exist), AIME 2026 99.2%, HLE (tools) 54.7% |
| MiniMax M3 | MiniMax | api, self | $0.30 / $1.20 (steps up >512K) | 1M | ~May 2026; sparse attention (MSA), native video; SWE-bench Verified 80.5%, Pro 59.0%, GPQA ~92.9%, AA Index ~55; extremely cheap |
| Mistral Large 3 | Mistral | api, self | $0.50 / $1.50 | 256K | Dec 2025; EU jurisdiction, cheapest flagship-tier output; multimodal |
| Mistral Small 4 | Mistral | api, self | $0.15 / $0.60 | 128K | Apache 2.0; high-volume production |
| Mistral Small 3.2 | Mistral | api, self | $0.08 / $0.20 | 128K | Cheapest capable Mistral |
| Ministral 8B | Mistral | api, self | $0.10 / $0.10 | 128K | Edge/on-device |
| Codestral | Mistral | api, self | $0.30 / $0.90 | 256K | Code completion (FIM) specialist |
| Devstral 2 | Mistral | api, self | $0.40 / $2.00 | — | Coding agent |
| Amazon Nova Micro | Amazon | api | $0.035 / $0.14 | 128K | Cheapest on Bedrock; classification, extraction |
| Amazon Nova Lite | Amazon | api | $0.06 / $0.24 | 300K | Multimodal (image/video), OCR, doc workflows |
| Amazon Nova Pro | Amazon | api | $0.80 / $3.20 | 300K | Agents, RAG, ~10× cheaper than Claude Sonnet |
| Nova 2 Lite | Amazon | api | ~Nova Lite | — | Current-gen successor |
| Cohere Command | Cohere | api | ~$1.50 / $2.00 (per Bedrock example) | — | Enterprise RAG; Command R now legacy |
| Command R7B | Cohere | api | $0.0375 / $0.15 | — | One of cheapest first-party APIs |
| Cohere Embed v4 / Rerank 3.5 | Cohere | api | embed ~$0.10/M | — | Retrieval (active surface) |
| Microsoft Phi-4 | Microsoft | api, self | $0.07 / $0.14 | — | Small, cheap, Azure-native |
| NVIDIA Nemotron 3 Ultra | NVIDIA | api, self | $0.50 / $2.20 (free tier avail) | 1M | 550B/55B active, hybrid Mamba-Transformer, open; agent orchestration; AA Index 48 (highest US open-weight) |
| Nemotron 3 Nano 30B A3B | NVIDIA | api, self | $0.05 / $0.20 | 262K | Cheap open agentic small model |
| AI21 Jamba 1.5 Large/Mini | AI21 | api | Mini $0.20 / $0.40 | long | Hybrid Mamba-Transformer, long-context, regulated industries |

Audio/transcription (non-OpenAI): **NVIDIA Parakeet TDT 0.6B v3** — a 600M-parameter FastConformer-TDT model trained on the Granary dataset (670,000+ hours) achieving "a 6.34% average word error rate on the HuggingFace Open ASR Leaderboard" across 25 European languages, CC-BY-4.0 license, ~3,333× realtime (RTFx 3,332.74). Also **Deepgram Nova-3 / Flux** (voice-agent latency leader); **AWS Transcribe** $0.024/min. **Grok Voice Agent** named leading speech-reasoning model early 2026 ($3/hr realtime).

## Capability-to-Task Mapping (the core deliverable)

Capability tiers per task: **S** (frontier best) / **A** (excellent) / **B** (good enough for most) / **C** (usable with limits) / **D** (weak). For each task: **Budget pick** (cheapest good-enough), **Balanced pick** (best value mid), **Premium pick** (quality-critical).

### Simple tasks — cheap models are genuinely good enough

| Task | Budget pick (cheapest good-enough) | Balanced pick | Premium (only if quality critical) | Cost-efficiency insight |
|------|-----------------------------------|---------------|-----------------------------------|-------------------------|
| T1 Summarization | Gemini 3.1 Flash-Lite ($0.25/$1.50) or DeepSeek V4 Flash ($0.14/$0.28) — **B/A** | Gemini 3 Flash / GPT-5.6 Luna | Claude Sonnet 5 for nuanced/long | A RAG team cut summarization bill from $1,200→$38/mo switching GPT-4o→V4 Flash at same quality |
| T2 Simple Q&A | GPT-4.1 nano ($0.10/$0.40) or Nova Micro ($0.035/$0.14) — **B** | Gemini 3.5 Flash (add search grounding) | Gemini 3.1 Pro (grounded) | Add search grounding for factual accuracy rather than a bigger model |
| T3 Proofreading/editing | Nova Micro / GPT-4.1 nano / Ministral 8B — **A** | Mistral Small 4 | Claude Sonnet 5 | Highest-volume writing subtask (~⅔ of all ChatGPT writing is edits); smallest models excel |
| T4 Translation | Qwen3.6-35B ($0.15/$1.00, 201 langs) — **A** | Gemini 3.5 Flash | Gemini 3.1 Pro / GPT-5.6 Sol | Qwen/Gemini multilingual edge beats generic frontier |
| T5 Email drafting | Nova Micro / GPT-4.1 nano — **A** | Mistral Small 4 / Haiku 4.5 | — | Rarely needs more than budget |
| T8 Brainstorming | Gemini 3 Flash / DeepSeek V4 Flash — **B** | Grok 4.1 Fast / Sonnet 4.6 | Claude Opus 4.8 | Cheap models fine; premium adds range not correctness |
| T9 Data extraction/JSON | DeepSeek V4 Flash / Nova Micro — **A** | GPT-5.6 Luna / Gemini 3.1 Flash-Lite | Gemini 3.1 Pro (complex schemas) | Use structured-output mode; cheapest tier suffices |
| T10 Classification/sentiment | Nova Micro ($0.035/$0.14) or Gemini 2.5 Flash-Lite ($0.10/$0.40) — **A** | GPT-4.1 nano | — | The canonical budget task; frontier is pure waste here |
| T21 Role-play/companionship | DeepSeek V4 Flash / Grok 4.1 Fast — **B** | Grok 4.5 / Sonnet 4.6 | Claude Opus 4.8 (Fable 5 for creative depth) | Cheap–mid fine; premium adds persona coherence |

### Medium tasks — mid-tier is the sweet spot

| Task | Budget pick | Balanced pick | Premium pick | Insight |
|------|-------------|---------------|--------------|---------|
| T6 Content writing | Mistral Small 4 / Gemini 3 Flash — **B** | Gemini 3.5 Flash / Sonnet 4.6 — **A** | Claude Opus 4.8 / Fable 5 | Mid-tier handles most marketing/blog copy |
| T7 Creative writing | DeepSeek V4 Pro / Qwen — **C/B** | Sonnet 5 / Grok 4.5 — **A** | Claude Fable 5 / Opus 4.8 — **S** | One of the few tasks where premium is clearly better on voice/coherence |
| T11 Code (simple scripts) | Qwen3.6-35B / DeepSeek V4 Flash / Codestral — **A** | GPT-5.6 Luna / Devstral 2 | Sonnet 5 | Coding specialists at budget prices dominate here |
| T16 Image understanding/OCR | Nova Lite ($0.06/$0.24) / Gemini 3.1 Flash-Lite — **B** | Gemini 3.5 Flash — **A** | Gemini 3.1 Pro / Opus 4.8 (hi-res) | Nova Lite's 300K context + cheap vision is the budget OCR winner |
| T18 Audio transcription | gpt-4o-mini-transcribe ($0.003/min) / Parakeet (self, free) — **A** | gpt-4o-transcribe ($0.006/min) | gpt-4o-transcribe-diarize / Deepgram | Per-minute economics; mini tier fine for clean audio |

### Complex tasks — premium justified, but cheap open models close the gap

| Task | Budget pick (surprisingly capable) | Balanced pick | Premium pick | Insight |
|------|-----------------------------------|---------------|--------------|---------|
| T12 Complex SWE / agentic coding | DeepSeek V4 Pro (80.6% SWE-bench Verified, $0.435/$0.87) — **A** | Qwen3.7-Max (60.6% Pro) / GLM 5.2 (62.1% Pro) / Sonnet 5 (85.2% Verified) | Claude Opus 4.8 (88.6% Verified, 69.2% Pro) / GPT-5.6 Sol / Fable 5 — **S** | Last 7–15 SWE points cost 20–50× more per token; DeepSeek/MiniMax deliver ~80% Verified at ~1/30 the price |
| T13 Math / quant reasoning | DeepSeek V4 Pro (95.2% AIME/HMMT) / GLM 5.2 (99.2% AIME) — **A** | Qwen3.7-Max / Gemini 3.5 Flash | GPT-5.6 Sol / Gemini 3.1 Pro / Opus 4.8 — **S** | ⚠️ Small non-reasoning models (Nova Micro, nano) are **D** here — the classic "cheap but bad at math" trap. Reasoning mode is mandatory |
| T14 Scientific/research analysis | DeepSeek V4 Pro (90.1% GPQA) — **B/A** | Gemini 3.1 Pro (94.3% GPQA) | GPT-5.6 Sol (94.6% ⚠️) / Opus 4.8 (93.6%) — **S** | GPQA saturated at top; cheap open models within ~4 pts |
| T15 Long-document analysis | Grok 4.1 Fast (2M ctx, $0.20/$0.50) / DeepSeek V4 (1M) — **A** | Gemini 3.5 Flash (1M) | Gemini 3.1 Pro (2M) / Grok 4.5 | Grok 4.1 Fast's 2M context at budget price is the standout value; watch recall degradation before advertised max |
| T20 Agentic/tool-use workflows | MiniMax M3 ($0.30/$1.20) / Nemotron 3 Ultra — **B** | Kimi K2.6 (agent stability, 4000 tool calls) / GLM 5.2 | Claude Opus 4.8 (most reliable tool use) / GPT-5.6 Sol — **S** | Kimi K2.6 is the open budget champion for long-horizon stability; test tool-calling + latency before routing volume to cheap models |

### Multimodal generation (separate model classes)

- **T17 Image generation:** Budget — Gemini 3.1 Flash Image ($0.045–$0.15/image). Premium — GPT Image, Gemini 3 Pro Image (higher fidelity/text rendering).
- **T19 Audio/voice generation & realtime:** Budget — tts-1 ($15/1M chars). Realtime — gpt-realtime-2 ($32/$64 per 1M audio tokens), gpt-realtime-mini ($10/$20); Grok Voice ($3/hr). Video — Sora 2 ($0.10/sec), Veo 3.1, Gemini Omni Flash ($0.10/sec).

## Recommendations

**Staged adoption for a cost-efficient recommendation engine:**

1. **Default everything to a three-tier router now.** Budget tier for T1–T5, T8–T10, T21 (route to Gemini 3.1 Flash-Lite, DeepSeek V4 Flash, Nova Micro, or GPT-4.1 nano). Mid tier for T6, T11, T16, T18 (Gemini 3.5 Flash, Sonnet 4.6/5, Codestral). Premium tier for T12–T15, T20 (Opus 4.8, GPT-5.6 Sol, Gemini 3.1 Pro). Expected saving: 50–80% vs all-flagship.
2. **Turn on caching + batch before upgrading any model.** 90% cache savings on repeated prefixes and 50% batch discounts often beat a tier downgrade while keeping quality.
3. **Escalate on evidence, not vibes.** Run a 50-prompt eval on your actual traffic per task category. Escalate a task from budget→mid→premium only when the cheaper tier fails your quality bar on that eval.
4. **For math/reasoning/coding, never route to a non-reasoning small model.** This is the one place cheap models fail hard. Use a reasoning-capable model (DeepSeek V4 Pro is the budget entry point) even in the "budget" tier.
5. **For self-hosting, cross the volume threshold first.** Open weights (DeepSeek, Qwen, Gemma 4, Llama 4, GLM, MiniMax, Nemotron) only beat API pricing when GPUs stay saturated — roughly >200M tokens/day for a mid model. Below that, hosted APIs (Together, Fireworks, Groq, DeepInfra, OpenRouter) or first-party APIs win.

**Thresholds that change the recommendation:**
- If a task needs >200K context regularly → prefer Grok, Gemini, or DeepSeek (avoid Mistral's 128K cap and Gemini Pro's >200K surcharge by chunking).
- If EU data residency is required → Mistral (EU jurisdiction) or self-hosted open weights; avoid China-hosted APIs.
- If real-time/live information is needed → Grok (X/web grounding) or Gemini (search grounding).
- If the budget model's eval accuracy is within ~5% of premium on your task → stay on budget; the gap isn't worth 10–50× cost.

## Caveats

- **Pricing volatility:** Rates changed multiple times in H1 2026 (Opus dropped 67% from the 4.1 era; DeepSeek made a 75%-off promo permanent; Sonnet 5 is on introductory pricing through Aug 31 2026). Re-verify every price against official provider docs before production.
- **Benchmark limitations:** GPQA is saturated; vendor scores exceed independent harnesses; some June 2026 models (Kimi K2.7, GPT-5.6) withheld standard benchmarks, so their tiers here are provisional. SWE-bench Verified and Pro are not interchangeable (Pro runs 10–30 pts lower).
- **Tokenizer differences inflate cost:** Anthropic's newer tokenizer (Opus 4.7+, Fable 5, Sonnet 5) uses ~30–35% more tokens for the same text; Qwen and Magistral reasoning models are token-verbose. Effective cost ≠ headline rate.
- **Reasoning-token billing:** o-series/reasoning models bill hidden thinking tokens at output rates — real costs can be 3–10× the visible output.
- **Deprecations scheduled:** DeepSeek `deepseek-chat`/`deepseek-reasoner` (Jul 24 2026); Gemini 2.0 Flash (Jun 1 2026); Veo 2/3 (Jun 30 2026); Imagen 4 (Aug 17 2026); various Bedrock models (Cohere Command R/R+, Nova Premier ~Sep 2026, Llama 3.x → legacy). Grok retired several model IDs May 15 2026.
- **Quality of hosted open weights varies:** Serverless providers often fp8-quantize, degrading output below reference weights — test the specific endpoint.
- **Geopolitical/compliance:** Chinese models (DeepSeek, Qwen, Kimi, GLM, MiniMax) carry data-residency and content-filter considerations; self-hosting the open weights mitigates the hosting concern.
- **Unverified reports flagged:** The "Llama 5" April 2026 release article appears speculative; Meta's verified status is no new open Llama through mid-2026 plus the proprietary Muse Spark. Fable/Mythos 5 had a brief export-control suspension (June 2026). xAI's $175/mo free-credit program may have ended for new accounts.

---

*Machine-parsing note for downstream builders: model records use consistent fields (Model | API ID | Access [api/chat/self] | Price in/out | Context | Modalities | Reasoning | Speed | Released | Optimized-for). Task records use IDs T1–T21 with complexity labels. The mapping uses fixed columns (Budget/Balanced/Premium pick + S/A/B/C/D tier). All prices are USD per 1M tokens unless a per-minute/per-image/per-second unit is stated. Re-scrape provider pricing pages and Artificial Analysis / llm-stats leaderboards weekly to keep this current.*