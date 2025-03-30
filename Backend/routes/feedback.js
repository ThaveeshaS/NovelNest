const express = require('express');
const router = express.Router();
const CustomerFeedback = require('../models/Feedback');
const socketIO = require('../socket');

// Helper function to emit feedback updates
const emitFeedbackUpdate = async () => {
  try {
    // Get ratings distribution
    const ratings = await CustomerFeedback.aggregate([
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Get sentiment distribution
    const sentiments = await CustomerFeedback.aggregate([
      {
        $group: {
          _id: "$sentiment",
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get topics distribution
    const topics = await CustomerFeedback.aggregate([
      {
        $group: {
          _id: "$feedbackTopic",
          count: { $sum: 1 }
        }
      }
    ]);

    const io = socketIO.getIO();
    if (io) {
      io.emit('dataUpdate', {
        type: 'ratings',
        labels: ratings.map(r => `Rating ${r._id}`),
        data: ratings.map(r => r.count)
      });
      
      io.emit('dataUpdate', {
        type: 'feedback-sentiment',
        labels: sentiments.map(s => s._id.charAt(0).toUpperCase() + s._id.slice(1)),
        data: sentiments.map(s => s.count)
      });
      
      io.emit('dataUpdate', {
        type: 'feedback-topics',
        labels: topics.map(t => t._id.charAt(0).toUpperCase() + t._id.slice(1)),
        data: topics.map(t => t.count)
      });
    }
  } catch (error) {
    console.error('Error emitting feedback updates:', error);
  }
};

// Submit Feedback
router.post('/submit-feedback', async (req, res) => {
  try {
    const { fullName, email, feedbackTopic, message, rating, sentiment } = req.body;

    // Validate required fields
    if (!fullName || !email || !message || !rating) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create a new feedback document
    const newFeedback = new CustomerFeedback({
      fullName,
      email,
      feedbackTopic,
      message,
      rating,
      sentiment
    });

    // Save the feedback to the database
    await newFeedback.save();

    // Emit updates to all connected clients
    await emitFeedbackUpdate();

    res.status(201).json({ 
      message: 'Feedback submitted successfully!',
      feedback: newFeedback
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get All Feedback with filtering and sorting
router.get('/all', async (req, res) => {
  try {
    const { topic, sentiment, sortBy, search } = req.query;
    let query = {};
    
    // Add filters if provided
    if (topic) {
      query.feedbackTopic = topic;
    }
    if (sentiment) {
      query.sentiment = sentiment;
    }
    if (search) {
      query.$text = { $search: search };
    }

    // Set up sorting
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sortBy === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sortBy === 'highest') {
      sortOption = { rating: -1 };
    } else if (sortBy === 'lowest') {
      sortOption = { rating: 1 };
    }

    const feedback = await CustomerFeedback.find(query).sort(sortOption);
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Failed to fetch feedback. Please try again later.' });
  }
});

// Get Feedback Statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await CustomerFeedback.aggregate([
      {
        $facet: {
          totalCount: [{ $count: "count" }],
          averageRating: [{ $group: { _id: null, avg: { $avg: "$rating" } } }],
          byTopic: [
            { $group: { _id: "$feedbackTopic", count: { $sum: 1 } } }
          ],
          bySentiment: [
            { $group: { _id: "$sentiment", count: { $sum: 1 } } }
          ],
          byRating: [
            { $group: { _id: "$rating", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
          ]
        }
      }
    ]);

    res.status(200).json({
      total: stats[0].totalCount[0]?.count || 0,
      averageRating: stats[0].averageRating[0]?.avg ? Math.round(stats[0].averageRating[0].avg * 10) / 10 : 0,
      byTopic: stats[0].byTopic,
      bySentiment: stats[0].bySentiment,
      byRating: stats[0].byRating
    });
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    res.status(500).json({ message: 'Failed to fetch feedback statistics' });
  }
});

// Get Ratings Distribution
router.get('/ratings', async (req, res) => {
  try {
    const ratings = await CustomerFeedback.aggregate([
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      labels: ratings.map(r => `Rating ${r._id}`),
      datasets: [{
        data: ratings.map(r => r.count)
      }]
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ message: 'Failed to fetch ratings data' });
  }
});

// Get Sentiment Distribution
router.get('/sentiment', async (req, res) => {
  try {
    const sentiments = await CustomerFeedback.aggregate([
      {
        $group: {
          _id: "$sentiment",
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      labels: sentiments.map(s => s._id.charAt(0).toUpperCase() + s._id.slice(1)),
      datasets: [{
        data: sentiments.map(s => s.count)
      }]
    });
  } catch (error) {
    console.error('Error fetching sentiment data:', error);
    res.status(500).json({ message: 'Failed to fetch sentiment data' });
  }
});

// Get Topics Distribution
router.get('/topics', async (req, res) => {
  try {
    const topics = await CustomerFeedback.aggregate([
      {
        $group: {
          _id: "$feedbackTopic",
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      labels: topics.map(t => t._id.charAt(0).toUpperCase() + t._id.slice(1)),
      datasets: [{
        data: topics.map(t => t.count)
      }]
    });
  } catch (error) {
    console.error('Error fetching topics data:', error);
    res.status(500).json({ message: 'Failed to fetch topics data' });
  }
});

// Get Single Feedback by ID
router.get('/:id', async (req, res) => {
  try {
    const feedback = await CustomerFeedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Failed to fetch feedback' });
  }
});

// Delete Feedback
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFeedback = await CustomerFeedback.findByIdAndDelete(id);
    
    if (!deletedFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    // Emit updates to all connected clients
    await emitFeedbackUpdate();
    
    res.status(200).json({ 
      message: 'Feedback deleted successfully!',
      deletedFeedback
    });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ message: 'Failed to delete feedback. Please try again later.' });
  }
});

// Update Feedback
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, feedbackTopic, message, rating, sentiment } = req.body;

    const updatedFeedback = await CustomerFeedback.findByIdAndUpdate(
      id,
      { fullName, email, feedbackTopic, message, rating, sentiment },
      { new: true, runValidators: true }
    );

    if (!updatedFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    // Emit updates to all connected clients
    await emitFeedbackUpdate();

    res.status(200).json({ 
      message: 'Feedback updated successfully!',
      feedback: updatedFeedback
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ message: 'Failed to update feedback. Please try again later.' });
  }
});

module.exports = router;