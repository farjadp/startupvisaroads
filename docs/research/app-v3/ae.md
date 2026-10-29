# United Arab Emirates (AE) — our data vs official pages

Checked 2026-10-27. No notebook exists for the UAE, so there is no notebook column; every row compares our route file with the official page.

Official pages opened:

- ICP Golden Residency (body dated 2026-09-10): https://icp.gov.ae/en/services/uae-golden-residency/
- ICP Green Residency (body dated 2026-09-12): https://icp.gov.ae/en/services/uae-green-residency/
- u.ae Golden Visa (updated 2026-07-28): https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/golden-visa
- u.ae Emirati nationality (updated 2026-09-10): https://u.ae/en/information-and-services/Passport-and-travel/The-UAE-Passport/emirati-nationality
- GDRFA Dubai: investors `8ea80da4…`, entrepreneurs `8ea80da7…`, talents `2e7da546…`, freelancers `f52024d1…`, student residence `f52024e0…`, golden students `8ea80dad…` (all under https://www.gdrfad.gov.ae/en/services/)

Not opened: any MOHRE page on the freelance permit (search found none; fee and document list unverified, so not encoded).

## ae-golden-investor

| Field | Ours | Official | Verdict | URL |
|---|---|---|---|---|
| Term | 10 years | ICP 10; GDRFAD 10; u.ae 10 (public investments) / 5 (real estate) | unchanged conflict; ours right per 2 of 3 | u.ae |
| Options | deposit/fund, capital, partner share, property, AED 250k tax | same; plus off-plan from approved developer; bank-financed property allowed | ours right | ICP |
| Abroad | — | ICP: six-month multiple-entry visa (renewable 6 months) to complete the process | add | ICP |
| Lock-in | deposit frozen ≥2 yrs | GDRFAD: deposit not refundable and property not disposable during the 10 years | add | GDRFAD inv |
| 180-day rule | — | GDRFAD: Golden holders exempt; void only if it expires abroad | add | GDRFAD inv |
| Fees / processing | 1,100 + 10 + 10 + 500 + 20, +100/yr; 5 days | same | ours right | GDRFAD inv |

**Verified?** Stays `true`.

## ae-golden-entrepreneur

| Field | Ours | Official | Verdict | URL |
|---|---|---|---|---|
| Incubator path | conflict: ICP standalone vs GDRFAD AED 2M income | unchanged: ICP lists incubator / Ministry of Economy / "the Authority" / local authority approval as a path; GDRFAD: "pioneering project from a business incubator or the Ministry of Economy … with an income of AED 2 million" | conflict persists | ICP, GDRFAD ent |
| SME path | AED 1M revenue | ICP: SME in approved field, AED 1,000,000 annual revenue; GDRFAD: project registered with MoE or local authority, AED 1M income | ours right | ICP |
| Exit | AED 7M | ICP "total value at least AED 7,000,000"; GDRFAD "sold for no less than AED 7 million" | ours right | ICP |
| Term | 10 (u.ae 5) | ICP 10, GDRFAD 10, u.ae 5 | conflict persists | u.ae |
| Nominator name | DFF | GDRFAD conditions: "Dubai Future Foundation"; documents: "Dubai Future Authority" | new minor inconsistency on GDRFAD's page | GDRFAD ent |
| Documents | — | GDRFAD: sponsor's passport copy, nomination letter | add | GDRFAD ent |
| Fees / processing | 1,100 + 10 + 10 + 500 + 20; 5 days | same, plus +100/yr beyond two years | ours missing the +100 line | GDRFAD ent |

**Verified?** Stays `false` (incubator conflict).

## ae-golden-talent

| Field | Ours | Official | Verdict | URL |
|---|---|---|---|---|
| Processing | 5 days "inferred" | GDRFAD talents page: 5.0 days, published | ours right → drop "inferred" in review | GDRFAD tal |
| Fees | 1,100 + 10 + 10 | 1,100 + 10 + 10 + 500 in-country + 20 delivery, +100/yr beyond two years | **ours incomplete → add 500, 20, +100** | GDRFAD tal |
| Specialist criteria | degree, AED 30k, MOHRE 1–2, UAE contract | ICP same | ours right | ICP |
| GDRFAD talents scope | — | covers culture/arts, innovators, athletes, digital talent only (no salary category); nomination bodies named per group; renewal = renew the nomination letter | add | GDRFAD tal |
| Culture and arts | 5 yrs experience | GDRFAD "Distinguished Practitioner": ≥5 yrs, works in last 3 yrs, recognition, membership | ours right, add detail | GDRFAD tal |

**Verified?** Stays `true`.

## ae-green-freelancer

| Field | Ours | Official | Verdict | URL |
|---|---|---|---|---|
| Income | AED 360k, "per year or combined: unclear", encoded per year | ICP now: "Annual freelance income in each of the previous two years of at least AED 360,000"; GDRFAD: "for the two preceding years should not be less than 360,000", or solvency throughout the stay | **ambiguity resolved: per year. Ours right** | ICP green |
| Solvency | GDRFAD alternative | ICP also lists "proof of stable annual income or financial solvency throughout the residence period" | ours right | ICP green |
| Entry visa fee | AED 200 + 5% VAT | not on the GDRFAD freelancer page now | **ours unverified → remove** | GDRFAD free |
| Grace period | — | 180 days after expiry or cancellation | add | GDRFAD free |
| Term | 5 years | ICP 5 years renewable; GDRFAD page silent | ours right | ICP green |

**Verified?** **Can switch to `true`** once the review note is updated and the entry-visa fee removed.

## ae-student

| Field | Ours | Official | Verdict | URL |
|---|---|---|---|---|
| Golden term | 10 (u.ae 5 for school) | GDRFAD: "valid for 10 years and is non-extendable"; u.ae 5 (high school) / 10 (university) | conflict persists | GDRFAD gstu, u.ae |
| Standard permit | institution sponsor; 48 h; AED 200 + … | same; documents: photo, passport, medical, ID receipt, health insurance; grace 60 days | ours right; add documents and grace | GDRFAD stu |
| Golden criteria | 95%, top-100 + GPA 3.5, UAE A 3.5 / B 3.8, ≤2 yrs | same | ours right | ICP, GDRFAD gstu |

**Verified?** Stays `true`.

## Country level

- Citizenship: only by nomination (Rulers' Courts, Executive Councils, Cabinet); 2021 amendment lets naturalised persons keep their original nationality; investors must own property. u.ae, updated 2026-09-10. Our `pr` lines say "citizenship by nomination only": confirmed.
- No PR exists: confirmed indirectly (ICP/u.ae describe only renewable residences).

## Studio items

None — no UAE notebook. `media: []` on every UAE route.
