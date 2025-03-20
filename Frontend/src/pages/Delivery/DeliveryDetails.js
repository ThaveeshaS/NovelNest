import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";
import Header2 from "../../components/Header2"; // Import Header2
import Navbar2 from "../../components/Navbar2"; // Import Navbar2
import { Button, Container, Alert, Spinner } from "react-bootstrap"; // Using React Bootstrap for UI

export default function DeliveryDetails() {
  const [deliveries, setDeliveries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      </Container>
    </div>
  );
}
