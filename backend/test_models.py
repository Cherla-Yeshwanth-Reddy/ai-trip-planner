from google import genai
from dotenv import load_dotenv
import os

# 1. Load .env
load_dotenv() 

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print(f"❌ Error: GEMINI_API_KEY not found.")
    exit()

print(f"✅ Found API Key: {api_key[:5]}...*****")

client = genai.Client(api_key=api_key)

print("\n🔍 Fetching available models...")
try:
    pager = client.models.list()
    for model in pager:
        # Simplified: Just print the name directly
        print(f" • {model.name}")
except Exception as e:
    print(f"❌ Error fetching models: {e}")