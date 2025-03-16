import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is imported

export default function CustomerLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      const response = await axios.post("http://localhost:5000/api/customer/login", {
        username,
        password,
      });
      localStorage.setItem("authToken", response.data.token); // Save token
      localStorage.setItem("Type", "customer"); // Set user type as "customer"
      navigate("/customerdashboard"); // Redirect to customer dashboard
    } catch (err) {
      console.error(err.response || err.message); // Log the entire error
      if (err.response && err.response.status === 400) {
        setError("Invalid credentials. Please try again.");
      } else {
        setError("Server error. Please try again later.");
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: "url('https://wallpaperaccess.com/full/284466.jpg')", // Add a background image 1920x1080
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="card shadow-lg" style={{ width: "400px", backgroundColor: "rgba(255, 255, 255, 0.9)" }}>
        <div className="card-body p-4">
          <h2 className="text-center mb-4 text-primary">Customer Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="d-grid">
              <button
                className="btn btn-primary btn-lg"
                type="submit"
              >
                Login
              </button>
            </div>
          </form>
          <div className="mt-3 text-center">
            <a href="/signUp" className="text-decoration-none">
              Don't have an account? Sign Up
            </a>
            <br />
            <a href="/adminlogin" className="text-decoration-none">
              Admin Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}