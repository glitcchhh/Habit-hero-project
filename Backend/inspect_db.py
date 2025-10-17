from database import SessionLocal
import models

# Open a session
db = SessionLocal()

# Get all users
users = db.query(models.User).all()
for u in users:
    print(u.id, u.name, u.email, u.phone)

# Get all habits
habits = db.query(models.Habit).all()
for h in habits:
    print(h.id, h.name, h.completed, h.category, h.user_id)

db.close()
