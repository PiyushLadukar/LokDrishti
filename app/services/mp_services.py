"""
mp_services.py
--------------
Service layer for MP-level queries.
Replaces: search_engine.py, compare_engin.py
"""

from app.db import query_df

MP_FIELDS = """
    name, state, party, constituency,
    attendance, debates, questions,
    LCI_score, national_rank, state_rank, party_rank,
    percentile, engagement_index, silent_flag
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
# 1. Get all MPs (with filters)
# ----------------------------

def get_all_mps(state=None, party=None, min_lci=None,
                silent_only=False, page=1, page_size=20):
    conditions = []
    params = {}

    if state:
        conditions.append("LOWER(state) = LOWER(:state)")
        params["state"] = state

    if party:
        conditions.append("LOWER(party) = LOWER(:party)")
        params["party"] = party

    if min_lci is not None:
        conditions.append("LCI_score >= :min_lci")
        params["min_lci"] = min_lci

    if silent_only:
        conditions.append("silent_flag = 1")

    where = ("WHERE " + " AND ".join(conditions)) if conditions else ""

    sql = f"SELECT {MP_FIELDS} FROM mp_performance {where} ORDER BY national_rank ASC"
    df = query_df(sql, params)

    if df.empty:
        return _not_found("No MPs found matching the given filters.")

    return _paginate(df, page, page_size)


# ----------------------------
# 2. Get single MP by name
# ----------------------------

def get_mp_by_name(name):
    df = query_df(
        f"SELECT {MP_FIELDS} FROM mp_performance WHERE LOWER(name) = LOWER(:name) LIMIT 1",
        {"name": name}
    )
    if df.empty:
        # fallback: partial match
        df = query_df(
            f"SELECT {MP_FIELDS} FROM mp_performance WHERE LOWER(name) LIKE LOWER(:name) ORDER BY national_rank ASC LIMIT 1",
            {"name": f"%{name}%"}
        )
    if df.empty:
        return _not_found(f"MP '{name}' not found.")

    return {"data": df.to_dict(orient="records")[0]}


# ----------------------------
# 3. Search MPs by partial name
# ----------------------------

def search_mps(query, page=1, page_size=20):
    sql = f"""
        SELECT {MP_FIELDS} FROM mp_performance
        WHERE LOWER(name) LIKE LOWER(:query)
        ORDER BY national_rank ASC
    """
    df = query_df(sql, {"query": f"%{query}%"})

    if df.empty:
        return _not_found(f"No MPs found matching '{query}'.")

    return _paginate(df, page, page_size)


# ----------------------------
# 4. Compare two MPs
# ----------------------------

def compare_mps(name1, name2):
    sql = f"""
        SELECT {MP_FIELDS} FROM mp_performance
        WHERE LOWER(name) IN (LOWER(:name1), LOWER(:name2))
    """
    df = query_df(sql, {"name1": name1, "name2": name2})

    if df.empty:
        return _not_found("Neither MP found.")
    if len(df) == 1:
        found = df.iloc[0]["name"]
        missing = name2 if found.lower() == name1.lower() else name1
        return _not_found(f"MP '{missing}' not found.")

    mp1 = df.iloc[0].to_dict()
    mp2 = df.iloc[1].to_dict()

    diff_fields = ["LCI_score", "percentile", "engagement_index",
                   "attendance", "debates", "questions"]

    diff = {
        f: round(float(mp1[f]) - float(mp2[f]), 4)
        for f in diff_fields if f in mp1 and f in mp2
    }

    winner = {
        f: mp1["name"] if diff[f] > 0 else (mp2["name"] if diff[f] < 0 else "tie")
        for f in diff
    }

    return {"mp1": mp1, "mp2": mp2, "diff": diff, "winner": winner}


# ----------------------------
# 5. Silent MPs
# ----------------------------

def get_silent_mps(state=None, party=None, page=1, page_size=20):
    return get_all_mps(state=state, party=party,
                       silent_only=True, page=page, page_size=page_size)