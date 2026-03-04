"""
ranking_services.py
-------------------
Service layer for ranking queries.
Replaces: query_test.py, search_engine.py ranking functions
"""

from app.db import query_df

RANKING_FIELDS = """
    name, state, party, constituency,
    LCI_score, national_rank, state_rank, party_rank,
    percentile, engagement_index, attendance, debates, questions, silent_flag
"""


# ----------------------------
# Helpers
# ----------------------------

def _paginate(df, page, page_size):
    total = len(df)
    start = (page - 1) * page_size
    end = start + page_size
    return {
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": -(-total // page_size),
        "data": df.iloc[start:end].to_dict(orient="records")
    }


def _not_found(msg):
    return {"error": msg, "data": []}


# ----------------------------
# 1. National Rankings
# ----------------------------

def get_national_rankings(top_n=None, page=1, page_size=20):
    if top_n:
        sql = f"SELECT {RANKING_FIELDS} FROM mp_performance ORDER BY national_rank ASC LIMIT :top_n"
        df = query_df(sql, {"top_n": top_n})
        if df.empty:
            return _not_found("No data found.")
        return {"total": len(df), "data": df.to_dict(orient="records")}

    df = query_df(f"SELECT {RANKING_FIELDS} FROM mp_performance ORDER BY national_rank ASC")
    if df.empty:
        return _not_found("No data found.")
    return _paginate(df, page, page_size)


# ----------------------------
# 2. State Rankings
# ----------------------------

def get_state_rankings(state, top_n=None, page=1, page_size=20):
    if top_n:
        sql = f"""
            SELECT {RANKING_FIELDS} FROM mp_performance
            WHERE LOWER(state) = LOWER(:state)
            ORDER BY state_rank ASC LIMIT :top_n
        """
        df = query_df(sql, {"state": state, "top_n": top_n})
        if df.empty:
            return _not_found(f"No MPs found for state '{state}'.")
        return {"state": state, "total": len(df), "data": df.to_dict(orient="records")}

    sql = f"""
        SELECT {RANKING_FIELDS} FROM mp_performance
        WHERE LOWER(state) = LOWER(:state)
        ORDER BY state_rank ASC
    """
    df = query_df(sql, {"state": state})
    if df.empty:
        return _not_found(f"No MPs found for state '{state}'.")

    result = _paginate(df, page, page_size)
    result["state"] = state
    return result


# ----------------------------
# 3. Party Rankings
# ----------------------------

def get_party_rankings(party, top_n=None, page=1, page_size=20):
    if top_n:
        sql = f"""
            SELECT {RANKING_FIELDS} FROM mp_performance
            WHERE LOWER(party) = LOWER(:party)
            ORDER BY party_rank ASC LIMIT :top_n
        """
        df = query_df(sql, {"party": party, "top_n": top_n})
        if df.empty:
            return _not_found(f"No MPs found for party '{party}'.")
        return {"party": party, "total": len(df), "data": df.to_dict(orient="records")}

    sql = f"""
        SELECT {RANKING_FIELDS} FROM mp_performance
        WHERE LOWER(party) = LOWER(:party)
        ORDER BY party_rank ASC
    """
    df = query_df(sql, {"party": party})
    if df.empty:
        return _not_found(f"No MPs found for party '{party}'.")

    result = _paginate(df, page, page_size)
    result["party"] = party
    return result


# ----------------------------
# 4. State Leaderboard (top MP per state)
# ----------------------------

def get_state_leaderboard():
    sql = """
        SELECT name, state, party, LCI_score,
               national_rank, state_rank, percentile
        FROM mp_performance
        WHERE state_rank = 1
        ORDER BY LCI_score DESC
    """
    df = query_df(sql)
    if df.empty:
        return _not_found("No data found.")
    return {"total": len(df), "data": df.to_dict(orient="records")}


# ----------------------------
# 5. Party Leaderboard (top MP per party)
# ----------------------------

def get_party_leaderboard():
    sql = """
        SELECT name, state, party, LCI_score,
               national_rank, party_rank, percentile
        FROM mp_performance
        WHERE party_rank = 1
        ORDER BY LCI_score DESC
    """
    df = query_df(sql)
    if df.empty:
        return _not_found("No data found.")
    return {"total": len(df), "data": df.to_dict(orient="records")}


# ----------------------------
# 6. Percentile Band Lookup
# ----------------------------

def get_mps_by_percentile_band(min_percentile=0, max_percentile=100,
                                page=1, page_size=20):
    sql = f"""
        SELECT {RANKING_FIELDS} FROM mp_performance
        WHERE percentile BETWEEN :min_p AND :max_p
        ORDER BY percentile DESC
    """
    df = query_df(sql, {"min_p": min_percentile, "max_p": max_percentile})
    if df.empty:
        return _not_found(f"No MPs in percentile range {min_percentile}–{max_percentile}.")

    result = _paginate(df, page, page_size)
    result["percentile_band"] = {"min": min_percentile, "max": max_percentile}
    return result