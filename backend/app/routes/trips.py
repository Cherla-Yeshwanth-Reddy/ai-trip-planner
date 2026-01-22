from fastapi import APIRouter, HTTPException, Depends
from app.services.ai_service import generate_trip_ai
from app.core.security import get_current_user
from app.database import get_database
from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime

router = APIRouter()

# --- MODELS ---
class TripSaveRequest(BaseModel):
    destination: str
    itinerary: List[Dict[str, Any]]

# --- GENERATE TRIP (LANDMARK FOCUSED) ---
@router.post("/generate")
async def generate_trip(data: dict, user=Depends(get_current_user)):
    source = data.get("source")       
    destination = data.get("destination")
    start_date = data.get("startDate") 
    days = data.get("days")
    interests = data.get("interests", []) 

    if not destination or not days or not start_date:
        raise HTTPException(status_code=400, detail="Missing required fields")

    # Construct the Prompt
    interests_str = ", ".join(interests) if interests else "General Sightseeing"
    
    prompt = f"""
    Act as a local travel guide who knows the city inside out.
    Plan a {days}-day trip to {destination}, starting from {start_date}.
    The traveler is flying from {source}.
    User Interests: {interests_str}.
    
    CRITICAL RULES FOR ACCURACY:
    1. MUST-VISIT LANDMARKS: You MUST include the most iconic landmarks of {destination} (e.g., if Hyderabad -> Charminar & Golconda Fort; if Paris -> Eiffel Tower).
    2. REALISM: Only suggest real, currently existing places.
    3. GEOGRAPHY: Group activities by neighborhood to minimize travel time (e.g. don't jump between far ends of the city).
    4. LOCAL FLAVOR: Suggest specific local dishes to try for lunch/dinner (e.g., Hyderabadi Biryani at Paradise/Bawarchi).
    
    RETURN ONLY JSON. Structure:
    [
      {{
        "day": 1,
        "date": "YYYY-MM-DD",
        "theme": "Focus of the day (e.g., Heritage Walk)",
        "morning": "Activity Name (Time). Description.",
        "afternoon": "Activity Name (Approx Cost: $$). Why it's famous.",
        "evening": "Activity Name. Best spot for dinner nearby."
      }}
    ]
    """

    result = await generate_trip_ai(prompt)
    return result

# --- SAVE TRIP ---
@router.post("/save")
async def save_trip(trip: TripSaveRequest, user=Depends(get_current_user)):
    db = await get_database()
    new_trip = {
        "username": user["username"],
        "destination": trip.destination,
        "itinerary": trip.itinerary,
        "created_at": datetime.utcnow()
    }
    result = await db.trips.insert_one(new_trip)
    return {"message": "Trip saved successfully", "trip_id": str(result.inserted_id)}

# --- GET TRIPS ---
@router.get("/my-trips")
async def get_my_trips(user=Depends(get_current_user)):
    db = await get_database()
    trips = await db.trips.find({"username": user["username"]}).to_list(length=50)
    for t in trips:
        t["id"] = str(t["_id"])
        del t["_id"]
    return trips