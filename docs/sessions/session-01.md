# Session 1 — Understanding and running local models

**Central question:** How does a conventional application communicate with a
locally running language model?

## What was implemented

- `src/cli.ts`: a single-file TypeScript CLI (`pnpm ask`) that POSTs one
  prompt to Ollama's native `/api/chat` endpoint via plain `fetch` and prints
  the answer plus the runtime's own metrics (prompt/output token counts, model
  load time, total time, tokens/sec). Flags: `--model`, `--temperature`.
- Project scaffolding: `package.json` (pnpm, ESM), strict `tsconfig.json`.
  Dev dependencies only (`typescript`, `tsx`, `@types/node`) — zero runtime
  dependencies. No inference abstraction yet; that's Session 2's job, once we
  have a reason for it (validation and reuse).

## Key concepts covered

- Ollama is an HTTP server wrapping a model runtime: a model file (weights,
  quantized) is loaded into memory, then generates token by token. No SDK is
  required — it's just JSON over HTTP, like any API the participants already use.
- The response carries operational metrics applications should care about:
  separate prompt (prefill) vs output (eval) token counts and durations.
- Cold vs warm starts: first request paid ~1.6s `load_duration`; subsequent
  requests ~0s (model stays resident ~5 min).

## Experiments and results (instructor machine, M3 Ultra)

**Temperature** — prompt: "Name a color. Reply with just the color name."

| Setting | Run 1 | Run 2 |
|---|---|---|
| `--temperature 0` | Blue | Blue (identical — greedy decoding) |
| `--temperature 1.5` | Red | Blue (varies across runs) |

Takeaway: temperature 0 is reproducible but not "more correct"; sampling
settings control variability, not truth.

**Model size** — prompt: HTTP 429 explanation, temperature 0.

| Model | Output tokens | Load | Total | Speed |
|---|---|---|---|---|
| llama3.2:3b | 84 | 0.00s (warm) | 0.52s | 175 tok/s |
| qwen3:8b | 251 | 3.82s (cold) | 6.83s | 91 tok/s |

Takeaways: the 8B answer was tighter and mentioned exponential backoff; the
3B answer was correct but wordier. The 8B "two-sentence" answer billed 251
output tokens — qwen3 generates hidden reasoning ("thinking") tokens that cost
real latency, a concrete example of model-specific behavior an application
must account for.

## Verified

- `pnpm typecheck` passes (strict mode).
- `pnpm ask` end-to-end against Ollama 0.40.9 with both models.
- Connection-refused path prints an actionable error (checked by code review;
  exercised when the server isn't running).

## Known limitations

- No input validation beyond arg parsing; no streaming; no system prompt;
  no structured output. All deliberate — each is a future session's problem.
- Single-turn only, by design for the whole course.

## Prerequisites for Session 2

- None beyond Session 1 state. Session 2 will add `zod` (first runtime
  dependency) when structured output needs validation.
