import sys
import os
sys.path.append(os.getcwd())
from database import SessionLocal, engine, Base
from models import User
from passlib.context import CryptContext
User.__table__.drop(engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_super_user():
    db = SessionLocal()
    
    existing_admin = db.query(User).filter(User.email == "admin@edustream.com").first()
    if existing_admin:
        print("Admin user already existes")
        return
    
    admin_user = User(
        email="admin@edustream.com",
        username="admin",
        password=pwd_context.hash("SecureAdminPassword123!"),
        is_superuser=True
    )
    
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    print(f"Admin created: {admin_user.email}")
    db.close()
    
if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    create_super_user()