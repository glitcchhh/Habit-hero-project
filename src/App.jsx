import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateAccount from "./pages/Signup";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import AllHabitsPage from "./pages/Allhabits";
import StatsPage from "./pages/StatsPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateAccount />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<CreateAccount/>}/>
        <Route path="/allhabits" element={<AllHabitsPage/>}/>
        <Route path="/stats" element={<StatsPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;