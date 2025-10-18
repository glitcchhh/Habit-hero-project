import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../UserContext';
import './Home.css';


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

const Edit = (props) => (
  <Icon {...props}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </Icon>
);

const Trash2 = (props) => (
  <Icon {...props}>
    <polyline points="3,6 5,6 21,6" />
    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </Icon>
);


// --- Habit Card ---
const HabitCard = ({ habit, onEdit, onDelete }) => (
  <div className="habit-card-display">
    <div className="habit-info">
      <span className="habit-title">{habit.name}</span>
      <div className="habit-details">
        <span className="habit-category">{habit.category}</span>
        {habit.scheduled_days && habit.scheduled_days.length > 0 && (
          <div className="scheduled-days">
            <span className="scheduled-label">Scheduled:</span>
            <div className="days-list">
              {habit.scheduled_days.map((day, index) => (
                <span key={index} className="day-tag">{day}</span>
              ))}
            </div>
          </div>
        )}
        <div className="streak-info">
          <span className="current-streak">Current: {habit.current_streak} days</span>
          <span className="longest-streak">Best: {habit.longest_streak} days</span>
        </div>
      </div>
    </div>
    <div className="habit-actions">
      <button 
        className="action-btn edit-btn" 
        onClick={() => onEdit(habit)}
        title="Edit habit"
      >
        <Edit size={16} />
      </button>
      <button 
        className="action-btn delete-btn" 
        onClick={() => onDelete(habit.id)}
        title="Delete habit"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);


const AllHabitsPage = () => {
  const [habits, setHabits] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    category: 'Work',
    scheduled_days: []
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingHabitId, setDeletingHabitId] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


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

 
  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setEditForm({
      name: habit.name,
      category: habit.category,
      scheduled_days: habit.scheduled_days || []
    });
    setShowEditModal(true);
  };

  const handleDelete = (habitId) => {
    setDeletingHabitId(habitId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deletingHabitId) {
      axios.delete(`http://localhost:8000/habits/${deletingHabitId}`)
        .then(() => {
          setHabits(prev => prev.filter(h => h.id !== deletingHabitId));
          setShowDeleteConfirm(false);
          setDeletingHabitId(null);
        })
        .catch(err => console.error('Error deleting habit:', err));
    }
  };

  
  const toggleEditDay = (day) => {
    setEditForm(prev => ({
      ...prev,
      scheduled_days: prev.scheduled_days.includes(day) 
        ? prev.scheduled_days.filter(d => d !== day)
        : [...prev.scheduled_days, day]
    }));
  };

  const saveEdit = () => {
    if (!editingHabit || !editForm.name.trim()) return;

    axios.put(`http://localhost:8000/habits/${editingHabit.id}/update`, {
      name: editForm.name.trim(),
      category: editForm.category,
      scheduled_days: editForm.scheduled_days
    })
      .then(res => {
        setHabits(prev => prev.map(h => h.id === editingHabit.id ? res.data : h));
        setShowEditModal(false);
        setEditingHabit(null);
        setEditForm({ name: '', category: 'Work', scheduled_days: [] });
      })
      .catch(err => console.error('Error updating habit:', err));
  };

 
  const groupedHabits = habits.reduce((acc, habit) => {
    const category = habit.category || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(habit);
    return acc;
  }, {});

  
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
    return null; 
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
            <p>View all your habits organized by category</p>
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
                  <HabitCard 
                    key={habit.id} 
                    habit={habit} 
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Habit</h3>
            <input
              type="text"
              placeholder="Enter habit name..."
              value={editForm.name}
              onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
            />
            <select
              value={editForm.category}
              onChange={e => setEditForm(prev => ({ ...prev, category: e.target.value }))}
              className="habit-dropdown"
            >
              <option value="Work">Work</option>
              <option value="Sports">Sports</option>
              <option value="Learning">Learning</option>
              <option value="Health">Health</option>
              <option value="Self-care">Self-care</option>
              <option value="Mental Health">Mental Health</option>
            </select>

            {/* Days Selector */}
            <div className="days-selector" style={{ marginTop: '1rem' }}>
              {daysOfWeek.map(day => (
                <button
                  key={day}
                  type="button"
                  className={`day-button ${editForm.scheduled_days.includes(day) ? 'selected' : ''}`}
                  onClick={() => toggleEditDay(day)}
                  style={{
                    margin: '0 3px',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    backgroundColor: editForm.scheduled_days.includes(day) ? '#1b22b0ff' : 'white',
                    color: editForm.scheduled_days.includes(day) ? 'white' : '#333',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  {day}
                </button>
              ))}
            </div>

            <div className="modal-buttons" style={{ marginTop: '1rem' }}>
              <button className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="add-btn" onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Habit</h3>
            <p>Are you sure you want to delete this habit? This action cannot be undone.</p>
            <div className="modal-buttons" style={{ marginTop: '1rem' }}>
              <button 
                className="cancel-btn" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="delete-btn" 
                onClick={confirmDelete}
                style={{ backgroundColor: '#ff4444', color: 'white' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllHabitsPage;