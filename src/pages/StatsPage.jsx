import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../UserContext';
import './Home.css';
import { ArrowLeft, Calendar ,Home, Activity, Settings,Award, TrendingUp, Target, Edit2, Save, X} from '../components/Icons';
//import {  Plus, User, Mail, Phone, Calendar, Award, TrendingUp, Target, Edit2, Save, X } from "../components/Icons";

// --- Progress Circle Comp---
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

const CategoryProgressCard = ({ category, habits }) => {
  const completedCount = habits.filter(h => h.completed).length;
  const totalCount = habits.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  
  const categoryEmoji = {
    'Work': '💼',
    'Sports': '⚽',
    'Learning': '📚',
    'Health': '❤️',
    'Self-care': '🧘',
    'Mental Health': '🧠',
    'Uncategorized': '📋'
  };

  return (
    <div className="progress-card" style={{ marginBottom: '20px' }}>
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '20px', 
        fontSize: '48px',
        opacity: '0.2'
      }}>
        {categoryEmoji[category] || '📋'}
      </div>
      <div className="progress-circle-wrapper">
        <ProgressCircle percent={progressPercent} />
      </div>
      <div className="progress-text">
        <h2 style={{ fontSize: '18px', marginBottom: '5px' }}>{category}</h2>
        <p style={{ fontSize: '16px', fontWeight: '600', margin: '0' }}>
          {completedCount} of {totalCount} completed
        </p>
        <p style={{ fontSize: '14px', color: '#666', margin: '5px 0 0 0' }}>
          {progressPercent}% completion rate
        </p>
      </div>
    </div>
  );
};

const StatsPage = () => {
  const [habits, setHabits] = useState([]);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:8000/habits/${user.id}`)
        .then((res) => setHabits(res.data))
        .catch((err) => console.error('Error fetching habits:', err));
    }
  }, [user]);

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

  const totalHabits = habits.length;
  const totalCompleted = habits.filter(h => h.completed).length;
  const overallPercent = totalHabits > 0 ? Math.round((totalCompleted / totalHabits) * 100) : 0;

  return (
    <div className="app-container">
      <div className="main-card">
        <header className="header">
          
          <div>
            <h1>Statistics</h1>
            <p>Track your progress</p>
          </div>
        </header>

        {/* Overall Progress Card */}
        <div className="progress-card" style={{ marginBottom: '30px' }}>
          <Calendar className="calendar-bg" />
          <div className="progress-circle-wrapper">
            <ProgressCircle percent={overallPercent} />
          </div>
          <div className="progress-text">
            <h2>Overall Progress</h2>
            <p>{totalCompleted} of {totalHabits} habits completed today!</p>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
              {sortedCategories.length} active categories
            </p>
          </div>
        </div>

        {/* Bottom Nav */}
      <nav className="bottom-nav">
        <button
          className="nav-link"
          onClick={() => navigate('/home')}
        >
          <Home />
          <span>Home</span>
        </button>
        <button
          className="nav-link active"
          onClick={() => navigate('/stats')}
        >
          <Activity />
          <span>Stats</span>
        </button>
        <button
          className="nav-link "
          onClick={() => navigate('/profile')}
        >
          <Settings />
          <span>Profile</span>
        </button>
      </nav>

        {/* Category Progress Cards */}
        <section className="section">
          <div className="section-header">
            <h2>Progress by Category</h2>
          </div>
          <div className="section-content">
            {sortedCategories.length === 0 ? (
              <p className="no-habits">No habits found. Start adding habits to see your stats!</p>
            ) : (
              sortedCategories.map((category) => (
                <CategoryProgressCard
                  key={category}
                  category={category}
                  habits={groupedHabits[category]}
                />


                
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StatsPage;