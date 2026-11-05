// ============================================================================
// lib/agent-reports/report.ts
// The shape of a report the local Claude agents post, the check that a posted
// body really is one, and the plain-text message Telegram gets.
//
// Pure: no Prisma, no fetch. The route stores what `parseReport` returns and
// sends what `telegramMessage` builds.
//
// The payload is structured, not markdown, on purpose: the admin page draws
// metrics as tiles and trends, and items as ranked bars. Markdown would have
// to be parsed back into that, and agent output rendered as HTML is a
// stored-XSS hole. Every string here is rendered as text, never as markup.
// ============================================================================

export const AGENTS = {
  'market-intel': { fa: 'هوش بازار', en: 'Market intel' },
  'seo-strategist': { fa: 'استراتژیست سئو', en: 'SEO strategist' },
  'fact-checker': { fa: 'راستی‌آزمایی', en: 'Fact checker' },
  'ai-visibility-tracker': { fa: 'دیده‌شدن در هوش مصنوعی', en: 'AI visibility' },
} as const;

export type AgentId = keyof typeof AGENTS;

export type Metric = {
  label: string;
  value: number | string;
  /** Change since the previous report, in the metric's own unit. */
  delta?: number;
  unit?: string;
  /** Whether a rise is good (default) or bad, e.g. errors. Colours the delta. */
  higherIsBetter?: boolean;
};

export type Item = {
  title: string;
  /** 0–100. Drawn as a bar. */
  score?: number;
  priority?: 'P1' | 'P2' | 'P3';
  status?: string;
  url?: string;
  note?: string;
};

export type Section = { heading: string; body?: string; items?: Item[] };

export type Link = { label: string; url: string };

export type AgentReportPayload = {
  agent: AgentId;
  job: string;
  title: string;
  locale: 'fa' | 'en';
  /** The short version: the Telegram message, and the line under the title. */
  summary: string;
  period?: { from: string; to: string };
  metrics: Metric[];
  sections: Section[];
  /** Decisions only Farjad can make. Shown first, and counted in Telegram. */
  actions: string[];
  links: Link[];
};

export const LIMITS = {
  title: 200,
  summary: 1500,
  metrics: 16,
  sections: 20,
  items: 50,
  body: 8000,
  text: 500,
  actions: 20,
  links: 10,
} as const;

type Result = { ok: true; report: AgentReportPayload } | { ok: false; error: string };

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

function str(v: unknown, max: number): string | undefined {
  if (typeof v !== 'string') return undefined;
  const t = v.trim();
  return t ? t.slice(0, max) : undefined;
}

/** Only http(s). A `javascript:` link drawn in the admin would run with the admin's session. */
export function safeUrl(v: unknown): string | undefined {
  const s = str(v, 2000);
  if (!s) return undefined;
  try {
    const u = new URL(s);
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.toString() : undefined;
  } catch {
    return undefined;
  }
}

function num(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined;
}

function parseMetric(v: unknown): Metric | undefined {
  if (!isObj(v)) return undefined;
  const label = str(v.label, 80);
  const value = num(v.value) ?? str(v.value, 40);
  if (!label || value === undefined) return undefined;
  const m: Metric = { label, value };
  const delta = num(v.delta);
  if (delta !== undefined) m.delta = delta;
  const unit = str(v.unit, 12);
  if (unit) m.unit = unit;
  if (typeof v.higherIsBetter === 'boolean') m.higherIsBetter = v.higherIsBetter;
  return m;
}

function parseItem(v: unknown): Item | undefined {
  if (!isObj(v)) return undefined;
  const title = str(v.title, LIMITS.text);
  if (!title) return undefined;
  const it: Item = { title };
  const score = num(v.score);
  if (score !== undefined) it.score = Math.max(0, Math.min(100, Math.round(score)));
  if (v.priority === 'P1' || v.priority === 'P2' || v.priority === 'P3') it.priority = v.priority;
  const status = str(v.status, 40);
  if (status) it.status = status;
  const url = safeUrl(v.url);
  if (url) it.url = url;
  const note = str(v.note, LIMITS.text);
  if (note) it.note = note;
  return it;
}

function parseSection(v: unknown): Section | undefined {
  if (!isObj(v)) return undefined;
  const heading = str(v.heading, LIMITS.title);
  if (!heading) return undefined;
  const s: Section = { heading };
  const body = str(v.body, LIMITS.body);
  if (body) s.body = body;
  if (Array.isArray(v.items)) {
    const items = v.items.slice(0, LIMITS.items).map(parseItem).filter((x): x is Item => !!x);
    if (items.length) s.items = items;
  }
  return s.body || s.items ? s : undefined;
}

