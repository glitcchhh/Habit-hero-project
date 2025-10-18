import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../UserContext';
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

const ArrowLeft = (props) => (
  <Icon {...props}>
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
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

const EllipsisVertical = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </Icon>
);

// --- Habit Card ---
const HabitCard = ({ habit, toggleHabit }) => (
  <div
    className={`habit-card ${habit.completed ? 'completed' : ''}`}
    onClick={() => toggleHabit(habit.id)}
  >
    <span className={`habit-title ${habit.completed ? 'completed' : ''}`}>
      {habit.name}
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
const AllHabitsPage = () => {
  const [habits, setHabits] = useState([]);
  const navigate = useNavigate();
  const { user } = useUser();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // --- Fetch habits from backend ---
  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:8000/habits/${user.id}`)
        .then((res) => setHabits(res.data))
        .catch((err) => console.error('Error fetching habits:', err));
    }
  }, [user]);

  // --- Toggle habit completion ---
  const toggleHabit = (id) => {
    axios
      .put(`http://localhost:8000/habits/${id}`)
      .then((res) => {
        setHabits((prev) => prev.map((h) => (h.id === id ? res.data : h)));
      })
      .catch((err) => console.error('Error toggling habit:', err));
  };

  // --- Group habits by category ---
  const groupedHabits = habits.reduce((acc, habit) => {
    const category = habit.category || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(habit);
    return acc;
  }, {});

  // --- Define category order ---
  const categoryOrder = [
    'Work',
    'Sports',
    'Learning',
    'Health',
    'Self-care',
    'Mental Health',
    'Uncategorized'
  ];

  const sortedCategories = Object.keys(groupedHabits).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div className="app-container">
      <div className="main-card">
        <header className="header">
          <button 
            onClick={() => navigate('/home')} 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ArrowLeft color="#333" strokeWidth={2} />
          </button>
          <div>
            <h1>All Habits</h1>
            <p>Organized by category</p>
          </div>
        </header>

        {sortedCategories.length === 0 ? (
          <p className="no-habits">No habits found. Add some from the home page!</p>
        ) : (
          sortedCategories.map((category) => (
            <section key={category} className="section">
              <div className="section-header">
                <h2>{category}</h2>
                <span className="habit-count" style={{ 
                  fontSize: '14px', 
                  color: '#666',
                  fontWeight: 'normal'
                }}>
                  {groupedHabits[category].length} habit{groupedHabits[category].length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="section-content">
                {groupedHabits[category].map((habit) => (
                  <HabitCard key={habit.id} habit={habit} toggleHabit={toggleHabit} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
};

export default AllHabitsPage;