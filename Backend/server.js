const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const customerRoutes = require("./routes/customer");
const adminRoutes = require("./routes/admin");
const deliveryRoutes = require("./routes/deliveryRoutes"); // Import deliveryRoutes

dotenv.config();

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json()); // Enable JSON parsing in Express

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

  // Routes
app.use("/api/customer", customerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/deliveries", deliveryRoutes);

// Define Schema
const deliverySchema = new mongoose.Schema({
  deliveryId: String,
  orderId: String,
  customerName: String,
  deliveryAddress: String,
  contactNumber: String,
  email: String,
  deliveryStatus: String,
  estimatedDeliveryDate: String,
  deliveryFee: Number
});


// Create Model
const Delivery = mongoose.model('Delivery', deliverySchema);

// ✅ FIXED: Ensure this route exists
app.post('/api/deliveries', async (req, res) => {
  try {
    const newDelivery = new Delivery(req.body);
    await newDelivery.save();
    res.status(201).json(newDelivery);
  } catch (error) {
    console.error('Error saving delivery:', error);
    res.status(500).json({ message: 'Error saving delivery' });
  }
});

// Start Server
const port = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});