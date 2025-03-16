import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Nav, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header2 from "../../components/Header2"; // Import Header2
import Navbar2 from "../../components/Navbar2"; // Import Navbar2

export default function CustomerAccount() {
  const [activeTab, setActiveTab] = useState("personal-details");
  const [customerData, setCustomerData] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // Fetch customer data
      axios
        .get("http://localhost:5000/api/customer/me", {
          headers: { authToken: token },
        })
        .then((response) => {
          if (response.data) {
            setCustomerData(response.data);
            setFormData(response.data);
          }
        })
        .catch((error) => {
          console.error("There was an error fetching the customer data!", error);
        });
    } else {
      console.error("No token found");
      navigate("/login"); // Redirect to login if no token is found
    }
  }, [navigate]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (token) {
      // Update customer data
      axios
        .put("http://localhost:5000/api/customer/me", formData, {
          headers: { authToken: token },
        })
        .then((response) => {
          setCustomerData(response.data);
          setFormData(response.data);
          alert("Profile updated successfully!");
        })
        .catch((error) => {
          console.error("There was an error updating the customer data!", error);
        });
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Do you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("authToken"); // Remove the token from local storage
      navigate("/"); // Navigate to the home page
    }
  };

  return (
    <div>
      {/* Add Header2 and Navbar2 */}
      <Header2 />
      <Navbar2 />

      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Nav
              variant="tabs"
              activeKey={activeTab}
              onSelect={(selectedKey) => setActiveTab(selectedKey)}
            >
              <Nav.Item>
                <Nav.Link eventKey="personal-details">Personal details</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="edit-profile">Edit profile</Nav.Link>
              </Nav.Item>
            </Nav>
            <div className="card mt-4 p-4" style={{ marginBottom: 90 }}>
              {activeTab === "personal-details" && customerData && (
                <>
                  <h3 className="text-center mb-4">Customer Personal Details</h3>
                  <Form>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="3">
                        <strong>Email :</strong>
                      </Form.Label>
                      <Col sm="9">
                        <Form.Control
                          plaintext
                          readOnly
                          defaultValue={customerData.email}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="3">
                        <strong>Name :</strong>
                      </Form.Label>
                      <Col sm="9">
                        <Form.Control
                          plaintext
                          readOnly
                          defaultValue={`${customerData.firstName} ${customerData.lastName}`}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="3">
                        <strong>Address :</strong>
                      </Form.Label>
                      <Col sm="9">
                        <Form.Control
                          plaintext
                          readOnly
                          defaultValue={customerData.address}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="3">
                        <strong>Birth Day :</strong>
                      </Form.Label>
                      <Col sm="9">
                        <Form.Control
                          plaintext
                          readOnly
                          defaultValue={new Date(customerData.birthday).toLocaleDateString()}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="3">
                        <strong>Phone Number :</strong>
                      </Form.Label>
                      <Col sm="9">
                        <Form.Control
                          plaintext
                          readOnly
                          defaultValue={customerData.contactInfo}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="3">
                        <strong>Gender :</strong>
                      </Form.Label>
                      <Col sm="9">
                        <Form.Control
                          plaintext
                          readOnly
                          defaultValue={customerData.gender}
                        />
                      </Col>
                    </Form.Group>
                    {/* Logout Button */}
                    <div className="text-center mt-4">
                      <Button variant="danger" onClick={handleLogout}>
                        Logout
                      </Button>
                    </div>
                  </Form>
                </>
              )}
              {activeTab === "edit-profile" && customerData && (
                <>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="3">
                        <strong>Email :</strong>
                      </Form.Label>
                      <Col sm="9">
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleEditChange}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="3">
                        <strong>First Name :</strong>
                      </Form.Label>
                      <Col sm="9">
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleEditChange}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="3">
                        <strong>Last Name :</strong>
                      </Form.Label>
                      <Col sm="9">
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleEditChange}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="3">
                        <strong>Address :</strong>
                      </Form.Label>
                      <Col sm="9">
                        <Form.Control
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleEditChange}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="3">
                        <strong>Phone Number :</strong>
                      </Form.Label>
                      <Col sm="9">
                        <Form.Control
                          type="text"
                          name="contactInfo"
                          value={formData.contactInfo}
                          onChange={handleEditChange}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="3">
                        <strong>Birthday :</strong>
                      </Form.Label>
                      <Col sm="9">
                        <Form.Control
                          type="date"
                          name="birthday"
                          value={formData.birthday.split("T")[0]}
                          onChange={handleEditChange}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="3">
                        <strong>Gender :</strong>
                      </Form.Label>
                      <Col sm="9">
                        <Form.Control
                          as="select"
                          name="gender"
                          value={formData.gender}
                          onChange={handleEditChange}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </Form.Control>
                      </Col>
                    </Form.Group>
                    <div className="text-center">
                      <Button variant="primary" type="submit">
                        Update Profile
                      </Button>
                    </div>
                  </Form>
                </>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}