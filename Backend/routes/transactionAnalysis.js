const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const socketIO = require('../socket');

// Helper function to emit updates
const emitUpdate = (type, data) => {
  const io = socketIO.getIO();
  if (io) {
    io.emit('transactionUpdate', { type, ...data });
  }
};

// Transaction Amount Distribution
router.get('/amount-distribution', async (req, res) => {
  try {
    const transactions = await Transaction.find({});
    
    const amountBrackets = {
      '0-10': 0,
      '11-20': 0,
      '21-50': 0,
      '51-100': 0,
      '100+': 0
    };

    transactions.forEach(t => {
      if (t.amount <= 10) amountBrackets['0-10']++;
      else if (t.amount <= 20) amountBrackets['11-20']++;
      else if (t.amount <= 50) amountBrackets['21-50']++;
      else if (t.amount <= 100) amountBrackets['51-100']++;
      else amountBrackets['100+']++;
    });

    const responseData = {
      labels: Object.keys(amountBrackets),
      datasets: [{
        data: Object.values(amountBrackets),
        backgroundColor: 'rgba(255, 159, 64, 0.7)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1
      }]
    };

    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Transaction Timeline
router.get('/timeline', async (req, res) => {
  try {
    const transactions = await Transaction.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const labels = transactions.map(item => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[item._id.month - 1]} ${item._id.year}`;
    });
    
    const countData = transactions.map(item => item.count);
    const amountData = transactions.map(item => item.totalAmount);

    const responseData = {
      labels,
      datasets: [
        {
          label: 'Number of Transactions',
          data: countData,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: 'Total Amount',
          data: amountData,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1,
          yAxisID: 'y1'
        }
      ]
    };

    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update all transaction analytics
const updateAllTransactionAnalytics = async () => {
  try {
    // Amount Distribution
    const transactions = await Transaction.find({});
    const amountBrackets = {
      '0-10': 0,
      '11-20': 0,
      '21-50': 0,
      '51-100': 0,
      '100+': 0
    };

    transactions.forEach(t => {
      if (t.amount <= 10) amountBrackets['0-10']++;
      else if (t.amount <= 20) amountBrackets['11-20']++;
      else if (t.amount <= 50) amountBrackets['21-50']++;
      else if (t.amount <= 100) amountBrackets['51-100']++;
      else amountBrackets['100+']++;
    });

    emitUpdate('amount', {
      labels: Object.keys(amountBrackets),
      data: Object.values(amountBrackets)
    });

    // Timeline
    const timelineData = await Transaction.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const labels = timelineData.map(item => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[item._id.month - 1]} ${item._id.year}`;
    });
    
    const countData = timelineData.map(item => item.count);
    const amountData = timelineData.map(item => item.totalAmount);

    emitUpdate('timeline', {
      labels,
      countData,
      amountData
    });

    console.log('Transaction analytics updated');
  } catch (err) {
    console.error('Error updating transaction analytics:', err);
  }
};

exports.router = router;
exports.updateAllTransactionAnalytics = updateAllTransactionAnalytics;