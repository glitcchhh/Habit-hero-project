from pydantic import BaseModel, EmailStr
from typing import Optional

# --- User Schemas ---
class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(UserBase):
    id: int
    class Config:
        orm_mode = True


# --- Habit Schemas ---
class HabitBase(BaseModel):
    name: str
    completed: bool = False
    category: Optional[str] = None

class HabitCreate(HabitBase):
    user_id: int  # <-- Add this

class Habit(HabitBase):
    id: int
    user_id: int
    class Config:
        orm_mode = True


# --- Goal Schemas ---
class GoalBase(BaseModel):
    title: str
    description: Optional[str] = None

class GoalCreate(GoalBase):
    pass

class Goal(GoalBase):
    id: int
    class Config:
        orm_mode = True
