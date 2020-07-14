import pandas as pd
from sqlalchemy import create_engine


# PART 1 - ACCESS 'DATACOLLECTION' SHEET FROM MODEl, INCLUDE ONLY RELEVANT COLUMNS AND ROWS TO DATAFRAME
df = pd.read_excel('ExcelModel.xlsm', sheet_name = 'DataCollection', usecols = "A:C,E:H,J:M,O:P,R:T,V:X")
df = df.dropna(axis=0, how='all')       # drop rows where all values are NULL

# PART 2 - PUSH DATAFRAME TO MYSQL TABLE
sqlEngine = create_engine('mysql+pymysql://podio_user:dbtkAY0Ki6N9@34.66.207.19/testdb')      # database type :// user : passwd @ host / database name
df.to_sql('DFtoSQL Pivot3', con=sqlEngine)


