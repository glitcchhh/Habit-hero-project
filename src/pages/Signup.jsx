import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../UserContext";
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
  const { login } = useUser();

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

      // Automatically log in the user after signup
      login({
        id: data.id,
        name: data.name,
        email: data.email
      });

      setLoading(false);
      navigate("/home"); // Redirect to home page

    } catch (err) {
      console.error("Error:", err);
      setError("Server error. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="signup-page-container">
      <div className="signup-form-box">
        <div className="signup-form-content">
          <h2 className="signup-form-title">UNLOCK YOUR HABIT HERO JOURNEY</h2>
          <p className="signup-login-link">
            Already have an account? <Link to="/login">Log in</Link>
          </p>

          <form onSubmit={handleSubmit} className="signup-form-fields">
            <div className="signup-input-group">
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

            <div className="signup-input-group">
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

            <div className="signup-input-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="signup-input-group">
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

            <div className="signup-input-group">
              <label>Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {error && <p className="signup-error-text">{error}</p>}
            </div>

            <div className="signup-checkbox-group">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label>Show password</label>
            </div>

            <button type="submit" className="signup-submit-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Create an account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
