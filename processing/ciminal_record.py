"""
cr.py - Criminal Records Scraper
══════════════════════════════════
Searches MyNeta.info for each MP individually.
Run from LokDrishti/ folder: python processing\cr.py
"""

import json, time, re, sqlite3, os
from pathlib import Path

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    os.system("pip install requests beautifulsoup4")
    import requests
    from bs4 import BeautifulSoup

OUTPUT_JSON = Path("data/criminal_records.json")
DELAY = 1.2

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

def get_mp_names():
    db = Path("lokdrishti.db")
    if not db.exists():
        for p in Path(".").rglob("*.db"):
            db = p; break
    conn = sqlite3.connect(db)
    c = conn.cursor()
    c.execute("SELECT DISTINCT name FROM mp_performance WHERE name IS NOT NULL ORDER BY name")
    names = [r[0] for r in c.fetchall()]
    conn.close()
    print(f"Got {len(names)} MP names from {db}\n")
    return names

def match_score(a, b):
    def w(n): return set(re.sub(r'[^a-z\s]', '', n.lower()).split())
    wa, wb = w(a), w(b)
    if not wa or not wb: return 0
    return len(wa & wb) / max(len(wa), len(wb))

def search_and_scrape(name):
    """Search MyNeta for this MP and return their criminal data."""
    # Search URL — MyNeta's search uses a query param
    search_url = "https://myneta.info/ls2024/index.php"
    params = {
        "action": "show_candidates",
        "winner_filter": "w",
        "search_string": name,
    }
    try:
        resp = requests.get(search_url, params=params, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(resp.text, "html.parser")

        # Find candidate links on the results page
        links = soup.find_all("a", href=re.compile(r"candidate\.php\?cand_id=\d+"))

        if not links:
            # Try just last name
            last = name.split()[-1]
            params["search_string"] = last
            resp2 = requests.get(search_url, params=params, headers=HEADERS, timeout=15)
            soup2 = BeautifulSoup(resp2.text, "html.parser")
            links = soup2.find_all("a", href=re.compile(r"candidate\.php\?cand_id=\d+"))

        if not links:
            return None, "not_found"

        # Score each result
        best = None
        best_score = 0
        for link in links:
            cname = link.get_text(strip=True)
            score = match_score(name, cname)
            if score > best_score:
                best_score = score
                best = {"name": cname, "href": link["href"]}

        if not best or best_score < 0.35:
            return None, f"low_score({best_score:.2f})"

        # Scrape the candidate page
        cand_id = re.search(r"cand_id=(\d+)", best["href"]).group(1)
        cand_url = f"https://myneta.info/ls2024/candidate.php?cand_id={cand_id}"
        time.sleep(0.5)

        cr = requests.get(cand_url, headers=HEADERS, timeout=15)
        csoup = BeautifulSoup(cr.text, "html.parser")
        page_text = csoup.get_text()

        cases = []
        serious = 0
        serious_set = {"302","307","376","395","397","420","468","471","120B","121","124A","354","379"}

        for table in csoup.find_all("table"):
            t = table.get_text(" ").lower()
            if any(w in t for w in ["criminal","ipc","pending","case","court","offence"]):
                for row in table.find_all("tr"):
                    cells = [c.get_text(strip=True) for c in row.find_all(["td","th"])]
                    row_text = " | ".join(cells)
                    if len(row_text) < 6: continue
                    secs = re.findall(r'(?:u/s|IPC|Sec(?:tion)?\.?)\s*(\d+\w*)', row_text, re.I)
                    if not secs:
                        secs = re.findall(r'\b(\d{3}[A-Za-z]?)\b', row_text)
                    for s in secs:
                        if s in serious_set: serious += 1
                    if secs or any(k in row_text.lower() for k in ["pending","charge","court","ipc"]):
                        if any(ch.isdigit() for ch in row_text):
                            cases.append({"raw": row_text[:280], "sections": secs[:6]})

        no_case = any(p in page_text.lower() for p in ["no criminal case","nil","0 criminal","none"])
        has_record = len(cases) > 0 and not (no_case and len(cases) < 2)

        return {
            "total_cases": len(cases) if has_record else 0,
            "serious_cases": serious,
            "cases": cases[:10] if has_record else [],
            "has_criminal_record": has_record,
            "myneta_name": best["name"],
            "match_score": round(best_score, 2),
            "source_url": cand_url
        }, "ok"

    except Exception as e:
        return None, f"error: {e}"

def main():
    Path("data").mkdir(exist_ok=True)
    mp_names = get_mp_names()

    results = {}
    if OUTPUT_JSON.exists():
        try:
            with open(OUTPUT_JSON, encoding="utf-8") as f:
                results = json.load(f)
            print(f"Resuming — {len(results)} already done\n")
        except: pass

    done = criminal_count = not_found = 0

    for i, name in enumerate(mp_names):
        if name in results:
            done += 1
            continue

        print(f"[{i+1:3d}/{len(mp_names)}] {name}", end=" ", flush=True)

        data, status = search_and_scrape(name)

        if data:
            results[name] = data
            if data["has_criminal_record"]:
                criminal_count += 1
                print(f"→ {data['myneta_name']} | ⚠ {data['total_cases']} cases (serious={data['serious_cases']})")
            else:
                print(f"→ {data['myneta_name']} | ✓ Clean")
        else:
            not_found += 1
            print(f"→ ✗ {status}")
            results[name] = {
                "total_cases": 0, "serious_cases": 0,
                "cases": [], "has_criminal_record": False, "not_found": True
            }

        done += 1
        time.sleep(DELAY)

        if done % 10 == 0:
            with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
                json.dump(results, f, ensure_ascii=False, indent=2)
            print(f"\n  💾 {done} done | {criminal_count} with cases | {not_found} not found\n")

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Done!
   Processed : {len(results)}
   With cases: {criminal_count}
   Not found : {not_found}
   File      : {OUTPUT_JSON}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
""")

if __name__ == "__main__":
    main()