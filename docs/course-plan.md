# Course Plan

## 1. Course overview

**Title:** Local AI Engineering: From Open-Weight Models to Managed Inference
**Format:** 8 sessions × ~60 minutes, hands-on, one continuous project
**Audience:** Developers fluent in TypeScript/Node, REST, Git, testing, and
application architecture — but new to local LLM runtimes, open-weight models,
retrieval, and probabilistic software evaluation.

**Central objective:** Learn to design, build, test, evaluate, and operate an
application powered by a local open-weight model, and move it to managed
inference without rewriting it.

**What we deliberately do not teach:** programming fundamentals, model
training/fine-tuning, agents, vector databases, Kubernetes, auth, or
production-scale deployment. These may be mentioned; they are not requirements.

## 2. Eight-session roadmap

| # | Central question | Key experiments | Deliverable |
|---|---|---|---|
| 1 | How does a conventional app talk to a local model? | Same prompt at different temperatures; 3B vs 8B model | Working TS CLI against Ollama; verified environment |
| 2 | How do we make probabilistic output useful to software? | Prompt variations; valid-JSON-but-wrong-facts demo | Reusable inference function with system prompts, Zod-validated structured output, error handling |
| 3 | How can a model answer questions it wasn't trained on? | Multi-doc context; conflicts; outdated info; unanswerable questions; irrelevant-context noise | Document-aware CLI assistant with source references |
| 4 | Is "give the model everything" the best approach? | Full context vs selected docs vs retrieved passages; measure latency/tokens/quality | Retrieval pipeline with ≥2 selectable context strategies |
| 5 | How do we expose this through a normal web app? | Server route wrapping existing logic; loading/error states | Minimal Next.js UI over unchanged core logic |
| 6 | How do we know it behaves reliably? | Eval dataset incl. prompt-injection doc; citation verification; repeated-run timing | Repeatable evaluation harness + documented baseline |
| 7 | Can we change where the model runs without a rewrite? | Provider interface; DigitalOcean managed endpoint; API differences | Config-switchable local/managed inference |
| 8 | When is local vs managed the right call? | Same evals on both providers; quality/latency/cost/privacy comparison | Final demo, comparative results, architecture diagram, recommendations |

Session details, experiments, and stretch goals live in `docs/sessions/` as
each session is prepared.

## 3. Seven-session alternative

Least disruptive compression: **merge Sessions 7 and 8** into one
"managed inference and tradeoffs" session.

- Pre-session work absorbs the setup: the provider interface skeleton and
  DigitalOcean account/credential setup are completed before class.
- In-session time focuses on switching providers, running the existing eval
  harness against both, and discussing results.
- What is lost: leisurely exploration of provider API differences and the
  conceptual tour of dedicated-GPU hosting; both are covered in notes instead.

Rejected alternatives: merging 1+2 overloads the least-familiar material at
the start; cutting Session 6 removes the evaluation harness that Session 7/8
comparisons depend on.

## 4. Project architecture (initial, and how it evolves)

Final shape (reached incrementally — not built upfront):

```
src/
  documents/    # Session 3+: loading, metadata, sections, retrieval
  inference/    # Session 2+: provider-agnostic client; Session 7: provider interface
  app/          # Session 3+: question → context → prompt → validate → answer+sources
  cli.ts        # Session 1: entry point (stays as the testbed throughout)
eval/           # Session 6: questions, expected outcomes, harness, results
web/            # Session 5: minimal Next.js app calling src/app via a route
docs/sample-docs/ # Session 3: fictional document collection
```

Evolution rules:
- Session 1 is a single small CLI file. No abstraction yet.
- A layer is extracted only when a session's requirement makes the current
  shape painful (e.g., Session 2 extracts an inference function because the
  CLI needs validation and reuse; Session 7 introduces the provider interface
  because a second provider actually exists).
- Core logic stays importable without Next.js so the CLI and eval harness keep
  working all course long.

## 5. Risk assessment

| Risk | Likelihood | Mitigation |
|---|---|---|
| Participant hardware weaker than instructor's (M3 Ultra/512 GB is unrepresentative) | High | Baseline model is a 3B at Q4 (~2 GB RAM); all exercises verified against it. 8B model is optional. Never rely on instructor-only hardware for a required exercise. |
| Model downloads during class time | High | Pre-session checklist mandates pulls beforehand; verification commands catch gaps at session start. |
| Small models give erratic/failed structured output | Medium | That failure *is* the lesson (Sessions 2, 6). Retry/fallback paths shown; expectations set explicitly. |
| DigitalOcean offering/pricing/API drift by Session 7 | Medium | Re-verify current docs in Session 7 prep, not now. Provider interface keeps the app agnostic; any OpenAI-compatible endpoint is a fallback demo target. |
| Billable-resource surprises | Low | Serverless/metered inference only; explicit approval gate before any credential or paid call; no dedicated GPUs. |
| Ollama API changes between prep and delivery | Low | Pin verification to `/api/version`; exercises use stable endpoints (`/api/chat`, OpenAI-compatible `/v1`). |
| Session overruns | Medium | One essential outcome per session; stretch goals marked optional; always end on a committed working checkpoint. |

## 6. Success criteria (observable, per session)

1. Participant runs the CLI, gets a model response, and can explain what
   Ollama did (model file → memory → token-by-token generation), and show how
   temperature changed output across two runs.
2. Participant demonstrates a Zod-rejected response and explains why "valid
   JSON" ≠ "correct answer".
3. Participant asks a question answered only by combining two documents, and
   shows a question the assistant correctly declines as unsupported.
4. Participant shows measured latency/token differences between full-context
   and retrieval strategies and articulates when each wins.
5. Participant asks a question in the browser and traces the request through
   the server route into the same core code the CLI uses.
6. Participant runs the eval harness twice, explains a non-deterministic
   result difference, and shows one citation verified against a real passage
   (and the injection test outcome).
7. Participant flips provider via configuration and shows both providers
   answering the same question, with differences noted.
8. Participant presents the comparison table and defends a local-vs-managed
   recommendation for a stated scenario.

## 7. Simplification review

Reviewed for excess; the following were considered and **deferred or cut**:

- **Embeddings/vector search:** discussed in Session 4, implemented only if
  keyword retrieval measurably fails on our corpus (it likely won't at this scale).
- **Streaming UI:** optional stretch in Session 5 only.
- **Chat history/multi-turn:** cut; single-question flow keeps retrieval and
  evaluation tractable.
- **Docker/containers:** cut; brew + pnpm is sufficient and more transparent.
- **CSV/JSON results tooling:** a flat JSON file and a printed table; no
  dashboards.
- **Dedicated GPU demo (Session 8):** conceptual only, unless explicitly
  approved later.
