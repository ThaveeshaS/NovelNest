const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

// ==================== 👥 TEAM ROUTES ====================
const customerRoutes = require('./routes/customer');        // Sahan
const adminRoutes = require('./routes/admin');              // Viraj
const feedbackRoutes = require('./routes/feedback');        // Thaveesha

// ==================== 📌 USE ROUTES ====================
// Your features
app.use('/api/books', bookRoutes);              // Book CRUD
app.use('/api/transactions', transactionRoutes); // Order & PDF
app.use('/api/send-otp', otpRoutes);            // OTP sending

// Team features
app.use('/api/customer', customerRoutes);       // Customer account
app.use('/api/admin', adminRoutes);             // Admin control
app.use('/api/feedback', feedbackRoutes);       // Feedback system

// ==================== 🚀 START SERVER ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
