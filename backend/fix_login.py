# file: fix_login.py
import sys
import os
# Path fix karne ke liye
sys.path.append(os.getcwd())

from database import SessionLocal, engine, Base
from models import User
from passlib.context import CryptContext

# Database tables create karein (agar nahi hain)
Base.metadata.create_all(bind=engine)

db = SessionLocal()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_sure_admin():
    email = "admin@test.com"
    password = "123"
    
    # Check karein agar user pehle se hai
    existing_user = db.query(User).filter(User.email == email).first()
    
    if existing_user:
        # Agar hai, to delete kar dein taaki fresh bana sakein
        db.delete(existing_user)
        db.commit()
        print(f"🗑️  Purana user '{email}' delete kiya...")

    # Naya User Banayein
    hashed_password = pwd_context.hash(password)
    
    new_user = User(
        email=email,
        password=hashed_password,
        username="TestAdmin",
        is_superuser=True,
        is_subscribed=True
    )
    
    db.add(new_user)
    db.commit()
    print("------------------------------------------------")
    print("✅ SUCCESS! Naya Admin User Ban Gaya Hai")
    print(f"📧 Username/Email:  {email}")
    print(f"🔑 Password:        {password}")
    print("------------------------------------------------")
    print("Ab Swagger UI par jake INHI details se login karein.")

if __name__ == "__main__":
    create_sure_admin()