import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
import { HumanMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

dotenv.config();

export type LLMProvider = 'openai' | 'gemini';

export interface McpReviewOptions {
  provider?: LLMProvider;
  /** Repo root (default: process.cwd()) */
  repoRoot?: string;
  /**
   * Opcional: sufixo após `mcp-review-` (ex.: `--out employerList` → `mcp-review-employerList`).
   * Se omitido, deriva dos `*.mcp.spec.ts` (ex.: `employerList.mcp.spec.ts` → `mcp-review-employerList`).
   * Cada execução sobrescreve os mesmos caminhos (sem timestamp no nome).
   */
  outputPath?: string;
}

export interface McpReviewResult {
  jsonPath: string;
  reportPath: string;
  /** Resposta bruta da LLM (antes da separação). */
  rawResponse: string;
}

function splitReviewResponse(text: string): { parsed: unknown; markdown: string } {
  const trimmed = text.trim();
  const fence = /```\s*json\s*\r?\n([\s\S]*?)\r?\n```/;
  const m = trimmed.match(fence);
  if (!m) {
    throw new Error(
      'Resposta da LLM sem bloco ```json ... ```; impossível gravar o JSON separado. Ajuste o prompt ou reexecute.'
    );
  }
  const jsonRaw = m[1].trim();
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonRaw);
  } catch (e) {
    throw new Error(
      `JSON do revisor inválido: ${e instanceof Error ? e.message : String(e)}`
    );
  }
  const afterFence = trimmed.slice((m.index ?? 0) + m[0].length).trim();
  return { parsed, markdown: afterFence };
}

/** Garante `line_content` fiel ao arquivo quando `file` + `line` existem (caminho relativo ao repo). */
function enrichIssuesLineContent(repoRoot: string, parsed: unknown): void {
  if (!parsed || typeof parsed !== 'object') return;
  const root = parsed as Record<string, unknown>;
  const files = root.files;
  if (!Array.isArray(files)) return;

  for (const fileEntry of files) {
    if (!fileEntry || typeof fileEntry !== 'object') continue;
    const fe = fileEntry as Record<string, unknown>;
    const parentFile = typeof fe.file === 'string' ? fe.file : null;
    const issues = fe.issues;
    if (!Array.isArray(issues)) continue;

    for (const issue of issues) {
      if (!issue || typeof issue !== 'object') continue;
      const i = issue as Record<string, unknown>;
      const fileRel =
        typeof i.file === 'string' && i.file.length > 0 ? i.file : parentFile;
      const lineRaw = i.line;
      const lineNum =
        typeof lineRaw === 'number' ? lineRaw : Number(lineRaw);
      if (!fileRel || !Number.isFinite(lineNum) || lineNum < 1) continue;

      const abs = path.join(repoRoot, ...fileRel.split('/').filter(Boolean));
      if (!fs.existsSync(abs)) continue;

      const lines = readUtf8(abs).split(/\r?\n/);
      const idx = Math.floor(lineNum) - 1;
      if (idx >= 0 && idx < lines.length) {
        i.line_content = lines[idx].trim();
      }
      const lc = i.line_content;
      if (typeof lc === 'string') {
        i.line_content = lc.trim();
      }
    }
  }
}

const MCP_SPEC_SUFFIX = '.mcp.spec.ts';

function sanitizeStemSegment(segment: string): string {
  return segment
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_')
    .replace(/\s+/g, '-')
    .replace(/_+/g, '_')
    .replace(/^[-_.]+|[-_.]+$/g, '');
}

function specBaseName(absPath: string): string {
  const base = path.basename(absPath);
  if (base.endsWith(MCP_SPEC_SUFFIX)) {
    return base.slice(0, -MCP_SPEC_SUFFIX.length);
  }
  return path.basename(base, path.extname(base));
}

function deriveDefaultStemFromSpecs(specAbs: string[]): string {
  const bases = specAbs
    .map(specBaseName)
    .map(sanitizeStemSegment)
    .filter((s) => s.length > 0)
    .sort();
  if (bases.length === 0) return 'mcp-review';
  const suffix = bases.length === 1 ? bases[0]! : bases.join('-');
  return `mcp-review-${suffix}`;
}

function resolveStem(outputPath: string | undefined, specAbs: string[]): string {
  if (outputPath) {
    const raw = outputPath.replace(/[/\\]+/g, path.sep);
    const base = path.basename(raw, path.extname(raw));
    if (!base || base === '.' || base === '..') {
      return deriveDefaultStemFromSpecs(specAbs);
    }
    const cleaned = sanitizeStemSegment(base);
    if (!cleaned) return deriveDefaultStemFromSpecs(specAbs);
    if (cleaned.startsWith('mcp-review-')) return cleaned;
    return `mcp-review-${cleaned}`;
  }
  return deriveDefaultStemFromSpecs(specAbs);
}

const CONTEXT_PATHS = [
  'playwright/setup/fixtures.ts',
  'playwright/support/pages/EmployeeListMCPPage.ts',
  'playwright/support/pages/LoginPage.ts',
  'playwright/support/user/user.ts',
  'playwright/docs/prompt/prompt-qa-playwright-automator.md',
] as const;

const PROMPT_REVIEWER = 'playwright/docs/prompt/prompt-create-reviewer.md';
const E2E_ROOT = 'playwright/e2e';

