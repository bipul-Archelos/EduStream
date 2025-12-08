from database import SessionLocal, engine, Base
from models import Subject, Content, Plan, User, UserSubscription
from datetime import datetime, timedelta, timezone

# Database connect karo
db = SessionLocal()

def seed_data():
    print("🌱 Seeding Database...")

    # 1. Create Subject (ID 1)
    subject = db.query(Subject).filter(Subject.id == 1).first()
    if not subject:
        subject = Subject(name="Python Programming")
        db.add(subject)
        db.commit()
        print("✅ Subject 'Python Programming' created (ID: 1)")
    else:
        print("ℹ️ Subject already exists.")

    # 2. Add Dummy Content (Videos & PDFs)
    contents = [
        {"title": "Chapter 1: Python Basics", "url": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", "type": "video"},
        {"title": "Chapter 2: Loops & Logic", "url": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", "type": "video"},
        {"title": "Python Cheatsheet.pdf", "url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", "type": "pdf"},
        {"title": "Project Source Code.pdf", "url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", "type": "pdf"},
    ]

    for item in contents:
        exists = db.query(Content).filter(Content.title == item["title"]).first()
        if not exists:
            new_content = Content(
                title=item["title"],
                file_url=item["url"],
                content_type=item["type"],
                subject_id=1,  # Linking to Python
                is_premium=True
            )
            db.add(new_content)
    
    db.commit()
    print(f"✅ Added {len(contents)} content items.")

    # 3. Create Subscription Plan
    plan = db.query(Plan).filter(Plan.id == 1).first()
    if not plan:
        plan = Plan(name="Premium Monthly", price=499, duration_days=30)
        db.add(plan)
        db.commit()
        print("✅ Plan 'Premium Monthly' created.")

    # 4. (Optional) Make ALL users Premium
    users = db.query(User).all()
    for user in users:
        # Check active sub
        sub = db.query(UserSubscription).filter(UserSubscription.user_id == user.id).first()
        if not sub:
            new_sub = UserSubscription(
                user_id=user.id,
                plan_id=1,
                end_date=datetime.now(timezone.utc) + timedelta(days=365),
                is_active=True
            )
            db.add(new_sub)
            print(f"🎉 User {user.email} is now Premium!")
    
    db.commit()
    print("\n🚀 Database populated successfully! Restart your Frontend.")

if __name__ == "__main__":
    seed_data()