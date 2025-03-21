import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";
import Header2 from "../../components/Header2"; // Import Header2
import Navbar2 from "../../components/Navbar2"; // Import Navbar2
import { Button, Container, Alert, Spinner, Form, Row, Col, Modal, Card } from "react-bootstrap"; // Added Card component

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

  return (
    <div>
      {/* Add Header2 and Navbar2 */}
      <Header2 />
      <Navbar2 />

      <Container className="mt-5">
        <h2 className="mb-4 text-center">Delivery Details</h2>

        {/* Search and Generate Report */}
        <div className="mb-4">
          <div className="input-group">
            <input
              type="text"
              placeholder="Search by customer name or delivery ID..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="primary" onClick={generateReport}>
              <i className="fas fa-file-pdf"></i> Generate Report
            </Button>
          </div>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>Delivery ID</th>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Delivery Address</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Estimated Delivery Date</th>
                  <th>Delivery Fee</th>
                  <th>Actions</th> {/* New column for actions */}
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.length > 0 ? (
                  filteredDeliveries.map((delivery) => (
                    <tr key={delivery._id}>
                      <td>{delivery.deliveryId}</td>
                      <td>{delivery.orderId}</td>
                      <td>{delivery.customerName}</td>
                      <td>{delivery.deliveryAddress}</td>
                      <td>{delivery.contactNumber}</td>
                      <td>{delivery.email}</td>
                      <td>{delivery.estimatedDeliveryDate}</td>
                      <td>${delivery.deliveryFee}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button 
                            variant="success" 
                            size="sm" 
                            className="rounded-pill shadow-sm"
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
                            variant="danger" 
                            size="sm"
                            className="rounded-pill shadow-sm"
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
                    <td colSpan="9" className="text-center text-danger">
                      No matching deliveries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Enhanced Payment Method Section */}
        <div className="mt-5 py-4 px-3 bg-light rounded shadow-sm">
          <h3 className="mb-4 text-center position-relative">
            <span className="bg-primary px-4 py-2 rounded-pill text-white shadow">Select Payment Method</span>
          </h3>
          
          <Form onSubmit={handlePaymentSubmit}>
            <Row className="justify-content-center mb-4">
              <Col md={10} lg={8}>
                <div className="payment-options">
                  <Row>
                    {/* Commercial Bank Payment Option */}
                    <Col md={6} className="mb-3">
                      <Card 
                        className={`h-100 payment-card ${selectedPaymentMethod === "Commercial Bank" ? "border-primary" : ""}`}
                        style={{ 
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          transform: selectedPaymentMethod === "Commercial Bank" ? 'translateY(-5px)' : 'none',
                          boxShadow: selectedPaymentMethod === "Commercial Bank" ? '0 10px 20px rgba(0,0,0,0.1)' : '0 4px 8px rgba(0,0,0,0.05)'
                        }}
                        onClick={() => setSelectedPaymentMethod("Commercial Bank")}
                      >
                        <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                          <div 
                            className="payment-icon mb-3 rounded-circle bg-light d-flex align-items-center justify-content-center"
                            style={{ width: '70px', height: '70px' }}
                          >
                            <i className="fas fa-university fs-2 text-primary"></i>
                          </div>
                          <Card.Title className="text-center mb-3">Commercial Bank</Card.Title>
                          <Form.Check
                            type="radio"
                            name="paymentMethod"
                            value="Commercial Bank"
                            checked={selectedPaymentMethod === "Commercial Bank"}
                            onChange={handlePaymentMethodChange}
                            className="visually-hidden"
                            id="commercial-bank"
                          />
                          <label 
                            htmlFor="commercial-bank" 
                            className={`btn ${selectedPaymentMethod === "Commercial Bank" ? "btn-primary" : "btn-outline-primary"} w-100`}
                          >
                            {selectedPaymentMethod === "Commercial Bank" ? <><i className="fas fa-check-circle me-2"></i>Selected</> : "Select"}
                          </label>
                        </Card.Body>
                      </Card>
                    </Col>

                    {/* MasterCard Payment Option */}
                    <Col md={6} className="mb-3">
                      <Card 
                        className={`h-100 payment-card ${selectedPaymentMethod === "MasterCard" ? "border-primary" : ""}`}
                        style={{ 
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          transform: selectedPaymentMethod === "MasterCard" ? 'translateY(-5px)' : 'none',
                          boxShadow: selectedPaymentMethod === "MasterCard" ? '0 10px 20px rgba(0,0,0,0.1)' : '0 4px 8px rgba(0,0,0,0.05)'
                        }}
                        onClick={() => setSelectedPaymentMethod("MasterCard")}
                      >
                        <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                          <div 
                            className="payment-icon mb-3 rounded-circle bg-light d-flex align-items-center justify-content-center"
                            style={{ width: '70px', height: '70px' }}
                          >
                            <i className="fab fa-cc-mastercard fs-2 text-danger"></i>
                          </div>
                          <Card.Title className="text-center mb-3">MasterCard</Card.Title>
                          <Form.Check
                            type="radio"
                            name="paymentMethod"
                            value="MasterCard"
                            checked={selectedPaymentMethod === "MasterCard"}
                            onChange={handlePaymentMethodChange}
                            className="visually-hidden"
                            id="mastercard"
                          />
                          <label 
                            htmlFor="mastercard" 
                            className={`btn ${selectedPaymentMethod === "MasterCard" ? "btn-primary" : "btn-outline-primary"} w-100`}
                          >
                            {selectedPaymentMethod === "MasterCard" ? <><i className="fas fa-check-circle me-2"></i>Selected</> : "Select"}
                          </label>
                        </Card.Body>
                      </Card>
                    </Col>

                    {/* Visa Payment Option */}
                    <Col md={6} className="mb-3">
                      <Card 
                        className={`h-100 payment-card ${selectedPaymentMethod === "Visa" ? "border-primary" : ""}`}
                        style={{ 
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          transform: selectedPaymentMethod === "Visa" ? 'translateY(-5px)' : 'none',
                          boxShadow: selectedPaymentMethod === "Visa" ? '0 10px 20px rgba(0,0,0,0.1)' : '0 4px 8px rgba(0,0,0,0.05)'
                        }}
                        onClick={() => setSelectedPaymentMethod("Visa")}
                      >
                        <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                          <div 
                            className="payment-icon mb-3 rounded-circle bg-light d-flex align-items-center justify-content-center"
                            style={{ width: '70px', height: '70px' }}
                          >
                            <i className="fab fa-cc-visa fs-2 text-primary"></i>
                          </div>
                          <Card.Title className="text-center mb-3">Visa</Card.Title>
                          <Form.Check
                            type="radio"
                            name="paymentMethod"
                            value="Visa"
                            checked={selectedPaymentMethod === "Visa"}
                            onChange={handlePaymentMethodChange}
                            className="visually-hidden"
                            id="visa"
                          />
                          <label 
                            htmlFor="visa" 
                            className={`btn ${selectedPaymentMethod === "Visa" ? "btn-primary" : "btn-outline-primary"} w-100`}
                          >
                            {selectedPaymentMethod === "Visa" ? <><i className="fas fa-check-circle me-2"></i>Selected</> : "Select"}
                          </label>
                        </Card.Body>
                      </Card>
                    </Col>

                    {/* Cash on Delivery Payment Option */}
                    <Col md={6} className="mb-3">
                      <Card 
                        className={`h-100 payment-card ${selectedPaymentMethod === "Cash on Delivery" ? "border-primary" : ""}`}
                        style={{ 
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          transform: selectedPaymentMethod === "Cash on Delivery" ? 'translateY(-5px)' : 'none',
                          boxShadow: selectedPaymentMethod === "Cash on Delivery" ? '0 10px 20px rgba(0,0,0,0.1)' : '0 4px 8px rgba(0,0,0,0.05)'
                        }}
                        onClick={() => setSelectedPaymentMethod("Cash on Delivery")}
                      >
                        <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                          <div 
                            className="payment-icon mb-3 rounded-circle bg-light d-flex align-items-center justify-content-center"
                            style={{ width: '70px', height: '70px' }}
                          >
                            <i className="fas fa-money-bill-wave fs-2 text-success"></i>
                          </div>
                          <Card.Title className="text-center mb-3">Cash on Delivery</Card.Title>
                          <Form.Check
                            type="radio"
                            name="paymentMethod"
                            value="Cash on Delivery"
                            checked={selectedPaymentMethod === "Cash on Delivery"}
                            onChange={handlePaymentMethodChange}
                            className="visually-hidden"
                            id="cod"
                          />
                          <label 
                            htmlFor="cod" 
                            className={`btn ${selectedPaymentMethod === "Cash on Delivery" ? "btn-primary" : "btn-outline-primary"} w-100`}
                          >
                            {selectedPaymentMethod === "Cash on Delivery" ? <><i className="fas fa-check-circle me-2"></i>Selected</> : "Select"}
                          </label>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

            {/* Terms and Captcha Section */}
            <div className="bg-white p-4 rounded shadow-sm mt-3">
              <Row className="justify-content-center">
                <Col md={10}>
                  {/* Selected Payment Method Summary */}
                  {selectedPaymentMethod && (
                    <Alert variant="info" className="d-flex align-items-center">
                      <i className="fas fa-info-circle fs-4 me-3"></i>
                      <div>
                        <strong>Selected Payment Method:</strong> {selectedPaymentMethod}
                      </div>
                    </Alert>
                  )}
                  
                  {/* Terms and Conditions */}
                  <div className="border-top pt-4 mt-3">
                    <h5 className="mb-3"><i className="fas fa-file-contract me-2 text-primary"></i>Terms & Privacy</h5>
                    
                    <Form.Group className="mb-3">
                      <div className="d-flex align-items-center">
                        <Form.Check
                          type="checkbox"
                          id="terms-checkbox"
                          className="me-2"
                          required
                          checked={agreeToTerms}
                          onChange={handleAgreeToTermsChange}
                        />
                        <label htmlFor="terms-checkbox" className="mb-0">
                          I have read and agree to the{" "}
                          <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-decoration-none fw-bold">
                            website terms and conditions
                          </a>{" "}
                          <span className="text-danger">*</span>
                        </label>
                      </div>
                    </Form.Group>

                    {/* Privacy Policy Notice */}
                    <p className="small text-muted mt-2 fst-italic">
                      <i className="fas fa-shield-alt me-1"></i> Your personal data will be used to process your order, support your experience throughout this website, and
                      for other purposes described in our{" "}
                      <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                        Privacy Policy
                      </a>.
                    </p>
                  </div>

                  {/* Captcha Verification - Styled */}
                  <div className="border-top pt-4 mt-3">
                    <h5 className="mb-3"><i className="fas fa-robot me-2 text-primary"></i>Security Verification</h5>
                    
                    <Row className="align-items-center">
                      <Col md={6} className="mb-3 mb-md-0">
                        <div className="captcha-container p-3 bg-light rounded text-center" style={{ letterSpacing: '3px', fontFamily: 'monospace', fontSize: '24px', fontWeight: 'bold' }}>
                          {captcha.split('').map((char, index) => (
                            <span key={index} style={{ 
                              display: 'inline-block', 
                              transform: `rotate(${Math.random() * 20 - 10}deg)`,
                              color: `hsl(${Math.random() * 360}, 70%, 50%)`
                            }}>
                              {char}
                            </span>
                          ))}
                        </div>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Control
                            type="text"
                            placeholder="Enter captcha code"
                            value={userCaptchaInput}
                            onChange={(e) => setUserCaptchaInput(e.target.value)}
                            className="mb-2"
                          />
                          
                          <div className="d-flex gap-2">
                            <Button 
                              variant="outline-secondary" 
                              onClick={generateCaptcha} 
                              className="flex-grow-1"
                              size="sm"
                            >
                              <i className="fas fa-sync-alt me-1"></i> Refresh
                            </Button>
                            <Button 
                              variant={captchaVerified ? "success" : "primary"} 
                              onClick={verifyCaptcha} 
                              className="flex-grow-1"
                              size="sm"
                            >
                              {captchaVerified ? <><i className="fas fa-check me-1"></i> Verified</> : <><i className="fas fa-shield-alt me-1"></i> Verify</>}
                            </Button>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  {/* Submit Button */}
                  <div className="text-center mt-4">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      size="lg"
                      className="px-5 py-2 shadow-sm"
                      disabled={!selectedPaymentMethod || !agreeToTerms || !captchaVerified}
                    >
                      <i className="fas fa-lock me-2"></i> Proceed to Payment
                    </Button>
                    
                    {(!selectedPaymentMethod || !agreeToTerms || !captchaVerified) && (
                      <div className="text-danger small mt-2">
                        <i className="fas fa-exclamation-circle"></i> Please complete all required fields to proceed
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          </Form>
        </div>
      </Container>

      {/* Edit Delivery Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Delivery</Modal.Title>
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
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}