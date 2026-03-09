import requests
import os
import time

API = "https://en.wikipedia.org/w/api.php"

MP_NAMES = [
"Narendra Modi","Amit Shah","Rajnath Singh","Nitin Gadkari","Smriti Irani",
"Rahul Gandhi","Mallikarjun Kharge","Shashi Tharoor","Supriya Sule",
"Asaduddin Owaisi","Tejasvi Surya","Maneka Gandhi","Hema Malini",
"Kirron Kher","Anurag Thakur","Piyush Goyal","Dharmendra Pradhan",
"Jyotiraditya Scindia","Kiren Rijiju","Parshottam Rupala"
]

os.makedirs("mp_photos", exist_ok=True)

def get_image(title):
    params = {
        "action": "query",
        "titles": title,
        "prop": "pageimages",
        "format": "json",
        "pithumbsize": 600
    }

    r = requests.get(API, params=params).json()
    pages = r["query"]["pages"]

    for page in pages.values():
        if "thumbnail" in page:
            return page["thumbnail"]["source"]

    return None


count = 0

for name in MP_NAMES:

    try:
        img = get_image(name)

        if img:
            data = requests.get(img).content
            file = name.replace(" ", "_") + ".jpg"

            with open("mp_photos/" + file, "wb") as f:
                f.write(data)

            count += 1
            print("Downloaded:", name)

        else:
            print("No image:", name)

        time.sleep(0.5)

    except:
        print("Failed:", name)

print("\nDone:", count, "photos")