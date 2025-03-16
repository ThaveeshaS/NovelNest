const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");

const authMiddleware = async (req, res, next) => {
  try {
    // Get the token from the request header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.KEY);

    // Find the customer by ID from the decoded token
    const customer = await Customer.findById(decoded.id).select("-password");

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Attach the customer to the request object
    req.user = customer;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;