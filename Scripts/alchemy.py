import pymysql

# Connect to the database
connection = pymysql.connect(
    host="34.66.207.19",
    user="podio_user",
    passwd="dbtkAY0Ki6N9",
    db="testdb"
)

cursor = connection.cursor()

# Create a new record
sql = "INSERT INTO `testme` (`Name`, `Type 1`, `Type 2`, `HP`, `Attack`, `Defense`) VALUES (%s, %s, %s, %s, %s, %s)"
cursor.execute(sql, ('Greg', 'Dark', 'Ghost', 120, 110, 115))

# connection is not autocommit by default. So we must commit to save our changes.
connection.commit()

# Execute query
sql = "SELECT * FROM `testme`"
cursor.execute(sql)
# Fetch all the records
result = cursor.fetchall()
for i in result:
    print(i)

# close the database connection using close() method.
connection.close()
