const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import all route files (ensuring no duplicates)
const bookRoutes = require('./routes/bookRoutes');         // Book CRUD operations
const transactionRoutes = require('./routes/transactionRoutes'); // Order & PDF transactions
const otpRoutes = require('./routes/otpRoutes');           // OTP functionality
const customerRoutes = require('./routes/customer');       // Customer account management
const adminRoutes = require('./routes/admin');             // Admin control panel
const feedbackRoutes = require('./routes/feedback');       // Feedback system
const productRoutes = require('./routes/product');   // Product management

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ==================== 📚 API ROUTES ====================
// Book Management Routes
app.use('/api/books', bookRoutes);              // Book CRUD operations
app.use('/api/transactions', transactionRoutes); // Order & PDF transactions
app.use('/api/send-otp', otpRoutes);            // OTP functionality

// User Management Routes
app.use('/api/customer', customerRoutes);       // Customer account management
app.use('/api/admin', adminRoutes);             // Admin control panel
app.use('/api/feedback', feedbackRoutes);       // Feedback system
app.use('/api/product', productRoutes);         // Product management

// ==================== 🚀 SERVER START ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});