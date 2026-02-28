import requests
import re
import time

BASE_URL = "https://prsindia.org"

headers = {
    "User-Agent": "Mozilla/5.0",
    "X-Requested-With": "XMLHttpRequest"
}

def get_all_mp_urls():
    all_links = []

    for page in range(1, 80):

        print("Fetching page", page)

        url = (
            "https://prsindia.org/mptrack?"
            f"slug1=18th-lok-sabha&page={page}&per-page=9&"
            "parliament=Lok+Sabha&"
            "MpTrackSearch%5Bloc_sabha%5D=18th_lok_sabha"
        )

        response = requests.get(url, headers=headers)
        html = response.text

        
        links = re.findall(
            r'href="(/mptrack/18th-lok-sabha/[a-z0-9\-]+)"',
            html
        )

        
        if not links:
            print("No more MPs found. Stopping at page", page)
            break

        for link in links:
            full_link = BASE_URL + link
            all_links.append(full_link)

        time.sleep(1)  

    unique_links = list(set(all_links))
    print("Total unique MP URLs collected:", len(unique_links))

    return unique_links