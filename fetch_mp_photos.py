"""
fetch_mp_photos.py  (v2 — fixed to fetch ALL 544 MPs)
──────────────────────────────────────────────────────
Run from project root with Flask running:
    python fetch_mp_photos.py

Saves: frontend/public/mp_photos.json
"""

import json, time, requests

FLASK_BASE  = "http://localhost:5000/api/rankings/national"
OUTPUT_FILE = "frontend/public/mp_photos.json"
WIKI_API    = "https://en.wikipedia.org/w/api.php"
THUMB_WIDTH = 240
DELAY       = 0.12   # seconds between wiki calls

def get_wiki_photo(name: str):
    queries = [
        name,
        name + " Indian politician",
        name + " Member of Parliament India",
        name + " Lok Sabha",
    ]
    for query in queries:
        try:
            # Search for page
            sr = requests.get(WIKI_API, params={
                "action":"query","list":"search","srsearch":query,
                "srlimit":1,"format":"json"
            }, timeout=8).json()
            results = sr.get("query",{}).get("search",[])
            if not results:
                continue
            title = results[0]["title"]
            # Get thumbnail
            ir = requests.get(WIKI_API, params={
                "action":"query","titles":title,"prop":"pageimages",
                "pithumbsize":THUMB_WIDTH,"format":"json"
            }, timeout=8).json()
            for page in ir.get("query",{}).get("pages",{}).values():
                thumb = page.get("thumbnail",{}).get("source")
                if thumb:
                    return thumb
        except:
            continue
    return None

def fetch_all_mps():
    """Fetch all MPs across all pages from Flask API."""
    print("📡 Fetching all MPs from Flask API...")
    all_mps = []
    page = 1
    while True:
        try:
            url = f"{FLASK_BASE}?page={page}&page_size=100"
            r = requests.get(url, timeout=10)
            r.raise_for_status()
            data = r.json()
            batch = data.get("data", [])
            if not batch:
                break
            all_mps.extend(batch)
            total = data.get("total", 0)
            print(f"  Page {page}: got {len(batch)} MPs (total so far: {len(all_mps)} / {total})")
            if len(all_mps) >= total:
                break
            page += 1
        except Exception as e:
            print(f"❌ Error fetching page {page}: {e}")
            break
    return all_mps

def main():
    mps = fetch_all_mps()
    if not mps:
        print("❌ No MPs found. Is Flask running?")
        return
    print(f"\n✅ {len(mps)} MPs loaded. Starting Wikipedia photo search...\n")

    results = {}
    found = missing = 0

    for i, mp in enumerate(mps):
        name = mp.get("name","").strip()
        if not name:
            continue
        print(f"[{i+1:3}/{len(mps)}] {name:<42}", end="", flush=True)
        url = get_wiki_photo(name)
        if url:
            results[name] = url
            found += 1
            print(f"✅")
        else:
            missing += 1
            print(f"—")
        time.sleep(DELAY)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\n{'─'*55}")
    print(f"✅ {found} photos found   ✗ {missing} not found")
    print(f"📁 Saved → {OUTPUT_FILE}")
    print(f"\nRestart Next.js dev server and photos will appear!")

if __name__ == "__main__":
    main()