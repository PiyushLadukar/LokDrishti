from sqlalchemy import create_engine
import pandas as pd

engine = create_engine("sqlite:///lokdrishti.db")


def performance_inequality():

    query = """
    SELECT state, LCI_score
    FROM mp_performance
    """

    df = pd.read_sql(query, engine)

    inequality = df.groupby("state")["LCI_score"].std().reset_index()
    inequality.columns = ["state", "performance_std"]

    # Fill NaN for states with 1 MP
    inequality["performance_std"] = inequality["performance_std"].fillna(0)

    inequality = inequality.sort_values("performance_std", ascending=False)

    return inequality


if __name__ == "__main__":

    inequality = performance_inequality()

    print("\n📊 PERFORMANCE INEQUALITY INDEX (State Level)\n")
    print(inequality)

    print("\n⚠ Most Unequal State:")
    print(inequality.iloc[0])

    print("\n✅ Most Balanced State:")
    print(inequality.iloc[-1])