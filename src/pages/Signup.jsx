import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function CreateAccount() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || "Signup failed");
        setLoading(false);
        return;
      }

      // Signup successful
      const data = await response.json();
      console.log("User created:", data);
      setLoading(false);
      navigate("/home"); // Redirect to home page

    } catch (err) {
      console.error("Error:", err);
      setError("Server error. Please try again later.");
      setLoading(false);
    }
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
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter Phone Number"
                value={formData.phone}
                onChange={handleChange}
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

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Create an account"}
            </button>
          </form>
        </div>

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
