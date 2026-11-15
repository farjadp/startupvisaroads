// English reports. Reader: a skilled worker or a family deciding which RCIP
// community and occupation to aim at. Every figure is read from stats.json.
import { S, SRC, INDEX, GUIDE, EYEBROW, CHART_SOURCE, PROVINCE, a, fmt, dv, path, by, community, sector, occ, sname, oname, listDate, listLink, barChart, pairedBarChart, scrollTable } from './lib.mjs';

const L = 'en';
const f = fmt(L);
const O = S.overall;
const X = S.original;
const T = S.templates;
const M = S.meta;
const tpl = (title) => T.by_title.find((t) => t.title === title);
const sig = T.signatures[0]; // inside sales representative
const C = (name) => community(name);
const src = CHART_SOURCE[L];

const CATEGORY = 'Work & Skilled Immigration';
const TAGS = ['data-report', 'RCIP', 'Rural Community Immigration Pilot', 'Job Bank', 'Jobs in Canada'];

// ── Shared blocks ────────────────────────────────────────────────────────────

const methodBox = () => `
<h2>Method and limits</h2>
<ul>
<li><strong>One month.</strong> These are postings first advertised in October ${f.plain(2026)}. One month cannot show a trend, and autumn hiring differs from spring hiring.</li>
<li><strong>No employer names.</strong> Job Bank open data does not say who posted a job. We can count postings in a community, an industry and an occupation; we cannot tell whether a posting came from a designated employer. A posting counted here is not a job offer.</li>
<li><strong>Places.</strong> A posting is matched to a community by province and town name. ${f.n(M.rows_without_city)} postings in the national file had no town and could not be placed anywhere.</li>
<li><strong>Industry is often missing.</strong> ${f.n(O.unknown_industry_postings)} of the ${f.n(O.postings)} postings (${f.pc(O.unknown_industry_share_pct)}) came from external job boards without an industry code.</li>
<li><strong>Wages are minimums.</strong> We take the lowest wage each posting states, per hour. ${f.n(O.wide_range_postings)} postings give a range whose top is at least one and a half times its bottom, so the real wage may be higher. A median built on fewer than ${f.n(M.method.min_n_for_median)} wages is marked as a small sample.</li>
<li><strong>Remote sales ads removed.</strong> ${f.n(T.postings)} postings were the same work-from-home sales advertisement copied into towns across Canada. They are counted separately and left out of every ranking and median.</li>
<li><strong>Listings, not employers.</strong> The ${f.n(S.listings.total)} designated-employer listings are rows on the 14 community lists as we read them. Some employers appear more than once; there are ${f.n(S.listings.unique_employer_names)} distinct names. The lists carry different dates.</li>
</ul>`;

const sources = (extra = '') => `
<h2>Sources</h2>
<ul>
<li>${a(SRC.jobBank, 'Job Bank open data (Job Postings Advertised on Canada\'s National Job Bank Website)')}, Employment and Social Development Canada, October ${f.plain(2026)} file. Contains information licensed under the ${a(SRC.ogl, 'Open Government Licence – Canada')}.</li>
<li>Designated-employer lists published by the 14 communities, listed with their dates in ${a(path(L, 1), 'the table in part one')}.</li>
<li>Immigration, Refugees and Citizenship Canada: ${a(SRC.irccPilot, 'Rural Community Immigration Pilot')} and ${a(SRC.irccProgram, 'Rural Community Immigration Program')}.</li>${extra}
</ul>
<p>The calculations are ours. VisaRoads is not an immigration representative and this is not immigration advice.</p>`;

const seriesNote = (part) => {
  const items = [
    [1, 'Where the jobs are: the 14 communities compared'],
    [2, 'Which occupations are hiring, and what they pay'],
    [3, 'Designated employers against open postings, by industry'],
  ];
  const line = items
    .map(([n, title]) => (n === part ? `<li><strong>Part ${n}: ${title}</strong> (this page)</li>` : n < part ? `<li>Part ${n}: ${a(path(L, n), title)}</li>` : `<li>Part ${n}: ${title}</li>`))
    .join('\n');
  return `
<h2>The series</h2>
<ul>
${line}
</ul>
<p>Every part, and the next month's edition, is listed on the ${a(INDEX[L], 'Data reports page')}.</p>`;
};

// ── Part 1 ───────────────────────────────────────────────────────────────────

