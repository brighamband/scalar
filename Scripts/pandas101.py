# see link: https://www.youtube.com/watch?v=vmEHCJofslg

import pandas as pd

TUTORIAL - READ IN AND PRINT FILES
    csv files
        df = pd.read_csv('pokemon_data.csv')  # don't need full path as long as file you're reading in is saved in same location as this .py file
        print(df)
        print(df.head(3))   # only prints top 3 rows
        df = df.head(25)      # make the df only the first 25 rows
        print(df.tail(4))   # only prints bottom 4 rows

    xlsx files
        df_xlsx = pd.read_excel('pokemon_data.xlsx')
        print(df_xlsx.head(5))

    txt files
        df = pd.read_csv('pokemon_data.txt', delimiter = '\t')      # delimiter basically puts data in a new column every time it reads \t
        print(df)

TUTORIAL - OTHER PANDAS FUNCTIONALITY
    print(df.columns)     # print headers
    print(df['Name'])     # print all names
    print(df['Name'][0:5])        # print names of first 5 rows
    print(df[['Name', 'Type 1', 'HP']])        # only print 3 columns - name, type 1, and hp
    print(df.iloc[1])       # prints all info from integer location number 1
    print(df.iloc[2,3])     # prints cell content at specific coordinate
    for index, row in df.iterrows():
        print(index, row['Name'])
    print(df.loc[df['Type 1'] == "Fire"])       # only prints where type 1 is fire
    df.describe() # gives math stats like mean, SD, etc.
    print(df.sort_values('Name'))       # prints df in alphabetical order by name
    print(df.sort_values('Name', ascending = False))      # prints df in reverse alphabetical order
    print(df.sort_values(['Type 2', 'Name']))       # print sort by type 2, then by name
    print(df.sort_values(['Name', 'HP'], ascending = [1,0]))        # print sort by name in alphabetical, then by highest to lowest hp

    df['Total'] = df['HP'] + df['Attack'] # + .... keep adding up each column ....
    df = df.drop(columns = ['Total'])   # how to remove a header for good (df = resets it)
    df['Total'] = df.iloc[:, 4:10].sum(axis=1)  # include everything (:), from columns 4 to 9, then sum them up horizontally (axis = 1, axis = 0 if vertical)
    cols = list(df.columns.values)      # change total to be on 4th column
    df = df[cols[0:4] + [cols[-1]] + cols[4:12]]
    df.to_csv('edit.csv', index = False)     # save new df into a new csv, index=False says not to include index column
    df.to_xlsx('edit.xlsx', index = False)      # save to new xlsx
    df.to_csv('modified.txt', index = False, sep = '\t')        # save to new txt

    print(df.loc[df['Type 1'] == 'Grass'])
    new_df = df.loc[(df['Type 1'] == 'Grass') & (df['Type 2'] == 'Poison') & (df['HP'] > 70)] # & is the symbol here, not 'and' or &&.  To do or, it's '|'
    print(new_df)
    new_df.reset_index(drop = True, inplace = True)     # resets to new indexes, removes old ones
    new_df.to_csv('filtered.csv')     # make new file with just filtered data
    df.loc[df['Name'].str.contains('Mega')      # shows all of df that have rows with 'Mega'
    df.loc[~df['Name'].str.contains('Mega')     # shows all of df but rows with 'Mega'  # ~ means !, does not equal or contain
    import re
    df.loc[df['Type 1'].str.contains('Fire|Grass'), regex = True)]

CONCATENATE 2 DATAFRAMES
    import numpy as np
    csv_file1 = 'top10.csv'
    csv_file2 = 'bottom15.csv'
    df1 = pd.read_csv(csv_file1)
    df2 = pd.read_csv(csv_file2)
    values1 = df1[['Name', 'Type 1']]
    values2 = df2[['Name']]
    dataframes = [values1, values2]
    dataframes = [df1, df2]
    join = pd.concat(dataframes)
    join.to_csv('combinedNAMETEST.csv', index = False)

FORMAT CSV FILE (MIGHT NEED IMPORT NUMPY AS NP)
    df = pd.read_csv('sql-valuations.csv')
    # simplify excel sheet (only item ID, commission_variables, valuation_lead)
    df = df[['item_id', 'commission_variables', 'valuation_lead']]
    # sort by alphabetized valuation_lead
    df = df.sort_values('valuation_lead')
    # remove NaN values
    df = df.dropna(axis='rows')
    # print result
    print(df)
    # save result as new .csv file
    df.to_csv('new-vals.csv')

MYSQL.CONNECTOR - MAKE CONNECTION, MAKE TABLE
    import mysql.connector
    mydb = mysql.connector.connect(
        host = "34.66.207.19",
        user = "podio_user",
        passwd = "dbtkAY0Ki6N9",
        db = "testdb"
    )
    mycursor = mydb.cursor()
    mycursor.execute("CREATE TABLE podioVals (item_id INTEGER(10), commission_variables VARCHAR(255), valuation_lead VARCHAR(255))")
    for tb in mycursor:
        print(tb)
        
ACCESS EXCEL SHEET FROM WORKBOOK, INCLUDE ONLY RELEVANT COLUMNS AND ROWS TO DATAFRAME
    df = pd.read_excel('ExcelModel.xlsm', sheet_name = 'DataCollection', usecols = "A:C,E:H,J:M,O:P,R:T,V:X")
    df = df.dropna(axis=0, how='all')       # drop rows where all values are NULL
    
PUSH DATAFRAME TO MYSQL TABLE
    sqlEngine = create_engine('mysql+pymysql://podio_user:dbtkAY0Ki6N9@34.66.207.19/testdb')      # database type :// user : passwd @ host / database name
    df.to_sql('DFtoSQL', con=sqlEngine) #, index = False) 