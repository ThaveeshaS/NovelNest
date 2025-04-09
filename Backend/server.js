const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require('http');  // Added for Socket.io

const customerRoutes = require("./routes/customer");
const adminRoutes = require("./routes/admin");
const deliveryRoute = require("./routes/delivery.js");
const feedbackRoutes = require("./routes/feedback");
const { router: analysisRoutes, updateAllAnalytics } = require('./routes/analysis');
const socketIO = require('./socket');
const productRoutes = require('./routes/product.js');

const { router: transactionAnalysisRoutes, updateAllTransactionAnalytics } = require('./routes/transactionAnalysis');

dotenv.config();
const app = express();
const server = http.createServer(app);  // Create HTTP server for Socket.io
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB connected');
    
    // Initialize Socket.io after DB connection
    const io = socketIO.init(server);
    
    // Socket.io connection handler
    io.on('connection', (socket) => {
      console.log('New client connected');
      
      // Initial data push
      updateAllAnalytics();

      updateAllTransactionAnalytics();
      
      // Periodic updates every 5 minutes
      const updateInterval = setInterval(updateAllAnalytics, 5 * 60 * 1000);

      const transactionUpdateInterval = setInterval(updateAllTransactionAnalytics, 5 * 60 * 1000);
      
      socket.on('disconnect', () => {
        console.log('Client disconnected');
        clearInterval(updateInterval);

        clearInterval(transactionUpdateInterval);
      });
    });
  })
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
app.use('/api/analysis', analysisRoutes);       
app.use("/api/deliveries", deliveryRoute);
app.use('/api/product', productRoutes);

app.use('/api/transaction-analysis', transactionAnalysisRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
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

// ==================== 🚀 START SERVER ====================
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});