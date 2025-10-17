import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateAccount from "./pages/Signup";
import HomePage from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateAccount />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;