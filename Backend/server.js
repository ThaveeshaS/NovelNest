const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const customerRoutes = require("./routes/customer");
const adminRoutes = require("./routes/admin");
const deliveryRoute = require("./routes/delivery.js");

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
app.use("/api/deliveries", deliveryRoute);


// Start Server
const port = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});