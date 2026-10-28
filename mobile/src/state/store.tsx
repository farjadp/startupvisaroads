// Everything the app remembers lives on the device (spec: anonymous progress
// never leaves the phone). One JSON blob in AsyncStorage, versioned.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { StepId } from '@/content/checklist';
import type { Outcome } from '@/engine/road';
import type { StoredAnswers } from '@/engine/readiness';
import type { Locale } from '@/i18n/locales';
import type { AssessAnswers } from '@/content/assessment';
import type { FxCurrency } from '@shared/fx';
import { migrate } from './migrate';

export type ModePref = 'system' | 'paper' | 'night';

export type AppState = {
  /** 2 since 27 Oct 2026: followed roads and opened sources hold v2 route keys (migrate.ts). */
  v: 2;
  onboarded: boolean;
  locale: Locale | null;
  mode: ModePref;
  /** The retired v1 pathfinder (seven answers, its road, its step ticks, keyed by v1 road). Kept as stored; no screen reads them. */
  answers: StoredAnswers;
  step: number;
  outcome: Outcome | null;
  done: Partial<Record<string, StepId[]>>;
  /** v2 route keys whose official source the user opened (the Sources badge). */
  sourcesOpened: string[];
  newsRead: boolean;
  fundsUsed: boolean;
  /** Funds tool: also show an indicative US dollar amount (v1 switch; read once into fundsCurrencies). */
  fundsUsd: boolean;
  /** Funds tool: family size last set, and the currency to show figures in besides the official one ('none'; null = not chosen yet). */
  fundsPeople: number;
  fundsCurrency: FxCurrency | 'none' | null;
  /** v2 assessment answers (phone only), the screen reached (-1 = intro), and when it was finished. */
  assess: AssessAnswers;
  assessStep: number;
  assessAt: string | null;
  /** v2 route keys the user chose to follow (onboarding 3B). Filters News and leads Home; never scored. */
  following: string[];
  /** The opening motion plays once; later launches fade. */
  introSeen: boolean;
  /** Route page v3 (road map): steps ticked, documents ready, best quiz attempt, per v2 route key. Points are derived, never stored. */
  journey: Record<string, string[]>;
  docs: Record<string, string[]>;
  quizBest: Record<string, { right: number; of: number }>;
  /** Who the money is counted for on team routes. */
  team: { founders: number; spouse: boolean; children: number };
};

const KEY = 'vr.state.v1';

export const INITIAL: AppState = {
  v: 2,
  onboarded: false,
  locale: null,
  mode: 'system',
  answers: {},
  step: 0,
  outcome: null,
  done: {},
  sourcesOpened: [],
  newsRead: false,
  fundsUsed: false,
  fundsUsd: false,
  fundsPeople: 3,
  fundsCurrency: null,
  assess: {},
  assessStep: -1,
  assessAt: null,
  following: [],
  introSeen: false,
  journey: {},
  docs: {},
  quizBest: {},
  team: { founders: 1, spouse: false, children: 0 },
};

type Actions = {
  set: (patch: Partial<AppState>) => void;
  openedSource: (route: string) => void;
  /** Ticks or unticks an item in a per-route list (journey stations, documents). */
  toggleIn: (list: 'journey' | 'docs', route: string, item: string) => void;
  /** Merges into the latest team, so two quick taps never read a stale value. */
  patchTeam: (patch: Partial<AppState['team']>) => void;
  reset: () => Promise<void>;
  /** Writes the current state now; a restart must not race the debounced write. */
  persistNow: () => Promise<void>;
};

const Ctx = createContext<{ state: AppState; hydrated: boolean; introSeenAtLaunch: boolean } & Actions>(null as never);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(INITIAL);
  const [hydrated, setHydrated] = useState(false);
  // Read once from storage: the opening motion plays only when this launch had not seen it.
  const [introSeenAtLaunch, setIntroSeenAtLaunch] = useState(false);
  const latest = useRef(state);
  latest.current = state;
  const persistNow = useCallback(() => AsyncStorage.setItem(KEY, JSON.stringify(latest.current)).catch(() => {}), []);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (!raw) return;
        // A v1 blob is brought up to v2 on read; the next write stores it as v2.
        const parsed = migrate<AppState>(JSON.parse(raw));
        if (parsed) {
          setState({ ...INITIAL, ...parsed });
          setIntroSeenAtLaunch(!!parsed.introSeen);
        }
      })
      .catch(() => {
        // Unreadable storage starts the app fresh rather than crashing it.
      })
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
  }, [state, hydrated]);

  const set = useCallback((patch: Partial<AppState>) => setState((s) => ({ ...s, ...patch })), []);
  const openedSource = useCallback(
    (route: string) => setState((s) => (s.sourcesOpened.includes(route) ? s : { ...s, sourcesOpened: [...s.sourcesOpened, route] })),
    [],
  );
  const toggleIn = useCallback(
    (list: 'journey' | 'docs', route: string, item: string) =>
      setState((s) => {
        const cur = s[list][route] ?? [];
        const next = cur.includes(item) ? cur.filter((x) => x !== item) : [...cur, item];
        return { ...s, [list]: { ...s[list], [route]: next } };
      }),
    [],
  );
  const patchTeam = useCallback((patch: Partial<AppState['team']>) => setState((s) => ({ ...s, team: { ...s.team, ...patch } })), []);
  const reset = useCallback(async () => {
    await AsyncStorage.removeItem(KEY).catch(() => {});
    setState((s) => ({ ...INITIAL, locale: s.locale, onboarded: true, mode: s.mode, introSeen: s.introSeen }));
  }, []);

  const value = useMemo(() => ({ state, hydrated, introSeenAtLaunch, set, openedSource, toggleIn, patchTeam, reset, persistNow }), [state, hydrated, introSeenAtLaunch, set, openedSource, toggleIn, patchTeam, reset, persistNow]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);
