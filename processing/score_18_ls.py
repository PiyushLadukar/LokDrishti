import pandas as pd
import numpy as np

# -----------------------------------
# Load Clean Dataset
# -----------------------------------

df = pd.read_csv("../output/clean_18_ls.csv")

print("Loaded rows:", df.shape[0])

# -----------------------------------
# Ensure Numeric Columns (Safety)
# -----------------------------------

df["attendance"] = pd.to_numeric(df["attendance"], errors="coerce").fillna(0)
df["debates"] = pd.to_numeric(df["debates"], errors="coerce").fillna(0)
df["questions"] = pd.to_numeric(df["questions"], errors="coerce").fillna(0)

# -----------------------------------
# Normalize Metrics
# -----------------------------------

# Avoid division by zero
debates_max = df["debates"].max()
questions_max = df["questions"].max()

df["attendance_norm"] = df["attendance"] / 100
df["debates_norm"] = df["debates"] / debates_max if debates_max != 0 else 0
df["questions_norm"] = df["questions"] / questions_max if questions_max != 0 else 0

# -----------------------------------
# LokDrishti Civic Index (LCI)
# -----------------------------------

df["LCI_score"] = (
    0.4 * df["attendance_norm"] +
    0.3 * df["debates_norm"] +
    0.3 * df["questions_norm"]
)

# -----------------------------------
# Rankings
# -----------------------------------

df["national_rank"] = df["LCI_score"].rank(ascending=False, method="min")
df["state_rank"] = df.groupby("state")["LCI_score"].rank(ascending=False, method="min")
df["party_rank"] = df.groupby("party")["LCI_score"].rank(ascending=False, method="min")

# -----------------------------------
# Percentile Calculation
# -----------------------------------

total_mps = len(df)

df["percentile"] = (
    (total_mps - df["national_rank"] + 1) / total_mps
) * 100

# -----------------------------------
# Silent MP Detector
# -----------------------------------

df["silent_flag"] = (
    (df["debates"] < df["debates"].median()) &
    (df["questions"] < df["questions"].median())
)

# -----------------------------------
# Engagement Index
# -----------------------------------

df["engagement_index"] = df["debates"] + df["questions"]

# -----------------------------------
# Clean Final Sorting
# -----------------------------------

df = df.sort_values("national_rank")

# -----------------------------------
# Save Ranked File
# -----------------------------------

df.to_csv("../output/ranked_18_ls.csv", index=False)

print("🔥 Ranking + Intelligence Layer Created Successfully.")
print("Columns:", df.columns.tolist())