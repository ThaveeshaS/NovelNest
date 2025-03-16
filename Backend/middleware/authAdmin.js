const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const authAdminMiddleware = async (req, res, next) => {
  try {
    // Get the token from the request header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.KEY);

    // Find the admin by ID from the decoded token
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Attach the admin to the request object
    req.user = admin;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authAdminMiddleware;