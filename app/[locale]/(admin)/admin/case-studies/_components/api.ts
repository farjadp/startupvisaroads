// Client-side helpers for the case-studies admin screens. Every call goes to the
// /api/admin/case-studies/** route handlers with same-origin cookies; no server actions.

export const STATUSES = ['DRAFT', 'IN_REVIEW', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'WITHDRAWN'] as const;
export const TYPES = ['FC_DECISION', 'CLIENT_CASE'] as const;
export type CaseStatus = (typeof STATUSES)[number];
export type CaseType = (typeof TYPES)[number];

export const TYPE_LABEL: Record<CaseType, string> = {
  FC_DECISION: 'Court decision',
  CLIENT_CASE: 'Client case',
};

export type CaseListItem = {
  id: string;
  groupKey: string;
  locale: string;
  slug: string;
  type: CaseType;
  status: CaseStatus;
  title: string;
  citation: string | null;
  route: string | null;
  outcome: string | null;
  decisionDate: string | null;
  updatedAt: string;
  claimsTotal: number;
  claimsChecked: number;
  redLineCount: number;
  sample: boolean;
};

export type Claim = { id: string; kind: string; text: string; paras: Array<number | string>; quote: string; verified: boolean };
export type RedLine = { rule: string; label: string; match: string; index: number };

export type ConsentRecord = {
  id: string;
  clientRef: string;
  scope: string;
  signedAt: string;
  documentUri: string | null;
  revokedAt: string | null;
  revokedReason: string | null;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
};
export type ConsentListItem = ConsentRecord & { caseCount: number };

export type CaseDetailItem = Omit<CaseListItem, 'claimsTotal' | 'claimsChecked' | 'redLineCount'> & {
  excerpt: string | null;
  content: string | null;
  keyTakeaway: string | null;
  court: string | null;
  judge: string | null;
  officialUrl: string | null;
  publishAt: string | null;
  publishedAt: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  withdrawnAt: string | null;
  withdrawnReason: string | null;
  issues: unknown[];
  lessons: unknown[];
  claims: Claim[];
  faq: Array<{ q: string; a: string }>;
  redLines: RedLine[];
};

export type Settings = { courtPagesClearedByCounsel: boolean; clientCasesEnabled: boolean };
export type Gate = { ok: boolean; reasons: string[] };
export type CaseDetail = { item: CaseDetailItem; consent: ConsentRecord | null; settings: Settings; approval: Gate; publish: Gate };

export type Action = 'submit' | 'approve' | 'schedule' | 'publish' | 'reopen' | 'withdraw';

export class ApiError extends Error {
  status: number;
  reasons: string[];
  constructor(status: number, message: string, reasons: string[] = []) {
    super(message);
    this.status = status;
    this.reasons = reasons;
  }
}

export async function api<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      method: init?.method ?? 'GET',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: init?.body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'Network error: the server did not answer.');
  }
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) throw new ApiError(401, 'Session expired, log in again.');
    const d = (data ?? {}) as { error?: unknown; reasons?: unknown };
    const message = typeof d.error === 'string' ? d.error : `Request failed (${res.status})`;
    const reasons = Array.isArray(d.reasons) ? d.reasons.filter((r): r is string => typeof r === 'string') : [];
    throw new ApiError(res.status, message, reasons);
  }
  return data as T;
}

export function toApiError(e: unknown): ApiError {
  return e instanceof ApiError ? e : new ApiError(0, e instanceof Error ? e.message : 'Something went wrong');
}

export function fmtDate(v: string | null | undefined, withTime = false): string {
  if (!v) return '—';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleString('en-CA', withTime
    ? { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { year: 'numeric', month: 'short', day: 'numeric' });
}
