const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const customerRoutes = require('./routes/customer');
const adminRoutes = require('./routes/admin');
const customerFeedbackRoutes = require('./routes/feedback'); // Import the feedback route

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/customer', customerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', customerFeedbackRoutes); // Use the feedback route

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});