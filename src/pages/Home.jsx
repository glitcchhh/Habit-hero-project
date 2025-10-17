import React, { useState, useMemo } from 'react';
import './Home.css'; // Import the separate CSS file

// --- Icon Components ---
const Icon = ({ name, className = "icon", color = "currentColor", strokeWidth = 2, children }) => (
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
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
    </Icon>
);

const Activity = (props) => (
    <Icon {...props}>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </Icon>
);

const Settings = (props) => (
    <Icon {...props}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.44a2 2 0 0 1-2 2H4.44a2 2 0 0 0-2 2v.44a2 2 0 0 1-2 2h-.44a2 2 0 0 0 2 2v.44a2 2 0 0 1 2 2h.44a2 2 0 0 0 2 2v.44a2 2 0 0 1 2 2h.44a2 2 0 0 0 2 2v.44a2 2 0 0 1 2 2h.44a2 2 0 0 0 2 2v-.44a2 2 0 0 1 2-2h.44a2 2 0 0 0 2-2v-.44a2 2 0 0 1-2-2h-.44a2 2 0 0 0-2-2v-.44a2 2 0 0 1-2-2h-.44a2 2 0 0 0-2-2v-.44a2 2 0 0 1-2-2h-.44a2 2 0 0 0-2-2v-.44a2 2 0 0 1-2-2z"/>
        <circle cx="12" cy="12" r="3"/>
    </Icon>
);

const Plus = (props) => (
    <Icon {...props}>
        <path d="M5 12h14"/>
        <path d="M12 5v14"/>
    </Icon>
);

const Calendar = (props) => (
    <Icon {...props}>
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
        <line x1="16" x2="16" y1="2" y2="6"/>
        <line x1="8" x2="8" y1="2" y2="6"/>
        <line x1="3" x2="21" y1="10" y2="10"/>
    </Icon>
);

const EllipsisVertical = (props) => (
    <Icon {...props}>
        <circle cx="12" cy="12" r="1"/>
        <circle cx="12" cy="5" r="1"/>
        <circle cx="12" cy="19" r="1"/>
    </Icon>
);

const CheckSquare = (props) => (
    <Icon {...props}>
        <polyline points="9 11 12 14 22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </Icon>
);

const Square = (props) => (
    <Icon {...props}>
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
    </Icon>
);

// --- Progress Circle Component ---
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
                        <stop offset="0%" stopColor="#FF8C00" stopOpacity="1" />
                        <stop offset="100%" stopColor="#FF4500" stopOpacity="1" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="progress-circle-text">
                <span>{percent}%</span>
            </div>
        </div>
    );
};

// --- Initial Habits ---
const initialHabits = [
    { id: 1, name: 'Meditating', completed: true },
    { id: 2, name: 'Read Philosophy', completed: true },
    { id: 3, name: 'Journaling', completed: true },
    { id: 4, name: 'Exercise for 30 mins', completed: false },
    { id: 5, name: 'Plan next day', completed: false },
];

// --- Habit Card ---
const HabitCard = ({ habit, toggleHabit }) => {
    const isCompleted = habit.completed;

    return (
        <div
            className={`habit-card ${isCompleted ? 'completed' : ''}`}
            onClick={() => toggleHabit(habit.id)}
        >
            <span className={`habit-title ${isCompleted ? 'completed' : ''}`}>{habit.name}</span>
            <div className="flex items-center space-x-2">
                <div className="checkbox-icon">
                    {isCompleted ? (
                        <CheckSquare color="var(--success-green)" strokeWidth={3} />
                    ) : (
                        <Square color="#9ca3af" strokeWidth={3} />
                    )}
                </div>
                <EllipsisVertical color="#9ca3af" />
            </div>
        </div>
    );
};

// --- Main App ---
const HomePage = () => {
    const [habits, setHabits] = useState(initialHabits);

    const toggleHabit = (id) => {
        setHabits(prev =>
            prev.map(habit =>
                habit.id === id ? { ...habit, completed: !habit.completed } : habit
            )
        );
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

                {/* Header */}
                <header className="header">
                    <p>Sun, 1 March 2022</p>
                    <h1>
                        Hello, <span>Susy!</span>
                    </h1>
                </header>

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

                {/* Today's Habits */}
                <section className="section">
                    <div className="section-header">
                        <h2>Today's Habits</h2>
                        <a href="#">See all</a>
                    </div>
                    <div className="section-content">
                        {habits.slice(0, 4).map(habit => (
                            <HabitCard key={habit.id} habit={habit} toggleHabit={toggleHabit} />
                        ))}
                    </div>
                </section>

                {/* Your Goals */}
                <section className="section">
                    <div className="section-header">
                        <h2>Your Goals</h2>
                        <a href="#">See all</a>
                    </div>
                    <div className="goal-card">
                        <p>Goal: Run a half marathon by December</p>
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

                {/* Floating Action Button */}
                <button className="fab">
                    <Plus />
                </button>

            </div>
        </div>
    );
};

export default HomePage;
