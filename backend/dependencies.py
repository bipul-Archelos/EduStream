from fastapi import HTTPException, Depends, status
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db          # Aapka database connection
from models import User, UserSubscription # Aapke models

# Yeh function har premium route par guard ki tarah khada rahega
async def get_premium_access(
    current_user: User = Depends(get_current_user), # Pehle check karo user login hai ya nahi
    db: Session = Depends(get_db)                   # Database session lo
):
    # 1. Agar Admin hai, toh sab free hai (No restrictions)
    if current_user.is_superuser:
        return current_user

    # 2. Database mein check karo: "Kya is user ka koi ACTIVE plan hai?"
    # Hum 'end_date' ko descending order mein sort karte hain taaki sabse latest plan mile
    subscription = db.query(UserSubscription).filter(
        UserSubscription.user_id == current_user.id,
        UserSubscription.is_active == True
    ).order_by(UserSubscription.end_date.desc()).first()

    # 3. Logic: Agar plan nahi mila YA plan ki date purani ho gayi hai
    if not subscription or subscription.end_date < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="⚠️ Access Denied! Aapka subscription expire ho gaya hai. Please recharge karein."
        )

    # 4. Agar sab sahi hai, toh aage jane do
    return current_user