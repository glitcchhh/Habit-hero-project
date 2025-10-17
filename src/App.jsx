import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateAccount from "./pages/Signup";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateAccount />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<CreateAccount/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;