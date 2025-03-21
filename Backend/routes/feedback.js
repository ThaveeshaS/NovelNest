const express = require('express');
const router = express.Router();
const CustomerFeedback = require('../models/Feedback');

// Submit Feedback
router.post('/submit-feedback', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Create a new feedback document
    const newFeedback = new CustomerFeedback({
      name,
      email,
      message,
    });

    // Save the feedback to the database
    await newFeedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully!' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get All Feedback
router.get('/all', async (req, res) => {
  try {
    const feedback = await CustomerFeedback.find();
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Failed to fetch feedback. Please try again later.' });
  }
});

// Delete Feedback
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await CustomerFeedback.findByIdAndDelete(id);
    res.status(200).json({ message: 'Feedback deleted successfully!' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ message: 'Failed to delete feedback. Please try again later.' });
  }
});

// Update Feedback
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    await CustomerFeedback.findByIdAndUpdate(id, { message });
    res.status(200).json({ message: 'Feedback updated successfully!' });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ message: 'Failed to update feedback. Please try again later.' });
  }
});

module.exports = router;