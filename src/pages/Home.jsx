import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import { Home, Activity, Settings, Plus, Calendar, CheckSquare, Square, EllipsisVertical } from "../components/Icons";

// --- Streak Card Component ---
const StreakCard = ({ icon, label, value, color }) => (
  <div className="streak-card" style={{ borderColor: color }}>
    <div className="streak-icon" style={{ color }}>
      {icon}
    </div>
    <div className="streak-info">
      <p className="streak-label">{label}</p>
      <h3 className="streak-value" style={{ color }}>{value}</h3>
    </div>
  </div>
);

// --- Progress Circle ---
const ProgressCircle = ({ percent }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="progress-circle-container">
      <svg viewBox="0 0 120 120" className="progress-circle">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#f0f0f0" strokeWidth="10"></circle>
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3006946e" />
            <stop offset="100%" stopColor="#1b22b0ff" />
          </linearGradient>
        </defs>
      </svg>
      <div className="progress-circle-text">
        <span>{percent}%</span>
      </div>
    </div>
  );
};

// --- Habit Card ---
const HabitCard = ({ habit, toggleHabit }) => (
  <div
    className={`habit-card ${habit.completed ? 'completed' : ''}`}
    onClick={() => toggleHabit(habit.id)}
  >
    <span className={`habit-title ${habit.completed ? 'completed' : ''}`}>
      {habit.name} <small className="habit-type">({habit.category || habit.type})</small>
    </span>
    <div className="flex items-center space-x-2">
      <div className="checkbox-icon">
        {habit.completed ? (
          <CheckSquare color="var(--success-green)" strokeWidth={3} />
        ) : (
          <Square color="#9ca3af" strokeWidth={3} />
        )}
      </div>
      <EllipsisVertical color="#9ca3af" />
    </div>
  </div>
);

// --- Main Component ---
const HomePage = () => {
  const [habits, setHabits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newHabit, setNewHabit] = useState("");
  const [habitType, setHabitType] = useState("Work");
  const [selectedDays, setSelectedDays] = useState([]);
  const navigate = useNavigate();

  const USER_ID = 1; // Hardcoded for now, replace with login user id

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // --- Fetch habits from backend ---
  useEffect(() => {
    axios.get(`http://localhost:8000/habits/${USER_ID}`)
      .then(res => setHabits(res.data))
      .catch(err => console.error('Error fetching habits:', err));
  }, []);

  // --- Toggle habit completion ---
  const toggleHabit = (id) => {
    axios.put(`http://localhost:8000/habits/${id}`)
      .then(res => {
        setHabits(prev =>
          prev.map(h => h.id === id ? res.data : h)
        );
      })
      .catch(err => console.error('Error toggling habit:', err));
  };

  // --- Toggle day selection ---
  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  // --- Add new habit ---
  const addHabit = () => {
    if (!newHabit.trim()) return;

    axios.post("http://localhost:8000/habits/", {
      name: newHabit.trim(),
      completed: false,
      category: habitType,
      user_id: USER_ID,
      scheduledDays: selectedDays // include scheduled days in request
    })
      .then(res => {
        setHabits(prev => [...prev, res.data]);
        setNewHabit("");
        setHabitType("Work");
        setSelectedDays([]);
        setShowModal(false);
      })
      .catch(err => console.error('Error adding habit:', err));
  };

  const { completedCount, totalCount, progressPercent } = useMemo(() => {
    const completed = habits.filter(h => h.completed).length;
    const total = habits.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completedCount: completed, totalCount: total, progressPercent: percent };
  }, [habits]);

  // --- Fetch streak statistics ---
  const [streakStats, setStreakStats] = useState({
    currentStreak: 0,
    longestStreak: 0,
    totalCompleted: 0
  });

  useEffect(() => {
    axios.get(`http://localhost:8000/habits/stats/${USER_ID}`)
      .then(res => setStreakStats({
        currentStreak: res.data.current_streak,
        longestStreak: res.data.longest_streak,
        totalCompleted: res.data.total_completed
      }))
      .catch(err => console.error('Error fetching streak stats:', err));
  }, [habits]);

  return (
    <div className="app-container">
      <div className="main-card">
        <header className="header">
        <p>{new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
          <h1>Hello, <span>User!</span></h1>
        </header>

        {/* Streak Tracker */}
        <div className="streak-container">
          <StreakCard
            icon="🔥"
            label="Current Streak"
            value={`${streakStats.currentStreak} days`}
            color="#ff6b35"
          />
          <StreakCard
            icon="🏆"
            label="Longest Streak"
            value={`${streakStats.longestStreak} days`}
            color="#ffd700"
          />
          <StreakCard
            icon="✅"
            label="Total Completed"
            value={streakStats.totalCompleted}
            color="#10b981"
          />
        </div>

        {/* Progress Card */}
        <div className="progress-card">
          <Calendar className="calendar-bg" />
          <div className="progress-circle-wrapper">
            <ProgressCircle percent={progressPercent} />
          </div>
          <div className="progress-text">
            <h2>{completedCount} of {totalCount} habits completed today!</h2>
            <p>Keep up the great work.</p>
          </div>
        </div>

        {/* Habits */}
        <section className="section">
          <div className="section-header">
            <h2>Today's Habits</h2>
            <button className="see-all-btn" onClick={() => navigate('/allhabits')}>
              See all
            </button>
          </div>
          <div className="section-content">
            {habits.length === 0 ? (
              <p className="no-habits">No habits yet. Click + to add one!</p>
            ) : (
              habits.map(h => <HabitCard key={h.id} habit={h} toggleHabit={toggleHabit} />)
            )}
          </div>
        </section>

        {/* Bottom Navigation */}
        <nav className="bottom-nav">
          <button
            className="nav-link active"
            onClick={() => navigate('/home')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Home />
            <span>Home</span>
          </button>
          <button
            className="nav-link"
            onClick={() => navigate('/stats')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Activity />
            <span>Stats</span>
          </button>
          <button
            className="nav-link"
            onClick={() => navigate('/settings')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Settings />
            <span>Settings</span>
          </button>
        </nav>

        {/* Floating Add Button */}
        <button className="fab" onClick={() => setShowModal(true)}>
          <Plus />
        </button>

        {/* Popup Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Add New Habit</h3>
              <input
                type="text"
                placeholder="Enter habit name..."
                value={newHabit}
                onChange={e => setNewHabit(e.target.value)}
              />
              <select
                value={habitType}
                onChange={e => setHabitType(e.target.value)}
                className="habit-dropdown"
              >
                <option value="Work">Work</option>
                <option value="Sports">Sports</option>
                <option value="Learning">Learning</option>
                <option value="Health">Health</option>
                <option value="Self-care">Self-care</option>
                <option value="Mental Health">Mental Health</option>
              </select>

              {/* Days of Week Selector */}
              <div className="days-selector" style={{ marginTop: '1rem' }}>
                {daysOfWeek.map(day => (
                  <button
                    key={day}
                    type="button"
                    className={`day-button ${selectedDays.includes(day) ? 'selected' : ''}`}
                    onClick={() => toggleDay(day)}
                    style={{
                      margin: '0 3px',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      border: '1px solid #ccc',
                      backgroundColor: selectedDays.includes(day) ? '#1b22b0ff' : 'white',
                      color: selectedDays.includes(day) ? 'white' : '#333',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    {day}
                  </button>
                ))}
              </div>

              <div className="modal-buttons" style={{ marginTop: '1rem' }}>
                <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="add-btn" onClick={addHabit}>Add</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
