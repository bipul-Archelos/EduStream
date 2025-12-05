from pydantic import BaseModel, Field

class UserCreate(BaseModel):
    username: str
    email: str
    # Enforce max_length to prevent the 500 Internal Server Error
    password: str = Field(..., min_length=8, max_length=70)