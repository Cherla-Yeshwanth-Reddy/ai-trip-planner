from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

# Load Config from .env
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "trip_planner_db")

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def get_database():
    """Returns the database instance, creating the client if needed."""
    if db.client is None:
        print(f"🔌 Connecting to MongoDB at {MONGO_URL}...")
        db.client = AsyncIOMotorClient(MONGO_URL)
    return db.client[DB_NAME]

async def close_mongo_connection():
    """Closes the database connection."""
    if db.client:
        print("🔌 Closing MongoDB connection...")
        db.client.close()