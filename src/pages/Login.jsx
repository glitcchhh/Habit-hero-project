import React, { useState } from "react";
import "./Login.css";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    alert("Login successful!");
  };

  return (
    <div className="page-container">
      <div className="form-box">
        <div className="form-content">
          <h2 className="form-title">Log in to your account</h2>
          <p className="login-link">
            Don’t have an account? <a href="#">Create one</a>
          </p>

          <form onSubmit={handleSubmit} className="form-fields">
            <div className="input-group">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
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
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <div className="checkbox-group">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label>Show password</label>
            </div>

            <button type="submit" className="submit-btn">
              Log in
            </button>
          </form>

          <div className="bottom-links">
            <a href="#">Forgot password?</a>
          </div>
        </div>

        {/* Decorative geometric SVG art */}
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

export default LoginPage;
