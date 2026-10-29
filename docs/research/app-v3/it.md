# Italy (IT): notebook vs our data vs official pages

Checked 2026-10-27. Data written to `lib/routes-v2/extras/it.ts`.

**Access problem.** `italiastartupvisa.mise.gov.it` and `mimit.gov.it` refused connections from WebFetch, curl and the browser pane all day (ECONNREFUSED / timeout). The ISV portal and the 2018 Guidelines PDF could not be reopened. Startup figures were rechecked on consular pages instead (Chicago, Montreal, Maputo checklist dated 25/05/2026) and on Normattiva for Law 193/2024. Anything only on the ISV portal is marked unverified below.

Notebooks: `a17a116c-…` (Italia Startup Visa, 16 sources). `eac50320-…` (Europe business visas) has no Italy content: all 18 sources and the whole chat are about Spain, Portugal and France.

## it-startup (Italia Startup Visa)

| Field | Ours | Notebook | Official | Verdict | URL |
|---|---|---|---|---|---|
| Project funds | EUR 50,000, whole project | EUR 50,000 | "not less than 50,000 euros", dedicated to the startup | Ours right | https://ambmaputo.esteri.it/wp-content/uploads/2026/06/SELF-EMPLOYMENT-START-UP-1.pdf |
| Prior-year income | ~EUR 8,500 | "8,400 to 8,500" | Chicago EUR 8,400; New York EUR 8,500 | Ours right (approx); consulates still differ | https://conschicago.esteri.it/en/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/visti/visa-categories-and-requirements/italia-start-up-visanational-long-term-visa/ |
| Nulla osta time | Within 30 days | 30 days, clock restarts if incomplete | "usually issued within 30 days" | Ours right; restart rule notebook only | https://consmontreal.esteri.it/en/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/visti/italia-startup-visa/ |
| Consular visa fee | "not published" | not given | EUR 116, type D self-employment / start-up (Maputo, updated 25/05/2026) | **Ours wrong → add EUR 116** | Maputo PDF above |
| Permit fees | 30.46 + 50 (second bulletin) + 16 | 30.46 + 50 + 16 | 30.46 card + 16 stamp + **30 post office fee** + "any contribution" by duration (no amount on the page) | **Ours incomplete → add EUR 30 postal fee; EUR 50 contribution unverified** | https://www.poste.it/prodotti/guida-rilascio-e-rinnovo-permesso-di-soggiorno.html |
| Permit deadline after entry | not encoded | 8 working days | 8 working days, Questura of the province | Notebook right; add to route | https://www.poliziadistato.it/articolo/225 |
| Joining an existing startup | EUR 100,000 + company ≥ 3 years | EUR 100,000 | Montreal: managerial role in a startup active "at least 3 years"; no amount | 3 years confirmed; EUR 100,000 unverified | Montreal URL above |
| Consulting / agency exclusion | Since Dec 2024 (Law 193/2024) | same | Art. 28 L. 193/2024 adds "non svolge attività prevalente di agenzia e di consulenza"; in force 18 Dec 2024 | Ours right | https://www.normattiva.it/atto/caricaDettaglioAtto?atto.dataPubblicazioneGazzetta=2024-12-17&atto.codiceRedazionale=24G00215&atto.articolo.numero=28&atto.articolo.sottoArticolo=1&atto.articolo.tipoArticolo=0 |
| R&D indicator | 15% (one of 3 indicators) | 15%, rising to 25% from year 3 | 15% base; staying past year 3 needs one of: R&D 25%, PA testing contract, >50% growth, >EUR 50k equity reserve with R&D 20%, a patent | Ours right; notebook simplifies the year-3 rule | Normattiva URL above |
| SME requirement | not encoded | yes | New letter a-bis: must be an EU micro/small/medium enterprise | Add (notebook right) | Normattiva URL above |
| Team cap | 5 nulla osta (10 exceptionally) | not covered | ISV portal unreachable | Unverified today | — |
| Visa validity | 1 year | 1 year | "valid for one year" | Ours right | Montreal URL above |
| Permit then renewal | 1-year permit, renewable for 2 years | same; renew 60 days before expiry; no more than 6 months abroad | ISV portal unreachable | Unverified today | — |
| EU long-term permit | 5 years, assegno sociale, A2 | 5 years | 5 years valid permit; income ≥ assegno sociale (no amount on the page); A2; absences < 6 months in a row and ≤ 10 months total | Ours right | https://www.poliziadistato.it/articolo/permesso-di-soggiorno-ue-per-soggiornanti-di-lungo-periodo.--carta-di-soggiorno-per-cittadini-stranieri |
| Citizenship | not encoded | not covered | 10 years legal residence (non-EU), B1, EUR 250 + EUR 16 stamp | New | https://prefettura.interno.gov.it/it/prefetture/treviso/cittadinanza-art-9 |

