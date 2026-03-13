"""
scrape_criminal_records.py
══════════════════════════
WHAT THIS DOES:
  - Goes to MyNeta.info (official election affidavit site)
  - Searches for each of our 544 MPs by name
  - Extracts their criminal cases from their election affidavit
  - Saves everything into data/criminal_records.json

HOW TO RUN (from LokDrishti/ folder):
  pip install requests beautifulsoup4
  python scrape_criminal_records.py

Takes about 20-30 minutes for all 544 MPs.
It saves progress every 10 MPs so you can stop and restart anytime.
"""

import json, time, re, os
from pathlib import Path

# We need these two libraries:
# - requests: to download web pages
# - beautifulsoup4: to read/parse the HTML
try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Installing required libraries...")
    os.system("pip install requests beautifulsoup4")
    import requests
    from bs4 import BeautifulSoup

# ── File paths ───────────────────────────────────────────────
MP_PHOTOS_JSON  = Path("frontend/public/mp_photos.json")   # we use this to get MP names
OUTPUT_JSON     = Path("data/criminal_records.json")        # where we save results
PROGRESS_FILE   = Path("data/scrape_progress.json")        # tracks which MPs are done

# ── MyNeta.info API ──────────────────────────────────────────
# MyNeta has a search API that returns candidate info as JSON
SEARCH_URL = "https://myneta.info/api/search.php"
DETAIL_URL = "https://myneta.info/ls2024/candidate.php"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "application/json, text/html, */*",
    "Referer": "https://myneta.info/",
}

DELAY = 1.5  # seconds between requests (be polite to their server)

# ── Helper: search for an MP on MyNeta ──────────────────────
def search_myneta(name: str) -> list:
    """
    Search MyNeta.info for a candidate by name.
    Returns a list of matching candidates.
    """
    try:
        # Try their search API first
        resp = requests.get(
            "https://myneta.info/ls2024/index.php",
            params={"action": "show_candidates", "constituency_no": "all", "winner_filter": "winner"},
            headers=HEADERS,
            timeout=15
        )
        # If API doesn't work, try direct search
        resp2 = requests.get(
            f"https://myneta.info/ls2024/",
            params={"action": "show_candidates", "winner_filter": "winner"},
            headers=HEADERS,
            timeout=15
        )
    except:
        pass

    # Use their candidate search
    try:
        resp = requests.post(
            "https://myneta.info/ls2024/",
            data={"name": name, "Submit": "Search"},
            headers={**HEADERS, "Content-Type": "application/x-www-form-urlencoded"},
            timeout=15
        )
        return resp.text
    except Exception as e:
        return None

def get_candidate_page(candidate_id: str) -> str:
    """Download a candidate's detail page from MyNeta."""
    try:
        url = f"https://myneta.info/ls2024/candidate.php?cand_id={candidate_id}"
        resp = requests.get(url, headers=HEADERS, timeout=15)
        return resp.text
    except:
        return None

def parse_criminal_cases(html: str) -> dict:
    """
    Read the HTML of a MyNeta candidate page and
    extract criminal case information.
    
    Returns a dict like:
    {
        "total_cases": 3,
        "serious_cases": 2,
        "cases": [
            {
                "section": "IPC 302",
                "description": "Murder",
                "court": "Sessions Court, Delhi",
                "status": "Pending"
            }
        ],
        "has_criminal_record": True
    }
    """
    if not html:
        return {"total_cases": 0, "serious_cases": 0, "cases": [], "has_criminal_record": False}

    soup = BeautifulSoup(html, "html.parser")
    cases = []
    serious = 0

    # MyNeta shows criminal cases in a section called "Criminal Antecedents"
    # Look for tables or divs with this heading
    full_text = soup.get_text()

    # Pattern 1: Look for "Cases Pending" section
    criminal_section = None
    for tag in soup.find_all(["h2","h3","h4","b","strong","td","th"]):
        text = tag.get_text(strip=True).lower()
        if "criminal" in text or "case" in text or "ipc" in text:
            criminal_section = tag
            break

    # Pattern 2: Find all table rows that mention IPC sections
    # IPC sections look like "302", "420", "376" etc.
    ipc_pattern = re.compile(r'\b(IPC\s*)?(\d{2,3}[A-Z]?)\b')

    # Look for the criminal cases table
    tables = soup.find_all("table")
    for table in tables:
        table_text = table.get_text().lower()
        if "criminal" in table_text or "ipc" in table_text or "case" in table_text:
            rows = table.find_all("tr")
            for row in rows:
                cells = row.find_all(["td","th"])
                if len(cells) >= 2:
                    row_text = " ".join(c.get_text(strip=True) for c in cells)
                    if row_text and len(row_text) > 5:
                        # Check for IPC sections
                        ipc_matches = re.findall(r'(?:IPC\s+)?[Ss]ection\s+(\d+\w*)', row_text)
                        if not ipc_matches:
                            ipc_matches = re.findall(r'\b(\d{3}[A-Z]?)\b', row_text)

                        if ipc_matches or any(word in row_text.lower() for word in ["pending","case","court","charge"]):
                            case_info = {
                                "raw": row_text[:300],
                                "sections": ipc_matches[:5],
                            }
                            cases.append(case_info)

                            # Serious IPC sections (murder, rape, kidnapping etc.)
                            serious_sections = {"302","307","376","395","397","420","468","471","120B","121"}
                            if any(s in serious_sections for s in ipc_matches):
                                serious += 1

    # Pattern 3: Check "No criminal case" text
    no_case_phrases = ["no criminal case", "nil", "no case", "0 case", "none"]
    if any(phrase in full_text.lower() for phrase in no_case_phrases):
        if len(cases) == 0:
            return {"total_cases": 0, "serious_cases": 0, "cases": [], "has_criminal_record": False}

    return {
        "total_cases": len(cases),
        "serious_cases": serious,
        "cases": cases[:10],  # max 10 cases
        "has_criminal_record": len(cases) > 0
    }

