from pydantic import BaseModel

class HabitBase(BaseModel):
    name: str
    completed: bool = False

class HabitCreate(HabitBase):
    pass

class Habit(HabitBase):
    id: int
    class Config:
        orm_mode = True

class GoalBase(BaseModel):
    name: str

class GoalCreate(GoalBase):
    pass

class Goal(GoalBase):
    id: int
    class Config:
        orm_mode = True
