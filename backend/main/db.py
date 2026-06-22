import os
import mysql.connector # connect to MySQL database
from dotenv import load_dotenv # load environment variables from .env file

load_dotenv() # Load environment variables from .env file

# Function to connect to the MySQL database
def connect_db():
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        database=os.getenv("MYSQL_DATABASE"),
    )
