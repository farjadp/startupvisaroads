# VisaRoads app — content v3 (27 Oct 2026)

Farjad's brief: check and complete every route against his Gemini notebooks, and add design, gamification, action and film. Decisions (27 Oct):

- **Figures come from official pages.** A notebook figure that disagrees with the government page is reported, not used. The notebooks rest mostly on YouTube and contradict themselves (Estonia TRP fee: 380 in chat, 190 in the report; the PPA page says 380 abroad / 350 in Estonia).
- **New content per route** (`RouteExtras`, `lib/routes-v2/extras-types.ts`):
  - funds per person / founder / team / spouse / child, split into kept vs spent
  - steps with official links (action)
  - document checklist the user ticks (action + progress)
  - realities: challenges, tips, myths
  - PR → citizenship timeline, dual-citizenship rule
  - five-question quiz (gamification)
  - media leads: the notebook Studio videos and infographics (film, design)
- **New per country** (`CountryProfile`): strengths, weaknesses, and rankings / life indicators (UNDP HDI, World Happiness Report, Global Peace Index, World Bank, WIPO GII, EF EPI, Henley, OECD), each with year and source.
- **Five new countries:** Australia, Austria, Norway, Ireland, Sweden → 15 countries.

## Files

- `lib/routes-v2/extras/<cc>.ts` — `EXTRAS_<CC>: Record<routeKey, RouteExtras>` and `PROFILE_<CC>: CountryProfile`, one file per country.
- `lib/routes-v2/<cc>.ts` — route data for each new country (`RouteV2[]`).
- `docs/research/app-v3/<cc>.md` — per country: notebook vs current data vs official page, with the verdict and URL for each conflict.

## Phases

1. Research and data, one country group per agent (this file).
2. Corrections from the conflict reports applied to the existing route files.
3. Design options for the route and country pages (rendered, Farjad picks), then the UX auditor.
4. Screens: steps, checklist with progress, quiz with points, funds calculator per team, country profile, media.
5. Video: playing in-app needs `expo-video`, a native module, so it ships in a store build, not over the air. Infographics (images) can ship over the air.
