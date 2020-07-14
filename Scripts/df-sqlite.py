# https://datatofish.com/pandas-dataframe-to-sql/

# df to sqlite

import sqlite3
from pandas import DataFrame

conn = sqlite3.connect('TestDB1.db')
c = conn.cursor()

c.execute('CREATE TABLE CARS (Brand text, Price number)')
conn.commit()

Cars = {'Brand': ['Honda Civic', 'Toyota Corolla', 'Ford Focus', 'Audi A4'],
        'Price': [22000, 25000, 27000, 35000]
        }

df = DataFrame(Cars, columns=['Brand', 'Price'])
df.to_sql('CARS', conn, if_exists='replace', index=False)

c.execute('''
SELECT * FROM CARS
          ''')

for row in c.fetchall():
    print(row)


# df to sqlite to df

# import sqlite3
# from pandas import DataFrame
#
# conn = sqlite3.connect('TestDB2.db')
# c = conn.cursor()
#
# c.execute('CREATE TABLE CARS (Brand text, Price number)')
# conn.commit()
#
# Cars = {'Brand': ['Honda Civic','Toyota Corolla','Ford Focus','Audi A4'],
#         'Price': [22000,25000,27000,35000]
#         }
#
# df = DataFrame(Cars, columns= ['Brand', 'Price'])
# df.to_sql('CARS', conn, if_exists='replace', index = False)
#
# c.execute('''
# SELECT Brand, max(price) FROM CARS
#           ''')
#
# df = DataFrame(c.fetchall(), columns=['Brand','Price'])
# print (df)
#
# #c.execute('DROP TABLE CARS')
