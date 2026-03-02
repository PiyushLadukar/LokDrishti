import pandas as pd

# Load dataset
df = pd.read_csv("../data/18 LS MP Track.csv")

print("Original shape:", df.shape)
print("Columns available:")
print(df.columns)

# Select correct columns (UPDATED NAMES)
df = df[
    [
        "mp_name",
        "state",
        "mp_political_party",   # ✅ correct column
        "pc_name",
        "attendance",
        "debates",
        "questions"
    ]
]

# Rename columns
df.columns = [
    "name",
    "state",
    "party",
    "constituency",
    "attendance",
    "debates",
    "questions"
]

# Fill missing values
df.fillna(0, inplace=True)

# Convert numeric fields safely
df["attendance"] = pd.to_numeric(df["attendance"], errors="coerce").fillna(0)
df["debates"] = pd.to_numeric(df["debates"], errors="coerce").fillna(0)
df["questions"] = pd.to_numeric(df["questions"], errors="coerce").fillna(0)

print("Clean shape:", df.shape)

df.to_csv("../output/clean_18_ls.csv", index=False)

print("✅ Clean file saved successfully.")