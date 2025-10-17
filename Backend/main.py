from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from typing import List
import models, schemas
from database import SessionLocal, engine, Base

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
    # Check if user exists
    user = db.query(models.User).filter(models.User.id == habit.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db_habit = models.Habit(
        name=habit.name,
        completed=habit.completed,
        category=habit.category,
        user_id=habit.user_id
    )
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit


@app.get("/habits/{user_id}", response_model=List[schemas.Habit])
def get_user_habits(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Habit).filter(models.Habit.user_id == user_id).all()


@app.put("/habits/{habit_id}", response_model=schemas.Habit)
def toggle_habit(habit_id: int, db: Session = Depends(get_db)):
    habit = db.query(models.Habit).filter(models.Habit.id == habit_id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    habit.completed = not habit.completed
    db.commit()
    db.refresh(habit)
    return habit


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