function resolveRepoRoot(repoRoot?: string): string {
  return path.resolve(repoRoot ?? process.cwd());
}

function readUtf8(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

function walkMcpSpecs(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walkMcpSpecsInto(full, results);
    } else if (ent.isFile() && ent.name.endsWith('.mcp.spec.ts')) {
      results.push(full);
    }
  }
  return results.sort();
}

function walkMcpSpecsInto(dir: string, results: string[]): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkMcpSpecsInto(full, results);
    else if (ent.isFile() && ent.name.endsWith('.mcp.spec.ts')) results.push(full);
  }
}

function addLineNumbers(source: string): string {
  const lines = source.split(/\r?\n/);
  const w = Math.max(2, String(lines.length).length);
  return lines.map((line, i) => `${String(i + 1).padStart(w, ' ')} | ${line}`).join('\n');
}

function formatFileSection(
  relativePath: string,
  content: string,
  opts?: { lineNumbers?: boolean }
): string {
  const ext = path.extname(relativePath).toLowerCase();
  const lang = ext === '.md' ? 'markdown' : 'typescript';
  const useNums = Boolean(opts?.lineNumbers && ext === '.ts');
  const body = useNums ? addLineNumbers(content) : content.trimEnd();
  return `### ${relativePath}\n\n\`\`\`${lang}\n${body}\n\`\`\`\n\n`;
}

/** `lineNumbersForTypeScript`: numera linhas só em `.ts` para o modelo citar `line` alinhada ao código. */
function buildBundle(
  repoRoot: string,
  absolutePaths: string[],
  lineNumbersForTypeScript: boolean
): string {
  let out = '';
  for (const abs of absolutePaths) {
    const rel = path.relative(repoRoot, abs).split(path.sep).join('/');
    out += formatFileSection(rel, readUtf8(abs), {
      lineNumbers: lineNumbersForTypeScript,
    });
  }
  return out.trimEnd();
}

function buildLLM(provider: LLMProvider) {
  if (provider === 'gemini') {
    return new ChatGoogleGenerativeAI({
      model: 'gemini-3-flash-preview',
      apiKey: process.env.GOOGLE_API_KEY,
    });
  }
  return new ChatOpenAI({
    model: 'gpt-4o',
    apiKey: process.env.OPENAI_API_KEY,
  });
}

/**
 * Coleta recursivamente arquivos `.mcp.spec.ts` em `playwright/e2e`, monta o prompt com
 * contexto fixo e chama a LLM. Separa JSON e relatório Markdown em pastas dedicadas.
 */
export async function runMcpCodeReview(
  options: McpReviewOptions = {}
): Promise<McpReviewResult> {
  const repoRoot = resolveRepoRoot(options.repoRoot);
  const provider: LLMProvider =
    options.provider ??
    (process.env.LLM_PROVIDER as LLMProvider) ??
    'openai';

  const e2eDir = path.join(repoRoot, E2E_ROOT);
  const specAbs = walkMcpSpecs(e2eDir);
  if (specAbs.length === 0) {
    throw new Error(
      `Nenhum arquivo .mcp.spec.ts encontrado em ${e2eDir}. Gere testes via MCP ou ajuste o caminho.`
    );
  }

  const contextAbs = CONTEXT_PATHS.map((p) => path.join(repoRoot, p));
  for (const p of contextAbs) {
    if (!fs.existsSync(p)) {
      throw new Error(`Arquivo de contexto ausente: ${path.relative(repoRoot, p)}`);
    }
  }

  const promptPath = path.join(repoRoot, PROMPT_REVIEWER);
  if (!fs.existsSync(promptPath)) {
    throw new Error(`Prompt do revisor ausente: ${PROMPT_REVIEWER}`);
  }

  const template = readUtf8(promptPath);
  const contextBlock = buildBundle(repoRoot, contextAbs, true);
  const testBlock = buildBundle(repoRoot, specAbs, true);

  const fullPrompt = template
    .replace('{{CONTEXT_FILES}}', contextBlock)
    .replace('{{TEST_FILES}}', testBlock);

  const llm = buildLLM(provider);
  const response = await llm.invoke([new HumanMessage(fullPrompt)]);
  const text =
    typeof response.content === 'string'
      ? response.content
      : JSON.stringify(response.content);

  const reviewsDir = path.join(repoRoot, 'playwright/docs/reviews');
  const jsonDir = path.join(reviewsDir, 'json');
  const relatorioDir = path.join(reviewsDir, 'relatorio');
  fs.mkdirSync(jsonDir, { recursive: true });
  fs.mkdirSync(relatorioDir, { recursive: true });

  const stem = resolveStem(options.outputPath, specAbs);

  const { parsed, markdown } = splitReviewResponse(text);
  enrichIssuesLineContent(repoRoot, parsed);
  const jsonFormatted = `${JSON.stringify(parsed, null, 2)}\n`;

  const jsonPath = path.join(jsonDir, `${stem}.json`);
  const reportPath = path.join(relatorioDir, `${stem}.md`);

  fs.writeFileSync(jsonPath, jsonFormatted, 'utf-8');
  fs.writeFileSync(reportPath, markdown, 'utf-8');

  console.log(`[mcpCodeReviewer] JSON salvo em: ${jsonPath}`);
  console.log(`[mcpCodeReviewer] Relatório salvo em: ${reportPath}`);

  return { jsonPath, reportPath, rawResponse: text };
}
