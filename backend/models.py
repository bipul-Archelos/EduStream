from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, DateTime
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    is_superuser = Column(Boolean, default=False)
    is_subscribed = Column(Boolean, default=False)

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    description = Column(String)
    
class Content(Base):
    __tablename__ = "contents"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content_type = Column(String)
    file_url = Column(String)
    is_premium = Column(Boolean, default=True)
    # 👇 FIX 1: "subjects.id" (plural)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    
class LiveSession(Base):
    __tablename__= "live_sessions"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    stream_link = Column(String)
    start_time = Column(DateTime)
    is_active = Column(Boolean, default=False)
    # 👇 FIX: Ye sahi tha, bas verify kar lein
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    
class Plan(Base):
    __tablename__ = "plans"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    price = Column(Integer)
    duration_days = Column(Integer)
    
class UserSubscription(Base):
    __tablename__ = "user_subscriptions"
    id = Column(Integer, primary_key=True, index=True)
    # 👇 FIX 2: "users.id" (plural) - Aapne "user.id" likha tha
    user_id = Column(Integer, ForeignKey("users.id"))
    plan_id = Column(Integer, ForeignKey("plans.id"))
    
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime)
    is_active = Column(Boolean, default=True)
    
class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer,primary_key= True, index = True)
    content = Column(String)
    user_id = Column(Integer,ForeignKey("users.id"))
    subject_id = Column(Integer,ForeignKey("subjects.id"))

