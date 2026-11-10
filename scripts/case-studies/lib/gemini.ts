// Minimal Gemini API client over fetch, same contract as anthropic.ts.
// Uses generateContent (POST /v1beta/models/{model}:generateContent): Google
// calls it "legacy" since the Interactions API, but "fully supported"
// (aistudio.google.com/docs/interactions, checked 2026-11-10), and its wire
// shape is stable. Structured output via generationConfig.responseMimeType +
// responseJsonSchema. Unsupported JSON Schema keywords (minLength, maxLength,
// uniqueItems, …) are stripped by Google, not rejected, so the pipeline's own
// schema validation after the call stays the real gate.
import type { JsonCall, JsonResult, Usage } from './anthropic';

export class GeminiError extends Error {
  constructor(message: string, readonly status?: number, readonly retryable = false) {
    super(message);
  }
}

const API_BASE = () =>
  process.env.GEMINI_BASE_URL?.trim() || 'https://generativelanguage.googleapis.com/v1beta';

export function requireGeminiKey(): string {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    throw new GeminiError(
      'GEMINI_API_KEY is not set. Export it in your shell (never commit it); offline eval needs no key: npx tsx scripts/case-studies/eval/run.ts --offline',
    );
  }
  return key;
}

/** Gemini 3+ thinking levels are low | medium | high; higher efforts clamp to high. */
export function thinkingLevel(effort: JsonCall['effort']): 'low' | 'medium' | 'high' | undefined {
  if (!effort) return undefined;
  if (effort === 'low' || effort === 'medium') return effort;
  return 'high';
}

export function buildGeminiBody(call: JsonCall): Record<string, unknown> {
  const level = thinkingLevel(call.effort);
  return {
    systemInstruction: { parts: [{ text: call.system }] },
    contents: [{ role: 'user', parts: [{ text: call.user }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      responseJsonSchema: call.schema,
      maxOutputTokens: call.maxTokens,
      ...(level ? { thinkingConfig: { thinkingLevel: level } } : {}),
    },
  };
}

type GeminiResponse = {
  modelVersion?: string;
  promptFeedback?: { blockReason?: string };
  candidates?: Array<{ finishReason?: string; content?: { parts?: Array<{ text?: string; thought?: boolean }> } }>;
  usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number; thoughtsTokenCount?: number; cachedContentTokenCount?: number };
};

/** Map a 200 response to the shared result; blocks and truncation are errors, never partial JSON. */
export function parseGeminiResponse<T>(data: GeminiResponse, call: JsonCall): JsonResult<T> {
  const model = data.modelVersion ?? call.model;
  if (data.promptFeedback?.blockReason) {
    throw new GeminiError(`Prompt blocked (${model}): ${data.promptFeedback.blockReason}; case stops, no repair.`);
  }
  const cand = data.candidates?.[0];
  const finish = cand?.finishReason ?? 'UNKNOWN';
  if (finish === 'MAX_TOKENS') {
    throw new GeminiError(`Output hit maxOutputTokens=${call.maxTokens} (${model}); raise the cap, do not use partial JSON.`);
  }
  if (finish !== 'STOP') {
    throw new GeminiError(`Model stopped with ${finish} (${model}); case stops, no repair.`);
  }
  const out = (cand?.content?.parts ?? []).filter((p) => !p.thought).map((p) => p.text ?? '').join('');
  let value: T;
  try {
    value = JSON.parse(out) as T;
  } catch {
    throw new GeminiError(`Model output is not valid JSON (${model}).`);
  }
  const u = data.usageMetadata ?? {};
  const usage: Usage = {
    input_tokens: u.promptTokenCount ?? 0,
    // Thinking tokens are billed as output.
    output_tokens: (u.candidatesTokenCount ?? 0) + (u.thoughtsTokenCount ?? 0),
    ...(u.cachedContentTokenCount ? { cache_read_input_tokens: u.cachedContentTokenCount } : {}),
  };
  return { value, model, usage, stopReason: finish };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** One structured-output request; retries 408/429/5xx and network errors with backoff. */
export async function callGeminiJson<T>(call: JsonCall, attempts = 4): Promise<JsonResult<T>> {
  const key = requireGeminiKey();
  const url = `${API_BASE()}/models/${encodeURIComponent(call.model)}:generateContent`;
  const body = JSON.stringify(buildGeminiBody(call));

  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), call.timeoutMs ?? 600_000);
    try {
      const res = await fetch(url, {
        method: 'POST',
        // Key in a header, never in the URL (URLs end up in logs).
        headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
        body,
        signal: ctrl.signal,
      });
      const text = await res.text();
      if (!res.ok) {
        const retryable = [408, 429, 500, 502, 503, 504].includes(res.status);
        let msg = text.slice(0, 500);
        try {
          const j = JSON.parse(text) as { error?: { status?: string; message?: string } };
          msg = `${j.error?.status ?? 'error'}: ${j.error?.message ?? msg}`;
        } catch {
          /* non-JSON error body */
        }
        const err = new GeminiError(`Gemini API ${res.status} (${call.model}): ${msg}`, res.status, retryable);
        if (!retryable) throw err;
        lastErr = err;
        const ra = Number(res.headers.get('retry-after'));
        await sleep(Number.isFinite(ra) && ra > 0 ? ra * 1000 : 2000 * 2 ** i);
        continue;
      }
      return parseGeminiResponse<T>(JSON.parse(text) as GeminiResponse, call);
    } catch (e) {
      if (e instanceof GeminiError && !e.retryable) throw e;
      lastErr = e;
      if (i < attempts - 1) await sleep(2000 * 2 ** i);
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr instanceof Error ? lastErr : new GeminiError(String(lastErr));
}
