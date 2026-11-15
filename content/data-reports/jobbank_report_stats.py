#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Cleaned statistics for the public RCIP x Job Bank data reports.

Reads   jobbank_data.json        postings already matched to the 14 communities
                                 (output of jobbank_build.py)
        jobbank_raw/<month>.csv  the national Job Bank open-data file, used only
                                 as evidence for the template rule
        rcip_all_classified.csv  designated-employer listings
Writes  one JSON with every figure the reports print (default
        jobbank_report_stats.json). No employer name, contact or address is
        written: aggregates only.

What it does that jobbank_build.py does not:
  1. Flags "national template" postings and keeps them out of every ranking
     and median (rule below, plus a hand-reviewed list).
  2. Maps both sides to NAICS sectors (2-digit), so supply and demand line up.
  3. Reports medians with their n and flags n < 20.
  4. Counts designated-employer LISTINGS and, separately, unique names.
  5. Marks harvest labour (NOC 85101) as seasonal.

Template rule
  An external-board posting is a national template when its signature
  (job title, salary unit, salary minimum, salary maximum) has one fixed
  salary (minimum == maximum) and appears, in the national file, in at least
  TEMPLATE_MIN_PROVINCES provinces/territories and TEMPLATE_MIN_CITIES cities.
  A local wage does not repeat to the cent across provinces with different
  minimum wages and labour markets; a remote job advertised town by town does.
  Every signature the rule catches is listed in the output with its national
  spread and the most common original ad titles, and must have a decision in
  REVIEWED. Repeats the rule does not catch but that show up in four or more
  communities are listed too, with the reason they were kept.

Usage:
  python3 jobbank_report_stats.py [--input jobbank_raw/oct2026_en.csv]
                                  [--month 2026-10] [--out jobbank_report_stats.json]
