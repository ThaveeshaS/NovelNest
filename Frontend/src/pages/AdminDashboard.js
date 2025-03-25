/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Header2 from "../components/Header2";


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
    <div className="admin-dashboard">
      {/* Header2 Component */}
      <Header2 />

      

      {/* Dashboard Content */}
      <Container fluid className="dashboard-container py-5">
        {/* Hero Banner */}
        <Row className="mb-5">
          <Col>
            <div className="hero-banner text-center p-5 rounded shadow-sm">
              <div className="overlay"></div>
              <div className="banner-content position-relative">
                <h1 className="display-4 mb-3 text-white">
                  Bookstore Admin Dashboard
                </h1>
                <div className="welcome-message">
                  <p className="lead text-white">
                    Welcome back, <strong>{admin.username}</strong>!
                  </p>
                  <p className="text-white">
                    Manage your bookstore operations from this central hub.
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Dashboard Cards */}
        <Row className="g-4 mb-4">
          <Col lg={4} md={6}>
            <Card className="dashboard-card h-100 shadow-sm">
              <div className="card-image-top customer-management"></div>
              <Card.Body className="d-flex flex-column">
                <div className="card-icon mb-3">
                  <i className="fas fa-users fa-2x text-primary"></i>
                </div>
                <Card.Title>Customer Management</Card.Title>
                <Card.Text className="flex-grow-1">
                  View and manage customer accounts, review reading habits, and
                  handle customer inquiries.
                </Card.Text>
                <Button
                  variant="primary"
                  className="mt-auto"
                  onClick={() => navigate("/managecustomers")}
                >
                  Manage Customers
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} md={6}>
            <Card className="dashboard-card h-100 shadow-sm">
              <div className="card-image-top customer-management"></div>
              <Card.Body className="d-flex flex-column">
                <div className="card-icon mb-3">
                  <i className="fas fa-users fa-2x text-primary"></i>
                </div>
                <Card.Title>Customer Feedback Management</Card.Title>
                <Card.Text className="flex-grow-1">
                  View and manage customer feedbacks.
                </Card.Text>
                <Button
                  variant="primary"
                  className="mt-auto"
                  onClick={() => navigate("/managefeedback")}
                >
                  Manage Customer Feedbacks
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} md={6}>
            <Card className="dashboard-card h-100 shadow-sm">
              <div className="card-image-top book-management"></div>
              <Card.Body className="d-flex flex-column">
                <div className="card-icon mb-3">
                  <i className="fas fa-book fa-2x text-success"></i>
                </div>
                <Card.Title>Book Management</Card.Title>
                <Card.Text className="flex-grow-1">
                  Update inventory, manage book details, categories, and handle
                  book availability.
                </Card.Text>
                <Button
                  variant="success"
                  className="mt-auto"
                  onClick={() => navigate("/manageproducts")}
                >
                  Manage Books
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} md={6}>
            <Card className="dashboard-card h-100 shadow-sm">
              <div className="card-image-top payment-gateway"></div>
              <Card.Body className="d-flex flex-column">
                <div className="card-icon mb-3">
                  <i className="fas fa-credit-card fa-2x text-info"></i>
                </div>
                <Card.Title>Payment Gateway</Card.Title>
                <Card.Text className="flex-grow-1">
                  Track book sales, process refunds, and review payment
                  analytics for your bookstore.
                </Card.Text>
                <Button
                  variant="info"
                  className="mt-auto text-white"
                  onClick={() => navigate("/admintransactions")}
                >
                  Payment Gateway
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} md={6}>
            <Card className="dashboard-card h-100 shadow-sm">
              <div className="card-image-top delivery-management"></div>
              <Card.Body className="d-flex flex-column">
                <div className="card-icon mb-3">
                  <i className="fas fa-truck fa-2x text-warning"></i>
                </div>
                <Card.Title>Delivery Management</Card.Title>
                <Card.Text className="flex-grow-1">
                  Track book shipments, manage delivery partners, and monitor
                  delivery statuses.
                </Card.Text>
                <Button
                  variant="warning"
                  className="mt-auto"
                  onClick={() => navigate("/admin/DeliveryHandling")}
                >
                  Manage Deliveries
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} md={6}>
            <Card className="dashboard-card h-100 shadow-sm">
              <div className="card-image-top add-book"></div>
              <Card.Body className="d-flex flex-column">
                <div className="card-icon mb-3">
                  <i className="fas fa-plus-circle fa-2x text-danger"></i>
                </div>
                <Card.Title>Add New Book</Card.Title>
                <Card.Text className="flex-grow-1">
                  Add new books to your inventory, upload cover images, and set
                  pricing details.
                </Card.Text>
                <Button
                  variant="danger"
                  className="mt-auto"
                  onClick={() => navigate("/addproducts")}
                >
                  Add Book
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} md={6}>
            <Card className="dashboard-card h-100 shadow-sm">
              <div className="card-image-top analytics"></div>
              <Card.Body className="d-flex flex-column">
                <div className="card-icon mb-3">
                  <i className="fas fa-chart-line fa-2x text-secondary"></i>
                </div>
                <Card.Title>Book Sales Analytics</Card.Title>
                <Card.Text className="flex-grow-1">
                  View book sales reports, popular genres, bestsellers, and
                  other key performance metrics.
                </Card.Text>
                <Button
                  variant="secondary"
                  className="mt-auto"
                  onClick={() => navigate("/admin/analytics")}
                >
                  View Analytics
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Account Section */}
        <Row className="mt-5">
          <Col md={6} className="mx-auto">
            <Card className="text-center border-0 shadow-sm">
              <Card.Body>
                <div className="admin-account-section">
                  <h3 className="mb-3">Account Settings</h3>
                  <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                    <Button variant="outline-danger" onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Add CSS for styling */}
      <style jsx>{`
        .admin-dashboard {
          background-color: #f8f9fa;
          min-height: 100vh;
        }

        .dashboard-container {
          padding-top: 2rem;
          padding-bottom: 3rem;
        }

        .hero-banner {
          background-image: url("/api/placeholder/1200/400");
          background-size: cover;
          background-position: center;
          position: relative;
          color: white;
          margin-bottom: 2rem;
          overflow: hidden;
        }

        .hero-banner .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            45deg,
            rgba(25, 55, 109, 0.9),
            rgba(25, 110, 130, 0.9)
          );
          z-index: 1;
        }

        .banner-content {
          position: relative;
          z-index: 2;
        }

        .welcome-message {
          max-width: 700px;
          margin: 0 auto;
        }

        .dashboard-card {
          border: none;
          border-radius: 0.5rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          overflow: hidden;
        }

        .dashboard-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 123, 255, 0.15) !important;
        }

        .card-image-top {
          height: 140px;
          background-size: cover;
          background-position: center;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .customer-management {
          background-image: url("/api/placeholder/400/200");
          background-color: #e3f2fd;
        }

        .book-management {
          background-image: url("/api/placeholder/400/200");
          background-color: #e8f5e9;
        }

        .payment-gateway {
          background-image: url("/api/placeholder/400/200");
          background-color: #e0f7fa;
        }

        .delivery-management {
          background-image: url("/api/placeholder/400/200");
          background-color: #fff8e1;
        }

        .add-book {
          background-image: url("/api/placeholder/400/200");
          background-color: #ffebee;
        }

        .analytics {
          background-image: url("/api/placeholder/400/200");
          background-color: #f5f5f5;
        }

        .card-icon {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 60px;
        }

        .admin-account-section {
          padding: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
