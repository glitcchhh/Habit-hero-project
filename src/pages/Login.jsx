import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import "./Login.css";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login } = useUser();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Login successful:", data);
        
        // Store user data in context and localStorage
        login({
          id: data.user_id,
          name: data.name,
          email: formData.email
        });
        
        setSuccess(`Welcome back, ${data.name}!`);
        setError("");
        
        // Redirect to home page
        setTimeout(() => {
          navigate("/home");
        }, 500);
      } else {
        const err = await response.json();
        setError(err.detail || "Invalid email or password");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("Unable to connect to server. Please try again later.");
    }
  };

  return (
    <div className="page-container">
      <div className="form-box">
        <div className="form-content">
          <h2 className="form-title">Log in to your account</h2>
          <p className="login-link">
            Don't have an account? <a href="/signup">Create one</a>
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
            {success && <p className="success-text">{success}</p>}

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