`lib/fa/programmes.ts` 'italy': founders max 5 (unverified today), investment EUR 50,000 (right), unscored list (income test, Art. 25 indicators, consulting exclusion) consistent with the above. The "prior link to Italy" line comes from the 2018 Guidelines, which could not be reopened.

**Notebook only, unverified** (ISV portal down): priority family reunification for ISV holders; Italia Startup Hub conversion from inside Italy; 3 months to collect the visa after the nulla osta; 180 days to enter after the visa; notify the secretariat of the company number within 90 days; certified-incubator route taking 2–6 weeks; email subject format "APPLICATION ISV FIRST NAME … LAST NAME …"; bank letter content (AML checks, transferability); ISV holders may also take employment.

## it-self-employed (lavoro autonomo)

| Field | Ours | Notebook | Official | Verdict | URL |
|---|---|---|---|---|---|
| Quota | 650/yr 2026–2028, 50 reserved for Italian origin | — | 650 per year 2026, 2027, 2028; reserve not on this page | 650 right; reserve of 50 not on the page opened (Circular 8047 not reopened) | https://prefettura.interno.gov.it/it/prefetture/macerata/comunicazioni/dpcm-2-ottobre-2025-programmazione-dei-flussi-dingresso-2026-2028 |
| Resources | EUR 14,000 | — | "cannot be lower than the triple of the minimum social welfare yearly income (14.000 Euro)" | Ours right | https://consnewyork.esteri.it/en/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/visti/visas-to-enter-italy/independent-work/ |
| Income | ~EUR 8,500 | — | EUR 8,500 | Ours right | NY URL above |
| Questura nulla osta | ≤ 90 days old | — | issued within the previous 90 days | Ours right | NY URL above |
| Investor contingent | EUR 500,000, 3 jobs, 500/yr | — | not on pages opened | Unverified today | — |
| Visa fee | not published | — | EUR 116 for D self-employment start-up (Maputo); generic self-employment fee page not opened | Use 116 with care | Maputo PDF |
| Conversion | not encoded | — | Study and EU long-term permits convert to self-employment **outside quota**, no numerical limit | New | Macerata URL above |

## it-study

| Field | Ours | Notebook | Official | Verdict | URL |
|---|---|---|---|---|---|
| Funds 2026/27 | EUR 10,179.85/yr | — | EUR 10,179.85 per year | Ours right | https://consparigi.esteri.it/fr/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/visti/visto-di-studio-study-visa-visa-etudiant/ |
| Monthly figure | ~EUR 783.06 | — | Paris gives only the yearly figure | Not on page opened (Abu Dhabi PDF not reopened) | — |
| Visa fee | EUR 50 (Paris) | — | EUR 50, cash, exact amount | Ours right | Paris URL |
| Processing / deadline | ≤ 90 days; 30 Nov 2026 | — | same; no deadline for PhD/Erasmus but before courses start | Ours right | Paris URL |
| New from the page | — | — | Language proof ≥ B2; insurance from an **Italian** insurer; blocked account in own name accepted; balance alone not enough; passport issued within 10 years | Add to documents | Paris URL |

## Studio items

Notebook `a17a116c-…`:
- راهنمای جامع مطالعه: قوانین استارتاپ‌های نوآورانه و برنامه ویزای استارتاپ ایتالیا — report (study guide)
- Italy Startup Visa Blueprint (1 source) — slides
- The Startup Innovation Blueprint — slides
- Italy Startup Visa Blueprint (13 sources) — slides
- Italia Startup Blueprint — slides
- راهنمای ویزای استارتاپ ایتالیا ۲۰۲۵ — infographic
- راهنمای ویزای استارتاپ ایتالیا — infographic
- راهنمای قانون جدید استارتاپ‌های ایتالیا — infographic
- راهنمای دریافت ویزای استارتاپ ایتالیا — infographic
- راهنمای ویزای استارتاپ ایتالیا ۲۰۲۶ — infographic
- راهنمای مالی ویزای استارتاپ ایتالیا — infographic
- راهنمای جامع ویزای استارتاپ ایتالیا — infographic (two items with this title)

No videos or mind maps. `eac50320-…`: Spain-only Studio items, none for Italy.

## Profile sources

HDI 29/193 (0.915, 2023) — UNDP HDR25 annex xlsx; GPI 35/163 (1.712, 2026) — GPI 2026 poster PDF; GDP per capita USD 43,309 and unemployment 6.4% (2025) — World Bank API; GII 27/139 (2026) — wipo.int/gii-ranking/en/italy; EF EPI 59/123 (513, 2025). Not included: World Happiness Report (dashboard table did not load), Henley (ranking not on the page), top tax rate (not checked).
