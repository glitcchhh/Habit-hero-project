from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    password = Column(String, nullable=False)

    # Must match the Habit relationship
    habits = relationship("Habit", back_populates="user")


class Habit(Base):
    __tablename__ = "habits"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    completed = Column(Boolean, default=False)
    category = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))

    # Must match the User relationship
    user = relationship("User", back_populates="habits")


class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
