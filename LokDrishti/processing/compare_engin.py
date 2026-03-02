from sqlalchemy import create_engine
import pandas as pd

engine = create_engine("sqlite:///lokdrishti.db")


def compare_mps(name1, name2):

    query = f"""
    SELECT name, state, party,
           attendance, debates, questions,
           LCI_score, national_rank,
           percentile, engagement_index
    FROM mp_performance
    WHERE name IN ('{name1}', '{name2}')
    """

    df = pd.read_sql(query, engine)

    if len(df) != 2:
        print("❌ One or both MPs not found.")
        return

    print("\n📊 MP Comparison:\n")
    print(df)

    # Compute difference
    diff = df.iloc[0][["LCI_score", "percentile", "engagement_index"]] - \
           df.iloc[1][["LCI_score", "percentile", "engagement_index"]]

    print("\n📈 Performance Difference (MP1 - MP2):\n")
    print(diff)


if __name__ == "__main__":
    compare_mps("Akhilesh Yadav", "Smita Uday Wagh")