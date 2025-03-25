const express = require("express");
const router = express.Router();
const Delivery = require("../models/Delivery");

// Add a new delivery
router.post("/", async (req, res) => {
  try {
    const newDelivery = new Delivery(req.body);
    const savedDelivery = await newDelivery.save();
    res.status(201).json(savedDelivery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET all deliveries
router.get("/", async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.json(deliveries);
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    res.status(500).json({ message: "Failed to fetch deliveries" });
  }
});

module.exports = router;

// Get a delivery by ID
router.get("/:id", async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: "Delivery not found" });
    res.status(200).json(delivery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a delivery
router.put("/:id", async (req, res) => {
  try {
    const updatedDelivery = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDelivery) return res.status(404).json({ message: "Delivery not found" });
    res.status(200).json(updatedDelivery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a delivery
router.delete("/:id", async (req, res) => {
  try {
    const deletedDelivery = await Delivery.findByIdAndDelete(req.params.id);
    if (!deletedDelivery) return res.status(404).json({ message: "Delivery not found" });
    res.status(200).json({ message: "Delivery deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
