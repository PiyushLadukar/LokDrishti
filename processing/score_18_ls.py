import pandas as pd

df = pd.read_csv("../output/clean_18_ls.csv")

print("Loaded rows:", df.shape[0])

# -------------------------
# Normalize Metrics
# -------------------------

df["attendance_norm"] = df["attendance"] / 100
df["debates_norm"] = df["debates"] / df["debates"].max()
df["questions_norm"] = df["questions"] / df["questions"].max()

# -------------------------
# LokDrishti Civic Index
# -------------------------

df["LCI_score"] = (
    0.4 * df["attendance_norm"] +
    0.3 * df["debates_norm"] +
    0.3 * df["questions_norm"]
)

# -------------------------
# Rankings
# -------------------------

# National ranking
df["national_rank"] = df["LCI_score"].rank(ascending=False, method="min")

# Rank within state
df["state_rank"] = df.groupby("state")["LCI_score"] \
                      .rank(ascending=False, method="min")

# Rank within party
df["party_rank"] = df.groupby("party")["LCI_score"] \
                      .rank(ascending=False, method="min")

# Sort by national rank
df = df.sort_values("national_rank")

df.to_csv("../output/ranked_18_ls.csv", index=False)

print("🔥 Ranking upgraded successfully.")