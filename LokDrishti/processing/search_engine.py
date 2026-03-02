from sqlalchemy import create_engine
import pandas as pd

engine = create_engine("sqlite:///lokdrishti.db")


def search_by_name(name):
    query = f"""
    SELECT name, state, party, constituency,
           attendance, debates, questions,
           LCI_score, national_rank
    FROM mp_performance
    WHERE name LIKE '%{name}%'
    ORDER BY national_rank ASC
    """
    return pd.read_sql(query, engine)


def top_national(n=10):
    query = f"""
    SELECT name, state, party, LCI_score, national_rank
    FROM mp_performance
    ORDER BY national_rank ASC
    LIMIT {n}
    """
    return pd.read_sql(query, engine)


def top_by_state(state, n=5):
    query = f"""
    SELECT name, LCI_score, state_rank
    FROM mp_performance
    WHERE state = '{state}'
    ORDER BY state_rank ASC
    LIMIT {n}
    """
    return pd.read_sql(query, engine)


if __name__ == "__main__":
    print("\n🔎 Search Result:")
    print(search_by_name("Yadav"))

    print("\n🏆 Top 5 National:")
    print(top_national(5))

    print("\n📍 Top 5 Maharashtra:")
    print(top_by_state("Maharashtra", 5))