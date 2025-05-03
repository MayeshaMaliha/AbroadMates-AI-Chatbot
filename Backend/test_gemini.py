import os
import json
import requests
from dotenv import load_dotenv

print("🚀 Starting Gemini API test...")

# Load the API key
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ API key not found in .env")
    exit()

# ✅ Use a model you actually have access to
model = "models/gemini-1.5-flash"

url = f"https://generativelanguage.googleapis.com/v1/{model}:generateContent"

headers = {
    "Content-Type": "application/json"
}

params = {
    "key": api_key
}

payload = {
    "contents": [{
        "parts": [{
            "text": "What is the capital of France?"
        }]
    }],
    "generationConfig": {
        "temperature": 0.7,
        "maxOutputTokens": 256
    }
}

try:
    response = requests.post(url, headers=headers, params=params, json=payload)
    response.raise_for_status()
    data = response.json()
    print("✅ Gemini is working! Response:")
    print(data['candidates'][0]['content']['parts'][0]['text'])

except Exception as e:
    print("❌ Something went wrong:")
    print(str(e))
