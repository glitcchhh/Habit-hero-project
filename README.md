# HABIT HERO

A modern, full-stack habit tracking application built with React and FastAPI. Track your daily habits, maintain streaks, and achieve your goals with an intuitive and beautiful interface.

---

##  Features

### Home Dashboard
- Today's Habits View - See only habits scheduled for the current day
- Real-time Progress Tracking - Visual progress circle showing daily completion percentage
- Streak Statistics - Track current streak, longest streak, and total completed habits
- Weekly Progress Graph - Visual bar chart showing your progress throughout the week
- Quick Habit Toggle - One-click to mark habits as complete

### Smart Scheduling
- Day-Specific Habits - Schedule habits for specific days of the week
- Flexible Planning - Create habits that repeat on selected days (Mon, Wed, Fri, etc.)
- Automatic Filtering - Only see relevant habits for today

### Progress Analytics
- Streak Tracking - Automatic calculation of current and longest streaks
- Success Rate - View your overall habit completion percentage
- Weekly Visualization - Bar chart showing daily progress trends
- Achievement System - Unlock badges based on your accomplishments

### User Profile
- Personal Information - Manage your name, email, phone, and profile details
- Bio & Goals - Set personal goals and write your bio
- Statistics Dashboard - View comprehensive stats:
  - Total habits created
  - Habits completed today
  - Current and longest streaks
  - Total completions
  - Success rate percentage

  
- Achievement Badges - Earn rewards for:
  - 🎯 First Steps - Create your first habit
  - 🔥 Week Warrior - Achieve 7-day streak
  - 👑 Consistency King - Achieve 30-day streak
  - 💯 Century Club - Complete 100 habits
  - 🌅 Early Bird - Complete habits before 9 AM
  - 🦉 Night Owl - Complete habits after 9 PM

### 🔐 Authentication & Security
- Secure User Registration - Password hashing with pbkdf2_sha256
- User Login System - Session management with localStorage
- Protected Routes - Secure pages requiring authentication
- User-Specific Data - Each user has their own isolated habit data

### Modern UI/UX
- Beautiful Design - Modern gradient backgrounds and card-based layout
- Responsive - Works seamlessly on desktop, tablet, and mobile
- Smooth Animations - Hover effects, transitions, and micro-interactions
- Intuitive Navigation - Fixed sidebar navigation for easy access
- Dark Mode Ready - Purple gradient theme with customizable colors

### Habit Management
- Category Organization - Organize habits by Work, Sports, Learning, Health, Self-care, Mental Health
- Edit & Delete - Full CRUD operations for habit management
- Quick Add - Floating action button for instant habit creation
- Visual Completion Status - Clear checkmarks for completed habits

### AI-Powered Suggestions
- Smart Habit Recommendations - Get personalized habit suggestions powered by Perplexity AI
- Context-Aware - AI analyzes your existing habits, goals, and progress patterns
- Custom Suggestions - Receive tailored recommendations based on your profile
- Easy Integration - One-click to add AI-suggested habits to your routine
- Intelligent Scheduling - AI suggests optimal days for new habits

---

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Python (3.8 or higher)
- npm or yarn
- pip

### Backend Setup (FastAPI)
