import reactLogo from './assets/react.svg'
import React, { useState } from "react";
import "./Signup.css";

function CreateAccount() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    alert("Account created successfully!");
  };

  return (
    <div className="page-container">
      <div className="form-box">
        <div className="form-content">
          <h2 className="form-title">Create an account</h2>
          <p className="login-link">
            Already have an account? <a href="#">Log in</a>
          </p>

          <form onSubmit={handleSubmit} className="form-fields">
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {error && <p className="error-text">{error}</p>}
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label>Show password</label>
            </div>

            <button type="submit" className="submit-btn">
              Create an account
            </button>
          </form>
        </div>

        {/* Right-side geometric illustration */}
        <div className="art-box">
          <svg width="120" height="120" viewBox="0 0 100 100">
            <polygon
              points="30,10 90,40 70,90 10,70"
              stroke="#000"
              strokeWidth="1"
              fill="none"
            />
            <circle cx="20" cy="20" r="3" fill="#000" />
            <circle cx="85" cy="80" r="3" fill="#000" />
            <rect x="10" y="90" width="20" height="3" fill="#000" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
