# main.py
from fastapi import FastAPI, HTTPException, Depends ,Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from passlib.context import CryptContext
from typing import List
from datetime import date, timedelta
import models, schemas
from database import SessionLocal, engine, Base
import httpx
import os

# --- Create all database tables ---
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Habit Tracker API")

# --- CORS middleware ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Password hashing ---
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)

# --- Database session dependency ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- Streak Calculation Helper ---
def calculate_streak(habit: models.Habit, db: Session) -> int:
    """Calculate current streak for a habit"""
    if not habit.last_completed_date:
        return 0
    
    today = date.today()
    last_date = habit.last_completed_date
    
    # Check if streak is broken (more than 1 day gap)
    if (today - last_date).days > 1:
        return 0
    
    # Count consecutive days
    completions = db.query(models.HabitCompletion).filter(
        models.HabitCompletion.habit_id == habit.id
    ).order_by(models.HabitCompletion.completed_date.desc()).all()
    
    if not completions:
        return 0
    
    streak = 0
    expected_date = today
    
    for completion in completions:
        if completion.completed_date == expected_date or completion.completed_date == expected_date - timedelta(days=1):
            streak += 1
            expected_date = completion.completed_date - timedelta(days=1)
        else:
            break
    
    return streak


def update_habit_streak(habit: models.Habit, db: Session):
    """Update habit streak when completed"""
    today = date.today()
    
    # Check if already completed today
    existing_completion = db.query(models.HabitCompletion).filter(
        models.HabitCompletion.habit_id == habit.id,
        models.HabitCompletion.completed_date == today
    ).first()
    
    if habit.completed and not existing_completion:
        # Add completion record
        completion = models.HabitCompletion(
            habit_id=habit.id,
            completed_date=today
        )
        db.add(completion)
        
        # Update streak
        if habit.last_completed_date:
            days_diff = (today - habit.last_completed_date).days
            if days_diff == 1:
                # Continue streak
                habit.current_streak += 1
            elif days_diff == 0:
                # Same day, no change
                pass
            else:
                # Streak broken, restart
                habit.current_streak = 1
        else:
            # First completion
            habit.current_streak = 1
        
        habit.last_completed_date = today
        
        # Update longest streak
        if habit.current_streak > habit.longest_streak:
            habit.longest_streak = habit.current_streak
    
    elif not habit.completed and existing_completion:
        # Remove completion record
        db.delete(existing_completion)
        
        # Recalculate streak
        habit.current_streak = calculate_streak(habit, db)
        
        # Update last completed date
        last_completion = db.query(models.HabitCompletion).filter(
            models.HabitCompletion.habit_id == habit.id
        ).order_by(models.HabitCompletion.completed_date.desc()).first()
        
        habit.last_completed_date = last_completion.completed_date if last_completion else None


# ------------------- USERS ------------------- #

@app.post("/signup/", response_model=schemas.User)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(user.password)
    db_user = models.User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.post("/login/")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "success": True,
        "message": "Login successful",
        "user_id": db_user.id,
        "name": db_user.name
    }


@app.get("/users/", response_model=List[schemas.User])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()




# ------------------- HABITS ------------------- #

