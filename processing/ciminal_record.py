import requests
from bs4 import BeautifulSoup
import sqlite3
import json
import re
import time

DB_PATH = "processing/lokdrishti.db"
OUTPUT_FILE = "data/criminal_records.json"
BASE = "https://myneta.info/LokSabha2024"

HEADERS = {
    "User-Agent": "Mozilla/5.0"
}

SERIOUS_IPC = {
    "302","307","376","395","397","364","364A",
    "120B","121","124A","468","420","354","379"
}

# --------------------------------------------------
# LOAD MP NAMES FROM DATABASE
# --------------------------------------------------

def get_mp_names():

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute("SELECT DISTINCT name FROM mp_performance")

    names = [r[0] for r in cur.fetchall()]

    conn.close()

    return names


# --------------------------------------------------
# FIND CANDIDATE ID FROM MYNETA SEARCH
# --------------------------------------------------

def find_candidate_id(name):

    url = f"{BASE}/index.php"

    params = {
        "action":"show_candidates",
        "winner_filter":"w",
        "search_string":name
    }

    r = requests.get(url,params=params,headers=HEADERS)

    soup = BeautifulSoup(r.text,"html.parser")

    link = soup.find("a",href=re.compile("candidate_id="))

    if not link:
        return None

    m = re.search(r'candidate_id=(\d+)',link["href"])

    if m:
        return m.group(1)

    return None


# --------------------------------------------------
# SCRAPE CRIMINAL DATA
# --------------------------------------------------

def scrape_candidate(candidate_id):

    url = f"{BASE}/candidate.php?candidate_id={candidate_id}"

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

    # --------------------------------------------------
    # IPC SUMMARY
    # --------------------------------------------------

    ipc_heading = soup.find("h4",string=re.compile("IPC",re.I))

    if ipc_heading:

        ul_lists = ipc_heading.find_all_next("ul",limit=2)

        for ul in ul_lists:

            for li in ul.find_all("li"):

                txt = li.get_text(" ",strip=True)

                badge = li.find("span")

                count = 1

                if badge:
                    try:
                        count = int(badge.get_text(strip=True))
                    except:
                        pass

                m = re.search(r'IPC Section[-– ](\d+[A-Z]?)',txt)

                section = None

                if m:
                    section = m.group(1)

                data["ipc_summary"].append({
                    "description":txt,
                    "ipc_section":section,
                    "count":count,
                    "is_serious":section in SERIOUS_IPC if section else False
                })

    # --------------------------------------------------
    # CASE TABLES
    # --------------------------------------------------

    tables = soup.find_all("table",id="cases")

    pending_table = tables[0] if len(tables) > 0 else None
    convicted_table = tables[1] if len(tables) > 1 else None

    # --------------------------------------------------
    # PENDING CASES
    # --------------------------------------------------

    if pending_table:

        rows = pending_table.find_all("tr")[1:]

        for row in rows:

            cells = [td.get_text(strip=True) for td in row.find_all("td")]

            if len(cells) < 5:
                continue

            ipc = cells[4]

            sections = re.findall(r'\b\d{3}[A-Z]?\b',ipc)

            if any(sec in SERIOUS_IPC for sec in sections):
                data["serious_cases"] += 1

            data["pending_cases"].append({
                "serial":cells[0],
                "fir_no":cells[1],
                "case_no":cells[2],
                "court":cells[3],
                "ipc_sections":ipc,
                "other_sections":cells[5] if len(cells) > 5 else "",
                "charges_framed":cells[6] if len(cells) > 6 else "",
                "date_framed":cells[7] if len(cells) > 7 else "",
                "appeal_filed":cells[8] if len(cells) > 8 else "",
                "appeal_status":cells[9] if len(cells) > 9 else ""
            })

    # --------------------------------------------------
    # CONVICTED CASES
    # --------------------------------------------------

    if convicted_table:

        rows = convicted_table.find_all("tr")[1:]

        for row in rows:

            cells = [td.get_text(strip=True) for td in row.find_all("td")]

            if len(cells) < 4:
                continue

            data["convicted_cases"].append({
                "serial":cells[0],
                "case_no":cells[1],
                "court":cells[2],
                "ipc_sections":cells[3],
                "other_sections":cells[4] if len(cells) > 4 else "",
                "punishment":cells[5] if len(cells) > 5 else "",
                "date_convicted":cells[6] if len(cells) > 6 else "",
                "appeal_filed":cells[7] if len(cells) > 7 else "",
                "appeal_status":cells[8] if len(cells) > 8 else ""
            })

    return data


# --------------------------------------------------
# MAIN
# --------------------------------------------------

def main():

    mp_names = get_mp_names()

    results = {}

    print("Loaded MPs:",len(mp_names))

    for i,name in enumerate(mp_names):

        print(f"[{i+1}/{len(mp_names)}] {name}")

        cid = find_candidate_id(name)

        if not cid:

            results[name] = {
                "total_cases":0,
                "serious_cases":0,
                "ipc_summary":[],
                "pending_cases":[],
                "convicted_cases":[],
                "source_url":None
            }

            continue

        data = scrape_candidate(cid)

        results[name] = data

        time.sleep(1)

    with open(OUTPUT_FILE,"w",encoding="utf-8") as f:

        json.dump(results,f,indent=2,ensure_ascii=False)

    print("Saved to:",OUTPUT_FILE)


if __name__ == "__main__":
    main()