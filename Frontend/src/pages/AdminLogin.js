import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is imported

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/admin/adminlogin", {
        username,
        password,
      });

      // Save the token to localStorage
      localStorage.setItem("adminToken", response.data.token);

      // Redirect to the admin dashboard
      navigate("/admindashboard");
    } catch (err) {
      setError("Invalid username or password");
      console.error(err);
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
          <h2 className="text-center mb-4 text-primary">Admin Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleLogin}>
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
            <a href="/login" className="text-decoration-none">
              Customer Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;