from fastapi import APIRouter, Depends, HTTPException, status
from app.database import get_database
from app.core.security import get_current_user
from typing import List

# Create the router
router = APIRouter()

# Dependency: Check if the user is actually an Admin
async def verify_admin(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Admin privileges required"
        )
    return current_user

# --- ENDPOINT 1: Get All Users (Excluding Admins) ---
@router.get("/users", dependencies=[Depends(verify_admin)])
async def get_all_users():
    db = await get_database()
    
    # FILTER: Only fetch documents where "role" is "user"
    # This ensures admins are not listed in the general user table
    users = await db.users.find({"role": "user"}, {"password": 0}).to_list(length=100)
    
    # Convert _id to string for JSON compatibility
    for user in users:
        user["id"] = str(user["_id"])
        del user["_id"]
        
    return users

# --- ENDPOINT 2: Get System Stats ---
@router.get("/stats", dependencies=[Depends(verify_admin)])
async def get_system_stats():
    db = await get_database()
    
    # FILTER: Count only documents where "role" is "user"
    # This prevents the admin account from inflating the "Total Users" stat
    user_count = await db.users.count_documents({"role": "user"})
    
    # Count trips if the collection exists, otherwise return 0
    trip_count = await db.trips.count_documents({}) if "trips" in await db.list_collection_names() else 0
    
    return {
        "total_users": user_count,
        "total_trips": trip_count
    }