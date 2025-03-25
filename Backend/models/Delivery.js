const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema({
  deliveryId: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
  customerName: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  deliveryStatus: { type: String, enum: ["Pending", "In Transit", "Delivered"], default: "Pending" },
  estimatedDeliveryDate: { type: Date, required: true },
  deliveryFee: { type: Number, default: 0 },
});

module.exports = mongoose.model("Delivery", DeliverySchema);
