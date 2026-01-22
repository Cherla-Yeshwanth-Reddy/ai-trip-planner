from google import genai
import os
from fastapi import HTTPException
from dotenv import load_dotenv
import re
import json

load_dotenv()

# Initialize Client
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("CRITICAL WARNING: GEMINI_API_KEY not found in environment.")

client = genai.Client(api_key=api_key)

async def generate_trip_ai(prompt: str):
    # ---------------------------------------------------------
    # 🛡️ SMART MODEL STRATEGY (Based on your available models)
    # ---------------------------------------------------------
    models_to_try = [
        "models/gemini-2.0-flash",        # PRIMARY: Smart & Fast 2.0
        "models/gemini-2.0-flash-lite",   # BACKUP 1: Super efficient
        "models/gemini-flash-latest",     # BACKUP 2: This is 1.5 Flash (Old Reliable)
        "models/gemini-2.5-flash",        # BACKUP 3: Bleeding edge
    ]

    last_error = None

    for model_name in models_to_try:
        try:
            # print(f"🤖 Trying model: {model_name}...") # Uncomment for debugging
            
            # 1. Attempt to generate content
            response = await client.aio.models.generate_content(
                model=model_name,
                contents=prompt
            )

            # 2. Cleanup Response (Remove Markdown)
            clean_text = response.text.strip()
            if clean_text.startswith("```"):
                clean_text = re.sub(r"^```(json)?|```$", "", clean_text, flags=re.MULTILINE).strip()

            # 3. Parse JSON
            try:
                parsed_plan = json.loads(clean_text)
            except json.JSONDecodeError:
                # If JSON fails, return an error card (don't retry models for this)
                parsed_plan = [{
                    "day": 0, "theme": "Format Error", 
                    "morning": "AI returned text but not JSON.", 
                    "afternoon": clean_text[:100] + "...", 
                    "evening": "Try again."
                }]

            # 4. Success! Return immediately.
            return {
                "trip_plan": parsed_plan,
                "model": model_name
            }

        except Exception as e:
            # 5. Handle "Overloaded", "Quota", "Not Found", or "503" errors
            error_msg = str(e).lower()
            if any(x in error_msg for x in ["503", "overloaded", "429", "404", "not found"]):
                print(f"⚠️ {model_name} is busy/unavailable. Switching to backup...")
                last_error = e
                continue # Try next model in list
            else:
                # If it's a real error (like bad API key), fail immediately
                print(f"❌ Critical Error on {model_name}: {e}")
                raise e

    # If loop finishes without success
    print("❌ All backup models failed.")
    raise HTTPException(
        status_code=503, 
        detail="All AI models are currently overloaded. Please try again in a few seconds."
    )