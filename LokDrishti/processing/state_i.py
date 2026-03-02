from sqlalchemy import create_engine
import pandas as pd
import numpy as np

engine = create_engine("sqlite:///lokdrishti.db")


def state_dashboard():

    query = """
    SELECT state,
           COUNT(*) as total_mps,
           AVG(LCI_score) as avg_lci,
           AVG(attendance) as avg_attendance,
           AVG(debates) as avg_debates,
           AVG(questions) as avg_questions
    FROM mp_performance
    GROUP BY state
    """

    df = pd.read_sql(query, engine)

    # ----------------------------
    # State Strength Index (Weighted)
    # ----------------------------

    df["state_strength_index"] = (
        df["avg_lci"] * np.log(df["total_mps"] + 1)
    )

    df["state_performance_rank"] = df["state_strength_index"] \
        .rank(ascending=False, method="min")

    df = df.sort_values("state_performance_rank")

    return df


if __name__ == "__main__":

    dashboard = state_dashboard()

    print("\n🏛 STATE INTELLIGENCE DASHBOARD (Weighted)\n")
    print(dashboard)

    print("\n🥇 Strongest State (Weighted):")
    print(dashboard.iloc[0])

    print("\n🔻 Weakest State (Weighted):")
    print(dashboard.iloc[-1])