import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './UserContext';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from './pages/Login';
import CreateAccount from './pages/Signup';
import HomePage from './pages/Home';
import StatsPage from './pages/StatsPage';
import AllHabitsPage from './pages/Allhabits';


// import SettingsPage from './Settings';
// import AllHabitsPage from './AllHabits';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<CreateAccount />} />
          
          {/* Protected routes */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          
          {/* Add other protected routes similarly */}
           
          <Route 
            path="/stats" 
            element={
              <ProtectedRoute>
                <StatsPage />
              </ProtectedRoute>
            } 
          />
      
          <Route 
            path="/allhabits" 
            element={
              <ProtectedRoute>
                <AllHabitsPage />
              </ProtectedRoute>
            } 
          />
          
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;