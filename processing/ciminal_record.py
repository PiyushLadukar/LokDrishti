import requests
from bs4 import BeautifulSoup
import sqlite3
import json
import re
import time
from difflib import SequenceMatcher

BASE = "https://myneta.info/LokSabha2024"
DB_PATH = "processing/lokdrishti.db"

HEADERS = {
    "User-Agent": "Mozilla/5.0"
}

SERIOUS_IPC = {
    "302","307","376","395","397","364","364A",
    "120B","121","124A","468","420","354","379"
}


# -------------------------------
# LOAD MPs FROM DATABASE
# -------------------------------

def get_mp_names():

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute("SELECT DISTINCT name FROM mp_performance")

    names = [r[0] for r in cur.fetchall()]

    conn.close()

    return names


# -------------------------------
# GET ALL CANDIDATES
# -------------------------------

def get_all_candidates():

    print("Downloading candidate list...")

    url = f"{BASE}/index.php?action=show_winners"

    r = requests.get(url,headers=HEADERS)

    soup = BeautifulSoup(r.text,"html.parser")

    candidates = []

    for link in soup.find_all("a",href=re.compile("candidate_id=")):

        name = link.get_text(strip=True)

        m = re.search(r'candidate_id=(\d+)',link["href"])

        if not m:
            continue

        candidates.append({
            "name":name,
            "candidate_id":m.group(1)
        })

    print("Candidates scraped:",len(candidates))

    return candidates


# -------------------------------
# FUZZY MATCH
# -------------------------------

def match_name(mp_name,candidates):

    best = None
    best_score = 0

    for c in candidates:

        score = SequenceMatcher(None,mp_name.lower(),c["name"].lower()).ratio()

        if score > best_score:
            best_score = score
            best = c

    if best_score > 0.55:
        return best

    return None


# -------------------------------
# SCRAPE CRIMINAL DATA
# -------------------------------

def scrape_candidate(cid):

    url = f"{BASE}/candidate.php?candidate_id={cid}"

    r = requests.get(url,headers=HEADERS)

    soup = BeautifulSoup(r.text,"html.parser")

    data = {
        "total_cases":0,
        "serious_cases":0,
        "ipc_summary":[],
        "pending_cases":[],
        "convicted_cases":[],
        "source_url":url
    }

    text = soup.get_text(" ",strip=True)

    m = re.search(r'Number of Criminal Cases\s*:\s*(\d+)',text)

    if m:
        data["total_cases"] = int(m.group(1))

    tables = soup.find_all("table",id="cases")

    if tables:

        rows = tables[0].find_all("tr")[1:]

        for row in rows:

            cells = [td.get_text(strip=True) for td in row.find_all("td")]

            if len(cells) < 5:
                continue

            ipc = cells[4]

            sections = re.findall(r'\b\d{3}[A-Z]?\b',ipc)

            if any(sec in SERIOUS_IPC for sec in sections):
                data["serious_cases"] += 1

            data["pending_cases"].append({
                "case_no":cells[2],
                "court":cells[3],
                "ipc_sections":ipc
            })

    if len(tables) > 1:

        rows = tables[1].find_all("tr")[1:]

        for row in rows:

            cells = [td.get_text(strip=True) for td in row.find_all("td")]

            if len(cells) < 4:
                continue

            data["convicted_cases"].append({
                "case_no":cells[1],
                "court":cells[2],
                "ipc_sections":cells[3]
            })

    return data


# -------------------------------
# MAIN
# -------------------------------

def main():

    mp_names = get_mp_names()

    candidates = get_all_candidates()

    results = {}

    print("Matching MPs...")

    for i,name in enumerate(mp_names):

        print(f"[{i+1}/{len(mp_names)}] {name}")

        match = match_name(name,candidates)

        if not match:

            results[name] = {
                "total_cases":0,
                "serious_cases":0,
                "ipc_summary":[],
                "pending_cases":[],
                "convicted_cases":[],
                "source_url":None
            }

            continue

        data = scrape_candidate(match["candidate_id"])

        results[name] = data

        time.sleep(0.5)

    with open("data/criminal_records.json","w",encoding="utf-8") as f:

        json.dump(results,f,indent=2,ensure_ascii=False)

    print("Saved to data/criminal_records.json")


if __name__ == "__main__":
    main()