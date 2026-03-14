import requests
from bs4 import BeautifulSoup
import json
import re
import time

BASE = "https://myneta.info/LokSabha2024"

HEADERS = {
    "User-Agent": "Mozilla/5.0"
}

SERIOUS_IPC = {
    "302","307","376","395","397","364","364A",
    "120B","121","124A","468","420","354","379"
}


def get_all_candidates():
    url = f"{BASE}/index.php?action=show_winners"
    r = requests.get(url, headers=HEADERS)
    soup = BeautifulSoup(r.text, "html.parser")

    candidates = {}

    for link in soup.find_all("a", href=re.compile("candidate_id=")):
        name = link.get_text(strip=True)
        m = re.search(r'candidate_id=(\d+)', link["href"])
        if not m:
            continue

        cid = m.group(1)

        if cid not in candidates:
            candidates[cid] = {
                "name": name,
                "candidate_id": cid
            }

    print("Candidates:", len(candidates))
    return list(candidates.values())


def scrape_candidate(candidate):

    cid = candidate["candidate_id"]
    name = candidate["name"]

    url = f"{BASE}/candidate.php?candidate_id={cid}"

    r = requests.get(url, headers=HEADERS)
    soup = BeautifulSoup(r.text, "html.parser")

    data = {
        "name": name,
        "total_cases": 0,
        "serious_cases": 0,
        "ipc_summary": [],
        "pending_cases": [],
        "convicted_cases": [],
        "source_url": url
    }

    text = soup.get_text(" ", strip=True)

    m = re.search(r'Number of Criminal Cases\s*:\s*(\d+)', text)
    if m:
        data["total_cases"] = int(m.group(1))

    ipc_heading = soup.find(string=re.compile("Brief Details of IPC", re.I))

    if ipc_heading:
        ul = ipc_heading.find_parent().find_next("ul")
        if ul:
            for li in ul.find_all("li"):

                txt = li.get_text(" ", strip=True)

                badge = li.find("span")
                count = 1
                if badge:
                    try:
                        count = int(badge.get_text(strip=True))
                    except:
                        pass

                m = re.search(r'IPC Section[-– ](\d+[A-Z]?)', txt)
                section = m.group(1) if m else None

                data["ipc_summary"].append({
                    "description": txt,
                    "ipc_section": section,
                    "count": count,
                    "is_serious": section in SERIOUS_IPC if section else False
                })

    tables = soup.find_all("table", id="cases")

    if tables:

        rows = tables[0].find_all("tr")[1:]

        for row in rows:

            cells = [td.get_text(strip=True) for td in row.find_all("td")]

            if len(cells) < 5:
                continue

            ipc = cells[4]

            sections = re.findall(r'\b\d{3}[A-Z]?\b', ipc)

            if any(sec in SERIOUS_IPC for sec in sections):
                data["serious_cases"] += 1

            data["pending_cases"].append({
                "serial": cells[0],
                "fir_no": cells[1],
                "case_no": cells[2],
                "court": cells[3],
                "ipc_sections": ipc
            })

    if len(tables) > 1:

        rows = tables[1].find_all("tr")[1:]

        for row in rows:

            cells = [td.get_text(strip=True) for td in row.find_all("td")]

            if len(cells) < 4:
                continue

            data["convicted_cases"].append({
                "serial": cells[0],
                "case_no": cells[1],
                "court": cells[2],
                "ipc_sections": cells[3]
            })

    return data


def main():

    candidates = get_all_candidates()

    results = {}

    total = len(candidates)

    for i, candidate in enumerate(candidates):

        print(f"[{i+1}/{total}] {candidate['name']}")

        try:
            data = scrape_candidate(candidate)
            results[candidate["name"]] = data
        except:
            results[candidate["name"]] = {
                "name": candidate["name"],
                "total_cases": 0,
                "serious_cases": 0,
                "ipc_summary": [],
                "pending_cases": [],
                "convicted_cases": [],
                "source_url": None
            }

        time.sleep(0.5)

    with open("data/criminal_records.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print("Saved → data/criminal_records.json")


if __name__ == "__main__":
    main()