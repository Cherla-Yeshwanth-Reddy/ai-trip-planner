from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import MONGO_URL, DB_NAME
import os

# Performance Tuning for MongoDB
# maxPoolSize=10 is safe for serverless/cloud deployments
client = AsyncIOMotorClient(
    MONGO_URL,
    maxPoolSize=10,
    minPoolSize=1,
    uuidRepresentation="standard"
)

db = client[DB_NAME]

# Collections
users_collection = db["users"]
trips_collection = db["trips"]