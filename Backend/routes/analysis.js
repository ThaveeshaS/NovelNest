const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const socketIO = require('../socket');

// Helper function to emit updates
const emitUpdate = (type, data) => {
  const io = socketIO.getIO();
  if (io) {
    io.emit('dataUpdate', { type, ...data });
  }
};

// Customer Gender Distribution
router.get('/gender-distribution', async (req, res) => {
  try {
    const customers = await Customer.find({});
    
    const genderCounts = customers.reduce((acc, customer) => {
      const gender = customer.gender || 'Unknown';
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});

    const responseData = {
      labels: Object.keys(genderCounts),
      datasets: [{
        data: Object.values(genderCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(153, 102, 255, 0.7)'
        ]
      }]
    };

    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Customer Age Distribution
router.get('/age-distribution', async (req, res) => {
  try {
    const customers = await Customer.find({});
    const now = new Date();
    
    const ages = customers.map(customer => {
      if (!customer.birthday) return null;
      const birthDate = new Date(customer.birthday);
      let age = now.getFullYear() - birthDate.getFullYear();
      const monthDiff = now.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }).filter(age => age !== null);

    const ageBrackets = {
      '0-18': 0,
      '19-25': 0,
      '26-35': 0,
      '36-50': 0,
      '51+': 0
    };

    ages.forEach(age => {
      if (age <= 18) ageBrackets['0-18']++;
      else if (age <= 25) ageBrackets['19-25']++;
      else if (age <= 35) ageBrackets['26-35']++;
      else if (age <= 50) ageBrackets['36-50']++;
      else ageBrackets['51+']++;
    });

    const responseData = {
      labels: Object.keys(ageBrackets),
      datasets: [{
        label: 'Number of Customers',
        data: Object.values(ageBrackets),
        backgroundColor: 'rgba(75, 192, 192, 0.7)'
      }]
    };

    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Customer Registration Timeline
router.get('/registration-timeline', async (req, res) => {
  try {
    const customers = await Customer.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const labels = customers.map(item => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[item._id.month - 1]} ${item._id.year}`;
    });
    
    const data = customers.map(item => item.count);

    const responseData = {
      labels,
      datasets: [{
        label: 'New Registrations',
        data,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };

    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Function to update all analytics data
const updateAllAnalytics = async () => {
  try {
    // Gender Data
    const genderCustomers = await Customer.find({});
    const genderCounts = genderCustomers.reduce((acc, customer) => {
      const gender = customer.gender || 'Unknown';
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});
    
    emitUpdate('gender', {
      labels: Object.keys(genderCounts),
      data: Object.values(genderCounts)
    });

    // Age Data
    const ageCustomers = await Customer.find({});
    const now = new Date();
    const ages = ageCustomers.map(customer => {
      if (!customer.birthday) return null;
      const birthDate = new Date(customer.birthday);
      let age = now.getFullYear() - birthDate.getFullYear();
      const monthDiff = now.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }).filter(age => age !== null);

    const ageBrackets = {
      '0-18': 0,
      '19-25': 0,
      '26-35': 0,
      '36-50': 0,
      '51+': 0
    };

    ages.forEach(age => {
      if (age <= 18) ageBrackets['0-18']++;
      else if (age <= 25) ageBrackets['19-25']++;
      else if (age <= 35) ageBrackets['26-35']++;
      else if (age <= 50) ageBrackets['36-50']++;
      else ageBrackets['51+']++;
    });

    emitUpdate('age', {
      labels: Object.keys(ageBrackets),
      data: Object.values(ageBrackets)
    });

    // Registration Data
    const regCustomers = await Customer.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const regLabels = regCustomers.map(item => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[item._id.month - 1]} ${item._id.year}`;
    });
    
    const regData = regCustomers.map(item => item.count);

    emitUpdate('registration', {
      labels: regLabels,
      data: regData
    });

    console.log('Analytics data updated');
  } catch (err) {
    console.error('Error updating analytics:', err);
  }
};

// Export router and update function
exports.router = router;
exports.updateAllAnalytics = updateAllAnalytics;