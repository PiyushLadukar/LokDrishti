import requests
import re

URL = "https://prsindia.org/mptrack/18th-lok-sabha/abu-taher-khan"

headers = {"User-Agent": "Mozilla/5.0"}

response = requests.get(URL, headers=headers)

html = response.text


chart_blocks = re.findall(r'arrayToDataTable\((.*?)\);', html, re.S)

attendance = debates = questions = "N/A"

def extract_first_value(block):
    match = re.search(r'\["",\s*([\d.]+)', block)
    return match.group(1) if match else None

if len(chart_blocks) >= 3:
    attendance = extract_first_value(chart_blocks[0])
    debates = extract_first_value(chart_blocks[1])
    questions = extract_first_value(chart_blocks[2])

print("Attendance:", attendance)
print("Debates:", debates)
print("Questions:", questions)