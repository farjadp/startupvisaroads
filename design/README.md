# design/

`tokens.json` is the one place brand values live. It follows the W3C Design
Tokens format so a transform (Style Dictionary or a 40-line script) can emit:

- `tailwind.config.ts` → `theme.extend.colors / fontFamily / spacing` for the site
- an Expo theme object (`theme.ts`) for the app
- CSS custom properties for `globals.css`

Until that transform exists the file is read by hand. When it changes, change
the Brand Book in Notion in the same sitting; the Brand Book explains, this
file specifies.

Rules the tokens encode, in one place so nobody has to remember them:

1. One accent (`acid`). It is never text on `paper`, and never the only mark
   that shows state on `paper` (1.03:1): selection uses `theme.*.indicator`.
2. Square corners except chips and radio dots (`pill`) and the app mark (`mark`).
3. Font stack by **script**, not by locale: `latin` (en, fr), `arabic` (fa, ar), `han` (zh).
4. No letter-spacing or uppercase on Arabic script.
5. One easing curve; everything off under reduced motion.
6. No shadows.
7. Text colours pass WCAG AA in both modes; `fg-faint` is for large text and
   non-text marks only. Ratios are recorded next to each role.

Known drift this file does not yet fix: `#D4AF37` gold on legacy pages and the
unused IRANSansX files under `public/fonts`.
