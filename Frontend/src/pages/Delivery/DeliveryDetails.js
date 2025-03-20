import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";
import Header2 from "../../components/Header2"; // Import Header2
import Navbar2 from "../../components/Navbar2"; // Import Navbar2
import { Button, Container, Alert, Spinner, Form, Row, Col } from "react-bootstrap"; // Using React Bootstrap for UI

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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-danger">
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
    </div>
  );
}