@app.post("/habits/", response_model=schemas.Habit)
def create_habit(habit: schemas.HabitCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == habit.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db_habit = models.Habit(
        name=habit.name,
        completed=habit.completed,
        category=habit.category,
        user_id=habit.user_id,
        current_streak=0,
        longest_streak=0,
        scheduled_days=habit.scheduled_days  # Save scheduled days
    )
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit


@app.get("/habits/{user_id}", response_model=List[schemas.Habit])
def get_user_habits(user_id: int, db: Session = Depends(get_db)):
    habits = db.query(models.Habit).filter(models.Habit.user_id == user_id).all()
    
    # Update streaks for all habits
    for habit in habits:
        habit.current_streak = calculate_streak(habit, db)
    
    db.commit()
    return habits


@app.put("/habits/{habit_id}", response_model=schemas.Habit)
def toggle_habit(habit_id: int, db: Session = Depends(get_db)):
    habit = db.query(models.Habit).filter(models.Habit.id == habit_id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    habit.completed = not habit.completed
    update_habit_streak(habit, db)
    
    db.commit()
    db.refresh(habit)
    return habit


@app.get("/habits/stats/{user_id}", response_model=schemas.StreakStats)
def get_user_streak_stats(user_id: int, db: Session = Depends(get_db)):
    """Get overall streak statistics for a user"""
    habits = db.query(models.Habit).filter(models.Habit.user_id == user_id).all()
    
    if not habits:
        return schemas.StreakStats(
            current_streak=0,
            longest_streak=0,
            total_completed=0
        )
    
    # Calculate best current streak across all habits
    current_streak = max([calculate_streak(habit, db) for habit in habits], default=0)
    
    # Get longest streak across all habits
    longest_streak = max([habit.longest_streak for habit in habits], default=0)
    
    # Get total completions
    total_completed = db.query(func.count(models.HabitCompletion.id)).join(
        models.Habit
    ).filter(models.Habit.user_id == user_id).scalar()
    
    return schemas.StreakStats(
        current_streak=current_streak,
        longest_streak=longest_streak,
        total_completed=total_completed or 0
    )


@app.delete("/habits/{habit_id}")
def delete_habit(habit_id: int, db: Session = Depends(get_db)):
    habit = db.query(models.Habit).filter(models.Habit.id == habit_id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    # Delete all related habit completions first
    db.query(models.HabitCompletion).filter(
        models.HabitCompletion.habit_id == habit_id
    ).delete()
    
    # Delete the habit
    db.delete(habit)
    db.commit()
    return {"message": "Habit deleted successfully"}


@app.put("/habits/{habit_id}/update", response_model=schemas.Habit)
def update_habit(habit_id: int, habit_update: schemas.HabitUpdate, db: Session = Depends(get_db)):
    habit = db.query(models.Habit).filter(models.Habit.id == habit_id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    # Update habit fields
    if habit_update.name is not None:
        habit.name = habit_update.name
    if habit_update.category is not None:
        habit.category = habit_update.category
    if habit_update.scheduled_days is not None:
        habit.scheduled_days = habit_update.scheduled_days
    
    db.commit()
    db.refresh(habit)
    return habit

#----------------Habit suggestion using OpenAI------------------------------
PERPLEXITY_API_KEY = "API KEY"
PERPLEXITY_API_URL = "API URL"

@app.post("/ai/habit-suggestions")
async def habit_suggestions(request: Request):
    data = await request.json()
    habits = data.get("habits", [])
    if not habits:
        raise HTTPException(status_code=400, detail="No habits provided")

    habit_list_str = ", ".join(habits)
    prompt = (
        f"Given the following existing habits: {habit_list_str}, "
        "suggest 3 fun and quirky new habits that go well with them. "
        "Present each habit with a catchy name and a short, playful description. "
        "The response should sound friendly and casual, like you're chatting with a buddy. "
        "Format it like: Hey, your today's suggestions include [list of suggested habits and descriptions]. "
        "No bold words or formal tone."
    )

    headers = {
        "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "sonar",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 100,
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(PERPLEXITY_API_URL, headers=headers, json=payload)
        except Exception as e:
            print(f"❌ Exception while calling Perplexity API: {e}")
            fallback_suggestions = """Based on your current habits, here are some complementary suggestions:
1. Morning Stretching - A gentle way to start your day and complement your exercise routine
2. Journal Writing - Great for reflection and mental clarity alongside meditation
3. Hydration Tracking - Essential for overall health and wellness
These suggestions are generated locally when AI services are unavailable."""
            return {"suggestions": fallback_suggestions}

    if response.status_code == 200:
        data = response.json()
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        print(f"✅ Perplexity API responded: {content}")
        return {"suggestions": content}
    else:
        print(f"❌ Perplexity API error {response.status_code}: {response.text}")
        fallback_suggestions = """Based on your current habits, here are some complementary suggestions:
1. Morning Stretching - A gentle way to start your day and complement your exercise routine
2. Journal Writing - Great for reflection and mental clarity alongside meditation
3. Hydration Tracking - Essential for overall health and wellness
These suggestions are generated locally when AI services are unavailable."""
        return {"suggestions": fallback_suggestions}

# ------------------- GOALS ------------------- #

@app.post("/goals/", response_model=schemas.Goal)
def create_goal(goal: schemas.GoalCreate, db: Session = Depends(get_db)):
    db_goal = models.Goal(title=goal.title, description=goal.description)
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal


@app.get("/goals/", response_model=List[schemas.Goal])
def get_goals(db: Session = Depends(get_db)):
    return db.query(models.Goal).all()