function part1() {
  const cs = S.communities;
  const byVac = [...cs].sort(by('vacancies'));
  const byRate = [...cs].sort(by('postings_per_100_listings'));
  const nos = C('North Okanagan-Shuswap');
  const sud = C('Sudbury');
  const tim = C('Timmins');
  const tb = C('Thunder Bay');
  const bra = C('Brandon');
  const mj = C('Moose Jaw');
  const nebc = C('Northeast BC (Peace Liard)');
  const nb = C('North Bay');
  const pic = C('Pictou County');
  const miners = occ('83100');
  const flag = (c) => (c.small_sample ? ' *' : '');

  const vacChart = barChart(
    byVac.map((c, i) => ({ label: c.name, value: c.vacancies, display: `${f.n(c.vacancies)} vacancies · ${f.n(c.postings)} postings`, tone: i === 0 ? 'highlight' : 'plain' })),
    { eyebrow: EYEBROW[L], title: 'Vacancies advertised, by community', caption: 'One posting can carry several vacancies. Remote sales ads are excluded.', source: src },
    L,
  );
  const rateChart = barChart(
    byRate.map((c, i) => ({ label: c.name, value: c.postings_per_100_listings, display: f.d(c.postings_per_100_listings), tone: i < 2 ? 'highlight' : c.postings < M.method.min_n_for_median ? 'hollow' : 'plain' })),
    { eyebrow: EYEBROW[L], title: 'Postings per 100 designated-employer listings', caption: `A rough gauge of how busy a market is next to the size of its list. Dashed bars: fewer than ${f.n(M.method.min_n_for_median)} postings.`, source: src },
    L,
  );

  const table = `
${scrollTable(`<table>
<thead><tr><th>Community</th><th>Listings</th><th>Postings</th><th>Vacancies</th><th>Vacancies per posting</th><th>Median wage (n)</th><th>Full time</th><th>Postings per 100 listings</th></tr></thead>
<tbody>
${byVac.map((c) => `<tr><td>${c.name}, ${c.province}</td><td>${f.n(c.listings)}</td><td>${f.n(c.postings)}</td><td>${f.n(c.vacancies)}</td><td>${f.r(c.vacancies_per_posting)}</td><td>${f.w(c.median_wage_hr)} (${f.n(c.wage_n)})${flag(c)}</td><td>${f.pc(c.full_time_share_pct)}</td><td>${f.d(c.postings_per_100_listings)}</td></tr>`).join('\n')}
<tr><td><strong>All 14</strong></td><td><strong>${f.n(S.listings.total)}</strong></td><td><strong>${f.n(O.postings)}</strong></td><td><strong>${f.n(O.vacancies)}</strong></td><td><strong>${f.r(O.vacancies_per_posting)}</strong></td><td><strong>${f.w(O.median_wage_hr)} (${f.n(O.wage_n)})</strong></td><td><strong>${f.pc(O.full_time_share_pct)}</strong></td><td><strong>${f.d(O.postings_per_100_listings)}</strong></td></tr>
</tbody>
</table>`)}
<p>* Fewer than ${f.n(M.method.min_n_for_median)} wages. That is too few to treat the median as a market rate.</p>`;

  const listTable = `
${scrollTable(`<table>
<thead><tr><th>Community</th><th>Listings</th><th>List version</th><th>Published list</th></tr></thead>
<tbody>
${cs.map((c) => `<tr><td>${c.name}</td><td>${f.n(c.listings)}</td><td>${listDate(L, c.list_as_of)}</td><td>${a(listLink(c), new URL(c.list_source_url).hostname.replace(/^www\./, ''))}</td></tr>`).join('\n')}
</tbody>
</table>`)}`;

  const content = `
<p>If you are weighing one rural community against another, the first thing you want to know is where employers are actually advertising. We counted. In October ${f.plain(2026)}, Job Bank carried ${f.n(O.postings)} postings for ${f.n(O.vacancies)} vacancies in the 14 communities of the Rural Community Immigration Pilot (RCIP), once ${f.n(T.postings)} copies of a remote sales advertisement were taken out. The median posting offered at least ${f.w(O.median_wage_hr)} an hour and ${f.pc(O.full_time_share_pct)} were full time.</p>
<p><strong>North Okanagan-Shuswap in British Columbia had the most vacancies, ${f.n(nos.vacancies)}, close to a quarter of the total (${f.pc(nos.share_of_vacancies_pct)}). Sudbury had the most postings, ${f.n(sud.postings)}. Measured against the size of their designated-employer lists, Brandon and Moose Jaw were the busiest markets and Thunder Bay one of the quietest.</strong></p>
<p>This is part one of three. It compares the communities and explains the data. Parts two and three look at occupations and industries.</p>

<h2>What did we count?</h2>
<p>We put two public sources side by side. The first is ${a(SRC.jobBank, 'Job Bank open data')}, the monthly file of job postings that Employment and Social Development Canada publishes under the Open Government Licence. The October file has ${f.n(M.rows_in_national_file)} postings for the whole country. We matched ${f.n(M.matched_postings)} of them (${f.pc(M.matched_share_of_national_pct)}) to the towns that make up the 14 RCIP communities.</p>
<p>The second is each community's own list of designated employers, the only employers whose job offers count for RCIP. Together the 14 lists had ${f.n(S.listings.total)} listings when we read them, ${f.n(S.listings.unique_employer_names)} distinct employer names once repeats for second locations are set aside.</p>
<p>The two sources cannot be joined employer by employer, because the open data carries no employer names. So this report says how many jobs were advertised in a community, in which occupations and at what wage. It does not say that any of those postings came from a designated employer. That check is yours to make, on the community's list, before you apply for anything.</p>

<h2>Which community had the most openings?</h2>
${vacChart}
<p><strong>The two British Columbia interior communities are large.</strong> North Okanagan-Shuswap (Vernon, Salmon Arm and the towns around them) and West Kootenay together account for a third of all vacancies. Part of that is seasonal: ${f.n(nos.seasonal_harvest_vacancies)} of North Okanagan-Shuswap's vacancies and ${f.n(C('West Kootenay').seasonal_harvest_vacancies)} of West Kootenay's were harvest labour, which an RCIP job offer cannot be. Without them the two still hold ${f.n(nos.vacancies_excluding_harvest)} and ${f.n(C('West Kootenay').vacancies_excluding_harvest)} vacancies.</p>
<p><strong>Timmins advertises in bulk.</strong> It had only ${f.n(tim.postings)} postings but ${f.n(tim.vacancies)} vacancies, ${f.r(tim.vacancies_per_posting)} per posting, the highest ratio among the larger communities. Mining explains it: ${f.n(miners.postings)} postings for underground miners asked for ${f.n(miners.largest_posting_vacancies)} people each.</p>
<p><strong>Sudbury has many small postings.</strong> It leads on postings (${f.n(sud.postings)}) with ${f.r(sud.vacancies_per_posting)} vacancies per posting: many postings, each for one person.</p>
${table}

<h2>Where is hiring busy next to the size of the employer list?</h2>
<p>A long list of designated employers does not mean a lot of open jobs. Dividing postings by listings gives a rough gauge.</p>
${rateChart}
<p>Brandon had ${f.d(bra.postings_per_100_listings)} postings for every 100 listings, and Moose Jaw ${f.d(mj.postings_per_100_listings)}. In both, the local job market is bigger than the designated list, so a good share of advertised jobs are probably with employers who are not designated. Brandon's list has ${f.n(bra.listings)} listings.</p>
<p>Thunder Bay is the opposite case. It has the longest list of all, ${f.n(tb.listings)} listings, and ${f.d(tb.postings_per_100_listings)} postings per 100. Part of the reason is on the list itself: ${f.n(tb.listings_closed_to_new_applications)} of its listings, mostly fast food, gas stations and convenience stores, sit under the heading "designated, but currently excluded from ${f.plain(2026)} RCIP". North Okanagan-Shuswap marks ${f.n(nos.listings_closed_to_new_applications)} fast food and gas station listings as no longer accepting applications.</p>
<p>Read the gauge with care. The postings are not limited to designated employers, about half have no industry code, and the lists were read on different dates.</p>

<h2>What do the wages show?</h2>
<p>Across the 14 communities the median posting offered at least ${f.w(O.median_wage_hr)} an hour (${f.n(O.wage_n)} postings with a wage). Northeast BC (Peace Liard) was highest among communities with a usable sample, at ${f.w(nebc.median_wage_hr)}, followed by North Bay at ${f.w(nb.median_wage_hr)}. Pictou County (${f.w(pic.median_wage_hr)}) and Brandon (${f.w(bra.median_wage_hr)}) were lowest.</p>
<p>Three communities have too few postings to say anything about wages: Altona/Rhineland (${f.n(C('Altona/Rhineland').wage_n)} postings), Claresholm (${f.n(C('Claresholm').wage_n)}) and Steinbach (${f.n(C('Steinbach').wage_n)}). Their medians are in the table for completeness only.</p>
<p>These are the lowest wages postings state, not what people are paid, and a community's median mostly reflects which occupations happened to be advertised. Part two compares wages occupation by occupation, which is the fairer comparison.</p>

<h2>What did we remove, and how much did it change?</h2>
<p>The raw numbers were misleading in one specific way. ${f.n(tpl('inside sales representative').postings)} postings in all 14 communities had the same title, "inside sales representative", and the same salary to the dollar: ${f.n(Number(sig.salary.split(' ')[0]))} a year, or ${f.w(sig.wage_hr)} an hour. The national file has ${f.n(sig.national_postings)} copies of it in ${f.n(sig.national_cities)} towns across ${f.n(sig.national_provinces)} provinces and territories, and the original advertisement titles begin with the word "Remote". A further ${f.n(dv(T.postings - tpl('inside sales representative').postings, 'templates.postings minus the inside-sales postings'))} postings were a work-from-home sales advertisement filed under "informatics consultant" and "retail sales representative".</p>
<p>These are not local jobs. Our rule removes an external-board posting when the same title and the same fixed salary appear in at least ${f.n(M.method.template_min_provinces)} provinces and ${f.n(M.method.template_min_cities)} towns of the national file. We then read the list by hand.</p>
${scrollTable(`<table>
<thead><tr><th></th><th>Before cleaning</th><th>After cleaning</th></tr></thead>
<tbody>
<tr><td>Postings</td><td>${f.n(X.postings)}</td><td>${f.n(O.postings)}</td></tr>
<tr><td>Vacancies</td><td>${f.n(X.vacancies)}</td><td>${f.n(O.vacancies)}</td></tr>
<tr><td>Median wage</td><td>${f.w(X.median_wage_hr)}</td><td>${f.w(O.median_wage_hr)}</td></tr>
<tr><td>Full time</td><td>${f.pc(X.full_time_share_pct)}</td><td>${f.pc(O.full_time_share_pct)}</td></tr>
<tr><td>Postings per 100 listings</td><td>${f.d(X.postings_per_100_listings)}</td><td>${f.d(O.postings_per_100_listings)}</td></tr>
<tr><td>Top occupation by vacancies</td><td>Retail salespersons, median ${f.w(X.top_occupation.median_wage_hr)}</td><td>Harvesting labourers (seasonal), then transport truck drivers</td></tr>
</tbody>
</table>`)}
<p>A cashier wage that appears in five northern Ontario communities on eight different dates is ordinary retail hiring, so it stayed.</p>

<h2>How should you use this if you are choosing a community?</h2>
<ul>
<li>Start from the designated-employer list rather than from Job Bank. Only an offer from a designated employer counts. The lists are linked below.</li>
<li>Check the shape of the job. IRCC requires an RCIP job offer to be full time, non-seasonal and without an end date. ${f.n(O.permanent_full_time_postings)} of the ${f.n(O.postings)} postings (${f.pc(O.permanent_full_time_share_pct)}) said both "full time" and "permanent"; ${f.n(O.term_not_stated_postings)} did not state a term at all. Our guide to the ${a(GUIDE[L].rules, 'RCIP job offer rules')} has the full list.</li>
<li>Do not rank communities on one month. A community that looks quiet in October may hire in spring. We will repeat this count monthly so that a pattern can be seen.</li>
<li>The pilot is becoming a permanent program. IRCC says the pilot closes on ${f.plain(1)} January ${f.plain(2027)} and the permanent program opens that day, and that it intends to continue with the 14 current communities. See ${a(GUIDE[L].permanent, 'what changes on that date')}.</li>
</ul>

<h2>Where is each community's list?</h2>
<p>Each community publishes its own list and updates it on its own schedule. These are the versions we counted. The date is the one printed on the list or in its file name; where a list prints none, it is the date of the copy we read.</p>
${listTable}
<p>Claresholm's list was dated June ${f.plain(2025)} when we read it and Altona/Rhineland's carried no date, so their listing counts may be out of date.</p>
${methodBox()}
${seriesNote(1)}
${sources()}`;

  return {
    file: 'en-1-communities',
    part: 1,
    locale: L,
    slug: path(L, 1).split('/').pop(),
    title: 'RCIP job market, October 2026: where the jobs are in the 14 communities',
    excerpt: `Job Bank carried ${f.n(O.postings)} postings for ${f.n(O.vacancies)} vacancies in the 14 Rural Community Immigration Pilot communities in October 2026. Which communities advertised most, what they paid, and how that compares with their designated-employer lists.`,
    category: CATEGORY,
    tags: TAGS,
    keyTakeaway: `In October 2026 Job Bank listed ${f.n(O.postings)} postings (${f.n(O.vacancies)} vacancies) in the 14 RCIP communities after ${f.n(T.postings)} copied remote sales ads were removed. North Okanagan-Shuswap had the most vacancies (${f.n(nos.vacancies)}), Sudbury the most postings (${f.n(sud.postings)}). The median posting offered at least ${f.w(O.median_wage_hr)} an hour. The open data has no employer names, so a posting is not proof of a designated employer.`,
    summaryEn: `A monthly statistical report comparing the 14 Rural Community Immigration Pilot communities using Job Bank open data for October 2026 and each community's designated-employer list: postings, vacancies, median wage, full-time share and postings per 100 designated-employer listings, with the cleaning method and limits stated.`,
    faq: [
      { q: 'Which RCIP community had the most job vacancies in October 2026?', a: `North Okanagan-Shuswap in British Columbia, with ${f.n(nos.vacancies)} vacancies from ${f.n(nos.postings)} Job Bank postings. ${f.n(nos.seasonal_harvest_vacancies)} of those vacancies were seasonal harvest work.` },
      { q: 'Does a Job Bank posting in an RCIP community mean the employer is designated?', a: 'No. Job Bank open data has no employer names, so a posting cannot be matched to a designated employer. Check the community\'s published list of designated employers.' },
      { q: 'How many designated employers do the 14 RCIP communities list?', a: `${f.n(S.listings.total)} listings on the 14 community lists as we read them, with ${f.n(S.listings.unique_employer_names)} distinct employer names. The lists carry different dates.` },
      { q: 'What wage do jobs in RCIP communities advertise?', a: `The median posting in October 2026 stated a minimum of ${f.w(O.median_wage_hr)} an hour across the 14 communities. This is the lowest wage each posting gives, not average pay.` },
    ],
    internalLinks: [INDEX[L], GUIDE[L].rules, GUIDE[L].permanent],
    content,
  };
}

