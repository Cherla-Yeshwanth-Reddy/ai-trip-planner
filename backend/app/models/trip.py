from pydantic import BaseModel, Field
from typing import List

class TripGenerateRequest(BaseModel):
    destination: str
    days: int = Field(ge=1, le=14)
    budget: str

class Place(BaseModel):
    name: str
    description: str
    lat: float
    lon: float

class Day(BaseModel):
    day: int
    title: str
    places: List[Place]

class TripSaveRequest(BaseModel):
    destination: str
    days: int
    budget: str
    itinerary: list
    packing_list: list
