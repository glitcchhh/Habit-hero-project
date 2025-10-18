import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../UserContext';
import './Profile.css';
import { Home, Activity, Settings, Plus, User, Mail, Phone, Calendar, Award, TrendingUp, Target, Edit2, Save, X } from "../components/Icons";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    joinedDate: '',
    bio: '',
    goal: ''
  });
  
  const [stats, setStats] = useState({
    totalHabits: 0,
    completedToday: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalCompleted: 0,
    successRate: 0
  });

  const [achievements, setAchievements] = useState([
    { id: 1, title: "First Steps", description: "Created your first habit", icon: "🎯", unlocked: true },
    { id: 2, title: "Week Warrior", description: "7 day streak achieved", icon: "🔥", unlocked: false },
    { id: 3, title: "Consistency King", description: "30 day streak achieved", icon: "👑", unlocked: false },
    { id: 4, title: "Century Club", description: "100 habits completed", icon: "💯", unlocked: false },
    { id: 5, title: "Early Bird", description: "Complete habits before 9 AM", icon: "🌅", unlocked: false },
    { id: 6, title: "Night Owl", description: "Complete habits after 9 PM", icon: "🦉", unlocked: false }
  ]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      // Load user profile data
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        joinedDate: user.created_at || new Date().toISOString().split('T')[0],
        bio: user.bio || 'No bio yet. Click edit to add one!',
        goal: user.goal || 'Build better habits every day!'
      });
      
      // Fetch user statistics
      fetchUserStats();
    }
  }, [user, navigate]);

  const fetchUserStats = async () => {
    try {
      // Fetch habits
      const habitsRes = await axios.get(`http://localhost:8000/habits/${user.id}`);
      const habits = habitsRes.data;
      
      // Fetch streak stats
      const streakRes = await axios.get(`http://localhost:8000/habits/stats/${user.id}`);
      const streakStats = streakRes.data;
      
      // Calculate statistics
      const completedToday = habits.filter(h => h.completed).length;
      const successRate = habits.length > 0 
        ? Math.round((completedToday / habits.length) * 100) 
        : 0;
      
      setStats({
        totalHabits: habits.length,
        completedToday: completedToday,
        currentStreak: streakStats.current_streak,
        longestStreak: streakStats.longest_streak,
        totalCompleted: streakStats.total_completed,
        successRate: successRate
      });

      // Update achievements based on stats
      updateAchievements(streakStats, habits.length);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const updateAchievements = (streakStats, totalHabits) => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.id === 1 && totalHabits > 0) {
        return { ...achievement, unlocked: true };
      }
      if (achievement.id === 2 && streakStats.longest_streak >= 7) {
        return { ...achievement, unlocked: true };
      }
      if (achievement.id === 3 && streakStats.longest_streak >= 30) {
        return { ...achievement, unlocked: true };
      }
      if (achievement.id === 4 && streakStats.total_completed >= 100) {
        return { ...achievement, unlocked: true };
      }
      return achievement;
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      joinedDate: user.created_at || new Date().toISOString().split('T')[0],
      bio: user.bio || 'No bio yet. Click edit to add one!',
      goal: user.goal || 'Build better habits every day!'
    });
  };

  const handleSave = async () => {
    try {
      // Update user profile via API
      // await axios.put(`http://localhost:8000/users/${user.id}`, profileData);
      setIsEditing(false);
      // Show success message
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-header-content">
            <h1>Profile</h1>
            <p>Manage your account and view your progress</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        <div className="profile-content">
          {/* Left Column - Profile Info */}
          <div className="profile-left">
            {/* Avatar & Basic Info */}
            <div className="profile-info-card">
              <div className="avatar-section">
                <div className="avatar">
                  {profileData.name.charAt(0).toUpperCase()}
                </div>
                {!isEditing && (
                  <button className="edit-profile-btn" onClick={handleEdit}>
                    <Edit2 size={16} /> Edit Profile
                  </button>
                )}
                {isEditing && (
                  <div className="edit-actions">
                    <button className="save-btn" onClick={handleSave}>
                      <Save size={16} /> Save
                    </button>
                    <button className="cancel-btn" onClick={handleCancel}>
                      <X size={16} /> Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="profile-details">
                {isEditing ? (
                  <>
                    <div className="input-group">
                      <label><User size={16} /> Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      />
                    </div>
                    <div className="input-group">
                      <label><Mail size={16} /> Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      />
                    </div>
                    <div className="input-group">
                      <label><Phone size={16} /> Phone</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      />
                    </div>
                    <div className="input-group">
                      <label><Target size={16} /> Goal</label>
                      <input
                        type="text"
                        value={profileData.goal}
                        onChange={(e) => setProfileData({...profileData, goal: e.target.value})}
                      />
                    </div>
                    <div className="input-group">
                      <label>Bio</label>
                      <textarea
                        rows="3"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="detail-item">
                      <User size={18} />
                      <div>
                        <span className="detail-label">Name</span>
                        <span className="detail-value">{profileData.name}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <Mail size={18} />
                      <div>
                        <span className="detail-label">Email</span>
                        <span className="detail-value">{profileData.email}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <Phone size={18} />
                      <div>
                        <span className="detail-label">Phone</span>
                        <span className="detail-value">{profileData.phone || 'Not provided'}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <Calendar size={18} />
                      <div>
                        <span className="detail-label">Joined</span>
                        <span className="detail-value">
                          {new Date(profileData.joinedDate).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="bio-section">
                      <h3>Bio</h3>
                      <p>{profileData.bio}</p>
                    </div>
                    <div className="goal-section">
                      <Target size={18} />
                      <div>
                        <span className="detail-label">Current Goal</span>
                        <span className="goal-text">{profileData.goal}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Achievements */}
          <div className="profile-right">
            {/* Statistics */}
            <div className="stats-card">
              <h2>Statistics</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                    <TrendingUp size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{stats.totalHabits}</span>
                    <span className="stat-label">Total Habits</span>
                  </div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>
                    <Target size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{stats.completedToday}</span>
                    <span className="stat-label">Completed Today</span>
                  </div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>
                    🔥
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{stats.currentStreak}</span>
                    <span className="stat-label">Current Streak</span>
                  </div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ffd700, #ffed4e)' }}>
                    <Award size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{stats.longestStreak}</span>
                    <span className="stat-label">Longest Streak</span>
                  </div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    ✅
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{stats.totalCompleted}</span>
                    <span className="stat-label">Total Completed</span>
                  </div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    📊
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{stats.successRate}%</span>
                    <span className="stat-label">Success Rate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="achievements-card">
              <h2>Achievements</h2>
              <div className="achievements-grid">
                {achievements.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                  >
                    <div className="achievement-icon">{achievement.icon}</div>
                    <div className="achievement-info">
                      <h4>{achievement.title}</h4>
                      <p>{achievement.description}</p>
                    </div>
                    {achievement.unlocked && (
                      <div className="unlocked-badge">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button
          className="nav-link"
          onClick={() => navigate('/home')}
        >
          <Home />
          <span>Home</span>
        </button>
        <button
          className="nav-link"
          onClick={() => navigate('/stats')}
        >
          <Activity />
          <span>Stats</span>
        </button>
        <button
          className="nav-link active"
          onClick={() => navigate('/profile')}
        >
          <Settings />
          <span>Profile</span>
        </button>
      </nav>

    </div>
  );
};

export default Profile;