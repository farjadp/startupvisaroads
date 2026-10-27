# Estonia — notebook vs our data vs official (read 2026-10-27)

Subsistence level 2026: **EUR 220/month** — 2026 State Budget Act § 5 p 5, "toimetulekupiir 220 eurot kalendrikuus" (https://www.riigiteataja.ee/akt/118122025022). So 4 × = 880, 6 × = 1,320.

## ee-startup

| Field | Ours | Notebook | Official | Verdict | URL |
|---|---|---|---|---|---|
| Income | 880/month (4 × 220) | 800 **and** 880 (self-contradiction); "9,600/yr" | PPA: 4 × subsistence; vm.ee: start-up business 880/month applicant, **704/month spouse**, child n/a; PPA student guide July 2026: 880 in 2026 | ours right; notebook's 800 is the old level (Startup Estonia's founder page still says €800 — stale) | https://vm.ee/en/consular-visa-and-travel-information/visa-information/application-long-stay-d-visa |
| TRP fee | 350 in EE / 380 abroad | 380 in chat, **190** in the report | PPA fee table (from 1 Jan 2025): business TRP 350 / 380 | ours right; notebook's 190 wrong | https://www.politsei.ee/en/instructions/state-fee-amounts/residence-permit-and-rights-of-residence |
| D-visa fee | **80** (Startup Estonia) | 120 | PPA visa fee table: long-term visa **120 / 120**; vm.ee: "Visa fee is EUR 120, children 6-11 years EUR 60" | **ours wrong → 120** (Startup Estonia's 80 is out of date) | https://www.politsei.ee/en/instructions/state-fee-amounts/visa-application-and-extending-period-of-stay |
| D-visa length | — | 1 year + 6 months | up to 365 days, +183 (Startup Estonia); vm.ee: two consecutive D visas ≤ 548 days in 730 | notebook right; add | https://startupestonia.ee/startup-visa/ |
| Committee | 10 working days | "~10 days", "10–14 days", "4 of 7 votes" | PPA and Startup Estonia: 10 working days; committee = "selected members of the Estonian startup community" | ours right; votes rule unverified | https://startupestonia.ee/startup-visa/foreign-founder/ |
| Company age | ≤ 10 years | — | ≤ 10 years | ours right | Startup Estonia |
| Permit length | up to 5 years | up to 5 | first up to 5; **extensions up to 10 years at a time** | add extension length | https://www.politsei.ee/en/instructions/residence-permit-for-business/for-start-up-entrepreneurs |
| Nationality | — (no block) | Russia/Belarus cannot apply | vm.ee: Belarusians not issued visas "for engaging in business, including start-up business"; Russians: restrictions "apply to all types of visas", narrow exceptions | **ours lacks it → add `blockedCitizenships` (BY; RU) with the reason** | https://vm.ee/en/consular-visa-and-travel-information/visa-information/restrictions-accepting-visa-applications |
| Long-term residence | 5 y + income + insurance + B1 | — | same; fee 185 in Estonia | ours right | PPA long-term page; fee table |
| Citizenship | — | — | 8 years on a permit, last 5 permanent; Estonian exam (B1) + Constitution exam; **must be released from other citizenship** | add: dual not allowed | https://www.politsei.ee/en/instructions/estonian-citizenship-for-an-adult |

`lib/fa/programmes.ts` 'estonia': yearlyFunds 10,560 ✓; but `unscored` says «تأیید کمیته‌ی کارشناسی وزارت کشور» — **wrong body**: the Startup Committee is formed of Estonian start-up community members (Startup Estonia), not the Interior Ministry. Suggest «تأیید کمیته‌ی استارتاپ استونی (Startup Committee)، ظرف ۱۰ روز کاری».

## ee-entrepreneur

| Field | Ours | Notebook | Official | Verdict | URL |
|---|---|---|---|---|---|
| Shareholder investment | 65,000 | 65,000 | ≥ 65,000 "invested … in the activities of that company in Estonia" | ours right | https://www.politsei.ee/en/instructions/residence-permit-for-business |
| Shareholder income | 6 × = 1,320 | — | 6 × subsistence | ours right | same |
| Sole proprietor investment | 16,000 | — | ≥ 16,000 | ours right | https://www.politsei.ee/en/instructions/residence-permit-for-business/for-sole-proprietors |
| Sole proprietor income | "not read, not encoded" | — | **6 × subsistence (1,320)** | **fill in** | same |
| Business plan | Estonian or English, 2-year forecast, CVs, reason | — | same | ours right | PPA |
| Extensions | — | — | up to 10 years at a time | add | PPA |
| Fee | 350 / 380 | — | 350 / 380 | ours right | PPA fee table |

## ee-study

| Field | Ours | Notebook | Official | Verdict | URL |
|---|---|---|---|---|---|
| Income | 880 (review: 2025 guide said 800) | — | PPA student guide **9 July 2026**: "880 euros per month per applicant", "at least 880 euros per month in 2026" | ours right; conflict resolved, update source to `/files/2026-07/student-guide.pdf` | https://www.politsei.ee/files/2026-07/student-guide.pdf |
| TRP fee | 225 / 255 | — | guide: 225 at the service office; fee table general TRP 225 / 255 | ours right | guide; fee table |
| "EUR 120 in one checklist" | listed as conflict | — | 120 is the **D-visa** fee in the guide, not the TRP | **conflict resolved** | guide |
| Income evidence period | form asks "previous 6 months" | — | guide (D visa): bank statements for the **3 months** before applying | ours unverified for the TRP form; add the 3-month D-visa rule | guide |
| Route | TRP | — | D visa first at an embassy; TRP if studies last longer than a year | add | guide |
| Permit end | — | — | ends automatically 30 days after falling behind or interrupting studies | add | guide |
| Russians | — | — | Russian citizens restricted for all visa types | consider `blockedCitizenships` RU | vm.ee restrictions |
| Post-study stay | not read | — | not on the pages read | still open | — |

## Notebook has, we lack (unverified, left out)

e-Residency card EUR 150 (+20 pickup abroad), company registration ~EUR 260–280, contact-person service EUR 200–400/yr, health insurance ≥ EUR 30,000 cover for the visa, Startup Committee "4 of 7 votes", switching a failed start-up TRP to an employment TRP, accelerators (Startup Wise Guys, ESA BIC Tartu). Iran-specific: no Estonian visa service in Iran, biometrics in Turkey or the UAE (notebook's own outside-source note; not verified).

## Studio items (notebook 1ca216ae)

- video: *A Founder's Guide to the Estonia Startup Visa* (4:25, cinematic)
- slides: Estonia Startup Visa Blueprint; Estonia Digital Blueprint; Estonia Digital OS
- infographics: اقامت مجازی و استارتاپی استونی; نقشه راه کارآفرینی در استونی; راهنمای هزینه‌های مهاجرت به استونی
- reports (not a MediaLead kind): گزارش جامع استارتاپ ویزای استونی: راهنمای عملیاتی و استراتژیک (has the **190** TRP fee — wrong); راهنمای جامع ویزای استارتاپ استونی: از ایده تا اقامت اروپا

Notebook eac50320 has nothing on Estonia (Spain only).

**Caution for media:** the cost infographic and report likely carry 800 / 190 / 80 figures; check before shipping.

## Not verified

Startup Estonia FAQ page (404), committee voting rule, company registration and e-Residency fees, post-study stay, citizenship state fee, WIPO GII (wipo.int 403). Portal links in steps (ariregister.rik.ee, broneering.politsei.ee) are the PPA/RIK portals, not opened.
