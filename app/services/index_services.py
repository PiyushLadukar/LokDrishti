
import numpy as np
from app.db import query_df


def _not_found(msg):
    return {"error": msg, "data": []}

def get_state_strength_index():
    """
    Weighted state performance.
    Formula: avg_lci * log(total_mps + 1)
    Replaces: state_i.py
    """
    sql = """
        SELECT state,
               COUNT(*) as total_mps,
               AVG(LCI_score) as avg_lci,
               AVG(attendance) as avg_attendance,
               AVG(debates) as avg_debates,
               AVG(questions) as avg_questions
        FROM mp_performance
        GROUP BY state
    """
    df = query_df(sql)
    if df.empty:
        return _not_found("No state data found.")

    df["state_strength_index"] = df["avg_lci"] * np.log(df["total_mps"] + 1)
    df["state_rank"] = df["state_strength_index"].rank(ascending=False, method="min")
    df = df.sort_values("state_rank")

    # Round floats for clean JSON
    df = df.round(4)

    return {
        "total_states": len(df),
        "strongest_state": df.iloc[0]["state"],
        "weakest_state": df.iloc[-1]["state"],
        "data": df.to_dict(orient="records")
    }


def get_party_dominance_index():
    """
    Weighted party performance.
    Formula: avg_lci * log(total_mps + 1)
    Replaces: party_i.py
    """
    sql = """
        SELECT party,
               COUNT(*) as total_mps,
               AVG(LCI_score) as avg_lci,
               AVG(percentile) as avg_percentile,
               AVG(engagement_index) as avg_engagement
        FROM mp_performance
        GROUP BY party
    """
    df = query_df(sql)
    if df.empty:
        return _not_found("No party data found.")

    df["party_dominance_index"] = df["avg_lci"] * np.log(df["total_mps"] + 1)
    df["party_rank"] = df["party_dominance_index"].rank(ascending=False, method="min")
    df = df.sort_values("party_rank")

    df = df.round(4)

    return {
        "total_parties": len(df),
        "dominant_party": df.iloc[0]["party"],
        "weakest_party": df.iloc[-1]["party"],
        "data": df.to_dict(orient="records")
    }


def get_performance_inequality():
    """
    Standard deviation of LCI scores within each state.
    High std = high inequality among MPs of that state.
    Replaces: performance_inequality.py
    """
    sql = """
        SELECT state, LCI_score
        FROM mp_performance
    """
    df = query_df(sql)
    if df.empty:
        return _not_found("No data found.")

    inequality = df.groupby("state")["LCI_score"].std().reset_index()
    inequality.columns = ["state", "performance_std"]
    inequality["performance_std"] = inequality["performance_std"].fillna(0).round(4)
    inequality = inequality.sort_values("performance_std", ascending=False)

    return {
        "total_states": len(inequality),
        "most_unequal_state": inequality.iloc[0]["state"],
        "most_balanced_state": inequality.iloc[-1]["state"],
        "data": inequality.to_dict(orient="records")
    }

def get_representation_imbalance():
    """
    Compares each state's actual performance vs expected national average.
    Positive imbalance_score = overperforming state.
    Negative imbalance_score = underperforming state.
    Replaces: RIB.py
    """
    national_avg_df = query_df("SELECT AVG(LCI_score) as national_avg FROM mp_performance")
    national_avg = national_avg_df["national_avg"][0]

    sql = """
        SELECT state,
               COUNT(*) as total_mps,
               AVG(LCI_score) as avg_lci
        FROM mp_performance
        GROUP BY state
    """
    df = query_df(sql)
    if df.empty:
        return _not_found("No data found.")

    df["expected_strength"] = national_avg * df["total_mps"]
    df["actual_strength"]   = df["avg_lci"] * df["total_mps"]
    df["imbalance_score"]   = (df["actual_strength"] - df["expected_strength"]).round(4)
    df = df.sort_values("imbalance_score", ascending=False)

    return {
        "national_avg_lci": round(national_avg, 4),
        "most_overperforming_state": df.iloc[0]["state"],
        "most_underperforming_state": df.iloc[-1]["state"],
        "data": df.to_dict(orient="records")
    }