const mongoose = require('mongoose');

const customerFeedbackSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  feedbackTopic: {
    type: String,
    required: true,
    enum: ['general', 'product', 'service', 'website', 'delivery', 'other'],
    default: 'general'
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  sentiment: {
    type: String,
    required: true,
    enum: ['positive', 'neutral', 'negative'],
    default: 'positive'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add text index for search functionality
customerFeedbackSchema.index({
  fullName: 'text',
  email: 'text',
  message: 'text'
});

module.exports = mongoose.model('CustomerFeedback', customerFeedbackSchema);