"""
fetch_mp_photos.py  (v3 - FIXED)
─────────────────────────────────
The previous version failed because Wikipedia's search doesn't match
Indian MP names well. This version uses 3 strategies:

Strategy 1: Wikipedia REST API (better than action API for search)
Strategy 2: Wikimedia Commons direct search  
Strategy 3: Try common name variations (remove initials, reorder)

Run with Flask running:
    python fetch_mp_photos.py

Saves: frontend/public/mp_photos.json
"""

import json, time, re, requests

FLASK_BASE  = "http://localhost:5000/api/rankings/national"
OUTPUT_FILE = "frontend/public/mp_photos.json"
WIKI_API    = "https://en.wikipedia.org/w/api.php"
DELAY       = 0.2

session = requests.Session()
session.headers.update({
    "User-Agent": "LokDrishti/1.0 (civic-data-project; contact@lokdrishti.in)"
})

def clean_name_variants(name: str) -> list:
    """Generate multiple search variants for an Indian MP name."""
    variants = []
    name = name.strip()
    
    # Original name
    variants.append(name)
    
    # Remove single-letter initials at start (e.g. "P P Chaudhary" -> "Chaudhary")
    words = name.split()
    
    # If starts with initials (1-2 char words), try without them
    non_initial_words = [w for w in words if len(w) > 2]
    if non_initial_words and len(non_initial_words) < len(words):
        variants.append(" ".join(non_initial_words))
    
    # Last name first (common Indian name format)
    if len(words) >= 2:
        variants.append(f"{words[-1]} {' '.join(words[:-1])}")
    
    # With "politician" suffix
    variants.append(f"{name} politician")
    variants.append(f"{name} Indian politician")
    variants.append(f"{name} Lok Sabha")
    
    # Remove duplicates while preserving order
    seen = set()
    unique = []
    for v in variants:
        if v not in seen:
            seen.add(v)
            unique.append(v)
    return unique

def search_wikipedia_rest(query: str) -> str | None:
    """Use Wikipedia REST API - better for fuzzy name matching."""
    try:
        url = f"https://en.wikipedia.org/w/rest.php/v1/search/page"
        r = session.get(url, params={"q": query, "limit": 3}, timeout=8)
        if r.status_code != 200:
            return None
        pages = r.json().get("pages", [])
        for page in pages:
            # Check if this page has a thumbnail
            thumb = page.get("thumbnail", {})
            if thumb and thumb.get("url"):
                url_str = thumb["url"]
                # Make sure it's a person photo (not a logo/map)
                if not any(x in url_str.lower() for x in ["logo", "map", "flag", "coat", "seal", "symbol"]):
                    # Get higher resolution
                    url_str = re.sub(r'/\d+px-', '/300px-', url_str)
                    if not url_str.startswith("http"):
                        url_str = "https:" + url_str
                    return url_str
    except Exception as e:
        pass
    return None

def search_wikipedia_action(query: str) -> str | None:
    """Use Wikipedia action API with pageimages."""
    try:
        # Step 1: Search
        sr = session.get(WIKI_API, params={
            "action": "query", "list": "search",
            "srsearch": query, "srlimit": 3, "format": "json"
        }, timeout=8).json()
        
        results = sr.get("query", {}).get("search", [])
        if not results:
            return None
        
        # Try top 2 results
        for result in results[:2]:
            title = result["title"]
            # Skip disambiguation pages
            if "disambiguation" in title.lower():
                continue
                
            ir = session.get(WIKI_API, params={
                "action": "query", "titles": title,
                "prop": "pageimages|categories",
                "pithumbsize": 300, "format": "json",
                "clcategories": "Category:Indian_politicians"
            }, timeout=8).json()
            
            for page in ir.get("query", {}).get("pages", {}).values():
                if page.get("ns", 0) != 0:
                    continue
                thumb = page.get("thumbnail", {}).get("source", "")
                if thumb and not any(x in thumb.lower() for x in ["logo", "map", "flag", "coat"]):
                    return thumb
    except:
        pass
    return None

def get_photo(name: str) -> str | None:
    """Try all strategies to get a Wikipedia photo."""
    variants = clean_name_variants(name)
    
    # Strategy 1: Wikipedia REST API (faster, better fuzzy match)
    for variant in variants[:3]:
        result = search_wikipedia_rest(variant)
        if result:
            return result
        time.sleep(0.05)
    
    # Strategy 2: Wikipedia action API
    for variant in variants[:4]:
        result = search_wikipedia_action(variant)
        if result:
            return result
        time.sleep(0.1)
    
    return None

def fetch_all_mps() -> list:
    print("📡 Fetching all MPs from Flask API...")
    all_mps = []
    page = 1
    while True:
        try:
            r = session.get(f"{FLASK_BASE}?page={page}&page_size=100", timeout=10)
            r.raise_for_status()
            data = r.json()
            batch = data.get("data", [])
            if not batch:
                break
            all_mps.extend(batch)
            total = data.get("total", 0)
            print(f"  Page {page}: {len(batch)} MPs (total: {len(all_mps)}/{total})")
            if len(all_mps) >= total:
                break
            page += 1
        except Exception as e:
            print(f"❌ Error on page {page}: {e}")
            break
    return all_mps

def main():
    mps = fetch_all_mps()
    if not mps:
        print("❌ No MPs. Is Flask running on port 5000?")
        return

    print(f"\n✅ {len(mps)} MPs loaded.\n")
    print("Testing connection to Wikipedia...")
    test = search_wikipedia_rest("Narendra Modi Indian politician")
    if test:
        print(f"✅ Wikipedia connection OK: {test[:60]}...\n")
    else:
        test2 = search_wikipedia_action("Narendra Modi")
        if test2:
            print(f"✅ Wikipedia action API OK: {test2[:60]}...\n")
        else:
            print("⚠️  Wikipedia not reachable. Check internet connection.\n")

    results = {}
    found = missing = 0

    for i, mp in enumerate(mps):
        name = mp.get("name", "").strip()
        if not name:
            continue

        print(f"[{i+1:3}/{len(mps)}] {name:<44}", end="", flush=True)
        url = get_photo(name)
        
        if url:
            results[name] = url
            found += 1
            print(f"✅")
        else:
            missing += 1
            print(f"—")

        # Save progress every 50 MPs
        if (i + 1) % 50 == 0:
            with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
                json.dump(results, f, ensure_ascii=False, indent=2)
            print(f"    💾 Progress saved ({found} found so far)")

        time.sleep(DELAY)

    # Final save
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\n{'─'*60}")
    print(f"✅ {found} photos found")
    print(f"✗  {missing} not found")
    print(f"📁 Saved → {OUTPUT_FILE}")
    print(f"\nNow restart Next.js (Ctrl+C then npm run dev) and photos will show!")

if __name__ == "__main__":
    main()