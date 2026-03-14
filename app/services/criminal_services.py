import json

DATA_FILE = "data/criminal_records.json"

with open(DATA_FILE, "r", encoding="utf-8") as f:
    criminal_data = json.load(f)

def get_criminal_record(mp_name):

    mp_name = mp_name.lower()

    for name, data in criminal_data.items():
        if name.lower() == mp_name:
            return data

    return {
        "total_cases": 0,
        "serious_cases": 0,
        "pending_cases": [],
        "convicted_cases": [],
        "source_url": None
    }
