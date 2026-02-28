import requests
import re
import pandas as pd
import time
from bs4 import BeautifulSoup
from mp_list_scrapper import get_all_mp_urls

BASE_URL = "https://prsindia.org"
headers = {"User-Agent": "Mozilla/5.0"}


# ==========================
# SCRAPE SINGLE MP
# ==========================
def scrape_mp(url):
    response = requests.get(url, headers=headers)
    html = response.text
    soup = BeautifulSoup(html, "html.parser")

    # Extract Name
    name_tag = soup.find("h1")
    name = name_tag.text.strip() if name_tag else "N/A"

    # Extract chart data from JS
    chart_blocks = re.findall(r'arrayToDataTable\((.*?)\);', html, re.S)

    attendance = debates = questions = "N/A"

    def extract_first_value(block):
        match = re.search(r'\["",\s*([\d.]+)', block)
        return match.group(1) if match else None

    if len(chart_blocks) >= 3:
        attendance = extract_first_value(chart_blocks[0])
        debates = extract_first_value(chart_blocks[1])
        questions = extract_first_value(chart_blocks[2])

    return {
        "name": name,
        "attendance": attendance,
        "debates": debates,
        "questions": questions
    }


# ==========================
# GET ALL MP URLS
# ==========================
def get_mp_urls():
    sitemap_url = "https://prsindia.org/sitemap.xml"
    response = requests.get(sitemap_url, headers=headers)
    xml = response.text

    links = re.findall(r'https://prsindia\.org/mptrack/18th-lok-sabha/[a-z0-9\-]+', xml)

    return list(set(links))


# ==========================
# MAIN PIPELINE
# ==========================
if __name__ == "__main__":
    mp_urls = get_all_mp_urls()

    print("Total MPs found:", len(mp_urls))

    data = []

    for url in mp_urls[:10]:  # scrape first 10
        print("Scraping:", url)
        mp_data = scrape_mp(url)
        data.append(mp_data)
        time.sleep(2)

    df = pd.DataFrame(data)
    df.to_csv("mp_data.csv", index=False)

    print("Saved to mp_data.csv")