import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Nav, Button, Alert, Card, Image } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header2 from "../../components/Header2";
import Navbar2 from "../../components/Navbar2";
import { FaUser, FaEdit, FaSignOutAlt, FaCamera, FaTrash } from "react-icons/fa"; // Added icons

export default function CustomerAccount() {
  const [activeTab, setActiveTab] = useState("personal-details");
  const [customerData, setCustomerData] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [tempProfileImage, setTempProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoading(true);
      axios
        .get("http://localhost:5000/api/customer/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data) {
            setCustomerData(response.data);
            setFormData(response.data);
            // If the customer has a profile image stored (e.g. in localStorage or from API)
            const storedImage = localStorage.getItem("profileImage");
            if (storedImage) {
              setProfileImage(storedImage);
            }
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("There was an error fetching the customer data!", error);
          setError("Failed to fetch customer data. Please try again.");
          setIsLoading(false);
        });
    } else {
      console.error("No token found");
      navigate("/login");
    }
  }, [navigate]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Image size must be less than 5MB");
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setError("Only JPG, PNG or GIF images are allowed");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setTempProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => {
    setTempProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("authToken");
    
    // Validate form data
    if (!formData.email || !formData.firstName || !formData.lastName) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }
    
    if (token) {
      axios
        .put("http://localhost:5000/api/customer/me", formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setCustomerData(response.data);
          setFormData(response.data);
          
          // Save the temporary profile image as the current one
          if (tempProfileImage) {
            setProfileImage(tempProfileImage);
            localStorage.setItem("profileImage", tempProfileImage);
          }
          
          setSuccess("Profile updated successfully!");
          setError(null);
          setIsLoading(false);
          
          // Automatically switch back to personal details tab after successful update
          setTimeout(() => {
            setActiveTab("personal-details");
            setSuccess(null);
          }, 2000);
        })
        .catch((error) => {
          console.error("There was an error updating the customer data!", error);
          setError("Failed to update profile. Please try again.");
          setSuccess(null);
          setIsLoading(false);
        });
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Do you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("authToken");
      navigate("/");
    }
  };

  // Format date properly for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format date for input field
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
  };

  return (
    <div className="bg-light min-vh-100">
      <Header2 />
      <Navbar2 />

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-primary text-white">
                <h3 className="mb-0 text-center">My Account</h3>
              </Card.Header>
              <Card.Body className="p-0">
                <Nav
                  variant="tabs"
                  activeKey={activeTab}
                  onSelect={(selectedKey) => setActiveTab(selectedKey)}
                  className="nav-fill"
                >
                  <Nav.Item>
                    <Nav.Link eventKey="personal-details" className="py-3">
                      <FaUser className="me-2" /> Personal Details
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="edit-profile" className="py-3">
                      <FaEdit className="me-2" /> Edit Profile
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <div className="p-4">
                  {error && (
                    <Alert variant="danger" dismissible onClose={() => setError(null)}>
                      {error}
                    </Alert>
                  )}
                  {success && (
                    <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
                      {success}
                    </Alert>
                  )}

                  {isLoading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {activeTab === "personal-details" && customerData && (
                        <div className="py-3">
                          <Row className="justify-content-center mb-4">
                            <Col sm={4} md={3} className="text-center">
                              <div className="position-relative">
                                {profileImage ? (
                                  <Image 
                                    src={profileImage} 
                                    roundedCircle 
                                    className="border shadow-sm" 
                                    style={{ width: "200px", height: "200px", objectFit: "cover" }}
                                    alt="Profile"
                                  />
                                ) : (
                                  <div className="bg-light rounded-circle mx-auto d-flex justify-content-center align-items-center" style={{ width: "150px", height: "150px" }}>
                                    <FaUser size={50} className="text-secondary" />
                                  </div>
                                )}
                              </div>
                            </Col>
                          </Row>
                          
                          <Form>
                            <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label><strong>Full Name</strong></Form.Label>
                                  <Form.Control
                                    plaintext
                                    readOnly
                                    className="bg-light p-2 border rounded"
                                    defaultValue={`${customerData.firstName} ${customerData.lastName}`}
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label><strong>Email</strong></Form.Label>
                                  <Form.Control
                                    plaintext
                                    readOnly
                                    className="bg-light p-2 border rounded"
                                    defaultValue={customerData.email}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                            
                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label><strong>Birth Date</strong></Form.Label>
                                  <Form.Control
                                    plaintext
                                    readOnly
                                    className="bg-light p-2 border rounded"
                                    defaultValue={formatDate(customerData.birthday)}
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label><strong>Gender</strong></Form.Label>
                                  <Form.Control
                                    plaintext
                                    readOnly
                                    className="bg-light p-2 border rounded"
                                    defaultValue={customerData.gender}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                            
                            <Form.Group className="mb-3">
                              <Form.Label><strong>Address</strong></Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={2}
                                plaintext
                                readOnly
                                className="bg-light p-2 border rounded"
                                defaultValue={customerData.address}
                              />
                            </Form.Group>
                            
                            <Form.Group className="mb-3">
                              <Form.Label><strong>Phone Number</strong></Form.Label>
                              <Form.Control
                                plaintext
                                readOnly
                                className="bg-light p-2 border rounded"
                                defaultValue={customerData.contactInfo}
                              />
                            </Form.Group>
                            
                            <div className="d-flex justify-content-between mt-4">
                              <Button variant="outline-primary" onClick={() => setActiveTab("edit-profile")}>
                                <FaEdit className="me-2" /> Edit Profile
                              </Button>
                              <Button variant="outline-danger" onClick={handleLogout}>
                                <FaSignOutAlt className="me-2" /> Logout
                              </Button>
                            </div>
                          </Form>
                        </div>
                      )}

                      {activeTab === "edit-profile" && customerData && (
                        <div className="py-3">
                          <h4 className="mb-4 text-center text-primary">Update Your Information</h4>
                          
                          {/* Profile Picture Upload Section */}
                          <Row className="justify-content-center mb-4">
                            <Col sm={4} md={3} className="text-center">
                              <div className="position-relative mb-2">
                                {tempProfileImage ? (
                                  <Image 
                                    src={tempProfileImage} 
                                    roundedCircle 
                                    className="border shadow-sm" 
                                    style={{ width: "180px", height: "180px", objectFit: "cover" }}
                                    alt="Temporary Profile"
                                  />
                                ) : profileImage ? (
                                  <Image 
                                    src={profileImage} 
                                    roundedCircle 
                                    className="border shadow-sm" 
                                    style={{ width: "185px", height: "185px", objectFit: "cover" }}
                                    alt="Profile"
                                  />
                                ) : (
                                  <div className="bg-light rounded-circle mx-auto d-flex justify-content-center align-items-center" style={{ width: "150px", height: "150px" }}>
                                    <FaUser size={50} className="text-secondary" />
                                  </div>
                                )}
                                
                                <div 
                                  className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-2 cursor-pointer shadow border border-white"
                                  onClick={triggerFileInput}
                                  style={{ cursor: "pointer" }}
                                >
                                  <FaCamera className="text-white" />
                                </div>
                              </div>
                              
                              <div className="d-flex justify-content-center gap-2">
                                <Button 
                                  variant="outline-primary" 
                                  size="sm" 
                                  onClick={triggerFileInput}
                                >
                                  Change Photo
                                </Button>
                                {(tempProfileImage || profileImage) && (
                                  <Button 
                                    variant="outline-danger" 
                                    size="sm" 
                                    onClick={handleImageDelete}
                                  >
                                    <FaTrash /> 
                                  </Button>
                                )}
                              </div>
                              
                              <Form.Control
                                type="file"
                                accept="image/png, image/jpeg, image/gif"
                                className="d-none"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                              />
                              
                              <small className="text-muted d-block mt-2">
                                JPG, PNG or GIF (Max. 5MB)
                              </small>
                            </Col>
                          </Row>
                          
                          <Form onSubmit={handleSubmit}>
                          <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label><strong>First Name *</strong></Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName || ""}
                                    onChange={handleEditChange}
                                    required
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label><strong>Last Name *</strong></Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName || ""}
                                    onChange={handleEditChange}
                                    required
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label><strong>Email *</strong></Form.Label>
                                  <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email || ""}
                                    onChange={handleEditChange}
                                    required
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label><strong>Phone Number</strong></Form.Label>
                                  <Form.Control
                                    type="text"
                                    name="contactInfo"
                                    value={formData.contactInfo || ""}
                                    onChange={handleEditChange}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                            <Row>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label><strong>Birthday</strong></Form.Label>
                                  <Form.Control
                                    type="date"
                                    name="birthday"
                                    value={formatDateForInput(formData.birthday) || ""}
                                    onChange={handleEditChange}
                                  />
                                </Form.Group>
                              </Col>
                              <Col md={6}>
                                <Form.Group className="mb-3">
                                  <Form.Label><strong>Gender</strong></Form.Label>
                                  <Form.Select
                                    name="gender"
                                    value={formData.gender || ""}
                                    onChange={handleEditChange}
                                  >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Not Disclose</option>
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                            </Row>
                            
                            <Form.Group className="mb-3">
                              <Form.Label><strong>Address</strong></Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                name="address"
                                value={formData.address || ""}
                                onChange={handleEditChange}
                              />
                            </Form.Group>
                            
                            <div className="d-flex justify-content-between mt-4">
                              <Button variant="outline-secondary" onClick={() => setActiveTab("personal-details")}>
                                Cancel
                              </Button>
                              <Button 
                                variant="primary" 
                                type="submit"
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Updating...
                                  </>
                                ) : (
                                  "Update Profile"
                                )}
                              </Button>
                            </div>
                          </Form>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Card.Body>
              <Card.Footer className="bg-white text-center text-muted py-3">
                <small>Last updated: {formatDate(new Date())}</small>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}