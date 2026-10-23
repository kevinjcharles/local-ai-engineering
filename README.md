# Local AI Engineering: From Open-Weight Models to Managed Inference

An eight-session, hands-on workshop for experienced developers. We build one
application — a **Local-First AI Knowledge Assistant** that answers questions
about a collection of technical Markdown documents — starting with a local
open-weight model via Ollama and ending with configurable managed inference
(DigitalOcean).

## What this repository contains

| Path | Purpose |
|---|---|
| `curriculum/` | **Student-facing course guide** — start at [`curriculum/README.md`](curriculum/README.md) |
| `docs/course-plan.md` | Course overview, 8-session roadmap, risks, success criteria |
| `docs/environment.md` | Environment assessment, setup checklist, verification commands |
| `docs/dataset-plan.md` | Design of the fictional document collection used from Session 3 |
| `docs/sessions/` | Per-session notes and checkpoints |
| `src/` | Application source (grows session by session) |

## Quick start (Session 1 state)

Prerequisites: Node.js ≥ 20 LTS, pnpm, Ollama with `llama3.2:3b` pulled
(see `docs/environment.md` for the full checklist).

```bash
pnpm install
ollama serve &            # if not already running
pnpm ask "What is quantization, in two sentences?"
pnpm ask --temperature 1.2 "What is quantization, in two sentences?"
pnpm ask --model qwen3:8b "What is quantization, in two sentences?"
```

## Course principles

- One progressively developed application; every session ends in a working state.
- Problems are demonstrated before solutions are introduced.
- Architecture grows only when a requirement demands it — no frameworks,
  vector databases, or orchestration layers without a measured reason.
- Empirical comparison over received wisdom: we measure latency, token usage,
  and answer quality rather than assuming.
