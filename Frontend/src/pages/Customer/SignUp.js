import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CustomerSignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    address: "",
    contactInfo: "+94",
    birthday: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  // Handle key press for specific fields
  const handleKeyPress = (e) => {
    const { name, value } = e.target;

    // Restrict input for contactInfo
    if (name === "contactInfo") {
      if (value.length === 0 && e.key === "+") return; // Allow '+' as the first character
      if (!/[0-9]/.test(e.key)) e.preventDefault(); // Allow only numbers
    }

    // Restrict input for firstName and lastName
    if ((name === "firstName" || name === "lastName") && !/[a-zA-Z\s]/.test(e.key)) {
      e.preventDefault();
    }

    // Restrict input for address
    if (name === "address" && !/[a-zA-Z0-9/.,\s]/.test(e.key)) {
      e.preventDefault();
    }
  };

  // Validate individual fields
  const validateField = (name, value) => {
    let fieldErrors = { ...errors };

    switch (name) {
      case "firstName":
      case "lastName":
        fieldErrors[name] = /^[a-zA-Z\s]+$/.test(value) ? "" : "Invalid characters";
        break;
      case "email":
        fieldErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Invalid email";
        break;
      case "password":
        fieldErrors.password = value.length >= 6 ? "" : "Password must be at least 6 characters";
        break;
      case "contactInfo":
        fieldErrors.contactInfo = /^\+94[0-9]{9}$/.test(value) ? "" : "Invalid contact number";
        break;
      case "birthday":
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        const isFutureDate = birthDate > today;
        fieldErrors.birthday = age >= 16 && !isFutureDate ? "" : "You must be at least 16 years old";
        break;
      case "address":
        fieldErrors.address =
          value.length > 0 && value.length <= 100 && /^[a-zA-Z0-9/.,\s]+$/.test(value)
            ? ""
            : "Invalid address";
        break;
      case "gender":
        fieldErrors.gender = value ? "" : "Gender is required";
        break;
      default:
        break;
    }

    setErrors(fieldErrors);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for errors
    if (Object.values(errors).some((error) => error !== "")) {
      alert("Please fix the errors in the form before submitting.");
      return;
    }

    // Submit form data
    axios
      .post("http://localhost:5000/api/customer/signup", formData)
      .then((response) => {
        if (response.data === "exist") {
          alert("User already exists");
        } else {
          alert("Customer Added Successfully!");
          navigate("/login");
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            password: "",
            address: "",
            contactInfo: "+94",
            birthday: "",
            gender: "",
          });
        }
      })
      .catch((error) => {
        console.error("There was an error adding the customer!", error);
        alert("Error: " + error.response.data.message);
      });
  };

  // Calculate max date for birthday (16 years ago)
  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 16);
  const maxDateString = maxDate.toISOString().split("T")[0];

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: "url('https://miro.medium.com/v2/resize:fit:1024/1*8voFBoSzgnFWL4S3Mb_uqw.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="card shadow-lg border-0 rounded-lg overflow-hidden" style={{ backgroundColor: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(10px)" }}>
              <div className="row g-0">
                {/* Left side decorative panel */}
                <div className="col-lg-4 d-none d-lg-block" 
                  style={{
                    background: "linear-gradient(to bottom, rgba(45, 184, 226, 0.64), rgba(0, 86, 199, 0.85))",
                    padding: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    color: "white",
                    backdropFilter: "blur(5px)"
                  }}>
                  <h2 className="text-center mb-4">Welcome!</h2>
                  <p className="text-center mb-4">Join our community and experience premium services tailored just for you.</p>
                  <div className="text-center">
                    <i className="fas fa-user-plus fa-4x mb-3"></i>
                  </div>
                  <p className="text-center small">Already have an account? <a href="/login" className="text-white fw-bold">Sign In</a></p>
                </div>
                
                {/* Right side form */}
                <div className="col-lg-8" style={{ backdropFilter: "blur(5px)" }}>
                  <div className="card-body p-4 p-lg-5">
                    <h2 className="text-center fw-bold mb-4" 
                      style={{ color: 'rgb(9, 165, 255)'}}>
                        Create Account
                    </h2>
                    
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <div className="form-floating">
                            <input
                              type="text"
                              className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              onKeyPress={handleKeyPress}
                              placeholder="First Name"
                              style={{ backgroundColor: "rgb(255, 255, 255)" }}
                              required
                            />
                            <label htmlFor="firstName">First Name</label>
                            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form-floating">
                            <input
                              type="text"
                              className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              onKeyPress={handleKeyPress}
                              placeholder="Last Name"
                              style={{ backgroundColor: "rgb(255, 255, 255)" }}
                              required
                            />
                            <label htmlFor="lastName">Last Name</label>
                            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <div className="form-floating">
                            <input
                              type="email"
                              className={`form-control ${errors.email ? "is-invalid" : ""}`}
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="Email"
                              style={{ backgroundColor: "rgb(255, 255, 255)" }}
                              required
                            />
                            <label htmlFor="email">Email</label>
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form-floating">
                            <input
                              type="text"
                              className={`form-control ${errors.contactInfo ? "is-invalid" : ""}`}
                              id="contactInfo"
                              name="contactInfo"
                              value={formData.contactInfo}
                              onChange={handleChange}
                              onKeyPress={handleKeyPress}
                              maxLength={12}
                              placeholder="Mobile Number"
                              style={{ backgroundColor: "rgb(255, 255, 255)" }}
                              required
                            />
                            <label htmlFor="contactInfo">Mobile Number (+94)</label>
                            {errors.contactInfo && <div className="invalid-feedback">{errors.contactInfo}</div>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <div className="form-floating">
                            <select
                              className={`form-select ${errors.gender ? "is-invalid" : ""}`}
                              id="gender"
                              name="gender"
                              value={formData.gender}
                              onChange={handleChange}
                              style={{ backgroundColor: "rgb(255, 255, 255)" }}
                              required
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Not Disclose">Not Disclose</option>
                            </select>
                            <label htmlFor="gender">Gender</label>
                            {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form-floating">
                            <input
                              type="date"
                              className={`form-control ${errors.birthday ? "is-invalid" : ""}`}
                              id="birthday"
                              name="birthday"
                              value={formData.birthday}
                              onChange={handleChange}
                              max={maxDateString}
                              placeholder="Date of Birth"
                              style={{ backgroundColor: "rgb(255, 255, 255)" }}
                              required
                            />
                            <label htmlFor="birthday">Date of Birth</label>
                            {errors.birthday && <div className="invalid-feedback">{errors.birthday}</div>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="form-floating">
                          <input
                            type="text"
                            className={`form-control ${errors.address ? "is-invalid" : ""}`}
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Address"
                            style={{ backgroundColor: "rgb(255, 255, 255)" }}
                            required
                          />
                          <label htmlFor="address">Address</label>
                          {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                        </div>
                      </div>
                      
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <div className="form-floating">
                            <input
                              type="text"
                              className="form-control"
                              id="username"
                              name="username"
                              value={formData.username}
                              onChange={handleChange}
                              placeholder="Username"
                              style={{ backgroundColor: "rgb(255, 255, 255)" }}
                              required
                            />
                            <label htmlFor="username">Username</label>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="form-floating">
                            <input
                              type="password"
                              className={`form-control ${errors.password ? "is-invalid" : ""}`}
                              id="password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="Password"
                              style={{ backgroundColor: "rgb(255, 255, 255)" }}
                              required
                            />
                            <label htmlFor="password">Password</label>
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="d-grid">
                        <button 
                          type="submit" 
                          className="btn py-3 mt-3"
                          style={{
                            background: "linear-gradient(to right, rgba(45, 184, 226, 0.64), rgba(0, 86, 199, 0.85))",
                            color: "white",
                            fontSize: "1.1rem",
                            fontWeight: "600",
                            borderRadius: "8px",
                            backdropFilter: "blur(5px)"
                          }}
                        >
                          Create Account
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}