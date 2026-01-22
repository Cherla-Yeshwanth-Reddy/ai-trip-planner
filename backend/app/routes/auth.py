from fastapi import APIRouter, HTTPException, status
from app.database import get_database
from app.models import UserCreate, UserLogin
from app.core.security import verify_password, get_password_hash, create_access_token
from datetime import datetime, timezone
import uuid

router = APIRouter()

# --- REGISTER ---
@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    db = await get_database()
    
    # 1. Check if username already exists
    existing_user = await db.users.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Username already taken"
        )
    
    # 2. Create User Object
    # We strictly enforce "role": "user" here. 
    # Admins must be promoted manually in the database.
    new_user = {
        "id": str(uuid.uuid4()),
        "username": user.username,
        "password": get_password_hash(user.password), # Hash the password!
        "role": "user",  # <--- DEFAULT ROLE
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    # 3. Save to MongoDB
    await db.users.insert_one(new_user)
    
    return {"message": "User registered successfully"}

# --- LOGIN ---
@router.post("/login")
async def login(credentials: UserLogin):
    db = await get_database()
    
    # 1. Find the user by username
    user = await db.users.find_one({"username": credentials.username})
    
    # 2. Verify password (matches hashed version)
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid credentials"
        )
        
    # 3. Create JWT Token
    # We embed the role inside the token so the API knows who they are later
    access_token = create_access_token(
        data={
            "sub": user["username"], 
            "role": user["role"]
        }
    )
    
    # 4. Return Response
    # CRITICAL: We send "role" back so the Frontend knows where to redirect
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user["role"], # <--- Used by Login.jsx for redirection
        "username": user["username"]
    }