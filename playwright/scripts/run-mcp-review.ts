import * as path from 'path';
import { runMcpCodeReview, type LLMProvider } from '../support/llm/mcpCodeReviewer';

function parseArgs(argv: string[]): { out?: string; provider?: LLMProvider } {
  let out: string | undefined;
  let provider: LLMProvider | undefined;
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out' && argv[i + 1]) {
      out = argv[++i];
    } else if (a === '--provider' && argv[i + 1]) {
      const p = argv[++i] as LLMProvider;
      if (p !== 'openai' && p !== 'gemini') {
        throw new Error(`--provider deve ser openai ou gemini (recebido: ${p})`);
      }
      provider = p;
    }
  }
  return { out, provider };
}

async function main(): Promise<void> {
  const { out, provider } = parseArgs(process.argv);
  await runMcpCodeReview({
    repoRoot: path.resolve(__dirname, '../..'),
    outputPath: out,
    provider,
  });
}

main().catch((err) => {
  console.error('[run-mcp-review]', err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
