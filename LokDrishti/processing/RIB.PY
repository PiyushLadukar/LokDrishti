from sqlalchemy import create_engine
import pandas as pd

engine = create_engine("sqlite:///lokdrishti.db")


def representation_imbalance():

    # Get national average LCI
    national_query = "SELECT AVG(LCI_score) as national_avg FROM mp_performance"
    national_avg = pd.read_sql(national_query, engine)["national_avg"][0]

    # Get state stats
    query = """
    SELECT state,
           COUNT(*) as total_mps,
           AVG(LCI_score) as avg_lci
    FROM mp_performance
    GROUP BY state
    """

    df = pd.read_sql(query, engine)

    # Expected vs Actual
    df["expected_strength"] = national_avg * df["total_mps"]
    df["actual_strength"] = df["avg_lci"] * df["total_mps"]

    df["imbalance_score"] = df["actual_strength"] - df["expected_strength"]

    df = df.sort_values("imbalance_score", ascending=False)

    return df


if __name__ == "__main__":

    imbalance = representation_imbalance()

    print("\n⚖ REPRESENTATION IMBALANCE DETECTOR\n")
    print(imbalance)

    print("\n⬆ Most Overperforming State:")
    print(imbalance.iloc[0])

    print("\n⬇ Most Underperforming State:")
    print(imbalance.iloc[-1])