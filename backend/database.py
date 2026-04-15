import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "expensesplitter")

client = MongoClient(MONGODB_URI)
db = client[DATABASE_NAME]

groups_collection = db["groups"]
expenses_collection = db["expenses"]
