from pydantic import BaseModel, Field
from typing import Optional, List

# --- AUTH MODELS ---
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, description="Username must be at least 3 chars")
    password: str = Field(..., min_length=6, description="Password must be at least 6 chars")

class UserLogin(BaseModel):
    username: str
    password: str

# --- TRIP MODELS ---
class TripPlan(BaseModel):
    destination: str
    days: int
    budget: str

# --- ADMIN MODELS ---
class UserResponse(BaseModel):
    id: str
    username: str
    role: str