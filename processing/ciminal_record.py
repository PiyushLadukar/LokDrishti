import requests
from bs4 import BeautifulSoup
import json
import time

base_url = "https://myneta.info/LokSabha2024/candidate.php?candidate_id="

records = []

for candidate_id in range(1, 800):  # loop over possible IDs

    url = base_url + str(candidate_id)

    try:
        res = requests.get(url)
        soup = BeautifulSoup(res.text, "html.parser")

        name_tag = soup.find("h2")
        if not name_tag:
            continue

        name = name_tag.text.strip()

        criminal_cases = 0
        serious_cases = 0

        rows = soup.find_all("tr")

        for row in rows:

            text = row.text.lower()

            if "criminal cases" in text:
                criminal_cases = row.find_all("td")[1].text.strip()

            if "serious criminal cases" in text:
                serious_cases = row.find_all("td")[1].text.strip()

        records.append({
            "name": name,
            "criminal_cases": criminal_cases,
            "serious_cases": serious_cases
        })

        print("Scraped:", name)

        time.sleep(0.5)

    except:
        pass


with open("criminal_records.json", "w") as f:
    json.dump(records, f, indent=2)

print("Done. Total:", len(records))
