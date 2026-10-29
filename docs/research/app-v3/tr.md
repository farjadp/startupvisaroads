# Türkiye (TR): notebook vs our data vs official pages

Checked 2026-10-27. Data written to `lib/routes-v2/extras/tr.ts`.

**Access problems.** `turkiyetechvisa.gov.tr` timed out from WebFetch, curl and the browser pane; `techvisa.gov.tr` does not resolve (DNS). `goc.gov.tr` and `en.goc.gov.tr` return HTTP 500. Residence rules were read in Law 6458 and Law 5901 on mevzuat.gov.tr (PDFs) and in the e-ikamet checklists (PDFs); capital rules in the ÇSGB work-permit criteria; Tech Visa basics on invest.gov.tr. **tr-tech-visa stays `verified: false`**: no Tech Visa-specific threshold could be read on an official page.

Notebooks: `17aeaa35-…` (Tech Visa and ecosystem, 6 sources: consultants' meeting notes + 2 YouTube), `3b63da68-…` (seminar by a private agency, 2 sources), `d95f264d-…` (roadmap and costs, 4 sources: consultants' meetings). All three rest on intermediaries' meetings and sales seminars, not government material.

## tr-tech-visa

| Field | Ours | Notebook | Official | Verdict | URL |
|---|---|---|---|---|---|
| Minimum share per foreign partner | 20% | 17aeaa35: 20%; 3b63da68: **25%** | ÇSGB C.1.1(a): at least 20% (general rule for partners) | Ours right; 25% is notebook only | https://calismaizni.csgb.gov.tr/calisma-izni/-calisma-izni-degerlendirme-kriterleri/ |
| Max founders | 5 (derived from 20%) | 3b63da68: **at most 4**; 17aeaa35: teams of 3 advised | Not published | Unverified both ways | — |
| Partner capital | TRY 500,000 | TRY 500,000 | TRY 500,000, effective 1 Jan 2025; TRY 40,000 accepted until then | Ours right | ÇSGB URL |
| USD 100,000 waiver | yes | — | C.1.2: share ≥ USD 100,000 exempts from C.1.1(a) and (b) | Ours right | ÇSGB URL |
| 5 Turkish employees | Unconfirmed for founders (B.5.2) | **Tech Visa startups are exempt** | C.1.1(b): from month 7 of the first permit, monthly. B.5.2: people working "within a technology development zone" under Law 4691, with a positive Ministry of Industry opinion, are exempt from employment and financial criteria; partners not named | Ours right (still unconfirmed); notebook overstates | ÇSGB URL |
| Work permit length | 3 years | 3 years | "a special three-year work permit" | Ours right | https://www.invest.gov.tr/en/news/news-from-turkey/pages/turkiye-launches-tech-visa-program-attract-global-talent-innovators.aspx |
| Processing | Work permit ≤ 30 days | Whole process 3–6 months; ministry pre-check 2–5 days | 30 days once the file is complete; clock restarts on upload of missing documents | Ours right; notebook durations unverified | https://www.invest.gov.tr/en/investmentguide/pages/obtaining-a-work-permit.aspx |
| Consultancy | not encoded | "Welcome consultancy" | Six months of legal, financial and technical guidance | Add (notebook right) | invest.gov.tr news URL |
| Technopark evaluation fee | not encoded (amount unpublished) | USD 100, non-refundable | Not readable (portal down) | Notebook only, unverified | — |
| Set-up costs | not encoded | Company registration TRY 13–15k per company; notary TRY 15–20k per person; 3-year card ~TRY 32–33k per person; total TRY 180–200k for 3 | Not on any official page read | Notebook only, **do not use** | — |
| Running costs | — | Accountant TRY 4–10k/month; founder insurance ~TRY 12k/month per person; fixed taxes ≤ TRY 2k/month | Not read | Notebook only | — |
| Tax | — | 0% corporate tax and 0% VAT for tech companies that export; only inside a technopark | Law 4691 not opened | Notebook only, unverified | — |
| Health care | — | Free use of public hospitals | Not read | Notebook only, unverified | — |
| Family | Law 6458 family residence | spouse and children come along | Art. 34: spouse, minor or dependent children; ≤ 3 years at a time; never beyond the sponsor's permit | Confirmed | https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6458.pdf |
| Long-term residence | 8 years (Art. 42–43) | — | 8 years uninterrupted; no social aid in last 3 years; steady income; health insurance | Ours right | mevzuat 6458 URL |
| Citizenship | not encoded | — | Law 5901 Art. 11: **5 years** uninterrupted residence, "enough Turkish"; Art. 44 records multiple citizenship | New | https://www.mevzuat.gov.tr/mevzuatmetin/1.5.5901.pdf |
| Rejection | — | A rejected founder can still open an ordinary company, without Tech Visa benefits | Not read | Notebook only |

`lib/fa/programmes.ts` 'turkey': founders max 5 (derived), TRY 500,000 (right per ÇSGB); its note "five-employee rule, full exemption not confirmed" matches the official position.

