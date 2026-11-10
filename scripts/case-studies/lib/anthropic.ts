// Minimal Claude Messages API client over fetch.
// Why raw HTTP and not @anthropic-ai/sdk: the repo has no Anthropic SDK and
// phase 0 may not add dependencies (package.json is frozen for this work).
// Wire shapes follow the claude-api skill: POST /v1/messages, structured
// output via output_config.format (json_schema), adaptive thinking (the
// default on the 5.5 models; never budget_tokens), server-side refusal
// fallbacks ("default" form) on Opus/Sonnet 5.5.
//
// Provider: CASE_STUDIES_PROVIDER = gemini (default since 2026-11-10, Farjad's
// choice) | claude. Gemini calls go through ./gemini.ts with the same contract.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { callGeminiJson, requireGeminiKey } from './gemini';

export type Provider = 'gemini' | 'claude';

export function provider(): Provider {
  const p = process.env.CASE_STUDIES_PROVIDER?.trim().toLowerCase();
  if (!p || p === 'gemini') return 'gemini';
  if (p === 'claude' || p === 'anthropic') return 'claude';
  throw new ClaudeError(`CASE_STUDIES_PROVIDER="${p}" is not gemini or claude.`);
}

// Defaults checked against aistudio.google.com/docs/models on 2026-11-10.
// Extract uses the flagship gemini-4-argon: on the 5 fc-real decisions it
// found 3-4 holdings per case where gemini-3.8-flash found 1-2 (live run
// 2026-11-10, docs/engineering/case-studies-pipeline.md). Argon has no
// "stable" label yet; if it changes, set CASE_STUDIES_MODEL_EXTRACT.
const DEFAULTS: Record<Provider, { extract: string; write: string; verify: string }> = {
  gemini: { extract: 'gemini-4-argon', write: 'gemini-3.8-flash', verify: 'gemini-3.5-flash-lite' },
  claude: { extract: 'claude-opus-5-5', write: 'claude-sonnet-5-5', verify: 'claude-haiku-5-5' },
};

export const MODELS = {
  extract: () => process.env.CASE_STUDIES_MODEL_EXTRACT?.trim() || DEFAULTS[provider()].extract,
  write: () => process.env.CASE_STUDIES_MODEL_WRITE?.trim() || DEFAULTS[provider()].write,
  verify: () => process.env.CASE_STUDIES_MODEL_VERIFY?.trim() || DEFAULTS[provider()].verify,
};

const API_URL = () => `${process.env.ANTHROPIC_BASE_URL?.trim() || 'https://api.anthropic.com'}/v1/messages`;
const API_VERSION = '2023-06-01';
const FALLBACK_BETA = 'server-side-fallback-2026-07-01';

export class ClaudeError extends Error {
  constructor(message: string, readonly status?: number, readonly retryable = false) {
    super(message);
  }
}

export type Usage = { input_tokens: number; output_tokens: number; cache_read_input_tokens?: number; cache_creation_input_tokens?: number };

export type JsonCall = {
  model: string;
  /** Stable, versioned instructions (cached). */
  system: string;
  /** Untrusted material (decision text, claims) goes here, fenced, never in system. */
  user: string;
  schema: Record<string, unknown>;
  maxTokens: number;
  effort?: 'low' | 'medium' | 'high' | 'xhigh' | 'max';
  timeoutMs?: number;
};

export type JsonResult<T> = { value: T; model: string; usage: Usage; stopReason: string };

export function requireApiKey(): string {
  if (provider() === 'gemini') return requireGeminiKey();
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) {
    throw new ClaudeError('ANTHROPIC_API_KEY is not set. Export it in your shell (never commit it); offline eval needs no key: npx tsx scripts/case-studies/eval/run.ts --offline');
  }
  return key;
}

/** Load a versioned prompt from scripts/case-studies/prompts/<name>.md. */
export function loadPrompt(name: string): { id: string; text: string } {
  const file = join(process.cwd(), 'scripts/case-studies/prompts', `${name}.md`);
  return { id: name, text: readFileSync(file, 'utf8') };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function usesFallbacks(model: string): boolean {
  if (process.env.CASE_STUDIES_FALLBACKS === 'off') return false;
  return /^claude-(opus|sonnet)-5-5$/.test(model);
}

/**
 * One structured-output request. Retries 408/409/429/5xx/529 and network
 * errors with exponential backoff (honours retry-after). A refusal or a
 * max_tokens stop is an error, never a partial result.
 */
export async function callJson<T>(call: JsonCall, attempts = 4): Promise<JsonResult<T>> {
  if (provider() === 'gemini') return callGeminiJson<T>(call, attempts);
  const key = requireApiKey();
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'x-api-key': key,
    'anthropic-version': API_VERSION,
  };
  const body: Record<string, unknown> = {
    model: call.model,
    max_tokens: call.maxTokens,
    system: [{ type: 'text', text: call.system, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: call.user }],
    output_config: { format: { type: 'json_schema', schema: call.schema }, ...(call.effort ? { effort: call.effort } : {}) },
  };
  if (usesFallbacks(call.model)) {
    headers['anthropic-beta'] = FALLBACK_BETA;
    body.fallbacks = 'default';
  }

  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), call.timeoutMs ?? 600_000);
    try {
      const res = await fetch(API_URL(), { method: 'POST', headers, body: JSON.stringify(body), signal: ctrl.signal });
      const text = await res.text();
      if (!res.ok) {
        const retryable = [408, 409, 429, 500, 502, 503, 504, 529].includes(res.status);
        let msg = text.slice(0, 500);
        try {
          const j = JSON.parse(text) as { error?: { type?: string; message?: string } };
          msg = `${j.error?.type ?? 'error'}: ${j.error?.message ?? msg}`;
        } catch {
          /* non-JSON error body */
        }
        const err = new ClaudeError(`Claude API ${res.status} (${call.model}): ${msg}`, res.status, retryable);
        if (!retryable) throw err;
        lastErr = err;
        const ra = Number(res.headers.get('retry-after'));
        await sleep(Number.isFinite(ra) && ra > 0 ? ra * 1000 : 2000 * 2 ** i);
        continue;
      }
      const data = JSON.parse(text) as { model: string; stop_reason: string; content: Array<{ type: string; text?: string }>; usage: Usage };
      if (data.stop_reason === 'refusal') throw new ClaudeError(`Model refused (${data.model}); case stops, no repair.`);
      if (data.stop_reason === 'max_tokens') throw new ClaudeError(`Output hit max_tokens=${call.maxTokens} (${data.model}); raise the cap, do not use partial JSON.`);
      const out = data.content.filter((b) => b.type === 'text').map((b) => b.text ?? '').join('');
      let value: T;
      try {
        value = JSON.parse(out) as T;
      } catch {
        throw new ClaudeError(`Model output is not valid JSON (${data.model}).`);
      }
      return { value, model: data.model, usage: data.usage, stopReason: data.stop_reason };
    } catch (e) {
      if (e instanceof ClaudeError && !e.retryable) throw e;
      lastErr = e;
      if (i < attempts - 1) await sleep(2000 * 2 ** i);
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr instanceof Error ? lastErr : new ClaudeError(String(lastErr));
}

/** Fence untrusted text so the model reads it as data. */
export function fence(tag: string, text: string): string {
  const safe = text.replace(new RegExp(`</?${tag}>`, 'gi'), '');
  return `<${tag}>\n${safe}\n</${tag}>`;
}
