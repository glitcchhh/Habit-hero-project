from pydantic import BaseModel, EmailStr

# User schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(UserBase):
    id: int
    class Config:
        orm_mode = True

# Habit schemas
class HabitBase(BaseModel):
    name: str
    completed: bool = False

class HabitCreate(HabitBase):
    pass

class Habit(HabitBase):
    id: int
    class Config:
        orm_mode = True

# Goal schemas
class GoalBase(BaseModel):
    title: str
    description: str | None = None

class GoalCreate(GoalBase):
    pass

class Goal(GoalBase):
    id: int
    class Config:
        orm_mode = True
