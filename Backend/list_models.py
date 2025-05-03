import os
import requests
from dotenv import load_dotenv

print("📦 Fetching list of available Gemini models...")

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

url = "https://generativelanguage.googleapis.com/v1/models"
params = {"key": api_key}

response = requests.get(url, params=params)
print(response.json())
