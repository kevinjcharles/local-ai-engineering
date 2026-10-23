# Environment Assessment & Setup

## Instructor machine (assessed 2026-10-23)

| Component | Found | Assessment |
|---|---|---|
| CPU / GPU | Apple M3 Ultra, 32 cores, Apple-silicon GPU (Metal) | Far above requirements; any Ollama model runs |
| Memory | 512 GB unified | Effectively unconstrained |
| OS | macOS 27.0.1 (arm64) | Supported |
| Node.js | v24.9.0 (current LTS) | ✓ |
| pnpm | 12.15.0 | ✓ |
| Git | 2.54.0 | ✓ |
| Ollama | Installed via Homebrew during prep; server 0.40.9 | ✓ |

**Caution:** this machine is unrepresentative of participant hardware. All
required exercises are sized for the baseline model below, not for this machine.

## Recommended models

| Role | Model | Download | RAM in use | Why |
|---|---|---|---|---|
| **Baseline (required)** | `llama3.2:3b` (Q4_K_M) | ~2.0 GB | ~3–4 GB | Instruction-tuned, fast on modest laptops, good enough for every course exercise |
| Comparison (optional) | `qwen3:8b` (Q4_K_M) | ~5 GB | ~7–9 GB | Noticeably stronger reasoning/structure; shows what one model-size step buys. Emits `<think>` segments — itself a useful teaching point about model-specific behavior |

Participants with ≥16 GB RAM can pull both; 8 GB machines use the baseline only.

## How model size, quantization, and context length affect resources

- **Parameters:** memory and compute scale roughly linearly with parameter
  count; a 3B Q4 model needs ~2 GB for weights, an 8B ~5 GB, a 70B ~40 GB.
- **Quantization:** weights stored at reduced precision (e.g. 4-bit instead of
  16-bit). Q4 quantization cuts memory ~4× versus FP16 with modest quality
  loss; it's why laptop inference is possible at all. Ollama tags like
  `Q4_K_M` name the scheme.
- **Context length:** the KV cache grows with context. Long contexts raise
  memory use and slow the pre-generation ("prefill") phase — we measure this
  directly in Session 4.
- **Apple silicon:** unified memory means CPU and GPU share one pool; Metal
  acceleration is automatic in Ollama. On Windows/Linux, a discrete GPU with
  enough VRAM helps; otherwise CPU inference works but is slower.

## Participant setup checklist (pre-Session 1)

1. Install Node.js ≥ 20 LTS and pnpm (`corepack enable` or `npm i -g pnpm`).
2. Install Git.
3. Install Ollama: macOS `brew install ollama` (or the desktop app from
   ollama.com); Windows/Linux installers from ollama.com.
4. Start the server: `ollama serve` (the desktop app does this automatically).
5. Pull the baseline model **before class**: `ollama pull llama3.2:3b`
   (optional: `ollama pull qwen3:8b` if ≥16 GB RAM).
6. Clone this repository and run `pnpm install`.

## Verification commands

```bash
node --version                               # ≥ v20
pnpm --version
git --version
curl -s http://localhost:11434/api/version   # server responds with a version
ollama list                                  # llama3.2:3b present
ollama run llama3.2:3b "Say OK"              # model loads and replies
pnpm ask "Say OK"                            # the course CLI works end-to-end
```

## Known compatibility and performance notes

- Ollama exposes both its native API (`/api/chat`, `/api/generate`) and an
  OpenAI-compatible API (`/v1/chat/completions`). We start with the native API
  for its transparent timing/token metrics, and lean on the OpenAI-compatible
  shape in Session 7 when provider portability matters.
- First request after a cold start is slow (model loads into memory); Ollama
  then keeps the model resident ~5 minutes. Warm the model before timing
  comparisons.
- Corporate proxies/VPNs occasionally interfere with `localhost:11434`;
  verify with the curl command above.
