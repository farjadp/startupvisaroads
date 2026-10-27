// Everything the app remembers lives on the device (spec: anonymous progress
// never leaves the phone). One JSON blob in AsyncStorage, versioned.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { StepId } from '@/content/checklist';
import type { RouteKey } from '@/content/routes';
import type { Outcome } from '@/engine/road';
import type { QuizKey, StoredAnswers } from '@/engine/readiness';
import type { Locale } from '@/i18n/locales';
import type { AssessAnswers } from '@/content/assessment';
import type { FxCurrency } from '@shared/fx';

export type ModePref = 'system' | 'paper' | 'night';

export type AppState = {
  v: 1;
  onboarded: boolean;
  locale: Locale | null;
  mode: ModePref;
  answers: StoredAnswers;
  step: number;
  outcome: Outcome | null;
  done: Partial<Record<RouteKey, StepId[]>>;
  sourcesOpened: RouteKey[];
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
  /** Roads the user chose to follow (onboarding 3B). Orders Roads and filters News; never scored. */
  following: RouteKey[];
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
  v: 1,
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
  answer: (key: QuizKey, value: string) => void;
  toggleStep: (route: RouteKey, step: StepId) => void;
  openedSource: (route: RouteKey) => void;
  /** Ticks or unticks an item in a per-route list (journey stations, documents). */
  toggleIn: (list: 'journey' | 'docs', route: string, item: string) => void;
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
        const parsed = JSON.parse(raw) as AppState;
        if (parsed?.v === 1) {
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
  const answer = useCallback((key: QuizKey, value: string) => setState((s) => ({ ...s, answers: { ...s.answers, [key]: value } as StoredAnswers })), []);
  const toggleStep = useCallback(
    (route: RouteKey, step: StepId) =>
      setState((s) => {
        const cur = s.done[route] ?? [];
        const next = cur.includes(step) ? cur.filter((x) => x !== step) : [...cur, step];
        return { ...s, done: { ...s.done, [route]: next } };
      }),
    [],
  );
  const openedSource = useCallback(
    (route: RouteKey) => setState((s) => (s.sourcesOpened.includes(route) ? s : { ...s, sourcesOpened: [...s.sourcesOpened, route] })),
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
  const reset = useCallback(async () => {
    await AsyncStorage.removeItem(KEY).catch(() => {});
    setState((s) => ({ ...INITIAL, locale: s.locale, onboarded: true, mode: s.mode, introSeen: s.introSeen }));
  }, []);

  const value = useMemo(() => ({ state, hydrated, introSeenAtLaunch, set, answer, toggleStep, openedSource, toggleIn, reset, persistNow }), [state, hydrated, introSeenAtLaunch, set, answer, toggleStep, openedSource, toggleIn, reset, persistNow]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);
