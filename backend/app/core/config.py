from pathlib import Path
from dotenv import load_dotenv
import os

# backend folder path
BASE_DIR = Path(__file__).resolve().parents[2]

load_dotenv(BASE_DIR / ".env")

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

print("ENV CHECK -> DB_NAME:", DB_NAME)  # debug