"""
import argparse
import csv
import json
import os
import re
import statistics
import sys
from collections import Counter, defaultdict

BASE = os.path.dirname(os.path.abspath(__file__))

TEMPLATE_MIN_PROVINCES = 3
TEMPLATE_MIN_CITIES = 20
MIN_N_FOR_MEDIAN = 20      # medians on fewer wages are flagged, not hidden
NEAR_MISS_COMMUNITIES = 4  # same title + wage in this many communities gets a written decision
WIDE_RANGE_RATIO = 1.5     # salary maximum >= 1.5 x minimum: the minimum says little
SEASONAL_NOC = {"85101"}   # harvesting labourers

# Hand review, 15 Nov 2026 (October 2026 file). Key = job title as Job Bank codes it.
REVIEWED = {
    "inside sales representative": (
        "template",
        "One annual salary to the dollar in 13 provinces and territories and 744 cities, posted on two dates; "
        "the original ad titles say 'Remote Inside Sales'. A remote commission job advertised in every town, not local hiring."),
    "informatics consultant": (
        "template",
        "Three fixed annual salaries, each posted on a single date in 9 or 10 provinces; the original ad title is "
        "'Work From Home Sales Consultant'. Same advertiser pattern as above; the occupation code is wrong for the job."),
    "retail sales representative": (
        "template",
        "The same three fixed annual salaries and dates as 'informatics consultant', in 5 to 9 provinces. "
        "Same work-from-home advertisement under a second title."),
}
KEPT = {
    "customer service representative - call centre": (
        "One wage, but in a single province (Ontario) and on 12 posting dates nationally; the original ad title is a "
        "fixed-term seasonal customer-service job. That fits one large employer hiring across Ontario. Kept; "
        "it does not reach any top-occupation table."),
    "cashier": (
        "An entry-level wage that many unrelated retailers pay; posted on 8 different dates in the 14 communities, "
        "two of the postings direct on Job Bank with a retail industry code. Ordinary local hiring. Kept."),
    "sales representative - retail": (
        "Posted directly on Job Bank (not an external board) with an industry code and five vacancies per posting. "
        "A chain hiring in several towns. Kept."),
}

# NAICS Canada sectors. Job Bank publishes a mix of sector and subsector labels.
SECTORS = {
    "11": "Agriculture, forestry, fishing and hunting",
    "21": "Mining, quarrying, and oil and gas extraction",
    "22": "Utilities",
    "23": "Construction",
    "31-33": "Manufacturing",
    "41": "Wholesale trade",
    "44-45": "Retail trade",
    "48-49": "Transportation and warehousing",
    "51": "Information and cultural industries",
    "52": "Finance and insurance",
    "53": "Real estate and rental and leasing",
    "54": "Professional, scientific and technical services",
    "55": "Management of companies and enterprises",
    "56": "Administrative and support, waste management and remediation services",
    "61": "Educational services",
    "62": "Health care and social assistance",
    "71": "Arts, entertainment and recreation",
    "72": "Accommodation and food services",
    "81": "Other services (except public administration)",
    "91": "Public administration",
}
JOBBANK_LABEL_TO_SECTOR = {name: code for code, name in SECTORS.items()}
JOBBANK_LABEL_TO_SECTOR.update({
    "Mining and oil and gas extraction": "21",
    "Administrative and support services": "56",          # NAICS 561
    "Waste management and remediation services": "56",    # NAICS 562
    "Employment services": "56",                          # NAICS 5613
    "Repair and maintenance": "81",                       # NAICS 811
    "Personal and laundry services": "81",                # NAICS 812
    "Religious, grant-making, civic, and professional and similar organizations": "81",  # NAICS 813
    "Private households": "81",                           # NAICS 814
})


def sector_of_naics(code: str):
    """3-digit NAICS on the employer side -> sector code."""
    two = (code or "").strip()[:2]
    if not two:
        return None
    if two in ("31", "32", "33"):
        return "31-33"
    if two in ("44", "45"):
        return "44-45"
    if two in ("48", "49"):
        return "48-49"
    return two if two in SECTORS else None


# Occupation clusters, by NOC 2021.
FOOD_NOCS = {"60030", "62020", "62200", "63200", "64300", "64301", "65200", "65201"}
SOCIAL_NOCS = {"41300", "41301", "42201", "42202", "42203", "44101"}


def cluster_of(noc: str):
    if noc in FOOD_NOCS:
        return "food_service"
    if noc[:1] == "7":            # broad category 7: trades, transport and equipment operators
        return "trades_transport"
    if noc[:1] == "3" or noc in SOCIAL_NOCS:   # broad category 3: health; plus social and care unit groups
        return "health_social"
    return None


def teer_of(noc: str):
    return int(noc[1]) if len(noc) == 5 and noc.isdigit() else None


def med(xs):
    xs = [x for x in xs if x is not None]
    return round(statistics.median(xs), 2) if xs else None


def wage_block(ps):
    w = [p["wage_min"] for p in ps if p["wage_min"] is not None]
    return {"median_wage_hr": med(w), "wage_n": len(w), "small_sample": len(w) < MIN_N_FOR_MEDIAN}


def norm_name(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", (s or "").lower()).strip()


def pct(a, b, nd=1):
    return round(100 * a / b, nd) if b else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", default=os.path.join(BASE, "jobbank_raw", "oct2026_en.csv"))
    ap.add_argument("--data", default=os.path.join(BASE, "jobbank_data.json"))
    ap.add_argument("--employers", default=os.path.join(BASE, "rcip_all_classified.csv"))
    ap.add_argument("--month", default="2026-10")
    ap.add_argument("--out", default=os.path.join(BASE, "jobbank_report_stats.json"))
    args = ap.parse_args()

    data = json.load(open(args.data, encoding="utf-8"))
    if data["meta"]["month"] != args.month:
        sys.exit(f"jobbank_data.json is for {data['meta']['month']}, not {args.month}: rerun jobbank_build.py first")
    posts = data["postings"]
    by_id = {p["id"]: p for p in posts}
    warnings = []

    # ---- national evidence for the template rule --------------------------------
    nat = defaultdict(lambda: {"n": 0, "prov": set(), "city": set(), "dates": set(), "orig": Counter()})
    sig_of_id = {}
    with open(args.input, encoding="utf-16", newline="") as f:
        for r in csv.DictReader(f, delimiter="\t"):
            sig = (r["Job Title"].strip().lower(), r["Salary Per"], r["Salary Minimum"], r["Salary Maximum"])
            if r["External Indicator"] == "1":
                n = nat[sig]
                n["n"] += 1
                n["prov"].add(r["Province/Territory"])
                n["city"].add((r["Province/Territory"], r["City"]))
                n["dates"].add(r["First Posting Date"])
                n["orig"][r["Original Job Title"].strip()] += 1
            if r["WIC Job Location Snapshot ID"] in by_id:
                sig_of_id[r["WIC Job Location Snapshot ID"]] = sig

    def is_template_sig(sig):
        n = nat.get(sig)
        return bool(n and sig[2] == sig[3] and sig[2] not in ("NA", "")
                    and len(n["prov"]) >= TEMPLATE_MIN_PROVINCES and len(n["city"]) >= TEMPLATE_MIN_CITIES)

    template_ids = set()
    tsigs = defaultdict(list)
    for p in posts:
        sig = sig_of_id.get(p["id"])
        if p["external"] and sig and is_template_sig(sig):
            template_ids.add(p["id"])
            tsigs[sig].append(p)

    template_rows = []
    for sig, ps in sorted(tsigs.items(), key=lambda kv: -len(kv[1])):
        n = nat[sig]
        decision = REVIEWED.get(sig[0])
        if not decision:
            warnings.append(f"template signature not hand-reviewed: {sig}")
        template_rows.append({
            "title": sig[0],
            "salary": f"{sig[2]} per {sig[1].lower()}",
            "wage_hr": ps[0]["wage_min"],
            "postings": len(ps),
            "communities": len({p["community"] for p in ps}),
            "national_postings": n["n"],
            "national_provinces": len(n["prov"]),
            "national_cities": len(n["city"]),
            "national_posting_dates": len(n["dates"]),
            "original_ad_titles": [t for t, _ in n["orig"].most_common(3)],
            "reviewed": bool(decision),
            "reason": decision[1] if decision else "caught by the rule; not yet reviewed by hand",
        })
    template_titles = defaultdict(lambda: {"postings": 0, "communities": set(), "wages": set()})
    for p in posts:
        if p["id"] in template_ids:
            t = template_titles[p["title"].lower()]
            t["postings"] += 1
            t["communities"].add(p["community"])
            t["wages"].add(p["wage_min"])

    # ---- near misses: repeats the rule did not catch -----------------------------
    rep = defaultdict(list)
    for p in posts:
        if p["id"] not in template_ids:
            rep[(p["title"].lower(), p["wage_min"])].append(p)
    kept_rows = []
    for (title, wage), ps in sorted(rep.items(), key=lambda kv: -len(kv[1])):
        comms = {p["community"] for p in ps}
        if len(comms) < NEAR_MISS_COMMUNITIES:
            continue
        sig = sig_of_id.get(ps[0]["id"])
        n = nat.get(sig) if sig else None
        if title not in KEPT:
            warnings.append(f"repeat across {len(comms)} communities has no written decision: {title} at {wage}")
        kept_rows.append({
            "title": title, "wage_hr": wage, "postings": len(ps), "communities": len(comms),
            "external_postings": sum(1 for p in ps if p["external"]),
            "posting_dates": len({p["date"] for p in ps}),
            "national_provinces": len(n["prov"]) if n else None,
            "decision": "kept",
            "reason": KEPT.get(title, "no written decision yet"),
        })

    clean = [p for p in posts if p["id"] not in template_ids]

    # ---- employers (supply side): listings, never names --------------------------
    listings = list(csv.DictReader(open(args.employers, encoding="utf-8-sig")))
    emp = defaultdict(lambda: {"listings": 0, "names": set(), "sector": Counter(), "as_of": "", "url": "", "province": "",
                               "closed_to_new": 0})
    for r in listings:
        e = emp[r["community"]]
        e["listings"] += 1
        e["names"].add(norm_name(r["employer_name"]))
        e["sector"][sector_of_naics(r["naics"]) or "unknown"] += 1
        e["as_of"], e["url"], e["province"] = r["list_as_of"], r["source_url"], r["province"]
        if re.search(r"excluded from|not accepted", r["excluded_note"] or "", re.I):
            e["closed_to_new"] += 1
    total_listings = len(listings)
    unique_employers = sum(len(e["names"]) for e in emp.values())

    # ---- overall -------------------------------------------------------------------
    def summarise(ps):
        vac = sum(p["vacancies"] for p in ps)
        typed = [p for p in ps if p["type"]]
        seasonal_vac = sum(p["vacancies"] for p in ps if p["noc"] in SEASONAL_NOC)
        return {
            "postings": len(ps),
            "vacancies": vac,
            "vacancies_per_posting": round(vac / len(ps), 2) if ps else None,
            **wage_block(ps),
            "full_time_share_pct": pct(sum(1 for p in ps if p["type"] == "Full time"), len(ps)),
            "full_time_share_of_stated_pct": pct(sum(1 for p in typed if p["type"] == "Full time"), len(typed)),
            "unknown_industry_postings": sum(1 for p in ps if p["naics"] == "Unknown"),
            "unknown_industry_share_pct": pct(sum(1 for p in ps if p["naics"] == "Unknown"), len(ps)),
            "external_postings": sum(1 for p in ps if p["external"]),
            "permanent_full_time_postings": sum(1 for p in ps if p["type"] == "Full time" and p["term"] == "Permanent employment"),
            "permanent_full_time_share_pct": pct(sum(1 for p in ps if p["type"] == "Full time" and p["term"] == "Permanent employment"), len(ps)),
            "term_not_stated_postings": sum(1 for p in ps if not p["term"]),
            "seasonal_term_postings": sum(1 for p in ps if p["term"] == "Seasonal employment"),
            "seasonal_harvest_vacancies": seasonal_vac,
            "vacancies_excluding_harvest": vac - seasonal_vac,
        }

    def top_noc(ps, k=1):
        c = defaultdict(lambda: {"name": "", "postings": 0, "vacancies": 0, "wages": []})
        for p in ps:
            if not p["noc"].isdigit():
                continue
            n = c[p["noc"]]
            n["name"] = p["noc_name"]
            n["postings"] += 1
            n["vacancies"] += p["vacancies"]
            if p["wage_min"] is not None:
                n["wages"].append(p["wage_min"])
        rows = sorted(c.items(), key=lambda kv: (-kv[1]["vacancies"], -kv[1]["postings"]))
        return rows[:k] if k else rows

    orig_top = top_noc(posts)[0]
    original = {
        **summarise(posts),
        "postings_per_100_listings": round(100 * len(posts) / total_listings, 1),
        "top_occupation": {"noc": orig_top[0], "name": orig_top[1]["name"], "postings": orig_top[1]["postings"],
                           "vacancies": orig_top[1]["vacancies"], "median_wage_hr": med(orig_top[1]["wages"])},
    }
    overall = {**summarise(clean), "postings_per_100_listings": round(100 * len(clean) / total_listings, 1),
               "wide_range_postings": sum(1 for p in clean if p["wage_min"] and p["wage_max"]
                                          and p["wage_max"] >= WIDE_RANGE_RATIO * p["wage_min"]),
               "postings_without_wage": sum(1 for p in clean if p["wage_min"] is None),
               "postings_without_noc": sum(1 for p in clean if not p["noc"].isdigit())}

    # ---- communities ---------------------------------------------------------------
    communities = []
    for c in data["communities"]:
        name = c["name"]
        ps = [p for p in clean if p["community"] == name]
        e = emp[name]
        s = summarise(ps)
        tn = top_noc([p for p in ps if p["noc"] not in SEASONAL_NOC])
        communities.append({
            "name": name,
            "province": e["province"],
            "listings": e["listings"],
            "unique_employer_names": len(e["names"]),
            "listings_closed_to_new_applications": e["closed_to_new"],
            "list_as_of": e["as_of"],
            "list_source_url": e["url"],
            **s,
            "share_of_vacancies_pct": pct(s["vacancies"], overall["vacancies"]),
            "share_of_postings_pct": pct(s["postings"], overall["postings"]),
            "postings_original": sum(1 for p in posts if p["community"] == name),
            "template_postings_removed": sum(1 for p in posts if p["community"] == name and p["id"] in template_ids),
            "postings_per_100_listings": round(100 * len(ps) / e["listings"], 1) if e["listings"] else None,
            "top_occupation": ({"noc": tn[0][0], "name": tn[0][1]["name"], "postings": tn[0][1]["postings"],
                                "vacancies": tn[0][1]["vacancies"]} if tn else None),
        })

    # ---- sectors: supply vs demand ---------------------------------------------------
    sec = {code: {"code": code, "name": name, "listings": 0, "postings": 0, "vacancies": 0,
                  "harvest_vacancies": 0, "wages": [], "communities_with_postings": set()}
           for code, name in SECTORS.items()}
    unknown_listings = 0
    for e in emp.values():
        for code, n in e["sector"].items():
            if code == "unknown":
                unknown_listings += n
            else:
                sec[code]["listings"] += n
    unknown_post = {"postings": 0, "vacancies": 0}
    for p in clean:
        if p["naics"] == "Unknown":
            unknown_post["postings"] += 1
            unknown_post["vacancies"] += p["vacancies"]
            continue
        code = JOBBANK_LABEL_TO_SECTOR.get(p["naics"])
        if not code:
            warnings.append(f"Job Bank industry label not mapped to a sector: {p['naics']}")
            continue
        s = sec[code]
        s["postings"] += 1
        s["vacancies"] += p["vacancies"]
        s["communities_with_postings"].add(p["community"])
        if p["noc"] in SEASONAL_NOC:
            s["harvest_vacancies"] += p["vacancies"]
        if p["wage_min"] is not None:
            s["wages"].append(p["wage_min"])
    classified_listings = total_listings - unknown_listings
    known_postings = len(clean) - unknown_post["postings"]
    sectors = []
    for s in sec.values():
        if not s["listings"] and not s["postings"]:
            continue
        sectors.append({
            "code": s["code"], "name": s["name"],
            "listings": s["listings"],
            "listing_share_pct": pct(s["listings"], classified_listings),
            "postings": s["postings"],
            "posting_share_of_known_pct": pct(s["postings"], known_postings),
            "vacancies": s["vacancies"],
            "harvest_vacancies": s["harvest_vacancies"],
            "postings_per_100_listings": round(100 * s["postings"] / s["listings"], 1) if s["listings"] else None,
            "median_wage_hr": med(s["wages"]), "wage_n": len(s["wages"]),
            "small_sample": len(s["wages"]) < MIN_N_FOR_MEDIAN,
            "communities_with_postings": len(s["communities_with_postings"]),
        })
    sectors.sort(key=lambda r: -r["listings"])

    # ---- occupations -----------------------------------------------------------------
    occupations = []
    for code, v in top_noc(clean, k=25):
        ps = [p for p in clean if p["noc"] == code]
        occupations.append({
            "noc": code, "name": v["name"], "teer": teer_of(code), "cluster": cluster_of(code),
            "postings": v["postings"], "vacancies": v["vacancies"],
            "median_wage_hr": med(v["wages"]), "wage_n": len(v["wages"]),
            "small_sample": len(v["wages"]) < MIN_N_FOR_MEDIAN,
            "communities": len({p["community"] for p in ps}),
            "largest_posting_vacancies": max(p["vacancies"] for p in ps),
            "seasonal": code in SEASONAL_NOC,
        })
    clusters = {}
    for key in ("food_service", "trades_transport", "health_social"):
        ps = [p for p in clean if cluster_of(p["noc"]) == key]
        clusters[key] = {**{k: v for k, v in summarise(ps).items()
                            if k in ("postings", "vacancies", "vacancies_per_posting", "median_wage_hr", "wage_n",
                                     "small_sample", "full_time_share_pct")},
                         "share_of_postings_pct": pct(len(ps), len(clean)),
                         "share_of_vacancies_pct": pct(sum(p["vacancies"] for p in ps), overall["vacancies"]),
                         "communities": len({p["community"] for p in ps}),
                         "occupations": len({p["noc"] for p in ps})}
    core = [p for p in clean if cluster_of(p["noc"])]
    clusters_combined = {"postings": len(core), "share_of_postings_pct": pct(len(core), len(clean)),
                         "vacancies": sum(p["vacancies"] for p in core),
                         "share_of_vacancies_pct": pct(sum(p["vacancies"] for p in core), overall["vacancies"])}
    teer = Counter(teer_of(p["noc"]) for p in clean)
    teer_rows = [{"teer": t, "postings": teer[t], "share_pct": pct(teer[t], len(clean)),
                  "vacancies": sum(p["vacancies"] for p in clean if teer_of(p["noc"]) == t)}
                 for t in sorted(k for k in teer if k is not None)]

    out = {
        "meta": {
            "month": args.month,
            "source": data["meta"]["source"],
            "source_url": data["meta"]["source_url"],
            "attribution": "Contains information licensed under the Open Government Licence - Canada.",
            "rows_in_national_file": data["meta"]["rows_in_file"],
            "rows_without_city": data["meta"]["rows_without_city"],
            "matched_postings": len(posts),
            "matched_share_of_national_pct": pct(len(posts), data["meta"]["rows_in_file"]),
            "cross_post_duplicates_removed": data["meta"]["cross_post_duplicates_removed"],
            "communities": len(communities),
            "method": {
                "template_rule": f"external posting; fixed salary (minimum = maximum); same title and salary in at least "
                                 f"{TEMPLATE_MIN_PROVINCES} provinces/territories and {TEMPLATE_MIN_CITIES} cities of the national file",
                "template_min_provinces": TEMPLATE_MIN_PROVINCES,
                "template_min_cities": TEMPLATE_MIN_CITIES,
                "min_n_for_median": MIN_N_FOR_MEDIAN,
                "wide_range_ratio": WIDE_RANGE_RATIO,
                "wage": "each posting's salary minimum, converted to dollars per hour",
                "seasonal_noc": sorted(SEASONAL_NOC),
                "clusters": {"food_service": sorted(FOOD_NOCS),
                             "trades_transport": "NOC broad category 7",
                             "health_social": "NOC broad category 3 plus " + ", ".join(sorted(SOCIAL_NOCS))},
            },
            "warnings": warnings,
        },
        "original": original,
        "templates": {
            "postings": len(template_ids),
            "vacancies": sum(by_id[i]["vacancies"] for i in template_ids),
            "share_of_matched_pct": pct(len(template_ids), len(posts)),
            "communities": len({by_id[i]["community"] for i in template_ids}),
            "by_title": [{"title": t, "postings": v["postings"], "communities": len(v["communities"]),
                          "wages_hr": sorted(v["wages"])}
                         for t, v in sorted(template_titles.items(), key=lambda kv: -kv[1]["postings"])],
            "signatures": template_rows,
        },
        "kept_after_review": kept_rows,
        "listings": {
            "total": total_listings,
            "unique_employer_names": unique_employers,
            "duplicate_rows": total_listings - unique_employers,
            "classified": classified_listings,
            "unclassified": unknown_listings,
            "closed_to_new_applications": sum(e["closed_to_new"] for e in emp.values()),
        },
        "overall": overall,
        "communities": communities,
        "sectors": sectors,
        "sector_unknown": {"listings": unknown_listings, **unknown_post},
        "occupations": occupations,
        "clusters": clusters,
        "clusters_combined": clusters_combined,
        "teer": teer_rows,
    }
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
        f.write("\n")

    o, c = original, overall
    print(f"original : {o['postings']} postings, {o['vacancies']} vacancies, median ${o['median_wage_hr']}, "
          f"top {o['top_occupation']['noc']} at ${o['top_occupation']['median_wage_hr']}")
    print(f"templates: {len(template_ids)} postings in {out['templates']['communities']} communities")
    print(f"cleaned  : {c['postings']} postings, {c['vacancies']} vacancies, median ${c['median_wage_hr']} (n={c['wage_n']})")
    for w in warnings:
        print("WARNING:", w)
    print("wrote", args.out)


if __name__ == "__main__":
    main()
