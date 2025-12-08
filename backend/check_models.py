# file: check_models.py
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Env variables load karein
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ Error: .env file mein GEMINI_API_KEY nahi mili!")
else:
    print(f"🔑 Key found: {api_key[:5]}... (Checking Google Servers...)")
    
    try:
        genai.configure(api_key=api_key)
        
        print("\n✅ Available Models for you:")
        found_any = False
        for m in genai.list_models():
            # Sirf wo models dikhao jo Chat ke liye hain
            if 'generateContent' in m.supported_generation_methods:
                print(f"   👉 {m.name}")
                found_any = True
        
        if not found_any:
            print("⚠️  Koi model nahi mila! Shayad API Key mein permission issue hai.")
            
    except Exception as e:
        print(f"\n❌ Error: {e}")