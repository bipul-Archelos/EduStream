import sys
import os
sys.path.append(os.getcwd())

from database import engine, Base
from models import User,Subject,Content,Plan,UserSubscription,LiveSession

print("⚠️  Purani Tables Delete kar raha hoon...")
Base.metadata.drop_all(bind=engine)

print("✅ Nayi Tables (Naye Columns ke saath) bana raha hoon...")
Base.metadata.create_all(bind=engine)

print("🎉 Database Reset Complete!")