from sqlalchemy import create_engine
import pandas as pd

engine = create_engine("sqlite:///lokdrishti.db")

df = pd.read_csv("../output/ranked_18_ls.csv")

df.to_sql("mp_performance", engine, if_exists="replace", index=False)

print(" Database created and data inserted successfully.")

test = pd.read_sql("SELECT * FROM mp_performance LIMIT 5", engine)

print("\n Sample Data:")
print(test)