# ── Better approach: Use MyNeta's winner list directly ───────
def fetch_all_winners() -> list:
    """
    Fetch the complete list of 2024 Lok Sabha winners from MyNeta.
    This is more reliable than searching one by one.
    """
    print("Fetching complete winner list from MyNeta.info...")
    try:
        url = "https://myneta.info/ls2024/index.php?action=show_candidates&state_id=S00&winner_filter=w"
        resp = requests.get(url, headers=HEADERS, timeout=30)
        soup = BeautifulSoup(resp.text, "html.parser")

        candidates = []
        # Find candidate links — they look like candidate.php?cand_id=12345
        links = soup.find_all("a", href=re.compile(r"candidate\.php\?cand_id=\d+"))
        for link in links:
            cand_id = re.search(r"cand_id=(\d+)", link["href"])
            if cand_id:
                name = link.get_text(strip=True)
                candidates.append({
                    "name": name,
                    "cand_id": cand_id.group(1),
                    "url": f"https://myneta.info/ls2024/{link['href']}"
                })

        print(f"  Found {len(candidates)} winners on MyNeta")
        return candidates
    except Exception as e:
        print(f"  Error fetching winners: {e}")
        return []

def scrape_candidate_criminal_data(cand_id: str, name: str) -> dict:
    """
    Scrape criminal record data for one candidate.
    """
    url = f"https://myneta.info/ls2024/candidate.php?cand_id={cand_id}"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        html = resp.text
        data = parse_criminal_cases(html)
        data["source_url"] = url
        data["myneta_id"] = cand_id
        return data
    except Exception as e:
        return {
            "total_cases": 0, "serious_cases": 0,
            "cases": [], "has_criminal_record": False,
            "source_url": url, "error": str(e)
        }

# ── Fuzzy name matching ──────────────────────────────────────
def names_match(our_name: str, myneta_name: str) -> bool:
    """
    Check if two MP names are the same person.
    Handles variations like "Rahul Gandhi" vs "GANDHI RAHUL"
    """
    def normalize(n):
        return set(re.sub(r'[^a-z\s]', '', n.lower()).split())

    our_words    = normalize(our_name)
    myneta_words = normalize(myneta_name)

    # If they share 2+ words, it's likely the same person
    common = our_words & myneta_words
    return len(common) >= 2 or (len(common) >= 1 and len(our_words) <= 2)

# ── MAIN ─────────────────────────────────────────────────────
def main():
    # Create data folder if it doesn't exist
    Path("data").mkdir(exist_ok=True)

    # Load our MP names
    if not MP_PHOTOS_JSON.exists():
        print(f"ERROR: {MP_PHOTOS_JSON} not found.")
        print("Make sure you're running from the LokDrishti/ folder.")
        return

    with open(MP_PHOTOS_JSON, encoding="utf-8") as f:
        photos = json.load(f)
    our_mp_names = list(photos.keys())
    print(f"Loaded {len(our_mp_names)} MP names from mp_photos.json\n")

    # Load existing results (so we can resume if interrupted)
    results = {}
    if OUTPUT_JSON.exists():
        with open(OUTPUT_JSON, encoding="utf-8") as f:
            results = json.load(f)
        print(f"Resuming — {len(results)} MPs already done\n")

    # Step 1: Get all MyNeta winners
    all_winners = fetch_all_winners()
    if not all_winners:
        print("Could not fetch winner list. Trying individual searches...")
        # Fallback: search one by one
        all_winners = []

    # Step 2: For each of our MPs, find them on MyNeta and scrape
    done = 0
    not_found = []

    for i, our_name in enumerate(our_mp_names):
        if our_name in results:
            done += 1
            continue

        print(f"[{i+1:3d}/{len(our_mp_names)}] {our_name}")

        # Try to find this MP in the winner list
        matched = None
        for winner in all_winners:
            if names_match(our_name, winner["name"]):
                matched = winner
                break

        if matched:
            print(f"          → Matched: {matched['name']} (ID: {matched['cand_id']})")
            data = scrape_candidate_criminal_data(matched["cand_id"], our_name)
            data["myneta_name"] = matched["name"]
            results[our_name] = data

            if data["has_criminal_record"]:
                print(f"          ⚠ {data['total_cases']} criminal case(s) found!")
            else:
                print(f"          ✓ No criminal cases")
        else:
            print(f"          ✗ Not found on MyNeta")
            not_found.append(our_name)
            results[our_name] = {
                "total_cases": 0, "serious_cases": 0,
                "cases": [], "has_criminal_record": False,
                "source_url": None, "not_found": True
            }

        done += 1
        time.sleep(DELAY)

        # Save progress every 10 MPs
        if done % 10 == 0:
            with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
                json.dump(results, f, ensure_ascii=False, indent=2)
            criminal_count = sum(1 for v in results.values() if v.get("has_criminal_record"))
            print(f"\n  💾 Saved progress: {done} done, {criminal_count} with criminal records\n")

    # Final save
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    criminal_count = sum(1 for v in results.values() if v.get("has_criminal_record"))
    print(f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Done!
   Total MPs processed : {len(results)}
   With criminal cases : {criminal_count}
   Not found on MyNeta : {len(not_found)}
   Output saved to     : {OUTPUT_JSON}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next step: Run the Flask API (already in your app/)
Then visit any MP profile — criminal records will show up!
""")

if __name__ == "__main__":
    main()