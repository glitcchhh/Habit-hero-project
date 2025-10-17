import React, { useState, useMemo } from 'react';
import './Home.css';

// --- Icon Components ---
const Icon = ({ className = "icon", color = "currentColor", strokeWidth = 2, children }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const Home = (props) => (
  <Icon {...props}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </Icon>
);

const Activity = (props) => (
  <Icon {...props}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </Icon>
);

const Settings = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </Icon>
);

const Plus = (props) => (
  <Icon {...props}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </Icon>
);

const Calendar = (props) => (
  <Icon {...props}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </Icon>
);

const EllipsisVertical = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </Icon>
);

const CheckSquare = (props) => (
  <Icon {...props}>
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </Icon>
);

const Square = (props) => (
  <Icon {...props}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
  </Icon>
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
      {habit.name} <small className="habit-type">({habit.type})</small>
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

  const toggleHabit = (id) => {
    setHabits(prev =>
      prev.map(h =>
        h.id === id ? { ...h, completed: !h.completed } : h
      )
    );
  };

  const addHabit = () => {
    if (newHabit.trim() === "") return;
    setHabits(prev => [
      ...prev,
      { id: Date.now(), name: newHabit.trim(), type: habitType, completed: false }
    ]);
    setNewHabit("");
    setHabitType("Work");
    setShowModal(false);
  };

  const { completedCount, totalCount, progressPercent } = useMemo(() => {
    const completed = habits.filter(h => h.completed).length;
    const total = habits.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completedCount: completed, totalCount: total, progressPercent: percent };
  }, [habits]);

  return (
    <div className="app-container">
      <div className="main-card">
        <header className="header">
          <p>Fri, 17 Oct 2025</p>
          <h1>Hello, <span>User!</span></h1>
        </header>

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
            <button className="see-all-btn" onClick={() => alert("Navigate to All Habits page!")}>
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
          <a href="#" className="nav-link active">
            <Home />
            <span>Home</span>
          </a>
          <a href="#" className="nav-link">
            <Activity />
            <span>Stats</span>
          </a>
          <a href="#" className="nav-link">
            <Settings />
            <span>Settings</span>
          </a>
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
                onChange={(e) => setNewHabit(e.target.value)}
              />
              <select
                value={habitType}
                onChange={(e) => setHabitType(e.target.value)}
                className="habit-dropdown"
              >
                <option value="Work">Work</option>
                <option value="Sports">Sports</option>
                <option value="Learning">Learning</option>
                <option value="Health">Health</option>
                <option value="Self-care">Self-care</option>
                <option value="Mental Health">Mental Health</option>
              </select>
              <div className="modal-buttons">
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
