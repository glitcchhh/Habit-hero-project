# schemas.py
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date

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
    scheduled_days: Optional[List[str]] = None  # New field

class HabitCreate(HabitBase):
    user_id: int

class Habit(HabitBase):
    id: int
    user_id: int
    current_streak: int = 0
    longest_streak: int = 0
    last_completed_date: Optional[date] = None

    class Config:
        orm_mode = True

class HabitUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    scheduled_days: Optional[List[str]] = None


# --- Streak Stats Schema ---
class StreakStats(BaseModel):
    current_streak: int
    longest_streak: int
    total_completed: int


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