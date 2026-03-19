import requests
from bs4 import BeautifulSoup
import json

URL = "https://en.wikipedia.org/wiki/List_of_members_of_the_18th_Lok_Sabha"

headers = {
    "User-Agent": "Mozilla/5.0"
}

res = requests.get(URL, headers=headers)

if res.status_code != 200:
    print("❌ Failed to fetch page")
    exit()

soup = BeautifulSoup(res.text, "html.parser")

photos = []

# Wikipedia tables
tables = soup.find_all("table", {"class": "wikitable"})

for table in tables:
    rows = table.find_all("tr")

    for row in rows[1:]:
        cols = row.find_all("td")

        if len(cols) < 2:
            continue

        # find image
        img_tag = row.find("img")

        if img_tag:
            img_url = img_tag.get("src")

            if img_url:
                # convert to full URL
                if img_url.startswith("//"):
                    img_url = "https:" + img_url

                photos.append(img_url)

# remove duplicates
photos = list(set(photos))

# save
with open("mp_photos.json", "w") as f:
    json.dump(photos, f, indent=2)

print(f"✅ DONE: {len(photos)} photos saved")