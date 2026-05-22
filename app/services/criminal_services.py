import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_FILE = os.path.join(BASE_DIR, "data", "criminal_records.json")

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