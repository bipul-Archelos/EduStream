import os
import shutil
from datetime import datetime, timedelta, timezone # <--- Updated Import
from typing import List
import razorpay # <--- Razorpay Import
from fastapi.responses import StreamingResponse

from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext 
from jose import JWTError, jwt 
from sqladmin import Admin, ModelView
from dotenv import load_dotenv
import google.generativeai as genai 
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import io

# --- Custom Imports ---
from database import engine, SessionLocal, Base, get_db
from models import User, Subject, Content, Plan, UserSubscription, LiveSession

# --- Environment Setup ---
load_dotenv()

# --- GEMINI SETUP ---
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# --- RAZORPAY SETUP ---
# .env se keys lena best practice hai, par yahan hardcode kar sakte hain testing ke liye
razorpay_client = razorpay.Client(auth=("YOUR_KEY_ID_HERE", "YOUR_KEY_SECRET_HERE"))

# --- Configuration ---
SECRET_KEY = "SECRET_KEY_HERE"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# --- App Setup ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

admin = Admin(app, engine)
class UserAdmin(ModelView, model=User):
    column_list = [User.id, User.email, User.username, User.is_superuser]
    column_details_exclude_list = [User.password]
    name = "User"
    name_plural = "Users"
    icon = "fa-solid fa-user"
admin.add_view(UserAdmin)

Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# --- Helper Functions ---

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    
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

# Helper to get current UTC time without timezone info (for DB compatibility)
def get_utcnow():
    return datetime.now(timezone.utc).replace(tzinfo=None)

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

    # FIX: Use get_utcnow() for comparison
    if not subscription or subscription.end_date < get_utcnow():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="⚠️ Premium Content! Please subscription kharidein."
        )

    return current_user

def check_active_subscription(user, db):
    sub = db.query(UserSubscription).filter(
        UserSubscription.user_id == user.id,
        UserSubscription.is_active == True
    ).order_by(UserSubscription.end_date.desc()).first()
    
    # FIX: Use get_utcnow()
    if sub and sub.end_date > get_utcnow():
        return True
    return False

# --- Pydantic Models ---
from pydantic import BaseModel

class UserRegister(BaseModel):
    email: str
    password: str
    role: str = "student"

class SubjectChatRequest(BaseModel):
    subject: str
    question: str

class LiveSessionCreate(BaseModel):
    title: str
    stream_link: str
    subject_id: int

class NoteSchema(BaseModel):
    content:str
    subject_id:int
# ================= ROUTES =================

@app.get("/")
def home():
    return {"message": "EduStream API Live 🚀"}

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

@app.get("/profile")
def get_user_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    subscription = db.query(UserSubscription).filter(
        UserSubscription.user_id == user.id,
        UserSubscription.is_active == True
    ).order_by(UserSubscription.end_date.desc()).first()

    plan_details = "Free Plan"
    expiry_date = None
    days_left = 0

    if subscription:
        plan = db.query(Plan).filter(Plan.id == subscription.plan_id).first()
        if plan:
            plan_details = plan.name
        
        expiry_date = subscription.end_date
        # FIX: Use get_utcnow() for subtraction
        delta = subscription.end_date - get_utcnow()
        days_left = delta.days

    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "is_superuser": user.is_superuser,
        "plan": plan_details,
        "days_left": days_left if days_left > 0 else 0,
        "expiry_date": expiry_date
    }

@app.post("/upload_video")
async def upload_video(file: UploadFile = File(...)):
    os.makedirs("videos", exist_ok=True)
    file_location = f"videos/{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
    return {"info": f"video '{file.filename}' saved successfully"}

@app.get("/video/{video_name}")
def stream_video(video_name: str):
    video_path = f"videos/{video_name}"
    if os.path.exists(video_path):
        return FileResponse(video_path, media_type="video/mp4")
    return {"error": "Video not found"}

@app.post("/subjects/")
def create_subject(name: str, db: Session = Depends(get_db)):
    new_subject = Subject(name=name)
    db.add(new_subject)
    db.commit()
    return {"msg": "Subject created"}

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
             output.append({"title": item.title, "access": "LOCKED 🔒", "url": None, "content_type": item.content_type})
        else:
             output.append({"title": item.title, "access": "OPEN ✅", "url": item.file_url, "content_type": item.content_type})
    return output

