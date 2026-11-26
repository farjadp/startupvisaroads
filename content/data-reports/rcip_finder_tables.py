#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Aggregate tables for the RCIP employer finder on visaroads.com.

Writes one JSON (default rcip_finder_tables.json) with no employer names:
  nocs        NOC 2021 code -> English name, for every code in the national file
  sectors     NOC code -> NAICS sectors that post it nationally (share >= 10%,
              at least 3 postings, top 3). Used for the "related industry" tier.
  postings    NOC code -> October postings in the 14 communities after the same
              template cleaning as the reports: postings, vacancies, median
              minimum wage and its n, postings per community.

Usage:
  python3 rcip_finder_tables.py [--input jobbank_raw/oct2026_en.csv] [--month 2026-10]
"""
import argparse
import csv
import json
import os
import statistics
from collections import Counter, defaultdict

import jobbank_report_stats as rs

BASE = os.path.dirname(os.path.abspath(__file__))
MIN_SHARE = 0.10
MIN_POSTINGS_FOR_SECTOR = 3
MIN_NOC_POSTINGS = 5


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", default=os.path.join(BASE, "jobbank_raw", "oct2026_en.csv"))
    ap.add_argument("--data", default=os.path.join(BASE, "jobbank_data.json"))
    ap.add_argument("--month", default="2026-10")
    ap.add_argument("--out", default=os.path.join(BASE, "rcip_finder_tables.json"))
    args = ap.parse_args()

    data = json.load(open(args.data, encoding="utf-8"))
    if data["meta"]["month"] != args.month:
        raise SystemExit(f"jobbank_data.json is for {data['meta']['month']}, not {args.month}")
    ids = {p["id"] for p in data["postings"]}

    names = {}
    by_noc = defaultdict(Counter)
    nat = defaultdict(lambda: {"prov": set(), "city": set()})
    sig_of_id = {}
    with open(args.input, encoding="utf-16", newline="") as f:
        for r in csv.DictReader(f, delimiter="\t"):
            noc = r["NOC21 Code"]
            if noc.isdigit():
                names[noc] = r["NOC21 Code Name"]
                code = rs.JOBBANK_LABEL_TO_SECTOR.get(r["NAICS"])
                if code:
                    by_noc[noc][code] += 1
            sig = (r["Job Title"].strip().lower(), r["Salary Per"], r["Salary Minimum"], r["Salary Maximum"])
            if r["External Indicator"] == "1":
                nat[sig]["prov"].add(r["Province/Territory"])
                nat[sig]["city"].add((r["Province/Territory"], r["City"]))
            if r["WIC Job Location Snapshot ID"] in ids:
                sig_of_id[r["WIC Job Location Snapshot ID"]] = sig

    def template(p):
        sig = sig_of_id.get(p["id"])
        n = nat.get(sig) if sig else None
        return bool(p["external"] and n and sig[2] == sig[3] and sig[2] not in ("NA", "")
                    and len(n["prov"]) >= rs.TEMPLATE_MIN_PROVINCES and len(n["city"]) >= rs.TEMPLATE_MIN_CITIES)

    clean = [p for p in data["postings"] if not template(p)]

    sectors = {}
    for noc, c in by_noc.items():
        total = sum(c.values())
        if total < MIN_NOC_POSTINGS:
            continue
        top = [{"sector": k, "share": round(v / total, 3), "n": v} for k, v in c.most_common()
               if v / total >= MIN_SHARE and v >= MIN_POSTINGS_FOR_SECTOR][:3]
        if top:
            sectors[noc] = {"n": total, "sectors": top}

    postings = {}
    grouped = defaultdict(list)
    for p in clean:
        if p["noc"].isdigit():
            grouped[p["noc"]].append(p)
    for noc, ps in grouped.items():
        wages = [p["wage_min"] for p in ps if p["wage_min"] is not None]
        postings[noc] = {
            "postings": len(ps),
            "vacancies": sum(p["vacancies"] for p in ps),
            "median_wage_hr": round(statistics.median(wages), 2) if wages else None,
            "wage_n": len(wages),
            "by_community": dict(Counter(p["community"] for p in ps).most_common()),
        }

    out = {
        "meta": {
            "month": args.month,
            "source": data["meta"]["source"],
            "source_url": data["meta"]["source_url"],
            "attribution": "Contains information licensed under the Open Government Licence - Canada.",
            "templates_excluded": len(data["postings"]) - len(clean),
            "sector_rule": f"share >= {MIN_SHARE:.0%} of the occupation's national postings that state an industry, "
                           f"at least {MIN_POSTINGS_FOR_SECTOR} postings, top 3; occupations with fewer than "
                           f"{MIN_NOC_POSTINGS} such postings have no entry",
        },
        "nocs": dict(sorted(names.items())),
        "sectors": dict(sorted(sectors.items())),
        "postings": dict(sorted(postings.items())),
    }
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print(f"{len(names)} occupations, {len(sectors)} with sectors, {len(postings)} with postings "
          f"({out['meta']['templates_excluded']} template postings excluded) -> {args.out}")


if __name__ == "__main__":
    main()
