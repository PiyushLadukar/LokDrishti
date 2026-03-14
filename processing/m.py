"""
match_criminal_records.py
══════════════════════════
Matches the scraped MyNeta names to your DB MP names.
Creates a final criminal_records.json keyed by your exact DB names.

Run from LokDrishti/ folder:
    python processing\match_criminal_records.py
"""

import json, re, sqlite3
from pathlib import Path

DB_PATH      = Path("processing/lokdrishti.db")
SCRAPED_JSON = Path("data/criminal_records.json")
OUTPUT_JSON  = Path("data/criminal_records_matched.json")

# ── Load data ────────────────────────────────────────────────
with open(SCRAPED_JSON, encoding="utf-8") as f:
    scraped = json.load(f)

conn = sqlite3.connect(DB_PATH)
c = conn.cursor()
c.execute("SELECT DISTINCT name FROM mp_performance ORDER BY name")
db_names = [r[0] for r in c.fetchall()]
conn.close()

print(f"DB names   : {len(db_names)}")
print(f"Scraped    : {len(scraped)}")

# ── Name normalizer ──────────────────────────────────────────
def normalize(name):
    # Remove brackets, extra words, lowercase
    name = re.sub(r'\(.*?\)', '', name)   # remove (H.S.Patel) etc
    name = re.sub(r'\b(alias|aka|dr|prof|shri|smt|mr|mrs)\b', '', name, flags=re.I)
    name = re.sub(r'[^a-z\s]', '', name.lower())
    return set(name.split())

def score(a, b):
    wa, wb = normalize(a), normalize(b)
    if not wa or not wb: return 0
    return len(wa & wb) / len(wa | wb)

# ── Match each DB name to best scraped name ──────────────────
results = {}
matched = unmatched = 0

scraped_names = list(scraped.keys())

for db_name in db_names:
    # Try exact match first
    if db_name in scraped:
        results[db_name] = scraped[db_name]
        matched += 1
        continue

    # Try fuzzy match
    best_name = None
    best_score = 0
    for s_name in scraped_names:
        sc = score(db_name, s_name)
        if sc > best_score:
            best_score = sc
            best_name = s_name

    if best_name and best_score >= 0.4:
        results[db_name] = scraped[best_name]
        results[db_name]["myneta_name"] = best_name
        results[db_name]["match_score"] = round(best_score, 2)
        matched += 1
        if best_score < 0.8:
            print(f"  ~match: '{db_name}' → '{best_name}' (score={best_score:.2f})")
    else:
        unmatched += 1
        print(f"  ✗ no match: '{db_name}' (best: '{best_name}', score={best_score:.2f})")
        results[db_name] = {
            "total_cases": 0, "serious_cases": 0,
            "ipc_summary": [], "pending_cases": [], "convicted_cases": [],
            "has_criminal_record": False, "not_found": True
        }

# Add has_criminal_record field if missing
for name, data in results.items():
    if "has_criminal_record" not in data:
        data["has_criminal_record"] = data.get("total_cases", 0) > 0

with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

# Also overwrite the main file
with open(SCRAPED_JSON, "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

criminal_count = sum(1 for v in results.values() if v.get("has_criminal_record"))
serious_count  = sum(1 for v in results.values() if v.get("serious_cases", 0) > 0)

print(f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Matching complete!
   DB names      : {len(db_names)}
   Matched       : {matched}
   Not matched   : {unmatched}
   With cases    : {criminal_count}
   Serious cases : {serious_count}
   Saved to      : {OUTPUT_JSON}
               + : {SCRAPED_JSON} (overwritten)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next steps:
  1. Copy data/criminal_records.json to your Flask app folder
  2. Add criminal_routes.py to your Flask app
  3. Add CriminalRecordBox.tsx to your MP profile page
""")