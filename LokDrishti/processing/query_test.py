from sqlalchemy import create_engine
import pandas as pd

# Connect to existing database
engine = create_engine("sqlite:///lokdrishti.db")

print("\n🔹 Top 5 National Rank MPs")
top5 = pd.read_sql("""
SELECT name, state, party, LCI_score, national_rank
FROM mp_performance
ORDER BY national_rank ASC
LIMIT 5
""", engine)

print(top5)


print("\n🔹 Top 5 MPs from Maharashtra")
mh = pd.read_sql("""
SELECT name, LCI_score, state_rank
FROM mp_performance
WHERE state = 'Maharashtra'
ORDER BY state_rank ASC
LIMIT 5
""", engine)

print(mh)