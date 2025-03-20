import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";
import Header2 from "../../components/Header2"; // Import Header2
import Navbar2 from "../../components/Navbar2"; // Import Navbar2
import { Button, Container, Alert, Spinner, Form, Row, Col, Modal } from "react-bootstrap"; // Added Modal component

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
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-2"
                          onClick={() => handleEditClick(delivery)}
                        >
                          <i className="fas fa-edit"></i> Edit
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteClick(delivery._id)}
                        >
                          <i className="fas fa-trash"></i> Delete
                        </Button>
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

        {/* Payment Method Section */}
        <div className="mt-5">
          <h3 className="mb-3">Select Payment Method</h3>
          <Form onSubmit={handlePaymentSubmit}>
            <Form.Group>
              <Form.Check
                type="radio"
                label="Commercial Bank"
                name="paymentMethod"
                value="Commercial Bank"
                onChange={handlePaymentMethodChange}
              />
              <Form.Check
                type="radio"
                label="MasterCard"
                name="paymentMethod"
                value="MasterCard"
                onChange={handlePaymentMethodChange}
              />
              <Form.Check
                type="radio"
                label="Visa"
                name="paymentMethod"
                value="Visa"
                onChange={handlePaymentMethodChange}
              />
              <Form.Check
                type="radio"
                label="Cash on Delivery"
                name="paymentMethod"
                value="Cash on Delivery"
                onChange={handlePaymentMethodChange}
              />
            </Form.Group>

            {/* Terms and Conditions */}
            <Form.Group className="mt-3">
              <Form.Check
                type="checkbox"
                label={
                  <>
                    I have read and agree to the{" "}
                    <a href="/terms" target="_blank" rel="noopener noreferrer">
                      website terms and conditions
                    </a>{" "}
                    *
                  </>
                }
                required
                checked={agreeToTerms}
                onChange={handleAgreeToTermsChange}
              />
            </Form.Group>

            {/* Privacy Policy Notice */}
            <p className="mt-2">
              Your personal data will be used to process your order, support your experience throughout this website, and
              for other purposes described in our{" "}
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
              .
            </p>

            {/* Captcha Verification */}
            <Row className="mt-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Captcha: {captcha}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter captcha"
                    value={userCaptchaInput}
                    onChange={(e) => setUserCaptchaInput(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="d-flex align-items-end">
                <Button variant="secondary" onClick={generateCaptcha} className="me-2">
                  Refresh Captcha
                </Button>
                <Button variant="primary" onClick={verifyCaptcha}>
                  Verify Captcha
                </Button>
              </Col>
            </Row>

            {/* Submit Button */}
            <Button variant="primary" type="submit" className="mt-3">
              Proceed to Payment
            </Button>
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