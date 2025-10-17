from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import SessionLocal, engine, Base
import models, schemas

# Create SQLite tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Habit Tracker API")

# Dependency for DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- HABITS --- #
@app.post("/habits/", response_model=schemas.Habit)
def create_habit(habit: schemas.HabitCreate, db: Session = Depends(get_db)):
    db_habit = models.Habit(name=habit.name, completed=habit.completed)
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit

@app.get("/habits/", response_model=List[schemas.Habit])
def get_habits(db: Session = Depends(get_db)):
    return db.query(models.Habit).all()

@app.put("/habits/{habit_id}", response_model=schemas.Habit)
def update_habit(habit_id: int, habit: schemas.HabitCreate, db: Session = Depends(get_db)):
    db_habit = db.query(models.Habit).filter(models.Habit.id == habit_id).first()
    if not db_habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    db_habit.name = habit.name
    db_habit.completed = habit.completed
    db.commit()
    db.refresh(db_habit)
    return db_habit

@app.delete("/habits/{habit_id}")
def delete_habit(habit_id: int, db: Session = Depends(get_db)):
    db_habit = db.query(models.Habit).filter(models.Habit.id == habit_id).first()
    if not db_habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    db.delete(db_habit)
    db.commit()
    return {"message": "Habit deleted"}

# --- GOALS --- #
@app.post("/goals/", response_model=schemas.Goal)
def create_goal(goal: schemas.GoalCreate, db: Session = Depends(get_db)):
    db_goal = models.Goal(name=goal.name)
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

@app.get("/goals/", response_model=List[schemas.Goal])
def get_goals(db: Session = Depends(get_db)):
    return db.query(models.Goal).all()

# --- Optional: Progress endpoint --- #
@app.get("/progress/")
def get_progress(db: Session = Depends(get_db)):
    habits = db.query(models.Habit).all()
    total = len(habits)
    completed = len([h for h in habits if h.completed])
    percent = round((completed / total) * 100) if total > 0 else 0
    return {"completed": completed, "total": total, "percent": percent}
