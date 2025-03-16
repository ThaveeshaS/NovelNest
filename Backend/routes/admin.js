const express = require("express");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const authAdminMiddleware = require("../middleware/authAdmin");
const router = express.Router();

// @route   POST /api/admin/adminlogin
// @desc    Admin login
// @access  Public
router.post("/adminlogin", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find admin by username
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check password
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin._id }, process.env.KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/admin/registeradmin
// @desc    Register an admin (for manual creation via Postman)
// @access  Public (remove this route after use for security)
router.post("/registeradmin", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Create new admin
    const admin = new Admin({ username, password });
    await admin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/admin/protected
// @desc    Protected route for admin (example)
// @access  Private (requires admin token)
router.get("/protected", authAdminMiddleware, async (req, res) => {
  try {
    // Access the admin from the request object (added by authAdminMiddleware)
    const admin = req.user;

    res.status(200).json({
      message: "You have access to this protected route",
      admin: {
        id: admin._id,
        username: admin.username,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;