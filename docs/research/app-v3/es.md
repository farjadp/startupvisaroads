# Spain (ES): routes and site check, 9 Nov 2026

New country: "ours" = the new `lib/routes-v2/es.ts` and `lib/routes-v2/extras/es.ts`. There is no Gemini notebook for Spain, so `media` is empty and there is no notebook column. The main input was the site's own Spain guide (en `app/[locale]/(public)/europe/spain/SpainEn.tsx`, fa `content/fa/europe-spain.ts`). The live pages at visaroads.com/europe/spain and /fa/europe/spain carry the same figures as the repo files (checked with WebFetch).

inclusion.gob.es refuses curl and WebFetch, so its pages and PDFs were read in the built-in browser. PDFs were decoded in the page with a small text extractor.

## Official pages opened (2026-11-09)

- Ley 14/2013, consolidated text (arts. 61–76, DA 6, 7, 17, 18, 20, 21): https://www.boe.es/buscar/act.php?id=BOE-A-2013-10074. Arts. 63–67 (investor "golden visa") have been empty since 3 Apr 2025 (LO 1/2025).
- Ley 28/2022, consolidated text (art. 7, 15% rate for emerging companies): https://www.boe.es/buscar/act.php?id=BOE-A-2022-21739
- UGE, Entrepreneurs: https://www.inclusion.gob.es/web/unidadgrandesempresas/emprendedores
- UGE, instructions for the entrepreneur application (PDF, dated by its link `t=1682675484705`, Apr 2023): https://www.inclusion.gob.es/documents/1823432/1826098/Instrucciones+solicitud+emprendedores.pdf/3a4d0b60-71bf-1c53-9f9d-fff7f94cbf5d?t=1682675484705
- UGE, indicative documentation page, plus its general and entrepreneur PDFs (the entrepreneur PDF dates from 2015 and still names the Dirección General de Comercio Internacional e Inversiones): https://www.inclusion.gob.es/web/unidadgrandesempresas/documentacion-orientativa
- UGE, Authorisations and requirements: https://www.inclusion.gob.es/web/unidadgrandesempresas/autorizaciones-y-requisitos
- UGE, teleworkers, and the holders' documentation PDF (means, insurance, qualification): https://www.inclusion.gob.es/web/unidadgrandesempresas/teletrabajadores, https://www.inclusion.gob.es/documents/d/unidadgrandesempresas/informacion-documentacion-pagina-web-titular-v2
- UGE, highly qualified professionals, and the June 2026 Blue Card threshold update: https://www.inclusion.gob.es/web/unidadgrandesempresas/profesionales-altamente-cualificados, https://www.inclusion.gob.es/documents/d/unidadgrandesempresas/umbral-salarial.pdf
- Ministry of Inclusion, sheet 1, long-term stay for studies (updated Nov 2025): https://www.inclusion.gob.es/web/migraciones/w/estancia-por-estudios
- Real Decreto 1155/2024 (immigration regulation, art. 57: 30 h/week; arts. 67–68: family reunification; arts. 82–85: self-employment): https://www.boe.es/buscar/act.php?id=BOE-A-2024-24099
- Real Decreto 126/2026, SMI 2026 (EUR 1,221 a month, EUR 17,094 a year): https://www.boe.es/buscar/doc.php?id=BOE-A-2026-3815
- Ley 31/2022 (2023 budget), DA 90: IPREM EUR 600 a month: https://www.boe.es/buscar/act.php?id=BOE-A-2022-22128
- one.gob.es, application for the entrepreneur visa (100% IPREM + 50% per family member): https://one.gob.es/en/procedures/application-entrepreneur-visa
- Consulate General of Spain in London, entrepreneur visa (page dated 29 Apr 2026): https://www.exteriores.gob.es/Consulados/londres/en/ServiciosConsulares/Paginas/Consular/Visado-para-emprendedor.aspx
- Civil Code arts. 22–23 (citizenship): https://www.boe.es/buscar/act.php?id=BOE-A-1889-4763
- Income tax law art. 93 (newcomers' regime): https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764
- Corporate tax law art. 29 (as amended by Ley 7/2024): https://www.boe.es/buscar/act.php?id=BOE-A-2014-12328
- Ley 18/2022 (SL with EUR 1 capital): https://www.boe.es/buscar/act.php?id=BOE-A-2022-15818
- Indicators: UNDP HDR country page (ESP), World Bank API (NY.GDP.PCAP.CD, SL.UEM.TOTL.ZS), WIPO GII 2026 results.

## (a) Routes

### es-entrepreneur (family `startup`): open
- Basis: Ley 14/2013 arts. 69–70 as rewritten by Ley 28/2022. The activity must be "innovadora y/o" of special economic interest, with a favourable ENISA report. The UGE asks ENISA for the report ex officio; ENISA has 10 working days.
- The UGE says there is no minimum investment and no minimum job creation.
- Permit 3 years, renewals of 2, permanent residence possible at 5 (art. 69). Filed electronically with the UGE by the applicant or a legal representative. From abroad, one application starts the permit and then the visa.
- UGE decision within 20 days of electronic filing; silence means granted (art. 76.1). The application extends the current stay or residence until the decision. Visa within 10 working days, except applicants under Visa Code art. 22 consultation (art. 75.5). The visa is valid for one year (art. 75.4; London consulate).
- General requirements (art. 62.3): not irregular; 18 or over; no criminal record in the countries of residence of the last 2 years, plus a declaration covering 5; not on the refusal list; health insurance with an insurer authorised in Spain; sufficient means; fee paid. Family (art. 62.4): spouse or partner, minor children, dependent adult children, dependent ascendants; they can apply jointly, and joint applications are decided together.
- Means: Ley 14/2013 names no amount. one.gob.es states "100% of the IPREM, plus 50% of the IPREM for each family member". IPREM is EUR 600 a month (Ley 31/2022, DA 90; prorogued budget). **But** DA 20.3 of Ley 14/2013 (added 2022, amended 2023) says means thresholds "se referenciarán al salario mínimo interprofesional". No UGE page states an entrepreneur figure. Our scoreable test uses 36 × EUR 600 = EUR 21,600, which is our own multiplication; the route's `review` says so.
- Steps: ENISA portal questionnaire → form MIT + tasa 790-038 point 7 (NRC = 22 alphanumeric characters) + passport scan → UGE e-office with certificate or Cl@ve, 24 MB maximum → decision → consulate.
- Renewal: two-year periods; filing up to 90 days after expiry keeps the permit valid, with a possible fine (art. 76.3). For the first 6 months the passport is enough to register with Social Security (art. 76.5).
- Not verified: the 790-038 fee amount (left out on purpose); the five-year national long-term residence rule outside art. 69 (LO 4/2000 art. 32 was not reopened).

### es-digital-nomad (family `talent`, for want of a remote-work family): open
- Ley 14/2013 arts. 74 bis–quinquies: remote work for companies outside Spain. Freelancers may work for Spanish companies for up to 20% of their activity; employees may not.
- Requirements: a graduate of a reputed university, VET or business school, or 3 years of experience; the employer has been active for at least a year; the work relationship has lasted at least 3 months.
- Means (UGE holders' PDF): the holder needs 200% of the SMI; a two-person household adds at least 75% of the SMI; each further member adds 25%. Savings can cover a shortfall for the whole permit. Insurance: no travel policies, no co-payments, no waiting periods.
- SMI 2026: EUR 1,221 × 14 = EUR 17,094 a year, so 200% = EUR 34,188. The UGE wording ("mensualmente el 200% del SMI") leaves the 12- vs 14-payment basis open; this is noted in `review`.
- Visa up to 1 year; permit up to 3 years; renewals of 2. Apply for the permit within the 60 days before the visa expires.

### es-blue-card (family `talent`): open
- Ley 14/2013 arts. 71, 71 bis. The Blue Card needs a degree of at least 3 years (EQF 6) or 5 years of experience (3 within the last 7 years for ICT), and a contract or firm offer of at least 6 months.
- Salary thresholds since June 2026 (UGE update under Orden PJC/44/2026, 1.4 × the INE 2024 average of EUR 29,540.26): general EUR 41,356.36; reduced EUR 33,085.09 for shortage occupations in CNO groups 1–2 and for qualifications obtained within the last 3 years. The national highly qualified permit (art. 71.2.b) uses EUR 41,356.36 with no reduction.
- Permit 3 years (or the contract plus 3 months), renewals of 2, long-term residence at 5 (art. 71.3). 20-day decision, silence means granted.

### es-study (family `study`): open
- Ministry of Inclusion sheet 1 (Nov 2025) under RD 1155/2024. Means: 100% of the IPREM a month for the student; 75% for the first family member; 50% for each further one. Prepaid accommodation can replace the means; tuition money is not counted. Apply at least 2 months before studies start. Consulate decides within 1 month; from Spain, 2 months, and silence means refused. The stay covers the whole programme. Family members may not work.
- Work: up to 30 h/week automatically for higher-education students (RD 1155/2024 art. 57.2).
- After studies: up to 24 months to look for work or start a business, for graduates at EQF 6 or above (Ley 14/2013 DA 17). The 20-day decision with positive silence applies.
- Study years count at 50% towards EU long-term residence (RD 1155/2024, EU long-term residence article).

### Families checked and left out
- Investor (golden visa): abolished from 3 Apr 2025 (Ley 14/2013 arts. 63–67 emptied by LO 1/2025).
- Ordinary self-employment (cuenta propia, RD 1155/2024 arts. 82–85): 1-year initial permit, limited to one region and sector, 3-month decision, silence means refused. Mentioned on the site; not added as a route. Could be added if the app wants a non-innovative business route.

### Citizenship (all routes)
Civil Code art. 22: 10 years; 2 for nationals of Ibero-American countries, Andorra, the Philippines, Equatorial Guinea and Portugal, and for Sephardic Jews. Art. 23: the applicant renounces the previous nationality, except nationals of art. 24.1 countries. Hence `dualCitizenship: 'restricted'`. DELE A2 + CCSE: the site's claim matches BOE text read in Ley 12/2015, which deals with Sephardic applicants. The general-residence instrument was not opened.

### Country indicators
HDI 28/193 (0.918, 2023 data); GDP per capita US$38,627 (2025); unemployment 10.4% (2025); WIPO GII 2026 rank 28/139.

Not used:
- World Happiness: the dashboard did not render Spain's row.
- EF EPI: the Spain page showed a 2023 rank (36) while the index page is the 2025 edition, so the rank was not used.
- GPI and Henley: not attempted.

## (b) Site check: claims on the Spain pages that the official pages contradict or do not support

Severity: **high** = a figure or rule a reader acts on is wrong or unsupported; **medium** = misattributed or outdated, the conclusion may still hold; **low** = wording or precision.

| # | Claim on the site | Where | Official says | URL | Severity |
|---|---|---|---|---|---|
| 1 | Means for entrepreneurs are "the administration's criterion": 100% of the IPREM, EUR 600 a month in 2026, 150% for two, +50% per member; "published by the Secretaría de Estado de Migraciones" | SpainEn.tsx:124, 265, 483, 533–534, 565, 613–616; meta.ts (title "Real Funds"); SpainWidgets.tsx:4–5; europe-spain.ts:23–28, 48, 178–179, 211, 214–217 | No UGE or Ministry of Inclusion page states an entrepreneur figure. The IPREM criterion appears on **one.gob.es** (Oficina Nacional de Emprendimiento) and on consulate pages (e.g. Boston), not in anything the site cites. Ley 14/2013 **DA 20.3** (since 2022/2023): means thresholds "se referenciarán al salario mínimo interprofesional". The IPREM figure may therefore be outdated under the law's own rule; at minimum the site cites the wrong publisher. | https://one.gob.es/en/procedures/application-entrepreneur-visa ; https://www.boe.es/buscar/act.php?id=BOE-A-2013-10074 (DA 20) | high |
| 2 | IPREM "frozen since 2023 and EUR 600 a month in 2026" | SpainEn.tsx:483, 616; europe-spain.ts:25–26 | EUR 600 is set for 2023 by Ley 31/2022 DA 90. 2026 relies on the prorogued budget; no 2026 act was found on BOE. Plausible, but not proven by a 2026 source. | https://www.boe.es/buscar/act.php?id=BOE-A-2022-22128 | low |
| 3 | NRC is a "22-digit" code | SpainEn.tsx:148, 151, 202; europe-spain.ts:240 ("کد ۲۲ رقمی") | UGE instructions: "código de 22 caracteres alfanuméricos" (letters and digits). | UGE instructions PDF | low |
| 4 | "15% corporate tax instead of 25%" | SpainEn.tsx:939 and the tax section around 921–942; europe-spain.ts:281 | 15% for empresas emergentes is right (Ley 28/2022 art. 7: first positive year + 3). But since 2025 (Ley 7/2024) small companies with turnover under EUR 1m pay 17%/20%, and **every** newly created entity pays 15% in its first positive period and the next (LIS art. 29.1). The startup advantage is two extra years, not 15 vs 25. | https://www.boe.es/buscar/act.php?id=BOE-A-2014-12328 ; https://www.boe.es/buscar/act.php?id=BOE-A-2022-21739 | medium |
| 5 | After arrival you must get a TIE ("Arrive and get your TIE"; "A permit for more than six months needs a residence card") | SpainEn.tsx:178–183, 328; europe-spain.ts:116, 244 | Art. 75.4: residence visas under Ley 14/2013 last one year and "autorizarán la residencia de su titular en España sin necesidad de tramitar la tarjeta de identidad de extranjero". London consulate: the visa makes the TIE unnecessary during its validity, though the entrepreneur "may apply". Art. 76.2 (TIE for permits over 6 months) applies to permits granted in Spain. The step is optional in year one for visa holders, not required. | BOE Ley 14/2013 art. 75.4, 76.2; London consulate page | medium |
| 6 | Iran is on the Visa Code art. 22 prior-consultation list | SpainEn.tsx:269, 308, 537; europe-spain.ts:52, 96, 182, 302 | Art. 75.5's exception is verified. The country list is not published on any official page we could open, so "Iran included" is unverified. | BOE Ley 14/2013 art. 75.5 | medium (unverified) |
| 7 | Sources list says the UGE page backs "No minimum investment ... what ENISA assesses" and the code comment says the page was read with ENISA's "three criteria" | SpainEn.tsx:96–99 | Correct, but the UGE page heading still reads "Arts. 68 to 70" and says "innovative nature **that has** special economic interest". The page lags the law (68 deleted; "y/o"). The site rightly follows the law. No change needed; noted for the source note. | UGE Emprendedores | low |
| 8 | Ordinary self-employment permit "is assessed by the provincial labour office" | SpainEn.tsx:344; europe-spain.ts:132 | RD 1155/2024 art. 85: the "órgano competente" decides, which is the regional authority where it holds the competence. Visa through the consulate, 3-month decision, silence means **refused**, initial permit 1 year limited to one region and sector. The site's conclusion stands; the body is imprecise. | https://www.boe.es/buscar/act.php?id=BOE-A-2024-24099 | low |
| 9 | DELE A2 + CCSE mandatory for citizenship | SpainEn.tsx:246, 285, 989; europe-spain.ts:68, 272 | Consistent with the BOE text read (Ley 12/2015), but that law concerns Sephardic applicants. The general instrument for residence applicants (RD 1004/2015 / Ministry of Justice page) was not opened; the Justice URL tried returned 404. | https://www.boe.es/buscar/act.php?id=BOE-A-2015-7045 | low (partly verified) |
| 10 | Iranian criminal record needs Foreign Ministry + Spanish embassy legalisation because "Iran is not a member of the Apostille Convention" | europe-spain.ts:306 | Double-legalisation route confirmed by the London consulate for non-Hague countries. Iran's non-membership was not checked on hcch.net. | London consulate | low (unverified) |
| 11 | "Declaration of entry" needed if you entered Schengen elsewhere; form EX-17; tasa 790-012 | SpainEn.tsx:180, 328; europe-spain.ts:116, 232, 244 | Not checked on sede.administracionespublicas.gob.es / policia.es. | — | low (unverified) |
| 12 | Comparison figures for Italy, Estonia, Denmark, Netherlands (EUR 50,000, 5 founders, quota 75, etc.) | SpainEn.tsx:250–256, 352–356; europe-spain.ts:313–317 | Out of scope for Spain; not checked here. | — | n/a |

Claims checked and **supported** (no change): no minimum investment or job creation; ENISA 10 working days; UGE 20 days with positive silence and its stop on document requests (the stop rule is general administrative law, not reopened); consular 10 working days except Visa Code art. 22 cases; 3-year permit, 2-year renewals, permanent residence at 5; family incl. dependent ascendants, decided together; criminal record 2 years + 5-year declaration (law) vs London's 5 years / 6 months; health insurance wording (no "sin copago" in Ley 14/2013; the UGE does exclude co-payments for teleworkers); 24 MB; form MIT with scanned signature; certificate or Cl@ve; old UGE checklist names the previous evaluating body; renewal up to 90 days late with a possible fine; passport enough for Social Security for 6 months; filing in Spain extends the current stay (art. 76.1); citizenship 10 years and the 2-year list; renunciation unless art. 24 countries; EUR 34,188 = 200% of SMI 2026 (EUR 1,221 × 14); SL with EUR 1 capital (Ley 18/2022); Beckham regime covers art. 70 entrepreneurs, 24% up to EUR 600,000, year of arrival + 5, not resident in the previous 5 (IRPF art. 93); no founder cap in Spanish law.

Not on the site, worth adding: the teleworker, Blue Card (EUR 41,356.36 / 33,085.09 since June 2026) and study routes; the 24-month post-study search permit; and the end of the investor visa on 3 Apr 2025.
