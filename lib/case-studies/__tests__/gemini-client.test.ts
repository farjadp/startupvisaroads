import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MODELS, callJson, provider, requireApiKey, type JsonCall } from '../../../scripts/case-studies/lib/anthropic';
import { buildGeminiBody, parseGeminiResponse, thinkingLevel } from '../../../scripts/case-studies/lib/gemini';

const call: JsonCall = {
  model: 'gemini-3.8-flash',
  system: 'SYSTEM',
  user: '<decision>text</decision>',
  schema: { type: 'object', properties: { a: { type: 'string' } }, required: ['a'] },
  maxTokens: 1000,
  effort: 'high',
};

const ok = (text: string, finishReason = 'STOP') => ({
  modelVersion: 'gemini-3.8-flash-001',
  candidates: [{ finishReason, content: { parts: [{ text: 'thinking…', thought: true }, { text }] } }],
  usageMetadata: { promptTokenCount: 100, candidatesTokenCount: 20, thoughtsTokenCount: 30 },
});

const ENV = ['CASE_STUDIES_PROVIDER', 'GEMINI_API_KEY', 'ANTHROPIC_API_KEY', 'CASE_STUDIES_MODEL_EXTRACT', 'CASE_STUDIES_MODEL_VERIFY'];
let saved: Record<string, string | undefined>;
beforeEach(() => {
  saved = Object.fromEntries(ENV.map((k) => [k, process.env[k]]));
  ENV.forEach((k) => delete process.env[k]);
});
afterEach(() => {
  ENV.forEach((k) => (saved[k] === undefined ? delete process.env[k] : (process.env[k] = saved[k])));
  vi.unstubAllGlobals();
});

describe('provider selection', () => {
  it('defaults to gemini and its models', () => {
    expect(provider()).toBe('gemini');
    expect(MODELS.extract()).toBe('gemini-3.8-flash');
    expect(MODELS.verify()).toBe('gemini-3.5-flash-lite');
  });
  it('switches to claude models', () => {
    process.env.CASE_STUDIES_PROVIDER = 'claude';
    expect(MODELS.extract()).toBe('claude-opus-5-5');
  });
  it('model env vars still override', () => {
    process.env.CASE_STUDIES_MODEL_EXTRACT = 'gemini-4-argon';
    expect(MODELS.extract()).toBe('gemini-4-argon');
  });
  it('rejects an unknown provider', () => {
    process.env.CASE_STUDIES_PROVIDER = 'openai';
    expect(() => provider()).toThrow(/not gemini or claude/);
  });
  it('asks for the key of the chosen provider', () => {
    expect(() => requireApiKey()).toThrow(/GEMINI_API_KEY/);
    process.env.CASE_STUDIES_PROVIDER = 'claude';
    expect(() => requireApiKey()).toThrow(/ANTHROPIC_API_KEY/);
  });
});

describe('gemini request', () => {
  it('keeps untrusted text out of the system instruction and asks for schema JSON', () => {
    const b = buildGeminiBody(call) as any;
    expect(b.systemInstruction.parts[0].text).toBe('SYSTEM');
    expect(b.contents[0].parts[0].text).toContain('<decision>');
    expect(b.generationConfig.responseMimeType).toBe('application/json');
    expect(b.generationConfig.responseJsonSchema).toEqual(call.schema);
    expect(b.generationConfig.maxOutputTokens).toBe(1000);
    expect(b.generationConfig.thinkingConfig).toEqual({ thinkingLevel: 'high' });
  });
  it('clamps efforts above high and omits thinking when unset', () => {
    expect(thinkingLevel('max')).toBe('high');
    expect(thinkingLevel('medium')).toBe('medium');
    expect((buildGeminiBody({ ...call, effort: undefined }) as any).generationConfig.thinkingConfig).toBeUndefined();
  });
});

describe('gemini response', () => {
  it('parses JSON, drops thought parts and maps usage', () => {
    const r = parseGeminiResponse<{ a: string }>(ok('{"a":"x"}'), call);
    expect(r.value).toEqual({ a: 'x' });
    expect(r.model).toBe('gemini-3.8-flash-001');
    expect(r.usage).toEqual({ input_tokens: 100, output_tokens: 50 });
  });
  it('treats truncation, safety stops, blocks and bad JSON as errors', () => {
    expect(() => parseGeminiResponse(ok('{"a":', 'MAX_TOKENS'), call)).toThrow(/maxOutputTokens/);
    expect(() => parseGeminiResponse(ok('{}', 'SAFETY'), call)).toThrow(/SAFETY/);
    expect(() => parseGeminiResponse({ promptFeedback: { blockReason: 'OTHER' } }, call)).toThrow(/blocked/);
    expect(() => parseGeminiResponse(ok('not json'), call)).toThrow(/not valid JSON/);
  });
});

describe('gemini call over fetch', () => {
  it('sends the key in a header, never in the URL, and does not retry a 400', async () => {
    process.env.GEMINI_API_KEY = 'test-key';
    const fetchMock = vi.fn(async () => new Response('{"error":{"status":"INVALID_ARGUMENT","message":"bad"}}', { status: 400 }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(callJson(call)).rejects.toThrow(/Gemini API 400.*INVALID_ARGUMENT/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent');
    expect(url).not.toContain('test-key');
    expect((init.headers as Record<string, string>)['x-goog-api-key']).toBe('test-key');
  });
  it('returns the parsed value on success', async () => {
    process.env.GEMINI_API_KEY = 'test-key';
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(ok('{"a":"y"}')), { status: 200 })));
    const r = await callJson<{ a: string }>(call);
    expect(r.value.a).toBe('y');
  });
});
