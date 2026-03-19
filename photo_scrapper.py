import pandas as pd
import requests
from bs4 import BeautifulSoup
import json
import time

# ✅ Load your CSV
df = pd.read_csv("data/18 LS MP Track.csv")

mp_names = df["mp_name"].dropna().unique()

print(f"✅ Total MPs: {len(mp_names)}")

headers = {
    "User-Agent": "Mozilla/5.0"
}

results = []

def get_wiki_image(name):
    try:
        # 🔍 Search Wikipedia
        search_url = f"https://en.wikipedia.org/w/index.php?search={name.replace(' ', '+')}"
        res = requests.get(search_url, headers=headers)

        soup = BeautifulSoup(res.text, "html.parser")

        # 🔥 Get first result link
        result = soup.select_one(".mw-search-result-heading a")

        if result:
            link = "https://en.wikipedia.org" + result.get("href")
        else:
            # direct page fallback
            link = f"https://en.wikipedia.org/wiki/{name.replace(' ', '_')}"

        # 🔍 Open MP page
        res2 = requests.get(link, headers=headers)
        soup2 = BeautifulSoup(res2.text, "html.parser")

        # 🎯 Extract infobox image
        img = soup2.select_one(".infobox img")

        if img:
            src = img.get("src")
            if src.startswith("//"):
                return "https:" + src

        return None

    except Exception as e:
        return None


# 🚀 Loop through MPs
for i, name in enumerate(mp_names):
    print(f"[{i+1}] Fetching: {name}")

    img_url = get_wiki_image(name)

    results.append({
        "name": name,
        "photo": img_url
    })

    time.sleep(1)  # avoid blocking

# 💾 Save JSON
with open("mp_photos.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)

print("\n🔥 DONE! Saved mp_photos.json")