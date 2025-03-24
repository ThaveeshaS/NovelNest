const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const customerRoutes = require("./routes/customer");
const adminRoutes = require("./routes/admin");
const deliveryRoute = require("./routes/delivery.js");
const feedbackRoutes = require("./routes/feedback");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Enable JSON parsing in Express

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ==================== 📚 YOUR ROUTES ====================
const bookRoutes = require('./routes/bookRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const otpRoutes = require('./routes/otpRoutes');

// ==================== 📌 USE ROUTES ====================
app.use('/api/books', bookRoutes);             
app.use('/api/transactions', transactionRoutes); 
app.use('/api/send-otp', otpRoutes);            

// Team features
app.use('/api/customer', customerRoutes);       
app.use('/api/admin', adminRoutes);             
app.use('/api/feedback', feedbackRoutes);       
app.use("/api/deliveries", deliveryRoute);

// ==================== 🚀 START SERVER ====================
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
