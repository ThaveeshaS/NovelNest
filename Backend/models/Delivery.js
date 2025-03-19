// models/Delivery.js
const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  deliveryId: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
  customerName: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  deliveryStatus: { type: String, default: "Pending" },
  estimatedDeliveryDate: { type: Date, required: true },
  deliveryFee: { type: Number, required: true },
});

module.exports = mongoose.model("Delivery", deliverySchema);