# Session 1 — Understanding and running local models

**Central question:** How does a conventional application communicate with a
locally running language model?

**You will leave this session able to:** run an open-weight model on your own
machine, call it from TypeScript with nothing but `fetch`, and explain what
temperature, quantization, and token metrics actually mean in practice.

## Before class

Complete the [setup checklist](README.md#setup-complete-before-session-1).
If `pnpm ask "Say OK"` answers, you're ready.

## Concepts (10 minutes)

- **Ollama is just an HTTP server.** It loads a model file — quantized weights
  — into memory and generates text token by token. No SDK, no magic: JSON over
  HTTP, like every API you already use.
- **Quantization** stores weights at reduced precision (e.g. 4-bit instead of
  16-bit), cutting memory ~4× with modest quality loss. It's why a 3B model
  fits in ~2 GB and runs on a laptop. Tags like `Q4_K_M` name the scheme.
- **The response carries operational metrics** your application should care
  about: separate token counts and durations for the prompt (prefill) and the
  generated output (eval).

## Walkthrough: the CLI (10 minutes)

Open [`src/cli.ts`](../src/cli.ts). It is deliberately one file with zero
runtime dependencies. Find the three parts:

1. `parseArgs` — plain flag parsing (`--model`, `--temperature`).
2. `chat` — a single `fetch` POST to `http://localhost:11434/api/chat` with
   `stream: false`.
3. `main` — prints the answer, then the metrics Ollama returned.

Run it:

```bash
pnpm ask "In one sentence, what does quantization do to a language model?"
```

Note the metrics block. Run it again immediately — `load time` drops to ~0s
because the model stays resident in memory for ~5 minutes after use. Always
warm the model before timing anything.

## Experiment 1: temperature (10 minutes)

Run each of these **twice**:

```bash
pnpm ask --temperature 0 "Name a color. Reply with just the color name."
pnpm ask --temperature 1.5 "Name a color. Reply with just the color name."
```

**What to observe:** at temperature 0 (greedy decoding) the two runs are
identical. At 1.5 they usually differ — and if yours happen to match, that's
the point too: sampling is probabilistic, not "high temperature = different".

**Question to answer:** is the temperature-0 answer more *correct* than the
others? (No — sampling settings control variability, not truth. Keep this in
mind in Session 6 when we evaluate correctness.)

## Experiment 2: model size (10 minutes)

If you pulled the 8B model:

```bash
pnpm ask --temperature 0 "A REST API returns HTTP 429. In two sentences, what does it mean and what should a client do?"
pnpm ask --model qwen3:8b --temperature 0 "A REST API returns HTTP 429. In two sentences, what does it mean and what should a client do?"
```

**What to observe:**

- Answer quality: the 8B answer is typically tighter and mentions exponential
  backoff; the 3B answer is correct but wordier.
- Speed: the 8B generates at roughly half the tokens/sec of the 3B.
- **Output tokens:** the 8B reports far more output tokens than its two
  sentences contain. `qwen3` generates hidden reasoning ("thinking") tokens
  before answering — you pay for them in latency even though you never see
  them. Model-specific behavior like this is exactly why applications must
  treat models as configurable, observable components.

## Success check

You're done when you can:

- [ ] Explain what happens between `pnpm ask` and the printed answer (HTTP
      request → model file in memory → token-by-token generation → JSON back).
- [ ] Show two temperature-0 runs producing identical output, and explain why.
- [ ] Read the metrics block and say which numbers you'd put on a dashboard
      if this were production code, and why.

## Stretch (optional)

- Point the CLI at Ollama's OpenAI-compatible endpoint
  (`POST /v1/chat/completions`) and compare the response shapes. We'll rely
  on this compatibility in Session 7.
- Run `ollama ps` while a request is in flight to see memory in use.

## What's deliberately missing

No system prompt, no validation, no streaming, no abstraction layer. Each is
a future session's problem — introduced when its absence starts to hurt.

**Next session:** making probabilistic output usable by software — system
instructions, structured output, and why valid JSON is not the same thing as
a correct answer.
