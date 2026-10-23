# Local AI Engineering: From Open-Weight Models to Managed Inference

An eight-session, hands-on workshop (~60 minutes per session) for experienced
developers. You'll build one application across all eight sessions — a
**Local-First AI Knowledge Assistant** that answers questions about a
collection of technical Markdown documents — starting with an open-weight
model running on your own machine and ending with configurable managed
inference.

## What this course is

You already know how to build software. This course covers what's genuinely
different when a language model sits inside your application: probabilistic
output, context limits, retrieval, grounding, evaluation, and the choice
between running models on your own hardware or someone else's.

The project starts as a ~100-line CLI against a local 3B model and ends as a
web application that switches between local and managed inference through
configuration.

**What we don't teach:** programming fundamentals, model training or
fine-tuning, agents, vector databases, Kubernetes. Problems come before
solutions, measurements before opinions, and every session ends with the
application working.

## The eight sessions

| # | Session | Central question | Deliverable |
|---|---|---|---|
| 1 | [Understanding and running local models](session-01.md) | How does a conventional application communicate with a locally running language model? | Working local inference CLI; verified environment |
| 2 | Controlling model behavior | How do we make probabilistic model outputs useful to conventional software? | Reusable inference function with Zod-validated responses and error handling |
| 3 | Working with multiple documents | How can a model answer questions using information it was never trained on? | Document-aware assistant with source references |
| 4 | Retrieval and context optimization | Is giving the model all available information necessarily the best approach? | Retrieval pipeline with two selectable context strategies |
| 5 | Application integration with Next.js | How do we expose this through a conventional application interface? | Functional web interface over unchanged core logic |
| 6 | Testing and evaluating AI behavior | How do we determine whether an AI application is behaving reliably? | Repeatable evaluation harness and documented baseline |
| 7 | From local models to managed inference | Can we change where a model runs without rewriting the application? | Local or managed inference, switched by configuration |
| 8 | Practical engineering tradeoffs | When does local inference make sense — and when is managed the better decision? | Final demo, comparative results, and a defensible recommendation |

A detailed guide for each session is added here as that session is prepared —
the course builds incrementally on purpose, and later guides reflect what the
application actually looks like when you reach them.

## Setup (complete before Session 1)

1. Install **Node.js ≥ 20 LTS**, **pnpm**, and **Git**.
2. Install **Ollama** — `brew install ollama` on macOS, or the installer from
   [ollama.com](https://ollama.com) — and start it with `ollama serve` (the
   desktop app starts it automatically).
3. Pull the baseline model **before class** (~2 GB download):

   ```bash
   ollama pull llama3.2:3b
   ```

   With 16 GB+ RAM, optionally add the comparison model (~5 GB):

   ```bash
   ollama pull qwen3:8b
   ```

4. Clone this repository and run `pnpm install`.

Then verify everything responds:

```bash
node --version                               # ≥ v20
curl -s http://localhost:11434/api/version   # server answers
ollama run llama3.2:3b "Say OK"              # model loads and replies
pnpm ask "Say OK"                            # course CLI works end-to-end
```

The baseline model is sized for an 8 GB laptop. Every required exercise runs
on it; the 8B model only sweetens comparisons.

## How the course works

- **Problems before solutions.** No tool or abstraction appears until you've
  felt the pain it solves. Retrieval arrives only after full-context querying
  shows its limits.
- **Measure, don't assume.** Latency, token counts, and answer quality are
  recorded for every strategy comparison. Architecture decisions cite those
  numbers.
- **Always working.** Each session ends on a committed, runnable checkpoint.
- **Proportional architecture.** Deliberately deferred: embeddings, streaming
  UI, chat history, containers, dashboards. Each returns only if a measured
  need appears.

## What success looks like

By the end of each session you should be able to:

1. Run the CLI, explain what Ollama did, and show how temperature changed the output across runs.
2. Demonstrate a schema-rejected response and explain why valid JSON ≠ a correct answer.
3. Ask a question answered only by combining two documents — and one the assistant correctly declines.
4. Show measured latency and token differences between full-context and retrieval strategies.
5. Trace a browser question through the server route into the same core code the CLI uses.
6. Explain a non-deterministic eval difference and verify a citation against a real passage.
7. Flip providers via configuration and show both answering the same question.
8. Defend a local-vs-managed recommendation for a stated scenario, with data.

## Session format

Each session runs ~5 min problem framing · 10 min concepts and demo · 30 min
guided implementation · 10 min verification and discussion · 5 min recap.
Stretch exercises are optional and clearly marked — skip them freely.

The document corpus used from Session 3 onward is entirely synthetic — a
fictional product called "Beaconline". No real products, people, or data.
