import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import "./signUp.css"; // css stylesheet

const API_BASE_URL = "https://community-disease-reporting-dashboard.onrender.com/api/users"; // Update with your backend URL

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Fetch all users from the database
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const users = await response.json();
      console.log("Fetched users:", users);

      // Find user with matching email and password
      const user = users.find(u => u.email == email && u.password_hash == password);
      console.log("Authenticated user:", user);
      if (user) {
        // Store user info in localStorage
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userName", user.name || "");

        console.log("User logged in:", user);
        
        navigate('/dashboard');
        console.log("Login successful!");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

    </div>
  );
};

const Auth = () => {
  return <Login />;
};

export default Auth;