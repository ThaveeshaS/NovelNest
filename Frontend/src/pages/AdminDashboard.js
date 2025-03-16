import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header2 from '../components/Header2'; // Import Header2
import Navbar2 from '../components/Navbar2'; // Import Navbar2

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
        const response = await axios.get("http://localhost:5000/api/admin/protected", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Header2 Component */}
      <Header2 />

      {/* Navbar2 Component */}
      <Navbar2 />

      {/* Carousel Section with reduced space */}
      <div style={{ marginTop: "10px" }}> {/* Adjust the margin-top value as needed */}
        <div
          id="carouselExampleAutoplaying"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
          data-bs-interval="1500" // Set interval to 1.5 seconds
        >
          <div className="carousel-inner">
            {/* First Slide */}
            <div className="carousel-item active">
              <img
                src="https://juliaveenstra.com/wp-content/uploads/2025/03/Driftwood-24-by-72-1200x400.jpg"
                className="d-block w-100"
                alt="Welcome Slide"
              />
            </div>
            {/* Second Slide */}
            <div className="carousel-item">
              <img
                src="https://www.dieboldnixdorf.com/-/media/diebold/images/article/header-image/header-fitbanking-philosophy-1200x400.jpg"
                className="d-block w-100"
                alt="Manage System Slide"
              />
            </div>
            {/* Third Slide */}
            <div className="carousel-item">
              <img
                src="https://static.zerochan.net/Aoha.(Twintail).full.2145423.jpg"
                className="d-block w-100"
                alt="Monitor Activities Slide"
              />
            </div>
          </div>
          {/* Carousel Controls */}
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="mt-5" style={{ padding: "20px", textAlign: "center" }}>
        <h1>Admin Dashboard</h1>
        <p>Welcome back, <strong>{admin.username}</strong>! Here's an overview of your system and activities.</p>

        {/* Placeholder Cards for Dashboard */}
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
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Delivery Handling</h5>
                <p className="card-text">Track and manage delivery statuses.</p>
                <Button variant="secondary" onClick={() => navigate("/admin/DeliveryHandling")}>Manage Deliveries</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;