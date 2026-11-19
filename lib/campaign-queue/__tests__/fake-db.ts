// A small in-memory stand-in for the Prisma calls the queue makes. It keeps the
// two properties the tests depend on: updateMany is atomic, and the unique
// keys on CampaignLog reject a second row with P2002. Every call yields first,
// so two concurrent workers really do interleave.

type Row = Record<string, any>;

function matchesValue(value: any, cond: any): boolean {
  if (cond === null) return value === null || value === undefined;
  if (cond instanceof Date) return value?.getTime?.() === cond.getTime();
  if (typeof cond === 'object') {
    if ('in' in cond && !cond.in.includes(value)) return false;
    if ('not' in cond && (cond.not === null ? value === null || value === undefined : value === cond.not)) return false;
    if ('lt' in cond && !(value < cond.lt)) return false;
    if ('contains' in cond && !String(value ?? '').includes(cond.contains)) return false;
    if ('gt' in cond && !(value > cond.gt)) return false;
    if ('gte' in cond && !(value >= cond.gte)) return false;
    return true;
  }
  return value === cond;
}

export function matches(row: Row, where: Row = {}): boolean {
  return Object.entries(where).every(([key, cond]) => {
    if (key === 'OR') return (cond as Row[]).some((w) => matches(row, w));
    return matchesValue(row[key], cond);
  });
}

const tick = () => Promise.resolve();

export function createFakeDb() {
  const state = {
    campaigns: [] as Row[],
    campaignGroups: [] as Row[],
    contacts: [] as Row[],
    logs: [] as Row[],
    suppressions: [] as Row[],
    versions: [] as Row[],
    clicks: [] as Row[],
  };
  let nextLog = 1;

  const sorted = (rows: Row[], orderBy?: Row | Row[]) => {
    const orders = orderBy ? (Array.isArray(orderBy) ? orderBy : [orderBy]) : [];
    return [...rows].sort((a, b) => {
      for (const order of orders) {
        const [key, dir] = Object.entries(order)[0] as [string, string];
        if (a[key] < b[key]) return dir === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return dir === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const db: Row = {
    $transaction: async (work: (tx: Row) => Promise<unknown>) => work(db),
    campaignContentVersion: {
      create: async ({ data }: Row) => {
        await tick();
        state.versions.push({ ...data });
        return { ...data };
      },
      findMany: async ({ where, orderBy }: Row = {}) => {
        await tick();
        return sorted(state.versions.filter((v) => matches(v, where)), orderBy).map((v) => ({ ...v }));
      },
    },
    campaignLinkClick: {
      create: async ({ data }: Row) => {
        await tick();
        state.clicks.push({ ...data });
        return { ...data };
      },
      groupBy: async ({ where }: Row) => {
        await tick();
        const counts = new Map<string, Row>();
        for (const click of state.clicks.filter((c) => matches(c, where))) {
          const key = `${click.logId} ${click.url}`;
          const row = counts.get(key) ?? { logId: click.logId, url: click.url, _count: { _all: 0 } };
          row._count._all++;
          counts.set(key, row);
        }
        return [...counts.values()];
      },
    },
    campaign: {
      findMany: async ({ where, orderBy }: Row = {}) => {
        await tick();
        return sorted(state.campaigns.filter((c) => matches(c, where)), orderBy).map((c) => ({ ...c }));
      },
      findUnique: async ({ where }: Row) => {
        await tick();
        const row = state.campaigns.find((c) => c.id === where.id);
        return row ? { ...row } : null;
      },
      updateMany: async ({ where, data }: Row) => {
        await tick();
        const rows = state.campaigns.filter((c) => matches(c, where));
        rows.forEach((c) => Object.assign(c, data));
        return { count: rows.length };
      },
    },
    campaignGroup: {
      findMany: async ({ where }: Row) => {
        await tick();
        return state.campaignGroups.filter((g) => matches(g, where));
      },
    },
    marketingContact: {
      findMany: async ({ where, orderBy }: Row = {}) => {
        await tick();
        return sorted(state.contacts.filter((c) => matches(c, where)), orderBy).map((c) => ({ ...c }));
      },
      deleteMany: async ({ where }: Row) => {
        await tick();
        const before = state.contacts.length;
        state.contacts = state.contacts.filter((c) => !matches(c, where));
        return { count: before - state.contacts.length };
      },
    },
    marketingSuppression: {
      findMany: async () => {
        await tick();
        return state.suppressions.map((r) => ({ ...r }));
      },
      findUnique: async ({ where }: Row) => {
        await tick();
        return state.suppressions.find((r) => r.key === where.key) ?? null;
      },
      upsert: async ({ where, create }: Row) => {
        await tick();
        if (!state.suppressions.some((r) => r.key === where.key)) state.suppressions.push({ ...create });
        return { ...create };
      },
    },
    campaignLog: {
      findMany: async ({ where, orderBy, take, skip = 0 }: Row = {}) => {
        await tick();
        // Newest first must mean newest written when timestamps tie.
        const rows = state.logs.filter((l) => matches(l, where));
        const ordered = (orderBy ? sorted([...rows].reverse(), orderBy) : rows).slice(skip);
        return (take ? ordered.slice(0, take) : ordered).map((l) => ({ ...l }));
      },
      findUnique: async ({ where }: Row) => {
        await tick();
        const row = state.logs.find((l) => l.id === where.id);
        return row ? { ...row } : null;
      },
      count: async ({ where }: Row = {}) => {
        await tick();
        return state.logs.filter((l) => matches(l, where)).length;
      },
      create: async ({ data }: Row) => {
        await tick();
        for (const key of ['sendKey', 'addressKey']) {
          if (data[key] && state.logs.some((l) => l[key] === data[key])) {
            throw Object.assign(new Error(`Unique constraint failed on ${key}`), { code: 'P2002' });
          }
        }
        const row = { id: `log${nextLog++}`, sentAt: new Date(), error: null, ...data };
        state.logs.push(row);
        return { ...row };
      },
      update: async ({ where, data }: Row) => {
        await tick();
        const row = state.logs.find((l) => l.id === where.id);
        if (!row) throw new Error('log not found');
        for (const [key, value] of Object.entries(data as Row)) {
          if (value === undefined) continue;
          row[key] = (value as Row)?.increment ? (row[key] ?? 0) + (value as Row).increment : value;
        }
        return { ...row };
      },
      delete: async ({ where }: Row) => {
        await tick();
        state.logs = state.logs.filter((l) => l.id !== where.id);
        return {};
      },
    },
  };

  return { db, state };
}