@app.get("/live-classes/")
def get_live_classes(user: User = Depends(get_premium_access), db: Session = Depends(get_db)):
    classes = db.query(LiveSession).filter(LiveSession.is_active == True).all()
    return classes

@app.post("/live-sessions/")
def create_live_session(session: LiveSessionCreate, db: Session = Depends(get_db)):
    new_session = LiveSession(
        title=session.title,
        stream_link=session.stream_link,
        start_time=get_utcnow(), # FIX: Use get_utcnow()
        is_active=True,
        subject_id=session.subject_id
    )
    db.add(new_session)
    db.commit()
    return {"msg": "Live Class Started!", "id": new_session.id}

@app.post("/ask-tutor")
async def ask_subject_tutor(request: SubjectChatRequest):
    system_prompt = f"You are an expert {request.subject} teacher for school students. Explain concepts simply."
    if request.subject.lower() == "math":
        system_prompt += " Solve problems step-by-step."
    
    full_prompt = f"{system_prompt}\n\nStudent Question: {request.question}"

    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(full_prompt)
        return {"answer": response.text}
    except Exception as e:
        return {"error": str(e), "hint": "Check your GEMINI_API_KEY in .env file"}

@app.post("/plans")
def create_plan(name: str, price: int, days: int, db: Session = Depends(get_db)):
    new_plan = Plan(name=name, price=price, duration_days=days)
    db.add(new_plan)
    db.commit()
    return {"msg": f"Plan '{name}' created for ₹{price}"}

@app.post("/create-order")
def create_order(amount: int, db: Session = Depends(get_db)):
    data = { "amount": amount * 100, "currency": "INR", "payment_capture": "1" }
    try:
        order = razorpay_client.order.create(data=data)
        return order
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/buy-subscription/")
def buy_subscription(plan_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    plan = db.query(Plan).filter(Plan.id == plan_id).first()
    if not plan:
        return {"error": "Plan nahi mila"}

    # FIX: Use get_utcnow() for calculation
    expiry_date = get_utcnow() + timedelta(days=plan.duration_days)
    
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
    
@app.get("/generate-certificate")
def generate_certificate(user: User = Depends(get_current_user),db:Session = Depends(get_db)):
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize = letter)
    width,height = letter
    
    c.setStrokeColorRGB(0.2,0.2,0.8)
    c.setLineWidth(5)
    c.rect(50,50, width-100,height-100)
    c.setFont("Helvetica-Bold",30)
    c.drawCentredString(width/2,height-150,"CERTIFICATE OF COMPLETION")
    
    c.setFont("Helvetica",15)
    c.setFillColorRGB(0.2,0.2,0.8)
    name = user.email.split("@")[0].upper()
    c.drawCentredString(width/2,height-250,name)
    
    c.setFillColorRGB(0,0,0)
    c.setFont("Helvetica",15)
    c.drawCentredString(width/2,height-300,"has successfully completed the course.")
    
    c.setFont("Helvetica-Bold",20)
    c.drawCentredString(width/2,height-330,"Python Masterclass")
    
    c.setFont("Helvetica",12)
    date_str = datetime.now(timezone.utc).strftime("%d %B, %Y")
    c.drawCentredString(width/2,height-400,f"Date: {date_str}")
    
    c.line(width/2,height-500,width/2+100,height-500)
    c.setFont("Helvetica-Oblique",12)
    c.drawCentredString(width/2,height-500,"EduStream Instructor")
    
    c.save()
    buffer.seek(0)
    
    return StreamingResponse(buffer,media_type="application/pdf",headers={"Content-Disposition":"attachment; filename=certificate.pdf"})

@app.post("/notes")
def save_note(note: NoteSchema,user:User = Depends(get_current_user),db:Session = Depends(get_db)):
    existing = db.query(Note).filter(Note.user_id == user.id, Note.subject_id == note.subject_id).first()
    if existing:
        existing.content = note.content
    else:
        new_note = Note(content= note.content, user_id = user.id, subject_id = note.subject_id)
        db.add(new_note)
    db.commit()
    return {"msg":"Note Saved"}

@app.get("/notes/{subject_id}")
def get_note(subject_id:int, user:User = Depends(get_current_user),db:Session = Depends(get_db)):
    note = db.query(Note).filter(Note.user_id == user.id, Note.subject_id == subject_id)
    return {"content": note.content if note else ""}