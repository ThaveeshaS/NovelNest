/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";
import Header2 from "../../components/Header2"; // Import Header2
import Navbar2 from "../../components/Navbar2"; // Import Navbar2
import { Button, Container, Alert, Spinner, Form, Row, Col, Modal, Badge } from "react-bootstrap"; // Added Badge component

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
  // New state variables for edit functionality
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDelivery, setEditDelivery] = useState(null);
  // New state for table display mode
  const [viewMode, setViewMode] = useState("table"); // table or cards

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/deliveries");
        setDeliveries(response.data);
      } catch (error) {
        console.error("Error fetching deliveries:", error.response || error.message || error);
        setError("Failed to fetch deliveries. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
    generateCaptcha(); // Generate captcha on component mount
  }, []);

  // Search Filter
  const filteredDeliveries = deliveries.filter(
    (delivery) =>
      delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.deliveryId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle PDF generation
  const generateReport = () => {
    const doc = new jsPDF();

    // Add company logo (if available)
    const logo = "/path/to/your/logo.jpg"; // Adjust the logo path accordingly
    if (logo) {
      doc.addImage(logo, "JPEG", 80, 10, 40, 40); // Adjust position and size as needed
    }

    // Add company details
    doc.setFontSize(10);
    doc.text("Call us : +94 123 456 789", 15, 60);
    doc.text("Mail us : info@bookstore.com", 15, 68);
    doc.text("Find us : 123 Book Street, Colombo, Sri Lanka", 15, 76);

    // Add title
    doc.setFontSize(16);
    doc.text("Delivery Details Report", 14, 92);

    // Add table with filtered deliveries
    autoTable(doc, {
      startY: 97,
      head: [
        [
          "Delivery ID",
          "Order ID",
          "Customer Name",
          "Delivery Address",
          "Phone Number",
          "Email",
          "Estimated Delivery Date",
          "Delivery Fee",
        ],
      ],
      body: filteredDeliveries.map((delivery) => [
        delivery.deliveryId,
        delivery.orderId,
        delivery.customerName,
        delivery.deliveryAddress,
        delivery.contactNumber,
        delivery.email,
        delivery.estimatedDeliveryDate,
        `$${delivery.deliveryFee}`,
      ]),
    });

    doc.save("DeliveryDetailsReport.pdf");
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  // Handle terms and conditions agreement
  const handleAgreeToTermsChange = (e) => {
    setAgreeToTerms(e.target.checked);
  };

  // Generate a random captcha
  const generateCaptcha = () => {
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCaptcha(randomString);
    setCaptchaVerified(false); // Reset captcha verification status
  };

  // Verify captcha input
  const verifyCaptcha = () => {
    if (userCaptchaInput === captcha) {
      setCaptchaVerified(true);
      alert("Captcha verified successfully!");
    } else {
      setCaptchaVerified(false);
      alert("Invalid captcha. Please try again.");
    }
  };

  // Handle payment submission
  const handlePaymentSubmit = (e) => {
    e.preventDefault();

    if (!agreeToTerms) {
      alert("You must agree to the terms and conditions to proceed.");
      return;
    }

    if (!captchaVerified) {
      alert("Please verify the captcha to proceed.");
      return;
    }

    if (selectedPaymentMethod) {
      alert(`Payment method selected: ${selectedPaymentMethod}`);
      // Here you can add code to process the payment
    } else {
      alert("Please select a payment method.");
    }
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

  return (
    <div>
      {/* Add Header2 and Navbar2 */}
      <Header2 />
      <Navbar2 />

      <Container className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary fw-bold">Delivery Details</h2>
          <div className="d-flex gap-2">
            <Button 
              variant={viewMode === "table" ? "primary" : "outline-primary"} 
              onClick={() => setViewMode("table")}
            >
              <i className="fas fa-table me-1"></i> Table View
            </Button>
            <Button 
              variant={viewMode === "cards" ? "primary" : "outline-primary"} 
              onClick={() => setViewMode("cards")}
            >
              <i className="fas fa-th-large me-1"></i> Card View
            </Button>
          </div>
        </div>

        {/* Search and Generate Report */}
        <div className="mb-4 bg-light p-3 rounded shadow-sm">
          <div className="input-group">
            <span className="input-group-text bg-primary text-white">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              placeholder="Search by customer name or delivery ID..."
              className="form-control border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="primary" onClick={generateReport} className="fw-bold">
              <i className="fas fa-file-pdf me-1"></i> Generate Report
            </Button>
          </div>
          <div className="mt-2 small text-muted">
            {filteredDeliveries.length} deliveries found
          </div>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center p-5">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-3 text-primary">Loading delivery information...</p>
          </div>
        ) : (
          <>
            {viewMode === "table" ? (
              <div className="table-responsive bg-white rounded shadow">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr className="bg-primary text-white">
                      <th className="py-3">Delivery ID</th>
                      <th className="py-3">Order ID</th>
                      <th className="py-3">Customer Name</th>
                      <th className="py-3">Delivery Address</th>
                      <th className="py-3">Contact</th>
                      <th className="py-3">Estimated Delivery</th>
                      <th className="py-3">Fee</th>
                      <th className="py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeliveries.length > 0 ? (
                      filteredDeliveries.map((delivery) => (
                        <tr key={delivery._id} className="border-bottom">
                          <td className="fw-bold py-3">{delivery.deliveryId}</td>
                          <td className="py-3">{delivery.orderId}</td>
                          <td className="py-3">
                            <div className="d-flex align-items-center">
                              <div className="bg-light rounded-circle text-center me-2" style={{width: "30px", height: "30px", lineHeight: "30px"}}>
                                {delivery.customerName.charAt(0).toUpperCase()}
                              </div>
                              {delivery.customerName}
                            </div>
                          </td>
                          <td className="py-3">
                            <div style={{maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                              <i className="fas fa-map-marker-alt text-danger me-1"></i>
                              {delivery.deliveryAddress}
                            </div>
                          </td>
                          <td className="py-3">
                            <div><i className="fas fa-phone-alt text-success me-1"></i> {delivery.contactNumber}</div>
                            <div className="small text-muted"><i className="fas fa-envelope me-1"></i> {delivery.email}</div>
                          </td>
                          <td className="py-3">
                            <div>{delivery.estimatedDeliveryDate}</div>
                            <Badge bg={getDeliveryStatusColor(delivery.estimatedDeliveryDate)}>
                              {getDeliveryStatusText(delivery.estimatedDeliveryDate)}
                            </Badge>
                          </td>
                          <td className="py-3 fw-bold">${delivery.deliveryFee}</td>
                          <td className="text-center py-3">
                            <div className="d-flex justify-content-center gap-2">
                              <Button 
                                variant="outline-success" 
                                size="sm" 
                                className="rounded-pill border-2"
                                style={{
                                  minWidth: '80px',
                                  transition: 'all 0.3s ease',
                                  fontWeight: '500'
                                }}
                                onClick={() => handleEditClick(delivery)}
                              >
                                <i className="fas fa-edit me-1"></i> Edit
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                className="rounded-pill border-2"
                                style={{
                                  minWidth: '80px',
                                  transition: 'all 0.3s ease',
                                  fontWeight: '500'
                                }}
                                onClick={() => handleDeleteClick(delivery._id)}
                              >
                                <i className="fas fa-trash-alt me-1"></i> Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center text-danger py-4">
                          <i className="fas fa-exclamation-triangle me-2"></i>
                          No matching deliveries found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <Row>
                {filteredDeliveries.length > 0 ? (
                  filteredDeliveries.map((delivery) => (
                    <Col lg={4} md={6} className="mb-4" key={delivery._id}>
                      <div className="card h-100 shadow-sm hover-shadow border-0">
                        <div className="card-header bg-primary text-white">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold">{delivery.deliveryId}</span>
                            <Badge bg={getDeliveryStatusColor(delivery.estimatedDeliveryDate)}>
                              {getDeliveryStatusText(delivery.estimatedDeliveryDate)}
                            </Badge>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="mb-3">
                            <div className="d-flex align-items-center mb-2">
                              <div className="bg-light rounded-circle text-center me-2" style={{width: "40px", height: "40px", lineHeight: "40px"}}>
                                {delivery.customerName.charAt(0).toUpperCase()}
                              </div>
                              <h5 className="mb-0">{delivery.customerName}</h5>
                            </div>
                            <p className="text-muted mb-0"><small>{delivery.email}</small></p>
                          </div>
                          
                          <div className="mb-2">
                            <div className="small text-muted mb-1">Delivery Address</div>
                            <p className="mb-0">
                              <i className="fas fa-map-marker-alt text-danger me-1"></i>
                              {delivery.deliveryAddress}
                            </p>
                          </div>
                          
                          <div className="mb-2">
                            <div className="small text-muted mb-1">Contact</div>
                            <p className="mb-0">
                              <i className="fas fa-phone-alt text-success me-1"></i>
                              {delivery.contactNumber}
                            </p>
                          </div>
                          
                          <div className="d-flex justify-content-between mb-2">
                            <div>
                              <div className="small text-muted mb-1">Order ID</div>
                              <p className="mb-0">{delivery.orderId}</p>
                            </div>
                            <div>
                              <div className="small text-muted mb-1">Delivery Fee</div>
                              <p className="fw-bold mb-0">${delivery.deliveryFee}</p>
                            </div>
                          </div>
                          
                          <div>
                            <div className="small text-muted mb-1">Estimated Delivery Date</div>
                            <p className="mb-0">{delivery.estimatedDeliveryDate}</p>
                          </div>
                        </div>
                        <div className="card-footer bg-white border-0 pt-0">
                          <div className="d-flex gap-2">
                            <Button 
                              variant="outline-success" 
                              size="sm" 
                              className="w-50 rounded-pill border-2"
                              onClick={() => handleEditClick(delivery)}
                            >
                              <i className="fas fa-edit me-1"></i> Edit
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              className="w-50 rounded-pill border-2"
                              onClick={() => handleDeleteClick(delivery._id)}
                            >
                              <i className="fas fa-trash-alt me-1"></i> Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))
                ) : (
                  <Col className="text-center text-danger py-5">
                    <i className="fas fa-exclamation-triangle fs-1 mb-3"></i>
                    <h4>No matching deliveries found.</h4>
                  </Col>
                )}
              </Row>
            )}
          </>
        )}
      </Container>

      {/* Edit Delivery Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Edit Delivery Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editDelivery && (
            <Form>
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
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="contactNumber"
                  value={editDelivery.contactNumber}
                  onChange={handleEditInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={editDelivery.email}
                  onChange={handleEditInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Estimated Delivery Date</Form.Label>
                <Form.Control
                  type="text"
                  name="estimatedDeliveryDate"
                  value={editDelivery.estimatedDeliveryDate}
                  onChange={handleEditInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Delivery Fee</Form.Label>
                <Form.Control
                  type="number"
                  name="deliveryFee"
                  value={editDelivery.deliveryFee}
                  onChange={handleEditInputChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            <i className="fas fa-times me-1"></i> Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            <i className="fas fa-save me-1"></i> Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}