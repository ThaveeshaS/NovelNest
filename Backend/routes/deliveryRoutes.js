// routes/deliveryRoutes.js
const express = require("express");
const router = express.Router();
const Delivery = require("../models/Delivery");
const deliveryMiddleware = require("../middleware/deliveryMiddleware");

// Add Delivery
router.post("/add", deliveryMiddleware, async (req, res) => {
  const {
    deliveryId,
    orderId,
    customerName,
    deliveryAddress,
    contactNumber,
    email,
    estimatedDeliveryDate,
    deliveryFee,
  } = req.body;

  try {
    // Check if delivery ID already exists
    const existingDelivery = await Delivery.findOne({ deliveryId });
    if (existingDelivery) {
      return res.status(400).json({ message: "Delivery ID already exists" });
    }

    // Create a new delivery
    const newDelivery = new Delivery({
      deliveryId,
      orderId,
      customerName,
      deliveryAddress,
      contactNumber,
      email,
      estimatedDeliveryDate,
      deliveryFee,
    });

    // Save the delivery to the database
    await newDelivery.save();
    res.status(201).json({ message: "Delivery added successfully", delivery: newDelivery });
  } catch (err) {
    console.error("Error adding delivery:", err.message);
    res.status(500).json({ message: "Failed to add delivery", error: err.message });
  }
});

module.exports = router;