function list<T>(v: unknown, max: number, each: (x: unknown) => T | undefined): T[] {
  return Array.isArray(v) ? v.slice(0, max).map(each).filter((x): x is T => x !== undefined) : [];
}

/** Validate a posted body. Unknown fields are dropped; over-long ones are cut. */
export function parseReport(body: unknown): Result {
  if (!isObj(body)) return { ok: false, error: 'body must be a JSON object' };
  const agent = body.agent;
  if (typeof agent !== 'string' || !(agent in AGENTS)) {
    return { ok: false, error: `agent must be one of ${Object.keys(AGENTS).join(', ')}` };
  }
  const job = str(body.job, 40);
  if (!job || !/^[a-z][a-z0-9-]*$/.test(job)) return { ok: false, error: 'job must be a lowercase slug, e.g. scan' };
  const title = str(body.title, LIMITS.title);
  if (!title) return { ok: false, error: 'title is required' };
  const summary = str(body.summary, LIMITS.summary);
  if (!summary) return { ok: false, error: 'summary is required' };

  const report: AgentReportPayload = {
    agent: agent as AgentId,
    job,
    title,
    locale: body.locale === 'en' ? 'en' : 'fa',
    summary,
    metrics: list(body.metrics, LIMITS.metrics, parseMetric),
    sections: list(body.sections, LIMITS.sections, parseSection),
    actions: list(body.actions, LIMITS.actions, (x) => str(x, LIMITS.text)),
    links: list(body.links, LIMITS.links, (x) => {
      if (!isObj(x)) return undefined;
      const label = str(x.label, 80);
      const url = safeUrl(x.url);
      return label && url ? { label, url } : undefined;
    }),
  };
  if (isObj(body.period)) {
    const from = str(body.period.from, 10);
    const to = str(body.period.to, 10);
    if (from && to && /^\d{4}-\d{2}-\d{2}$/.test(from) && /^\d{4}-\d{2}-\d{2}$/.test(to)) report.period = { from, to };
  }
  return { ok: true, report };
}

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
export function localNumber(n: number | string, locale: 'fa' | 'en'): string {
  const s = typeof n === 'number' ? n.toLocaleString('en-US') : n;
  return locale === 'fa' ? s.replace(/\d/g, (d) => FA_DIGITS[Number(d)]).replace(/,/g, '٬') : s;
}

export function formatDelta(d: number, locale: 'fa' | 'en'): string {
  const sign = d > 0 ? '+' : d < 0 ? '−' : '±';
  return `${sign}${localNumber(Math.abs(d), locale)}`;
}

// Telegram caps a message at 4096 characters. Stay well under it.
export const TELEGRAM_LIMIT = 3500;

/**
 * Plain text — the sender sets no parse_mode, so nothing an agent writes can
 * render as markup or a disguised link.
 */
export function telegramMessage(r: AgentReportPayload, adminUrl: string): string {
  const fa = r.locale === 'fa';
  const name = AGENTS[r.agent][r.locale];
  const lines: string[] = [`📊 ${name} · ${r.job}`, r.title, '', r.summary];

  const metrics = r.metrics.slice(0, 6);
  if (metrics.length) {
    lines.push('');
    for (const m of metrics) {
      const delta = m.delta !== undefined && m.delta !== 0 ? ` (${formatDelta(m.delta, r.locale)})` : '';
      lines.push(`• ${m.label}: ${localNumber(m.value, r.locale)}${m.unit ? ` ${m.unit}` : ''}${delta}`);
    }
  }

  if (r.actions.length) {
    lines.push('', fa ? `⚠️ ${localNumber(r.actions.length, 'fa')} تصمیم با شماست:` : `⚠️ ${r.actions.length} decision(s) for you:`);
    for (const a of r.actions.slice(0, 5)) lines.push(`– ${a}`);
    if (r.actions.length > 5) lines.push(fa ? '…' : '…');
  }

  const tail = ['', `${fa ? 'گزارش کامل' : 'Full report'}: ${adminUrl}`];
  let text = lines.join('\n');
  const room = TELEGRAM_LIMIT - tail.join('\n').length;
  if (text.length > room) text = `${text.slice(0, room - 1)}…`;
  return `${text}${tail.join('\n')}`;
}
