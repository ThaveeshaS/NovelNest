import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaLock, FaSignInAlt, FaArrowLeft, FaUserShield } from "react-icons/fa";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/admin/adminlogin", {
        username,
        password,
      });

      localStorage.setItem("adminToken", response.data.token);
      navigate("/admindashboard");
    } catch (err) {
      setError("Invalid username or password");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url('https://wallpapercave.com/wp/wp9118796.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0" style={{ borderRadius: "16px", overflow: "hidden", backgroundColor: "rgba(255, 255, 255, 0.92)" }}>
              <div className="card-header text-center py-4" style={{ background: "linear-gradient(to right,rgba(45, 184, 226, 0.64), rgba(0, 86, 199, 0.85))", color: "white" }}>
                <h2 className="mb-0">Admin Login</h2>
                <p className="mb-0">Welcome back! Please login to your account</p>
              </div>
              <div className="card-body p-4">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <div className="me-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16">
                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                      </svg>
                    </div>
                    <div>{error}</div>
                  </div>
                )}
                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label htmlFor="username" className="form-label fw-bold">
                      <FaUser className="me-2" />Username
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FaUser />
                      </span>
                      <input
                        type="text"
                        className="form-control py-2"
                        id="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-bold">
                      <FaLock className="me-2" />Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <FaLock />
                      </span>
                      <input
                        type="password"
                        className="form-control py-2"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-primary btn-lg"
                      type="submit"
                      disabled={isLoading}
                      style={{ background: "linear-gradient(to right,rgba(45, 184, 226, 0.64), rgba(0, 86, 199, 0.85))", border: "none" }}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Logging in...
                        </>
                      ) : (
                        <>
                          <FaSignInAlt className="me-2" /> Login
                        </>
                      )}
                    </button>
                  </div>
                </form>
                <div className="mt-4">
                  <div className="row">
                    <div className="col-6">
                      <a href="/login" className="text-decoration-none d-flex align-items-center">
                        <FaArrowLeft className="me-1" /> Customer Login
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer bg-light py-3 text-center">
                <small className="text-muted">© 2025 Novel Nest Book Store.</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;