## tr-turquoise-card

| Field | Ours | Notebook | Official | Verdict | URL |
|---|---|---|---|---|---|
| Categories, discretion | as published | — | Five categories; temporary-protection holders excluded | Ours right | https://www.csgb.gov.tr/uigm/en/turkuaz-kart/ |
| Transition | 3 years; apply in last 180 days | — | same; missing the window invalidates the card | Ours right | csgb URL |
| Family | not encoded | — | Spouse and dependent children get a document serving as residence permit | Add | csgb URL |
| Exceptional citizenship | Law 5901 Art. 12 | — | Art. 12(1)(b) names Turquoise Card holders, spouse and minor/dependent children; by Presidential decision | Ours right | mevzuat 5901 URL |

No notebook covers the Turquoise Card.

## tr-company-formation

| Field | Ours | Notebook | Official | Verdict | URL |
|---|---|---|---|---|---|
| Partner capital / share / USD waiver / 5 employees | as ÇSGB | TRY 500,000 | same | Ours right | ÇSGB URL |
| Net sales TRY 8m / exports USD 150k | "operating firm alternative" | — | A.2.2: financial capacity of an operating workplace (paid-in TRY 500k, or net sales TRY 8m, or exports USD 150k); not attached to partners in section C | Ours right in substance; label could say "workplace financial capacity" | ÇSGB URL |
| TRY 50m exemption | yes | — | not re-read today | Not rechecked | — |
| Short-term permit length | ≤ 2 years at a time | — | Art. 31(2) | Ours right | mevzuat 6458 URL |
| Documents | notarised company docs | — | e-ikamet: visa for this purpose, notarised activity certificate, tax plate, trade registry gazette, signature circular; plus form, passport, fee receipt, address, insurance | Ours right | https://e-ikamet.goc.gov.tr/Ikamet/BasvuruIstenenBelgeler/BasvuruFormuIstenenBelgeler?tur=0 |
| Absences | not encoded | — | Art. 28(1): > 6 months in a year or > 1 year in 5 years breaks residence | Add | mevzuat 6458 URL |

## tr-student

| Field | Ours | Notebook | Official | Verdict | URL |
|---|---|---|---|---|---|
| Eligibility, language course | degree students only | — | Art. 38; language courses get short-term (Art. 31(1)(h)) | Ours right | mevzuat 6458 URL |
| Half counts | yes | — | Art. 28(2) | Ours right | mevzuat 6458 URL |
| Work right | not encoded | — | Art. 41: with a work permit; associate/bachelor's after the first year | Add | mevzuat 6458 URL |
| Insurance | not encoded | — | Compulsory, verified online; GSS possible if applying within 3 months of the academic year start | Add | https://e-ikamet.goc.gov.tr/Ikamet/BasvuruIstenenBelgeler/BasvuruFormuIstenenBelgeler?tur=5 |
| Admission | — | — | Each university sets its own rules; TR-YÖS for some; visa from the nearest consulate | Add | https://www.studyinturkiye.gov.tr/ |

No notebook covers study.

## Studio items

`17aeaa35-…`:
- نقشه راه مالی ویزای استارتاپ ترکیه — infographic
- Turkey Tech Visa Strategy — slides
- Türkiye Tech Visa Blueprint (2) — slides
- Türkiye Tech Visa Blueprint (6 sources) — slides
- پشت پرده ویزای تکنولوژی ترکیه — audio overview (16:58; no `MediaLead` kind for audio, not listed in extras)
- Türkiye Tech Visa Blueprint (5 sources) — slides
- نقشه راه ویزای تکنولوژی ترکیه — infographic

`3b63da68-…`:
- The Red Tape Bypass: Unpacking the Turkey Tech Visa — video (4:39, cinematic)
- Turkey Tech Visa Strategic Blueprint — slides

`d95f264d-…`:
- Turkish Technopark Strategic Atlas — slides
- راهنمای تکنوپارک‌های برتر برای استارتاپ‌ها — infographic
- Turkey Startup Blueprint — slides
- گزارش شفافیت مالی استارتاپ ترکیه — infographic
- راهنمای جامع ویزای استارتاپ ترکیه — infographic
- Turkey Strategic Bridge — slides
- راهنمای هزینه‌های ویزای استارتاپ ترکیه — infographic
- راهنمای ویزای استارتاپ ترکیه — infographic

Caution for media: the cost infographics (نقشه راه مالی، گزارش شفافیت مالی، راهنمای هزینه‌ها) carry the unverified consultant cost figures above; review before showing them in the app.

## Profile sources

HDI 51/193 (0.853, 2023) — UNDP HDR25 annex; GPI 136/163 (2.605, 2026) — GPI 2026 poster; GDP per capita USD 18,599 and unemployment 8.5% (2025) — World Bank API; GII 45/139 (2026) — wipo.int/gii-ranking/en/turkiye; EF EPI 71/123 (488, 2025). Not included: World Happiness Report, Henley, top tax rate.
