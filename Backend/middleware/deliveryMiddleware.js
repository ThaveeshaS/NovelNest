const jwt = require("jsonwebtoken");
const Delivery = require("../models/Delivery");

const deliveryMiddleware = async (req, res, next) => {
  try {
    // Get the token from the request header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.KEY);

    // Find the delivery by ID from the decoded token
    const delivery = await Delivery.findById(decoded.id);

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    // Attach the delivery to the request object
    req.delivery = delivery;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token. Please log in again." });
    } else if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }

    res.status(500).json({ message: "Server error" });
  }
};

module.exports = deliveryMiddleware;