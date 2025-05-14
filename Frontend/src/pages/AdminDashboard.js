/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Header2 from "../components/Header2";
import { motion } from "framer-motion";
import io from "socket.io-client";

// Initialize socket.io client
const socket = io("http://localhost:5000");

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalCustomers: 0,
    averageRating: 0,
    lowStockBooks: 0,
  });
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

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        // Fetch total customers
        const customersResponse = await axios.get(
          "http://localhost:5000/api/customer/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Fetch feedback stats
        const feedbackResponse = await axios.get(
          "http://localhost:5000/api/feedback/stats"
        );
        // Fetch low stock books
        const productsResponse = await axios.get(
          "http://localhost:5000/api/product/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const lowStockBooks = productsResponse.data.filter(
          (product) => product.bookQuantity < 10
        ).length;

        setStats({
          totalCustomers: customersResponse.data.length,
          averageRating: feedbackResponse.data.averageRating || 0,
          lowStockBooks,
        });
      } catch (err) {
        setError("Failed to fetch dashboard stats");
        console.error(err);
      }
    };

    fetchAdminData();
    fetchStats();

    // Listen for real-time feedback updates
    socket.on("dataUpdate", (data) => {
      if (data.type === "ratings") {
        const totalRatings = data.data.reduce(
          (sum, count, index) => sum + count * (index + 1),
          0
        );
        const totalCount = data.data.reduce((sum, count) => sum + count, 0);
        const averageRating = totalCount ? (totalRatings / totalCount).toFixed(1) : 0;
        setStats((prev) => ({ ...prev, averageRating }));
      }
    });

    // Cleanup socket listener
    return () => {
      socket.off("dataUpdate");
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  if (!admin) {
    return (
      <div
        className="d-flex justify-content-center align-items-center bg-light"
        style={{ height: "100vh" }}
      >
        <div className="text-center">
          <div
            className="spinner-grow text-primary mb-3"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const dashboardCards = [
    {
      id: 1,
      title: "Customer Management",
      description:
        "View and manage customer accounts, review reading habits, and handle customer inquiries.",
      icon: "fa-users",
      color: "primary",
      bgColor: "customer-management",
      buttonText: "Manage Customers",
      path: "/managecustomers",
    },
    {
      id: 2,
      title: "Customer Feedback",
      description:
        "View and manage customer feedbacks to improve your bookstore service.",
      icon: "fa-comments",
      color: "info",
      bgColor: "feedback-management",
      buttonText: "Manage Feedbacks",
      path: "/managefeedback",
    },
    {
      id: 3,
      title: "Book Management",
      description:
        "Update inventory, manage book details, categories, and handle book availability.",
      icon: "fa-book",
      color: "success",
      bgColor: "book-management",
      buttonText: "Manage Books",
      path: "/manageproducts",
    },
    {
      id: 4,
      title: "Payment Gateway",
      description:
        "Track book sales, process refunds, and review payment analytics for your bookstore.",
      icon: "fa-credit-card",
      color: "indigo",
      bgColor: "payment-gateway",
      buttonText: "Payment Gateway",
      path: "/admintransactions",
    },
    {
      id: 5,
      title: "Delivery Management",
      description:
        "Track book shipments, manage delivery partners, and monitor delivery statuses.",
      icon: "fa-truck",
      color: "warning",
      bgColor: "delivery-management",
      buttonText: "Manage Deliveries",
      path: "/admin/AddDelivery",
    },
    {
      id: 6,
      title: "Add New Book",
      description:
        "Add new books to your inventory, upload cover images, and set pricing details.",
      icon: "fa-plus-circle",
      color: "danger",
      bgColor: "add-book",
      buttonText: "Add Book",
      path: "/addproducts",
    },
    {
      id: 7,
      title: "Novel Nest Analytics",
      description:
        "View customer reports, book sales, popular genres, bestsellers, and key performance metrics.",
      icon: "fa-chart-line",
      color: "dark",
      bgColor: "analytics",
      buttonText: "View Analytics",
      path: "/analysis",
    },
  ];

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="admin-dashboard">
      {/* Header2 Component */}
      <Header2 />

      {/* Dashboard Content */}
      <Container fluid className="dashboard-container py-4">
        {/* Top Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="status-bar p-3 mb-4 rounded-lg shadow-sm"
        >
          <Row className="align-items-center">
            <Col md={6}>
              <div className="d-flex align-items-center">
                <div className="admin-avatar me-3">
                  {admin.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="mb-0 text-muted">{currentDate}</p>
                  <h5 className="fw-bold mb-0">Welcome back, {admin.username}!</h5>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex justify-content-md-end align-items-center">
                <div className="status-item">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt me-2"></i>Logout
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </motion.div>

        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-5"
        >
          <div className="hero-banner rounded-lg shadow position-relative overflow-hidden">
            <div className="overlay"></div>
            <div className="banner-content position-relative p-5">
              <Row className="align-items-center">
                <Col md={7}>
                  <h1 className="display-5 fw-bold mb-3 text-white">
                    Novel Nest Admin Hub
                  </h1>
                  <p className="lead text-white mb-4">
                    Manage your bookstore operations with ease. Everything you need
                    in one place.
                  </p>
                  <div className="dashboard-stats d-flex flex-wrap">
                    <div className="stat-box me-4 mb-3">
                      <h3 className="mb-0 text-white">{stats.totalCustomers}</h3>
                      <small className="text-white-50">Total Customers</small>
                    </div>
                    <div className="stat-box me-4 mb-3">
                      <h3 className="mb-0 text-white">{stats.averageRating}/5</h3>
                      <small className="text-white-50">Customer Satisfaction</small>
                    </div>
                    <div className="stat-box mb-3">
                      <h3 className="mb-0 text-white">{stats.lowStockBooks}</h3>
                      <small className="text-white-50">Low Stock Books</small>
                    </div>
                  </div>
                </Col>
                <Col md={5} className="d-none d-md-block">
                  <div className="banner-illustration">
                    {/* Placeholder for an SVG or image */}
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Cards */}
        <div className="mb-5">
          <h5 className="section-title mb-4">
            <i className="fas fa-th-large me-2 text-primary"></i>
            Dashboard Modules
          </h5>
          <Row className="g-4">
            {dashboardCards.map((card, i) => (
              <Col lg={4} md={6} key={card.id}>
                <motion.div
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  whileHover={{ y: -10 }}
                  className="h-100"
                >
                  <Card className="dashboard-card h-100 shadow-sm">
                    <div className={`card-image-top ${card.bgColor}`}>
                      <div className="card-overlay">
                        <div className="card-feature-icon">
                          <i className={`fas ${card.icon} fa-2x text-white`}></i>
                        </div>
                      </div>
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <div className={`card-icon-wrapper text-${card.color} mb-3`}>
                        <i className={`fas ${card.icon} fa-lg`}></i>
                      </div>
                      <Card.Title className="fw-bold">{card.title}</Card.Title>
                      <Card.Text className="text-muted flex-grow-1">
                        {card.description}
                      </Card.Text>
                      <Button
                        variant={card.color === "indigo" ? "primary" : card.color}
                        className={`mt-auto btn-${
                          card.color === "indigo" ? "purple" : ""
                        }`}
                        onClick={() => navigate(card.path)}
                      >
                        <i
                          className={`fas ${
                            card.icon === "fa-book" ? "fa-bookmark" : card.icon
                          } me-2`}
                        ></i>
                        {card.buttonText}
                      </Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>

      {/* Add CSS for styling */}
      <style jsx>{`
        .admin-dashboard {
          background-color: #f9fafc;
          min-height: 100vh;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .dashboard-container {
          padding-top: 1.5rem;
          padding-bottom: 3rem;
        }

        .status-bar {
          background-color: #ffffff;
          border-left: 4px solid #6366f1;
        }

        .admin-avatar {
          width: 45px;
          height: 45px;
          background: linear-gradient(45deg, #6366f1, #8b5cf6);
          color: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: bold;
        }

        .status-item {
          font-size: 0.9rem;
        }

        .hero-banner {
          background-image: url("/api/placeholder/1200/400");
          background-size: cover;
          background-position: center;
          position: relative;
          overflow: hidden;
          height: 300px;
        }

        .hero-banner .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(23, 37, 84, 0.95),
            rgba(30, 64, 175, 0.9),
            rgba(59, 130, 246, 0.85)
          );
          z-index: 1;
        }

        .banner-content {
          position: relative;
          z-index: 2;
          height: 100%;
        }

        .dashboard-stats .stat-box {
          background-color: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(5px);
          padding: 15px;
          border-radius: 8px;
        }

        .section-title {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .dashboard-card {
          border: none;
          border-radius: 12px;
          transition: all 0.3s ease;
          overflow: hidden;
          height: 100%;
        }

        .card-image-top {
          height: 140px;
          background-size: cover;
          background-position: center;
          position: relative;
          overflow: hidden; /* Prevent overflow into Card.Body */
        }

        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.4) 100%
          );
          display: flex;
          justify-content: flex-end; /* Align content to the right */
          align-items: flex-start; /* Align content to the top */
          padding: 1rem;
        }

        .card-feature-icon {
          position: absolute;
          top: 10px;
          right: -25px; /* Half of the icon is outside the container */
          width: 80px;
          height: 80px;
          background-color: rgba(255, 255, 255, 0.3); /* Transparent look */
          border-radius: 50%; /* Circular shape */
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px); /* Frosted glass effect */
          transform: rotate(5deg); /* Slight rotation for visual appeal */
          z-index: 2;
          border: 2px solid rgba(255, 255, 255, 0.5);
        }

        /* Dynamic background color based on card type */
        .customer-management .card-feature-icon {
          background: linear-gradient(45deg, #3b82f6, #60a5fa);
        }
        .feedback-management .card-feature-icon {
          background: linear-gradient(45deg, #0ea5e9, #38bdf8);
        }
        .book-management .card-feature-icon {
          background: linear-gradient(45deg, #22c55e, #4ade80);
        }
        .payment-gateway .card-feature-icon {
          background: linear-gradient(45deg, #8b5cf6, #a78bfa);
        }
        .delivery-management .card-feature-icon {
          background: linear-gradient(45deg, #f59e0b, #fbbf24);
        }
        .add-book .card-feature-icon {
          background: linear-gradient(45deg, #ef4444, #f87171);
        }
        .analytics .card-feature-icon {
          background: linear-gradient(45deg, #1f2937, #4b5563);
        }

        .card-icon-wrapper {
          width: 40px;
          height: 40px;
          background-color: #f8fafc;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .customer-management {
          background-image: url("/api/placeholder/400/200");
          background-color: #e0f2fe;
        }

        .feedback-management {
          background-image: url("/api/placeholder/400/200");
          background-color: #dbeafe;
        }

        .book-management {
          background-image: url("/api/placeholder/400/200");
          background-color: #dcfce7;
        }

        .payment-gateway {
          background-image: url("/api/placeholder/400/200");
          background-color: #ede9fe;
        }

        .delivery-management {
          background-image: url("/api/placeholder/400/200");
          background-color: #fef3c7;
        }

        .add-book {
          background-image: url("/api/placeholder/400/200");
          background-color: #fee2e2;
        }

        .analytics {
          background-image: url("/api/placeholder/400/200");
          background-color: #f1f5f9;
        }

        .btn-purple {
          background-color: #8b5cf6;
          border-color: #8b5cf6;
        }

        .btn-purple:hover {
          background-color: #7c3aed;
          border-color: #7c3aed;
        }

        @media (max-width: 768px) {
          .hero-banner {
            height: auto;
          }

          .dashboard-stats {
            flex-direction: column;
          }

          .dashboard-stats .stat-box {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;