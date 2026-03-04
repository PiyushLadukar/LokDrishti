from sqlalchemy import create_engine, text
import pandas as pd

_engine = None


def init_db(app):
    """Initialize the SQLAlchemy engine using app config."""
    global _engine
    _engine = create_engine(app.config["DATABASE_URI"])


def get_engine():
    if _engine is None:
        raise RuntimeError("Database not initialized. Call init_db(app) first.")
    return _engine


def query_df(sql: str, params: dict = None) -> pd.DataFrame:
    """
    Run a parameterized SQL query and return a DataFrame.
    Always use this — never use f-string SQL with user input.
    """
    engine = get_engine()
    with engine.connect() as conn:
        result = conn.execute(text(sql), params or {})
        return pd.DataFrame(result.fetchall(), columns=result.keys())