// ── Part 2 ───────────────────────────────────────────────────────────────────

function part2() {
  const occs = S.occupations;
  const K = S.clusters;
  const KC = S.clusters_combined;
  const harvest = occ('85101');
  const truck = occ('73300');
  const retail = occ('64100');
  const miners = occ('83100');
  const hdm = occ('72401');
  const lpn = occ('32101');
  const guards = occ('64410');
  const cooks = occ('63200');
  const fss = occ('62020');
  const scw = occ('42201');
  const farm = occ('84120');
  const teer = (t) => S.teer.find((x) => x.teer === t);
  const top = occs.slice(0, 15);
  const flag = (o) => (o.small_sample ? ' *' : '');

  const occChart = barChart(
    top.map((o) => ({ label: oname(L, o), value: o.vacancies, display: `${f.n(o.vacancies)} · ${f.w(o.median_wage_hr)}`, tone: o.seasonal ? 'hollow' : o.cluster ? 'highlight' : 'plain' })),
    { eyebrow: EYEBROW[L], title: 'Occupations with the most vacancies', caption: 'Vacancies and the median minimum wage per hour. Bright bars are in the three steady groups; the dashed bar is seasonal harvest work.', source: src },
    L,
  );
  const clusterRow = (label, k) => `<tr><td>${label}</td><td>${f.n(k.postings)}</td><td>${f.n(k.vacancies)}</td><td>${f.w(k.median_wage_hr)} (${f.n(k.wage_n)})</td><td>${f.pc(k.full_time_share_pct)}</td><td>${f.n(k.communities)}</td></tr>`;

  const content = `
<p>Part one of this series showed where jobs were advertised in the 14 Rural Community Immigration Pilot (RCIP) communities in October ${f.plain(2026)}. This part asks the question that matters more for most people: in which occupations?</p>
<p><strong>Just over half of the ${f.n(O.postings)} postings (${f.pc(KC.share_of_postings_pct)}) fall into three groups: trades and transport, food service, and health and social services. Trades and transport is the largest and pays a median of at least ${f.w(K.trades_transport.median_wage_hr)} an hour. Food service is the most widespread and the lowest paid, at ${f.w(K.food_service.median_wage_hr)}.</strong></p>
<p>The counts come from Job Bank open data, with ${f.n(T.postings)} copied remote sales ads removed. Occupations are coded with Canada's ${a(SRC.noc, 'National Occupational Classification (NOC) 2021')}.</p>

<h2>Which occupations had the most vacancies?</h2>
${occChart}
${scrollTable(`<table>
<thead><tr><th>NOC</th><th>Occupation</th><th>TEER</th><th>Postings</th><th>Vacancies</th><th>Median wage (n)</th><th>Communities</th></tr></thead>
<tbody>
${top.map((o) => `<tr><td>${o.noc}</td><td>${o.name}${o.seasonal ? ' (seasonal)' : ''}</td><td>${f.plain(o.teer)}</td><td>${f.n(o.postings)}</td><td>${f.n(o.vacancies)}</td><td>${f.w(o.median_wage_hr)} (${f.n(o.wage_n)})${flag(o)}</td><td>${f.n(o.communities)}</td></tr>`).join('\n')}
</tbody>
</table>`)}
<p>* Fewer than ${f.n(M.method.min_n_for_median)} wages: read the median as an indication only.</p>
<p>Two rows need a warning before anything else.</p>
<p><strong>Harvesting labourers top the list and should be set aside.</strong> ${f.n(harvest.postings)} postings asked for ${f.n(harvest.vacancies)} people, one of them for ${f.n(harvest.largest_posting_vacancies)}, in only ${f.n(harvest.communities)} communities, both in the BC interior. This is orchard and vineyard work that follows the season. IRCC's rules require an RCIP job offer to be non-seasonal, so these vacancies are outside the program however large the number.</p>
<p><strong>Underground miners are a single hiring round.</strong> All ${f.n(miners.vacancies)} vacancies come from ${f.n(miners.postings)} postings in ${f.n(miners.communities)} community, each for ${f.n(miners.largest_posting_vacancies)} people, at ${f.w(miners.median_wage_hr)} an hour. The demand is real and well paid, but it could be gone next month.</p>

<h2>What are the three steady groups?</h2>
<p>Set the one-off spikes aside and the same three groups keep appearing across communities.</p>
${scrollTable(`<table>
<thead><tr><th>Group</th><th>Postings</th><th>Vacancies</th><th>Median wage (n)</th><th>Full time</th><th>Communities (of 14)</th></tr></thead>
<tbody>
${clusterRow('Trades and transport', K.trades_transport)}
${clusterRow('Food service', K.food_service)}
${clusterRow('Health and social services', K.health_social)}
</tbody>
</table>`)}
<p><strong>Trades and transport</strong> is the largest group and the only one present in all 14 communities, with ${f.pc(K.trades_transport.full_time_share_pct)} of postings full time. Transport truck drivers lead it (${f.n(truck.vacancies)} vacancies, median ${f.w(truck.median_wage_hr)}), followed by heavy-duty equipment mechanics (${f.n(hdm.vacancies)} vacancies, ${f.w(hdm.median_wage_hr)}), automotive and truck mechanics, construction labourers, carpenters and welders. Several of these are certified trades in Canada. Certification is a separate step from immigration and differs by province.</p>
<p><strong>Food service</strong> postings are the most widespread. Cooks (${f.n(cooks.postings)} postings in ${f.n(cooks.communities)} communities) and food service supervisors (${f.n(fss.postings)} postings in ${f.n(fss.communities)}) are advertised almost everywhere, at a median of ${f.w(cooks.median_wage_hr)} an hour. Two cautions: these are the lowest wages in the table, and at least two communities' lists set fast food employers aside (see part one).</p>
<p><strong>Health and social services</strong> advertises less than its weight on the designated-employer lists would suggest, and only ${f.pc(K.health_social.full_time_share_pct)} are full time. Licensed practical nurses advertise a median of ${f.w(lpn.median_wage_hr)}, social and community service workers ${f.w(scw.median_wage_hr)}. This data cannot say why. Some health employers recruit on their own sites, so check their career pages too.</p>

<h2>What happened to retail sales, the original number one?</h2>
<p>In the raw data the top occupation was retail salespersons, with ${f.n(X.top_occupation.postings)} postings and a median wage of ${f.w(X.top_occupation.median_wage_hr)} an hour. That figure was produced by the remote sales advertisement described in part one. With it removed, retail salespersons have ${f.n(retail.postings)} postings, ${f.n(retail.vacancies)} vacancies and a median of ${f.w(retail.median_wage_hr)}. That is a normal retail wage, and it puts the occupation fifth.</p>

<h2>How does the skill level of a posting connect to RCIP?</h2>
<p>Every NOC code belongs to a TEER category from 0 to 5 (training, education, experience and responsibilities). Under IRCC's rules, the TEER of the job you are offered sets ${a(SRC.irccLanguage, 'the language level you need')} and ${a(SRC.irccWorkExp, 'which past work experience counts')}.</p>
${scrollTable(`<table>
<thead><tr><th>TEER of the job</th><th>Share of postings</th><th>Vacancies</th><th>Minimum language level (IRCC)</th></tr></thead>
<tbody>
<tr><td>0 and 1</td><td>${f.pc(teer(0).share_pct)} and ${f.pc(teer(1).share_pct)}</td><td>${f.n(teer(0).vacancies)} and ${f.n(teer(1).vacancies)}</td><td>CLB 6</td></tr>
<tr><td>2 and 3</td><td>${f.pc(teer(2).share_pct)} and ${f.pc(teer(3).share_pct)}</td><td>${f.n(teer(2).vacancies)} and ${f.n(teer(3).vacancies)}</td><td>CLB 5</td></tr>
<tr><td>4 and 5</td><td>${f.pc(teer(4).share_pct)} and ${f.pc(teer(5).share_pct)}</td><td>${f.n(teer(4).vacancies)} and ${f.n(teer(5).vacancies)}</td><td>CLB 4</td></tr>
</tbody>
</table>`)}
<p>Almost half of the postings are in TEER 2 and 3, the band of skilled trades, supervisors and technical roles. For a TEER 5 job, IRCC only accepts experience in the same five-digit NOC code, which makes that route narrower than the low language level suggests. The matching table is in our guide to the ${a(GUIDE[L].rules, 'RCIP job offer rules')}.</p>

<h2>Does a posting in one of these occupations qualify for RCIP?</h2>
<p>Not by itself. Four tests sit between a posting and an eligible job offer, and this data can only speak to the first.</p>
<ol>
<li><strong>The job's shape.</strong> ${a(SRC.irccCandidate, 'IRCC requires')} the offer to be full time (at least 30 paid hours a week), non-seasonal and without an end date. ${f.pc(O.permanent_full_time_share_pct)} of postings said both "full time" and "permanent".</li>
<li><strong>The employer.</strong> Only a designated employer can make the offer. The open data has no employer names, so we cannot tell you which postings pass.</li>
<li><strong>The community's priorities.</strong> Each community sets its own priority sectors and occupations, and ${a(SRC.irccJobOffer, 'recommends only within them')}. We did not check the postings against the 14 priority lists, and they change. Read your community's current list before relying on any occupation in this report.</li>
<li><strong>The wage.</strong> IRCC's ${a(SRC.irccImm0247, 'job offer form guide')} compares the offered wage with the Job Bank wage for that occupation and region. The medians here are the minimums that postings state. They are not that benchmark.</li>
</ol>
<p>One more row to treat with care: ${f.n(farm.vacancies)} of the vacancies for livestock workers and farm machinery operators come from a single posting.</p>
${methodBox()}
${seriesNote(2)}
${sources(`\n<li>Employment and Social Development Canada: ${a(SRC.noc, 'National Occupational Classification 2021')}.</li>`)}`;

  return {
    file: 'en-2-occupations',
    part: 2,
    locale: L,
    slug: path(L, 2).split('/').pop(),
    title: 'RCIP job market, October 2026: which occupations are hiring and what they pay',
    excerpt: `Trades and transport, food service, and health and social services make up ${f.pc(KC.share_of_postings_pct)} of Job Bank postings in the 14 RCIP communities. Vacancies and wages for the top occupations, and what a posting does and does not tell you about eligibility.`,
    category: CATEGORY,
    tags: [...TAGS, 'NOC 2021', 'TEER'],
    keyTakeaway: `Of ${f.n(O.postings)} Job Bank postings in the 14 RCIP communities in October 2026, ${f.pc(KC.share_of_postings_pct)} were in trades and transport (median at least ${f.w(K.trades_transport.median_wage_hr)} an hour), food service (${f.w(K.food_service.median_wage_hr)}) or health and social services (${f.w(K.health_social.median_wage_hr)}). Harvest labour had the most vacancies (${f.n(harvest.vacancies)}) but is seasonal, which an RCIP job offer cannot be. A posting is not an eligible offer until the employer, the community's priority list and the wage are checked.`,
    summaryEn: `A statistical report on the occupations (NOC 2021) advertised on Job Bank in the 14 Rural Community Immigration Pilot communities in October 2026: top occupations by vacancies with median minimum wages and sample sizes, three steady groups (trades and transport, food service, health and social services), the TEER distribution, and the IRCC tests a posting must still pass.`,
    faq: [
      { q: 'Which occupations are most in demand in RCIP communities?', a: `In October 2026, outside seasonal harvest work, the most vacancies were for transport truck drivers (${f.n(truck.vacancies)}), food service supervisors (${f.n(fss.vacancies)}) and cooks (${f.n(cooks.vacancies)}), counted from Job Bank postings in the 14 communities.` },
      { q: 'What do trades jobs pay in RCIP communities?', a: `Postings in trades and transport stated a median minimum of ${f.w(K.trades_transport.median_wage_hr)} an hour (${f.n(K.trades_transport.wage_n)} postings). Heavy-duty equipment mechanics advertised ${f.w(hdm.median_wage_hr)} and transport truck drivers ${f.w(truck.median_wage_hr)}.` },
      { q: 'Can seasonal farm work lead to RCIP?', a: 'No. IRCC requires an RCIP job offer to be non-seasonal, full time and without an end date. Harvest postings are counted in this report but marked as seasonal.' },
      { q: 'Is a job in a listed occupation automatically eligible for RCIP?', a: 'No. The employer must be designated by the community, the occupation must be within that community\'s priorities, and the wage must meet the Job Bank wage for the occupation and region.' },
    ],
    internalLinks: [INDEX[L], path(L, 1), GUIDE[L].rules],
    content,
  };
}

