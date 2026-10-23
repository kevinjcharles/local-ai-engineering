/**
 * Session 1 — minimal local inference CLI.
 *
 * Sends one prompt to a locally running Ollama server and prints the
 * response plus the runtime's own timing and token metrics. Deliberately a
 * single file with no abstractions: the point is to see exactly what an
 * inference request and response look like before we build on top of them.
 *
 * Usage:
 *   pnpm ask "Why is the sky blue?"
 *   pnpm ask --model qwen3:8b --temperature 1.2 "Why is the sky blue?"
 */

const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://localhost:11434";
const DEFAULT_MODEL = "llama3.2:3b";

interface CliArgs {
  model: string;
  temperature: number | undefined;
  prompt: string;
}

// Shape of Ollama's non-streaming /api/chat response (the fields we use).
// Durations are nanoseconds; token counts cover the prompt (prefill) and
// the generated output (eval) separately.
interface OllamaChatResponse {
  model: string;
  message: { role: string; content: string };
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  eval_count: number;
  eval_duration: number;
}

function parseArgs(argv: string[]): CliArgs {
  let model = DEFAULT_MODEL;
  let temperature: number | undefined;
  const rest: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--model") {
      model = argv[++i] ?? fail("--model requires a value");
    } else if (arg === "--temperature") {
      const raw = argv[++i] ?? fail("--temperature requires a value");
      temperature = Number(raw);
      if (Number.isNaN(temperature)) fail(`invalid temperature: ${raw}`);
    } else if (arg !== undefined) {
      rest.push(arg);
    }
  }

  const prompt = rest.join(" ").trim();
  if (!prompt) {
    fail('usage: pnpm ask [--model <name>] [--temperature <n>] "<prompt>"');
  }
  return { model, temperature, prompt };
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

async function chat(args: CliArgs): Promise<OllamaChatResponse> {
  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model: args.model,
      messages: [{ role: "user", content: args.prompt }],
      stream: false,
      options: args.temperature === undefined ? {} : { temperature: args.temperature },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Ollama returned ${response.status}: ${body}`);
  }
  return (await response.json()) as OllamaChatResponse;
}

const NS_PER_SEC = 1e9;

async function main() {
  const args = parseArgs(process.argv.slice(2));

  let result: OllamaChatResponse;
  try {
    result = await chat(args);
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch failed")) {
      fail(`Could not reach Ollama at ${OLLAMA_URL}. Is "ollama serve" running?`);
    }
    throw error;
  }

  console.log(result.message.content.trim());
  console.log("---");
  console.log(`model:          ${result.model}`);
  console.log(`temperature:    ${args.temperature ?? "(model default)"}`);
  console.log(`prompt tokens:  ${result.prompt_eval_count}`);
  console.log(`output tokens:  ${result.eval_count}`);
  console.log(`load time:      ${(result.load_duration / NS_PER_SEC).toFixed(2)}s`);
  console.log(`total time:     ${(result.total_duration / NS_PER_SEC).toFixed(2)}s`);
  console.log(
    `speed:          ${(result.eval_count / (result.eval_duration / NS_PER_SEC)).toFixed(1)} tokens/s`,
  );
}

main();
