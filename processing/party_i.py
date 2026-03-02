from sqlalchemy import create_engine
import pandas as pd
import numpy as np

engine = create_engine("sqlite:///lokdrishti.db")


def party_dashboard():

    query = """
    SELECT party,
           COUNT(*) as total_mps,
           AVG(LCI_score) as avg_lci,
           AVG(percentile) as avg_percentile,
           AVG(engagement_index) as avg_engagement
    FROM mp_performance
    GROUP BY party
    """

    df = pd.read_sql(query, engine)

    # Party Strength Index (weighted)
    df["party_strength_index"] = (
        df["avg_lci"] * np.log(df["total_mps"] + 1)
    )

    df["party_rank"] = df["party_strength_index"] \
        .rank(ascending=False, method="min")

    df = df.sort_values("party_rank")

    return df


if __name__ == "__main__":

    dashboard = party_dashboard()

    print("\n🏛 PARTY DOMINANCE INDEX\n")
    print(dashboard)

    print("\n🥇 Most Dominant Party:")
    print(dashboard.iloc[0])

    print("\n🔻 Weakest Performing Party:")
    print(dashboard.iloc[-1])