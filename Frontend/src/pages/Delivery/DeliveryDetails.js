/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";
import Header2 from "../../components/Header2";
import Navbar2 from "../../components/Navbar2";
import "./DeliveryDetails.css";
import { Button, Container, Alert, Spinner, Form, Row, Col, Modal, Badge, ProgressBar, OverlayTrigger, Tooltip } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaTruck, FaFilePdf, FaSearch, FaEdit, FaTrashAlt, FaCheckCircle, FaClock, FaExclamationTriangle, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaDollarSign, FaBoxOpen, FaTimes, FaSave } from "react-icons/fa";
import { GiDeliveryDrone } from "react-icons/gi";
import { RiCouponLine } from "react-icons/ri";
import { BsGraphUp, BsCalendarCheck } from "react-icons/bs";
import "./DeliveryDetails.css"; // Custom CSS file for additional styling


export default function DeliveryDetails() {
  const [deliveries, setDeliveries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [userCaptchaInput, setUserCaptchaInput] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDelivery, setEditDelivery] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [showQuickStats, setShowQuickStats] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "estimatedDeliveryDate", direction: "ascending" });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/deliveries");
        setDeliveries(response.data);
      } catch (error) {
        console.error("Error fetching deliveries:", error);
        setError("Failed to fetch deliveries. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
    generateCaptcha();
  }, []);

  // Sort deliveries
  const sortedDeliveries = React.useMemo(() => {
    let sortableItems = [...deliveries];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [deliveries, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Calculate analytics
  const calculateAnalytics = () => {
    const today = new Date();
    let totalFee = 0;
    let pendingOrders = 0;
    let onTrackOrders = 0;
    let soonOrders = 0;
    let delayedOrders = 0;
    let completedOrders = 0;

    deliveries.forEach(delivery => {
      totalFee += delivery.deliveryFee || 0;
      
      const deliveryDate = new Date(delivery.estimatedDeliveryDate);
      const difference = Math.ceil((deliveryDate - today) / (1000 * 60 * 60 * 24));
      
      if (difference < 0) delayedOrders++;
      else if (difference <= 2) soonOrders++;
      else if (difference > 2) onTrackOrders++;
      
      if (delivery.status === "completed") completedOrders++;
    });

    return {
      totalFee: totalFee.toFixed(2),
      totalOrders: deliveries.length,
      pendingOrders,
      onTrackOrders,
      soonOrders,
      delayedOrders,
      completedOrders
    };
  };

  const analytics = calculateAnalytics();

  // Filter deliveries based on status
  const filterDeliveries = (deliveries) => {
    const today = new Date();
    
    switch (activeFilter) {
      case "delayed":
        return deliveries.filter(delivery => {
          const deliveryDate = new Date(delivery.estimatedDeliveryDate);
          return deliveryDate < today;
        });
      case "soon":
        return deliveries.filter(delivery => {
          const deliveryDate = new Date(delivery.estimatedDeliveryDate);
          const difference = Math.ceil((deliveryDate - today) / (1000 * 60 * 60 * 24));
          return difference <= 2 && difference >= 0;
        });
      case "onTrack":
        return deliveries.filter(delivery => {
          const deliveryDate = new Date(delivery.estimatedDeliveryDate);
          const difference = Math.ceil((deliveryDate - today) / (1000 * 60 * 60 * 24));
          return difference > 2;
        });
      case "completed":
        return deliveries.filter(delivery => delivery.status === "completed");
      default:
        return deliveries;
    }
  };

  // Search Filter
  const filteredDeliveries = filterDeliveries(sortedDeliveries).filter(
    (delivery) =>
      delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.deliveryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle PDF generation
  const generateReport = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm"
    });

    // Add company logo
    doc.setFontSize(20);
    doc.setTextColor(40, 103, 178);
    doc.text("BookWorm Delivery Report", 105, 15, { align: "center" });

    // Add report details
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 25);
    doc.text(`Total Deliveries: ${filteredDeliveries.length}`, 10, 30);
    doc.text(`Total Revenue: Rs.${analytics.totalFee}`, 10, 35);

    // Add table with filtered deliveries
    autoTable(doc, {
      startY: 40,
      head: [
        [
          "Delivery ID",
          "Order ID",
          "Customer",
          "Address",
          "Contact",
          "Delivery Date",
          "Status",
          "Fee"
        ],
      ],
      body: filteredDeliveries.map((delivery) => [
        delivery.deliveryId,
        delivery.orderId,
        delivery.customerName,
        delivery.deliveryAddress,
        delivery.contactNumber,
        delivery.estimatedDeliveryDate,
        getDeliveryStatusText(delivery.estimatedDeliveryDate),
        `Rs.${delivery.deliveryFee}`,
      ]),
      styles: {
        fontSize: 8,
        cellPadding: 2,
        valign: "middle"
      },
      headStyles: {
        fillColor: [40, 103, 178],
        textColor: 255,
        fontSize: 9,
        fontStyle: "bold"
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      margin: { top: 40 }
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}`, 200, 200, { align: "right" });
      doc.text("Confidential - BookWorm Delivery Services", 10, 200);
    }

    doc.save(`DeliveryReport_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Generate a random captcha
  const generateCaptcha = () => {
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCaptcha(randomString);
    setCaptchaVerified(false);
  };

  // Handle edit button click
  const handleEditClick = (delivery) => {
    setEditDelivery(delivery);
    setShowEditModal(true);
  };

  // Handle delete button click
  const handleDeleteClick = async (deliveryId) => {
    if (window.confirm("Are you sure you want to delete this delivery?")) {
      try {
        await axios.delete(`http://localhost:5000/api/deliveries/${deliveryId}`);
        setDeliveries(deliveries.filter((delivery) => delivery._id !== deliveryId));
        alert("Delivery deleted successfully");
      } catch (error) {
        console.error("Error deleting delivery:", error);
        alert("Failed to delete delivery. Please try again.");
      }
    }
  };

  // Handle save changes in edit modal
  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:5000/api/deliveries/${editDelivery._id}`, editDelivery);
      setDeliveries(
        deliveries.map((delivery) =>
          delivery._id === editDelivery._id ? editDelivery : delivery
        )
      );
      setShowEditModal(false);
      alert("Delivery updated successfully");
    } catch (error) {
      console.error("Error updating delivery:", error);
      alert("Failed to update delivery. Please try again.");
    }
  };

  // Handle input change in edit modal
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditDelivery({ ...editDelivery, [name]: value });
  };

  // Get status color based on delivery date
  const getDeliveryStatusColor = (dateString) => {
    const deliveryDate = new Date(dateString);
    const today = new Date();
    const difference = Math.ceil((deliveryDate - today) / (1000 * 60 * 60 * 24));
    
    if (difference < 0) return "danger"; // Past due
    if (difference <= 2) return "warning"; // Due soon
    return "success"; // On track
  };

  // Get delivery status text
  const getDeliveryStatusText = (dateString) => {
    const deliveryDate = new Date(dateString);
    const today = new Date();
    const difference = Math.ceil((deliveryDate - today) / (1000 * 60 * 60 * 24));
    
    if (difference < 0) return "Delayed";
    if (difference === 0) return "Today";
    if (difference === 1) return "Tomorrow";
    if (difference <= 2) return "Soon";
    return "On Track";
  };

  // Calculate delivery progress (for progress bar)
  const calculateDeliveryProgress = (createdDate, estimatedDate) => {
    const created = new Date(createdDate);
    const estimated = new Date(estimatedDate);
    const today = new Date();
    
    const totalDuration = estimated - created;
    const elapsedDuration = today - created;
    
    const progress = Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));
    return progress;
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Header2 />
      <Navbar2 />

      <Container className="mt-4 delivery-dashboard">
        {/* Dashboard Header */}
        <motion.div variants={itemVariants} className="dashboard-header mb-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="d-flex align-items-center mb-3 mb-md-0">
              <GiDeliveryDrone className="text-primary me-2" size={28} />
              <h1 className="h3 mb-0 text-primary fw-bold">Delivery Management</h1>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant={viewMode === "table" ? "primary" : "outline-primary"} 
                onClick={() => setViewMode("table")}
                className="d-flex align-items-center"
              >
                <FaTruck className="me-1" /> Table View
              </Button>
              <Button 
                variant={viewMode === "cards" ? "primary" : "outline-primary"} 
                onClick={() => setViewMode("cards")}
                className="d-flex align-items-center"
              >
                <FaBoxOpen className="me-1" /> Card View
              </Button>
              <Button 
                variant="outline-success" 
                onClick={() => setShowQuickStats(!showQuickStats)}
                className="d-flex align-items-center"
              >
                <BsGraphUp className="me-1" /> {showQuickStats ? "Hide" : "Show"} Stats
              </Button>
            </div>
          </div>
          <p className="text-muted mb-0">Manage and track all delivery operations</p>
        </motion.div>

        {/* Quick Stats Section */}
        {showQuickStats && (
          <motion.div variants={itemVariants} className="mb-4">
            <Row className="g-3">
              <Col lg={3} md={6}>
                <motion.div whileHover={{ scale: 1.02 }} className="stat-card bg-white p-3 rounded shadow-sm border-start border-4 border-primary">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-1">Total Revenue</h6>
                      <h3 className="mb-0">Rs.{analytics.totalFee}</h3>
                      <small className="text-success">+12% from last month</small>
                    </div>
                    <div className="stat-icon bg-primary bg-opacity-10 p-3 rounded-circle">
                      <FaDollarSign className="text-primary fs-4" />
                    </div>
                  </div>
                </motion.div>
              </Col>
              <Col lg={3} md={6}>
                <motion.div whileHover={{ scale: 1.02 }} className="stat-card bg-white p-3 rounded shadow-sm border-start border-4 border-info">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-1">Total Orders</h6>
                      <h3 className="mb-0">{analytics.totalOrders}</h3>
                      <small className="text-success">+5 new today</small>
                    </div>
                    <div className="stat-icon bg-info bg-opacity-10 p-3 rounded-circle">
                      <FaTruck className="text-info fs-4" />
                    </div>
                  </div>
                </motion.div>
              </Col>
              <Col lg={3} md={6}>
                <motion.div whileHover={{ scale: 1.02 }} className="stat-card bg-white p-3 rounded shadow-sm border-start border-4 border-success">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-1">On Track</h6>
                      <h3 className="mb-0">{analytics.onTrackOrders}</h3>
                      <small>{Math.round((analytics.onTrackOrders / analytics.totalOrders) * 100)}% of total</small>
                    </div>
                    <div className="stat-icon bg-success bg-opacity-10 p-3 rounded-circle">
                      <FaCheckCircle className="text-success fs-4" />
                    </div>
                  </div>
                </motion.div>
              </Col>
              <Col lg={3} md={6}>
                <motion.div whileHover={{ scale: 1.02 }} className="stat-card bg-white p-3 rounded shadow-sm border-start border-4 border-warning">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-1">Coming Soon</h6>
                      <h3 className="mb-0">{analytics.soonOrders}</h3>
                      <small>Need attention</small>
                    </div>
                    <div className="stat-icon bg-warning bg-opacity-10 p-3 rounded-circle">
                      <FaClock className="text-warning fs-4" />
                    </div>
                  </div>
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        )}

        {/* Controls Section */}
        <motion.div variants={itemVariants} className="controls-section mb-4 p-3 bg-light rounded shadow-sm">
          <Row className="g-3 align-items-center">
            <Col md={6} lg={4}>
              <div className="search-box input-group">
                <span className="input-group-text bg-primary text-white">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  placeholder="Search deliveries..."
                  className="form-control border-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </Col>
            <Col md={6} lg={4}>
              <div className="d-flex flex-wrap gap-2">
                <Button 
                  variant={activeFilter === "all" ? "primary" : "outline-primary"} 
                  onClick={() => setActiveFilter("all")}
                  size="sm"
                >
                  All
                </Button>
                <Button 
                  variant={activeFilter === "onTrack" ? "primary" : "outline-primary"} 
                  onClick={() => setActiveFilter("onTrack")}
                  size="sm"
                >
                  On Track
                </Button>
                <Button 
                  variant={activeFilter === "soon" ? "primary" : "outline-primary"} 
                  onClick={() => setActiveFilter("soon")}
                  size="sm"
                >
                  Coming Soon
                </Button>
                <Button 
                  variant={activeFilter === "delayed" ? "primary" : "outline-primary"} 
                  onClick={() => setActiveFilter("delayed")}
                  size="sm"
                >
                  Delayed
                </Button>
              </div>
            </Col>
            <Col md={12} lg={4}>
              <div className="d-flex justify-content-end gap-2">
                <OverlayTrigger placement="top" overlay={<Tooltip>Generate PDF Report</Tooltip>}>
                  <Button variant="primary" onClick={generateReport} className="d-flex align-items-center">
                    <FaFilePdf className="me-1" /> Report
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="top" overlay={<Tooltip>Add New Delivery</Tooltip>}>
                  <Button variant="success" className="d-flex align-items-center">
                    <FaTruck className="me-1" /> New
                  </Button>
                </OverlayTrigger>
              </div>
            </Col>
          </Row>
          <div className="mt-2 small text-muted d-flex justify-content-between">
            <div>
              Showing <strong>{filteredDeliveries.length}</strong> of <strong>{deliveries.length}</strong> deliveries
            </div>
            <div>
              Filter: <span className="fw-bold text-capitalize">{activeFilter}</span>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div variants={itemVariants}>
            <Alert variant="danger" className="d-flex align-items-center">
              <FaExclamationTriangle className="me-2" />
              {error}
            </Alert>
          </motion.div>
        )}

        {loading ? (
          <motion.div variants={itemVariants} className="text-center p-5">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-3 text-primary">Loading delivery information...</p>
          </motion.div>
        ) : (
          <>
            {viewMode === "table" ? (
              <motion.div variants={itemVariants} className="table-responsive bg-white rounded shadow">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr className="bg-primary text-white">
                      <th className="py-3 cursor-pointer" onClick={() => requestSort("deliveryId")}>
                        Delivery ID {sortConfig.key === "deliveryId" && (
                          <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                        )}
                      </th>
                      <th className="py-3 cursor-pointer" onClick={() => requestSort("orderId")}>
                        Order ID {sortConfig.key === "orderId" && (
                          <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                        )}
                      </th>
                      <th className="py-3 cursor-pointer" onClick={() => requestSort("customerName")}>
                        Customer {sortConfig.key === "customerName" && (
                          <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                        )}
                      </th>
                      <th className="py-3">Address</th>
                      <th className="py-3">Contact</th>
                      <th className="py-3 cursor-pointer" onClick={() => requestSort("estimatedDeliveryDate")}>
                        Delivery Date {sortConfig.key === "estimatedDeliveryDate" && (
                          <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                        )}
                      </th>
                      <th className="py-3">Progress</th>
                      <th className="py-3 cursor-pointer" onClick={() => requestSort("deliveryFee")}>
                        Fee {sortConfig.key === "deliveryFee" && (
                          <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                        )}
                      </th>
                      <th className="py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeliveries.length > 0 ? (
                      filteredDeliveries.map((delivery) => (
                        <motion.tr 
                          key={delivery._id} 
                          className="border-bottom"
                          whileHover={{ backgroundColor: "rgba(13, 110, 253, 0.05)" }}
                          transition={{ duration: 0.2 }}
                        >
                          <td className="fw-bold py-3">
                            <Badge bg="secondary" className="me-1">#{delivery.deliveryId}</Badge>
                          </td>
                          <td className="py-3">
                            <Badge bg="light" text="dark" className="border">
                              {delivery.orderId}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <div className="d-flex align-items-center">
                              <div className="customer-avatar bg-light rounded-circle text-center me-2">
                                {delivery.customerName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="fw-medium">{delivery.customerName}</div>
                                <small className="text-muted">{delivery.email}</small>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="address-cell">
                              <FaMapMarkerAlt className="text-danger me-1" />
                              {delivery.deliveryAddress}
                            </div>
                          </td>
                          <td className="py-3">
                            <div><FaPhoneAlt className="text-success me-1" /> {delivery.contactNumber}</div>
                          </td>
                          <td className="py-3">
                            <div className="d-flex flex-column">
                              <div className="fw-medium">
                                <BsCalendarCheck className="me-1" />
                                {new Date(delivery.estimatedDeliveryDate).toLocaleDateString()}
                              </div>
                              <Badge bg={getDeliveryStatusColor(delivery.estimatedDeliveryDate)} className="mt-1 align-self-start">
                                {getDeliveryStatusText(delivery.estimatedDeliveryDate)}
                              </Badge>
                            </div>
                          </td>
                          <td className="py-3">
                            <ProgressBar 
                              now={calculateDeliveryProgress(delivery.createdAt, delivery.estimatedDeliveryDate)} 
                              variant={getDeliveryStatusColor(delivery.estimatedDeliveryDate)}
                              striped
                              animated
                              label={`${Math.round(calculateDeliveryProgress(delivery.createdAt, delivery.estimatedDeliveryDate))}%`}
                            />
                          </td>
                          <td className="py-3 fw-bold text-success">
                            Rs.{delivery.deliveryFee}
                          </td>
                          <td className="text-center py-3">
                            <div className="d-flex justify-content-center gap-2">
                              <OverlayTrigger placement="top" overlay={<Tooltip>Edit Delivery</Tooltip>}>
                                <Button 
                                  variant="outline-primary" 
                                  size="sm" 
                                  className="action-btn rounded-circle"
                                  onClick={() => handleEditClick(delivery)}
                                >
                                  <FaEdit />
                                </Button>
                              </OverlayTrigger>
                              <OverlayTrigger placement="top" overlay={<Tooltip>Delete Delivery</Tooltip>}>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm"
                                  className="action-btn rounded-circle"
                                  onClick={() => handleDeleteClick(delivery._id)}
                                >
                                  <FaTrashAlt />
                                </Button>
                              </OverlayTrigger>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center text-danger py-5">
                          <div className="d-flex flex-column align-items-center">
                            <FaExclamationTriangle size={32} className="mb-3" />
                            <h5>No matching deliveries found</h5>
                            <p className="text-muted">Try adjusting your search or filter criteria</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </motion.div>
            ) : (
              <motion.div variants={containerVariants} className="delivery-cards-container">
                <Row className="g-4">
                  {filteredDeliveries.length > 0 ? (
                    filteredDeliveries.map((delivery) => (
                      <Col xl={4} lg={6} key={delivery._id}>
                        <motion.div 
                          variants={itemVariants}
                          whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                          className="delivery-card card h-100 shadow-sm border-0 overflow-hidden"
                        >
                          <div className={`card-header bg-gradient d-flex justify-content-between align-items-center ${getDeliveryStatusColor(delivery.estimatedDeliveryDate)}`}>
                            <div className="d-flex align-items-center">
                              <FaTruck className="me-2" />
                              <span className="fw-bold">{delivery.deliveryId}</span>
                            </div>
                            <Badge bg="light" text="dark" pill>
                              {delivery.orderId}
                            </Badge>
                          </div>
                          <div className="card-body">
                            <div className="d-flex align-items-start mb-3">
                              <div className="customer-avatar-lg bg-light rounded-circle text-center me-3">
                                {delivery.customerName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h5 className="mb-1">{delivery.customerName}</h5>
                                <small className="text-muted">{delivery.email}</small>
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <div className="d-flex align-items-center text-muted mb-1">
                                <FaMapMarkerAlt className="me-2" />
                                <small>Delivery Address</small>
                              </div>
                              <p className="mb-0">{delivery.deliveryAddress}</p>
                            </div>
                            
                            <div className="mb-3">
                              <div className="d-flex align-items-center text-muted mb-1">
                                <FaPhoneAlt className="me-2" />
                                <small>Contact Information</small>
                              </div>
                              <p className="mb-0">{delivery.contactNumber}</p>
                            </div>
                            
                            <div className="mb-3">
                              <div className="d-flex justify-content-between mb-2">
                                <div className="d-flex align-items-center text-muted">
                                  <BsCalendarCheck className="me-2" />
                                  <small>Delivery Date</small>
                                </div>
                                <Badge bg={getDeliveryStatusColor(delivery.estimatedDeliveryDate)}>
                                  {getDeliveryStatusText(delivery.estimatedDeliveryDate)}
                                </Badge>
                              </div>
                              <p className="mb-2 fw-medium">
                                {new Date(delivery.estimatedDeliveryDate).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                              <ProgressBar 
                                now={calculateDeliveryProgress(delivery.createdAt, delivery.estimatedDeliveryDate)} 
                                variant={getDeliveryStatusColor(delivery.estimatedDeliveryDate)}
                                striped
                                animated
                              />
                            </div>
                            
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <small className="text-muted d-block">Delivery Fee</small>
                                <h4 className="mb-0 text-success">Rs.{delivery.deliveryFee}</h4>
                              </div>
                              <div className="d-flex gap-2">
                                <Button 
                                  variant="outline-primary" 
                                  size="sm"
                                  className="rounded-circle p-2"
                                  onClick={() => handleEditClick(delivery)}
                                >
                                  <FaEdit />
                                </Button>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm"
                                  className="rounded-circle p-2"
                                  onClick={() => handleDeleteClick(delivery._id)}
                                >
                                  <FaTrashAlt />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </Col>
                    ))
                  ) : (
                    <Col className="text-center py-5">
                      <motion.div 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="empty-state"
                      >
                        <GiDeliveryDrone size={64} className="text-muted mb-3" />
                        <h4 className="text-danger">No deliveries found</h4>
                        <p className="text-muted">Try adjusting your search or filter criteria</p>
                        <Button 
                          variant="primary" 
                          onClick={() => {
                            setSearchTerm("");
                            setActiveFilter("all");
                          }}
                        >
                          Reset Filters
                        </Button>
                      </motion.div>
                    </Col>
                  )}
                </Row>
              </motion.div>
            )}
          </>
        )}
      </Container>

      {/* Edit Delivery Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="d-flex align-items-center">
            <FaEdit className="me-2" /> Edit Delivery Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editDelivery && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Delivery ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="deliveryId"
                      value={editDelivery.deliveryId}
                      onChange={handleEditInputChange}
                      disabled
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Order ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="orderId"
                      value={editDelivery.orderId}
                      onChange={handleEditInputChange}
                      disabled
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Customer Name</Form.Label>
                <Form.Control
                  type="text"
                  name="customerName"
                  value={editDelivery.customerName}
                  onChange={handleEditInputChange}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Delivery Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="deliveryAddress"
                  value={editDelivery.deliveryAddress}
                  onChange={handleEditInputChange}
                />
              </Form.Group>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="contactNumber"
                      value={editDelivery.contactNumber}
                      onChange={handleEditInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={editDelivery.email}
                      onChange={handleEditInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Estimated Delivery Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="estimatedDeliveryDate"
                      value={editDelivery.estimatedDeliveryDate}
                      onChange={handleEditInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Delivery Fee (Rs.)</Form.Label>
                    <Form.Control
                      type="number"
                      name="deliveryFee"
                      value={editDelivery.deliveryFee}
                      onChange={handleEditInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Delivery Status</Form.Label>
                <Form.Select
                  name="status"
                  value={editDelivery.status || "pending"}
                  onChange={handleEditInputChange}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="out-for-delivery">Out for Delivery</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Special Instructions</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="specialInstructions"
                  value={editDelivery.specialInstructions || ""}
                  onChange={handleEditInputChange}
                  placeholder="Any special instructions for delivery"
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            <FaTimes className="me-1" /> Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            <FaSave className="me-1" /> Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
}