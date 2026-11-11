// Paragraphs copied from live visaroads.com articles on 10 Nov 2026
// (GET /api/app/news), so the rules are held against real prose.

/** /fa/blog/canada-immigration-levels-plan-2027-2029-fa — inline official citation. */
export const FA_LEVELS =
  '<p>نمودار خود بودجه نشان می‌دهد عددها چقدر پایین آمده‌اند. ورود موقت جدید در ۲۰۲۳ برابر ۹۷۱٬۸۱۵ و در ۲۰۲۴ برابر ۶۸۶٬۰۱۰ نفر بود؛ هدف سالانه جدید ۳۷۰ هزار است. پذیرش اقامت دائم در ۲۰۲۳ برابر ۴۷۱٬۸۲۰ و در ۲۰۲۴ برابر ۴۸۳٬۶۵۵ نفر بود؛ هدف جدید ۳۸۰ هزار است (بودجه ۲۰۲۶، نمودار ۳٫۱، داده IRCC تا ۳۱ اوت ۲۰۲۶).</p>';

/** /en/blog/canada-immigration-levels-plan-2027-2029 — the English twin. */
export const EN_LEVELS =
  "<p>The budget's own chart shows how far the numbers have come down. New temporary resident arrivals were 971,815 in 2023 and 686,010 in 2024; the new annual target is 370,000. Permanent resident admissions were 471,820 in 2023 and 483,655 in 2024; the target is 380,000 (Budget 2026, Chart 3.1, IRCC data to 31 August 2026).</p>";

/** Two different measures in one sentence: must never become one chart. */
export const EN_JOBS =
  '<p>IRCC names education, healthcare, construction, AI and digital innovation, defence, energy and critical minerals as the sectors where it will prioritise highly skilled workers. The budget adds the skilled-trades picture: more than 7 million job openings projected over the next decade and 1.4 million people needed in the trades by 2033 (Budget 2026, chapter 3).</p>';

/** Two cohorts, with years nearby that are not their dates. */
export const EN_COHORTS =
  "<p>Yes. Budget 2025 announced two one-time initiatives: up to 115,000 protected persons in Canada and up to 33,000 work permit holders moving to permanent residence across 2026 and 2027. IRCC's supplementary information for the new plan says these continue (IRCC, supplementary information, 5 Nov 2026).</p>";

/** /en/blog/ircc-processing-times-change-work-study-applicants — figures with no citation at all. */
export const EN_UNCITED =
  "<p>IRCC rolled out new temporary residence processing times on November 4, 2026. The standout: work permits for people applying from the United States. Here, IRCC's figures show a drop from 6 weeks to 3 weeks in the space of a week.</p>";

/**
 * /en/blog/how-americans-claim-canadian-citizenship-by-descent-2026 in the
 * autopilot's own markup (applyCitations): a superscript link and a Sources
 * entry. The live article cites a CIC News piece here.
 */
export function autopilotBody(sourceUrl: string): string {
  return (
    '<h2>How long does it take?</h2>' +
    '<p>Processing times have ballooned since Bill C-3 came into force. The wait for new files reached 34 months by October 2026, up from only five months before the new law<sup class="text-[0.7em] align-super"><a href="#src-1" class="no-underline">[1]</a></sup>. Anyone interested should expect a multi-year wait and file early.</p>' +
    '<p>File early.</p>' +
    '<section class="mt-12 not-prose"><h2>Sources</h2><ol>' +
    `<li id="src-1"><a href="${sourceUrl}" rel="noopener noreferrer" target="_blank">Proof of citizenship: processing times</a> <span class="opacity-70">(2026-10-19)</span></li>` +
    '</ol></section>'
  );
}
