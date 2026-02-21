import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="fleetflow"
    )