const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require('../middleware/authMiddleware');
require("dotenv").config();

// Sign-Up Route
router.post("/signup", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    username,
    password,
    address,
    contactInfo,
    birthday,
    gender,
  } = req.body;

  try {
    // Check if email or username already exists
    const existingCustomer = await Customer.findOne({ $or: [{ email }, { username }] });
    if (existingCustomer) {
      return res.status(400).json({ message: "Email or username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new customer
    const newCustomer = new Customer({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
      address,
      contactInfo,
      birthday,
      gender,
    });

    // Save the customer to the database
    await newCustomer.save();
    res.status(201).json({ message: "Customer registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find customer by username
    const customer = await Customer.findOne({ username });

    // Check if customer exists
    if (!customer) {
      return res.status(400).json({ message: "Customer not found. Invalid credentials." });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: customer._id }, process.env.KEY, {
      expiresIn: "1h",
    });

    // Return success message and token
    res.json({ message: "Login successful", token, username: customer.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get Logged-In Customer Data (Protected Route)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // Find the customer using the ID from the verified token
    const customer = await Customer.findById(req.user.id).select("-password");
    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error occurred" });
  }
});

// Update Customer Data (Protected Route)
router.put("/me", authMiddleware, async (req, res) => {
  try {
    // Find the customer using the ID from the verified token
    const customer = await Customer.findById(req.user.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    // Update the customer data
    const { firstName, lastName, email, address, contactInfo, gender } = req.body;
    if (firstName) customer.firstName = firstName;
    if (lastName) customer.lastName = lastName;
    if (email) customer.email = email;
    if (address) customer.address = address;
    if (contactInfo) customer.contactInfo = contactInfo;
    if (gender) customer.gender = gender;

    // Save the updated customer data
    await customer.save();
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error occurred" });
  }
});

// Get All Customers (For Admin Purposes)
router.get("/all", async (req, res) => {
  try {
    const customers = await Customer.find({}, "-password -username");
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Customer by ID (For Admin Purposes)
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Customer deleted successfully", customerId: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting customer", error: err.message });
  }
});

module.exports = router;