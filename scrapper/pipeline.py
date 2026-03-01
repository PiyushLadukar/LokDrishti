import requests
import re
import pandas as pd
import time
from bs4 import BeautifulSoup

BASE_URL = "https://prsindia.org"
headers = {"User-Agent": "Mozilla/5.0"}

session = requests.Session()
session.headers.update(headers)


def get_all_mp_data():
    all_data = []
    seen_profiles = set()
    page = 1
    MAX_PAGES = 80

    while page <= MAX_PAGES:
        print(f"Fetching page {page}")

        url = f"https://prsindia.org/mptrack?slug1=18th-lok-sabha&page={page}&per-page=9&parliament=Lok+Sabha&MpTrackSearch%5Bloc_sabha%5D=18th_lok_sabha"

        response = session.get(url, timeout=10)
        soup = BeautifulSoup(response.text, "html.parser")

        cards = soup.select("div.views-row")

        if not cards:
            break

        for card in cards:

            name_tag = card.select_one("h3 a")
            if not name_tag:
                continue

            name = name_tag.text.strip()
            profile_url = BASE_URL + name_tag["href"]

            if profile_url in seen_profiles:
                continue

            seen_profiles.add(profile_url)

            # -------------------------
            # Extract from LIST PAGE
            # -------------------------
            state = "N/A"
            constituency = "N/A"
            party = "N/A"

            text_lines = list(card.stripped_strings)

            # Structure is:
            # [Name, State, Constituency, Age, PartyLabel]

            if len(text_lines) >= 4:
                state = text_lines[1]
                constituency = text_lines[2]
                party = text_lines[-1]

            # -------------------------
            # Extract from PROFILE PAGE
            # -------------------------
            attendance = debates = questions = "0"

            profile_response = session.get(profile_url, timeout=10)
            profile_html = profile_response.text

            chart_blocks = re.findall(
                r'arrayToDataTable\((.*?)\);',
                profile_html,
                re.S
            )

            def extract(block):
                m = re.search(r'\["",\s*([\d.]+)', block)
                return m.group(1) if m else "0"

            if len(chart_blocks) >= 3:
                attendance = extract(chart_blocks[0])
                debates = extract(chart_blocks[1])
                questions = extract(chart_blocks[2])

            print("Scraped:", name)

            all_data.append({
                "name": name,
                "state": state,
                "party": party,
                "constituency": constituency,
                "attendance": attendance,
                "debates": debates,
                "questions": questions
            })

            time.sleep(0.2)

        page += 1

    return all_data


if __name__ == "__main__":

    print("🚀 Starting LokDrishti Full Pipeline...")

    data = get_all_mp_data()

    print("Total MPs scraped:", len(data))

    df = pd.DataFrame(data)

    df = df[
        ["name", "state", "party", "constituency",
         "attendance", "debates", "questions"]
    ]

    df.to_csv("mp_data.csv", index=False)

    print("✅ mp_data.csv saved successfully.")