// ── Part 3 ───────────────────────────────────────────────────────────────────

function part3() {
  const secs = S.sectors;
  const U = S.sector_unknown;
  const food = sector('72');
  const health = sector('62');
  const retail = sector('44-45');
  const constr = sector('23');
  const manuf = sector('31-33');
  const whole = sector('41');
  const prof = sector('54');
  const admin = sector('56');
  const other = sector('81');
  const transp = sector('48-49');
  const mining = sector('21');
  const pub = sector('91');
  const agri = sector('11');
  const info = sector('51');
  const flag = (s) => (s.small_sample ? ' *' : '');
  const main = secs.filter((s) => s.listings >= 80 || ['21', '91', '11'].includes(s.code));

  const chart = pairedBarChart(
    main.map((s) => ({ label: sname(L, s, true), a: s.listing_share_pct, b: s.posting_share_of_known_pct, aDisplay: f.pc(s.listing_share_pct), bDisplay: f.pc(s.posting_share_of_known_pct) })),
    { a: 'Share of listings', b: 'Share of postings' },
    { eyebrow: EYEBROW[L], title: 'Designated-employer listings against postings, by industry', caption: 'Each industry\'s share of classified listings and of postings that state an industry. Where the bright bar is longer, hiring runs ahead of the list.', source: src },
    L,
  );

  const content = `
<p>The 14 Rural Community Immigration Pilot (RCIP) communities publish lists of designated employers, the only ones whose job offers count. Job Bank shows who is advertising. Put the two together by industry and you can see where the lists are long but quiet, and where hiring runs ahead of them.</p>
<p><strong>Accommodation and food services is the largest industry on both sides: ${f.n(food.listings)} of the listings and ${f.n(food.postings)} of the postings that state an industry. Health care is the second-largest group of designated employers but advertises little on Job Bank. Mining, transport, farming and local government post more vacancies than their small place on the lists would suggest.</strong></p>
<p>This is part three of the October ${f.plain(2026)} series. A caution before the numbers: the two sources cannot be joined employer by employer, and ${f.pc(O.unknown_industry_share_pct)} of postings carry no industry at all. Every ratio below is therefore lower than the truth. Use the table to compare industries with each other, and do not read any single ratio as a measurement.</p>

<h2>How did we line the two sides up?</h2>
<p>Both sides are grouped into the sectors of the ${a(SRC.naics, 'North American Industry Classification System (NAICS)')}. Job Bank postings arrive with a mix of sector and sub-sector labels, so "repair and maintenance" and "personal services" are folded into "other services", and "employment services" and "waste management" into administrative support. The employer side is our own work: we assigned each listed employer to a sector from its name and public business information, and ${f.n(S.listings.unclassified)} of the ${f.n(S.listings.total)} listings could not be classified.</p>
<p>Before this step an early version of the table showed mining with no designated employers at all, simply because the two sources spell the sector's name differently. Mining has ${f.n(mining.listings)} listings.</p>

<h2>Where do listings and postings sit, industry by industry?</h2>
${chart}
${scrollTable(`<table>
<thead><tr><th>Industry (NAICS sector)</th><th>Listings</th><th>Share of listings</th><th>Postings</th><th>Vacancies</th><th>Postings per 100 listings</th><th>Median wage (n)</th></tr></thead>
<tbody>
${secs.map((s) => `<tr><td>${s.name}</td><td>${f.n(s.listings)}</td><td>${f.pc(s.listing_share_pct)}</td><td>${f.n(s.postings)}</td><td>${f.n(s.vacancies)}</td><td>${f.d(s.postings_per_100_listings)}</td><td>${s.wage_n ? `${f.w(s.median_wage_hr)} (${f.n(s.wage_n)})${flag(s)}` : 'n/a'}</td></tr>`).join('\n')}
<tr><td>Industry not stated</td><td>${f.n(U.listings)}</td><td></td><td>${f.n(U.postings)}</td><td>${f.n(U.vacancies)}</td><td></td><td></td></tr>
</tbody>
</table>`)}
<p>* Fewer than ${f.n(M.method.min_n_for_median)} wages: an indication only.</p>

<h2>Where is the list large but the hiring quiet?</h2>
<p><strong>Health care and social assistance.</strong> ${f.n(health.listings)} listings (${f.pc(health.listing_share_pct)}) but ${f.n(health.postings)} postings, ${f.d(health.postings_per_100_listings)} per 100. The wage is good, a median of ${f.w(health.median_wage_hr)}. This data cannot say why. Some health employers recruit on their own sites, so if health is your field, check the career pages of the designated employers as well as Job Bank.</p>
<p><strong>Manufacturing.</strong> ${f.n(manuf.listings)} listings and only ${f.n(manuf.postings)} postings, ${f.d(manuf.postings_per_100_listings)} per 100, the lowest ratio among the large sectors.</p>
<p><strong>Professional services and wholesale.</strong> ${f.n(prof.listings)} and ${f.n(whole.listings)} listings, ${f.n(prof.postings)} and ${f.n(whole.postings)} postings.</p>
<p>Quiet on Job Bank in one October does not mean closed. It does mean that in these sectors the designated list tells you more than Job Bank does about who might hire.</p>

<h2>Where does hiring run ahead of the list?</h2>
<p><strong>Transportation and warehousing.</strong> ${f.n(transp.listings)} listings, ${f.n(transp.postings)} postings, but ${f.n(transp.vacancies)} vacancies, because trucking firms advertise several seats at once. Median wage ${f.w(transp.median_wage_hr)}.</p>
<p><strong>Mining.</strong> ${f.n(mining.listings)} listings and ${f.n(mining.postings)} postings carrying ${f.n(mining.vacancies)} vacancies, in ${f.n(mining.communities_with_postings)} communities. The median of ${f.w(mining.median_wage_hr)} is the highest of any sector, on a small sample. As part one showed, Timmins had ${f.n(occ('83100').postings)} postings for ${f.n(occ('83100').vacancies)} underground miners.</p>
<p><strong>Public administration.</strong> ${f.n(pub.postings)} postings against ${f.n(pub.listings)} listings, more postings than listings. Public bodies advertised more postings than there are listings this month, and few of them are on the designated lists.</p>
<p><strong>Accommodation and food.</strong> The ratio is ordinary, ${f.d(food.postings_per_100_listings)} per 100, but the volume is the largest of all: ${f.n(food.vacancies)} vacancies at a median of ${f.w(food.median_wage_hr)}.</p>

<h2>What about agriculture?</h2>
<p>Agriculture has the most striking ratio in the table, ${f.n(agri.postings)} postings for ${f.n(agri.listings)} listings, and ${f.n(agri.vacancies)} vacancies. It is also the least useful number for an RCIP applicant. ${f.n(agri.harvest_vacancies)} of those vacancies are harvest labour. More harvest work is filed under other sectors: ${f.n(retail.harvest_vacancies)} vineyard vacancies are coded as retail trade and ${f.n(manuf.harvest_vacancies)} as manufacturing.</p>
<p>IRCC requires an RCIP job offer to be non-seasonal. Year-round farm jobs exist, but this data cannot separate them cleanly from the seasonal ones, and only ${f.n(agri.listings)} listings on the designated lists are agriculture, forestry or fishing businesses.</p>

<h2>What should a reader take from this?</h2>
<ul>
<li>The designated lists lean heavily on hospitality, health, retail and construction: those four sectors hold ${f.n(dv(food.listings + health.listings + retail.listings + constr.listings, 'listings of sectors 72 + 62 + 44-45 + 23'))} of the ${f.n(S.listings.classified)} classified listings.</li>
<li>Where your industry is on the list but silent on Job Bank, the list is the better tool. Use it to find the employers, then apply to vacancies they post themselves. Several communities ask candidates not to send unsolicited requests for job offers.</li>
<li>Where Job Bank is loud but the list is short, as in public administration and farming, expect many of the advertised jobs to be with employers who cannot make an RCIP offer.</li>
<li>Staffing agencies cannot be designated at all under ${a(SRC.irccDesignation, 'IRCC\'s designation rules')}, so postings from employment services are outside the program.</li>
</ul>
<p>Other services (${f.n(other.listings)} listings) and administrative support (${f.n(admin.listings)}) sit in the middle on every measure.</p>
${methodBox()}
${seriesNote(3)}
${sources(`\n<li>Statistics Canada: ${a(SRC.naics, 'North American Industry Classification System (NAICS) Canada 2022')}.</li>`)}`;

  return {
    file: 'en-3-industries',
    part: 3,
    locale: L,
    slug: path(L, 3).split('/').pop(),
    title: 'RCIP job market, October 2026: designated employers and open postings by industry',
    excerpt: `Hospitality and health dominate the designated-employer lists of the 14 RCIP communities, but health has few postings on Job Bank. Where the lists are large and quiet, where hiring runs ahead of them, and why the farm numbers mislead.`,
    category: CATEGORY,
    tags: [...TAGS, 'Designated employers', 'NAICS'],
    keyTakeaway: `The 14 RCIP communities list ${f.n(S.listings.total)} designated-employer listings; accommodation and food (${f.n(food.listings)}) and health care (${f.n(health.listings)}) are the largest groups. On Job Bank in October 2026, food services also led postings (${f.n(food.postings)}), while health had ${f.d(health.postings_per_100_listings)} postings per 100 listings. Transport, mining and public administration advertised more than their share of the lists. ${f.pc(O.unknown_industry_share_pct)} of postings state no industry, so all ratios are understated.`,
    summaryEn: `A statistical report comparing designated-employer listings with Job Bank postings by NAICS sector in the 14 Rural Community Immigration Pilot communities, October 2026: where listings are large but postings few (health, manufacturing), where postings outrun listings (transport, mining, public administration), and why seasonal agriculture inflates the vacancy count.`,
    faq: [
      { q: 'Which industries have the most RCIP designated employers?', a: `Accommodation and food services (${f.n(food.listings)} listings), health care and social assistance (${f.n(health.listings)}), retail trade (${f.n(retail.listings)}) and construction (${f.n(constr.listings)}), counted on the 14 community lists.` },
      { q: 'Why are there so few health care postings in RCIP communities on Job Bank?', a: `Health had ${f.n(health.postings)} postings against ${f.n(health.listings)} listings in October 2026. This data cannot say why. Some health employers recruit on their own career sites, so check those too.` },
      { q: 'Are mining jobs available through RCIP?', a: `Mining has ${f.n(mining.listings)} designated-employer listings. In October 2026 it had ${f.n(mining.postings)} postings for ${f.n(mining.vacancies)} vacancies, many of them in a few large postings. Whether a given job qualifies depends on the employer and the community's priority list.` },
      { q: 'Do farm jobs in RCIP communities qualify?', a: 'Seasonal harvest work does not, because IRCC requires a non-seasonal job offer. Most farm vacancies advertised in October 2026 were harvest labour.' },
    ],
    internalLinks: [INDEX[L], path(L, 1), path(L, 2), GUIDE[L].rules],
    content,
  };
}

export const articles = [part1(), part2(), part3()];
