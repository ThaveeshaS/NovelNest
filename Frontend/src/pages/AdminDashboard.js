/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header2 from '../components/Header2'; 
import Navbar2 from '../components/Navbar2'; 

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/protected",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAdmin(response.data.admin);
      } catch (err) {
        setError("Failed to fetch admin data");
        console.error(err);
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  if (!admin) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header2 />
      <Navbar2 />

      {/* Dashboard Content */}
      <div className="mt-5" style={{ padding: "20px", textAlign: "center" }}>
        <h1>Admin Dashboard</h1>
        <p>Welcome back, <strong>{admin.username}</strong>! Here's an overview of your system and activities.</p>

        <div className="row mt-4">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Handling Customer</h5>
                <p className="card-text">Manage customer accounts and interactions.</p>
                <Button variant="secondary" onClick={() => navigate("/managecustomers")}>Manage Customers</Button>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Product Handling</h5>
                <p className="card-text">Add, update, or remove products from your inventory.</p>
                <Button variant="secondary" onClick={() => navigate("/admin/ProductHandling")}>Manage Products</Button>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Payment Gateway</h5>
                <p className="card-text">Monitor and manage payment transactions.</p>
                <Button variant="secondary" onClick={() => navigate("/admin/PaymentGateway")}>Payment Gateway</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Handling Section */}
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Delivery Handling</h5>
                <p className="card-text">Track and manage delivery statuses.</p>
                <Button variant="secondary" onClick={() => navigate("/admin/AddDelivery")}>Manage Deliveries</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

