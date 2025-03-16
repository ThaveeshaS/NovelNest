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
        backgroundImage: "url('https://wallpaperaccess.com/full/284466.jpg')", // Add a background image 1920x1080
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="card shadow-lg" style={{ width: "800px", backgroundColor: "rgba(255, 255, 255, 0.9)" }}>
        <div className="card-body p-4">
          <h2 className="text-center text-primary mb-4">Customer Registration</h2>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  required
                />
                {errors.firstName && <div className="text-danger">{errors.firstName}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  required
                />
                {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <div className="text-danger">{errors.email}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="contactInfo" className="form-label">Mobile Number</label>
                <input
                  type="text"
                  className="form-control"
                  id="contactInfo"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  maxLength={12}
                  placeholder="Enter number starting with +94"
                  required
                />
                {errors.contactInfo && <div className="text-danger">{errors.contactInfo}</div>}
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="gender" className="form-label">Gender</label>
                <select
                  className="form-control"
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Not Disclose">Not Disclose</option>
                </select>
                {errors.gender && <div className="text-danger">{errors.gender}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="birthday" className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  id="birthday"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  max={maxDateString}
                  required
                />
                {errors.birthday && <div className="text-danger">{errors.birthday}</div>}
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 mb-3">
                <label htmlFor="address" className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  required
                />
                {errors.address && <div className="text-danger">{errors.address}</div>}
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && <div className="text-danger">{errors.password}</div>}
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}