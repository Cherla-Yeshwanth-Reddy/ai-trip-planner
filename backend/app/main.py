from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, trips, admin  # <--- 1. Import admin here

app = FastAPI()

# CORS (Allow Frontend to talk to Backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routes
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(trips.router, prefix="/api/trips", tags=["Trips"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"]) # <--- 2. Add this line!

@app.get("/")
def home():
    return {"message": "Trip Planner API is running 🚀"}