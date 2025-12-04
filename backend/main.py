from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
import shutil
from fastapi.responses import FileResponse
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from passlib.context import CryptContext 
import os

# --- Database Setup ---
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://admin:root@localhost:5432/edustream")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- Models ---
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String) 

Base.metadata.create_all(bind=engine)

# --- Schemas ---
class UserRegister(BaseModel):
    email: str
    password: str
    role: str

class UserLogin(BaseModel):
    email: str
    password: str

# --- Utils ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- App ---
app = FastAPI()

# Enable CORS 
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "EduStream API Live 🚀"}

# --- 1. SIGNUP API ---
@app.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = pwd_context.hash(user.password)
    new_user = User(email=user.email, password=hashed_password, role=user.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"status": "User Created", "email": new_user.email}

# --- 2. LOGIN API ---
@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid Credentials")
    
    return {"status": "Login Successful", "role": db_user.role, "token": "fake-jwt-token-123"}

# --- 3. VIDEO UPLOAD API ---
@app.post("/upload_video")
async def upload_video(file: UploadFile = File(...)):
    # Videos folder banao agar nahi hai
    os.makedirs("videos", exist_ok=True)
    
    file_location = f"videos/{file.filename}"
    
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
    
    return {"info": f"video '{file.filename}' saved successfully"}

# --- 4. VIDEO STREAM API ---
@app.get("/video/{video_name}")
def stream_video(video_name: str):
    video_path = f"videos/{video_name}"
    # Fixed Typo here: vidoe_path -> video_path
    if os.path.exists(video_path):
        return FileResponse(video_path, media_type="video/mp4")
    return {"error": "Video not found"}