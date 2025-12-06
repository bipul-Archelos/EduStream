# main.py - COMPLETE GEMINI VERSION

import os
import shutil
from datetime import datetime, timedelta
from typing import List

from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext 
from jose import JWTError, jwt 
from sqladmin import Admin, ModelView
from dotenv import load_dotenv

# --- NEW: Google Gemini Import ---
import google.generativeai as genai 

# --- Custom Imports ---
# Ensure database.py and models.py exist in the same folder
from database import engine, SessionLocal, Base, get_db
from models import User, Subject, Content, Plan, UserSubscription, LiveSession

# --- Environment Setup ---
load_dotenv()

# --- GEMINI SETUP (FREE) ---
# Ensure GEMINI_API_KEY is in your .env file
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# --- Configuration ---
SECRET_KEY = "SECRET_KEY_HERE" # Production mein change karein
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# --- App Setup ---
app = FastAPI()

# Enable CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Admin Panel Setup
admin = Admin(app, engine)

class UserAdmin(ModelView, model=User):
    column_list = [User.id, User.email, User.username, User.is_superuser]
    column_details_exclude_list = [User.password]
    name = "User"
    name_plural = "Users"
    icon = "fa-solid fa-user"

admin.add_view(UserAdmin)

# Create Tables (if not exist)
Base.metadata.create_all(bind=engine)

# --- Utils ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# --- Helper Functions ---

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

async def get_premium_access(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.is_superuser:
        return current_user

    subscription = db.query(UserSubscription).filter(
        UserSubscription.user_id == current_user.id,
        UserSubscription.is_active == True
    ).order_by(UserSubscription.end_date.desc()).first()

    if not subscription or subscription.end_date < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="⚠️ Premium Content! Please subscription kharidein."
        )

    return current_user

# Helper for study material logic
def check_active_subscription(user, db):
    sub = db.query(UserSubscription).filter(
        UserSubscription.user_id == user.id,
        UserSubscription.is_active == True
    ).order_by(UserSubscription.end_date.desc()).first()
    if sub and sub.end_date > datetime.utcnow():
        return True
    return False

# --- Schemas ---
from pydantic import BaseModel

class UserRegister(BaseModel):
    email: str
    password: str
    role: str = "student"

class SubjectChatRequest(BaseModel):
    subject: str
    question: str

# ================= ROUTES =================

@app.get("/")
def home():
    return {"message": "EduStream API Live (Powered by Gemini) 🚀"}

# --- 1. REGISTER ---
@app.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = pwd_context.hash(user.password)
    new_user = User(email=user.email, password=hashed_password) 
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"status": "User Created", "email": new_user.email}

# --- 2. LOGIN ---
@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not pwd_context.verify(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid Credentials")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# --- 3. VIDEO UPLOAD ---
@app.post("/upload_video")
async def upload_video(file: UploadFile = File(...)):
    os.makedirs("videos", exist_ok=True)
    file_location = f"videos/{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
    return {"info": f"video '{file.filename}' saved successfully"}

# --- 4. VIDEO STREAM ---
@app.get("/video/{video_name}")
def stream_video(video_name: str):
    video_path = f"videos/{video_name}"
    if os.path.exists(video_path):
        return FileResponse(video_path, media_type="video/mp4")
    return {"error": "Video not found"}

# --- 5. SUBJECTS ---
@app.post("/subjects/")
def create_subject(name: str, db: Session = Depends(get_db)):
    new_subject = Subject(name=name)
    db.add(new_subject)
    db.commit()
    return {"msg": "Subject created"}

# --- 6. CONTENT ---
@app.post("/content/")
def add_content(title: str, file_url: str, type: str, subject_id: int, is_premium: bool, db: Session = Depends(get_db)):
    new_content = Content(title=title, file_url=file_url, content_type=type, subject_id=subject_id, is_premium=is_premium)
    db.add(new_content)
    db.commit()
    return {"msg": "Content added"}

@app.get("/study-material/{subject_id}")
def get_materials(subject_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    materials = db.query(Content).filter(Content.subject_id == subject_id).all()
    output = []
    for item in materials:
        if item.is_premium and not getattr(user, 'is_superuser', False) and not check_active_subscription(user, db):
             output.append({"title": item.title, "access": "LOCKED 🔒", "url": None})
        else:
             output.append({"title": item.title, "access": "OPEN ✅", "url": item.file_url})
    return output

# --- 7. LIVE CLASSES ---
@app.get("/live-classes/")
def get_live_classes(user: User = Depends(get_premium_access), db: Session = Depends(get_db)):
    classes = db.query(LiveSession).filter(LiveSession.is_active == True).all()
    return classes

# --- 8. AI TUTOR (GEMINI) ---
@app.post("/ask-tutor")
async def ask_subject_tutor(request: SubjectChatRequest):
    # 1. System Prompt Prepare karo
    system_prompt = f"You are an expert {request.subject} teacher for school students. Explain concepts simply."
    if request.subject.lower() == "math":
        system_prompt += " Solve problems step-by-step."
    
    full_prompt = f"{system_prompt}\n\nStudent Question: {request.question}"

    try:
        # 2. Gemini Model Call karo (Free Model)
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(full_prompt)
        return {"answer": response.text}
    except Exception as e:
        return {"error": str(e), "hint": "Check your GEMINI_API_KEY in .env file"}

# --- 9. PLANS & SUBSCRIPTIONS ---
@app.post("/plans")
def create_plan(name: str, price: int, days: int, db: Session = Depends(get_db)):
    new_plan = Plan(name=name, price=price, duration_days=days)
    db.add(new_plan)
    db.commit()
    return {"msg": f"Plan '{name}' created for ₹{price}"}

@app.post("/buy-subscription/")
def buy_subscription(plan_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plan = db.query(Plan).filter(Plan.id == plan_id).first()
    if not plan:
        return {"error": "Plan nahi mila"}

    expiry_date = datetime.utcnow() + timedelta(days=plan.duration_days)
    
    new_sub = UserSubscription(
        user_id=user.id,
        plan_id=plan.id,
        end_date=expiry_date,
        is_active=True
    )
    
    db.add(new_sub)
    db.commit()
    
    return {
        "msg": "Badhai ho! Subscription active hai.",
        "plan": plan.name,
        "expires_on": expiry_date
    }