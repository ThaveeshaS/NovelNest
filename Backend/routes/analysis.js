const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");
const Product = require("../models/Product"); // Added Product model import
const socketIO = require("../socket");

// Helper function to emit updates
const emitUpdate = (type, data) => {
  const io = socketIO.getIO();
  if (io) {
    io.emit("dataUpdate", { type, ...data });
  }
};

// Customer Gender Distribution
router.get("/gender-distribution", async (req, res) => {
  try {
    const customers = await Customer.find({});

    const genderCounts = customers.reduce((acc, customer) => {
      const gender = customer.gender || "Unknown";
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});

    const responseData = {
      labels: Object.keys(genderCounts),
      datasets: [
        {
          data: Object.values(genderCounts),
          backgroundColor: [
            "rgba(255, 99, 132, 0.7)",
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(153, 102, 255, 0.7)",
          ],
        },
      ],
    };

    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Customer Age Distribution
router.get("/age-distribution", async (req, res) => {
  try {
    const customers = await Customer.find({});
    const now = new Date();

    const ages = customers
      .map((customer) => {
        if (!customer.birthday) return null;
        const birthDate = new Date(customer.birthday);
        let age = now.getFullYear() - birthDate.getFullYear();
        const monthDiff = now.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && now.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        return age;
      })
      .filter((age) => age !== null);

    const ageBrackets = {
      "0-18": 0,
      "19-25": 0,
      "26-35": 0,
      "36-50": 0,
      "51+": 0,
    };

    ages.forEach((age) => {
      if (age <= 18) ageBrackets["0-18"]++;
      else if (age <= 25) ageBrackets["19-25"]++;
      else if (age <= 35) ageBrackets["26-35"]++;
      else if (age <= 50) ageBrackets["36-50"]++;
      else ageBrackets["51+"]++;
    });

    const responseData = {
      labels: Object.keys(ageBrackets),
      datasets: [
        {
          label: "Number of Customers",
          data: Object.values(ageBrackets),
          backgroundColor: "rgba(75, 192, 192, 0.7)",
        },
      ],
    };

    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Customer Registration Timeline
router.get("/registration-timeline", async (req, res) => {
  try {
    const customers = await Customer.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const labels = customers.map((item) => {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${monthNames[item._id.month - 1]} ${item._id.year}`;
    });

    const data = customers.map((item) => item.count);

    const responseData = {
      labels,
      datasets: [
        {
          label: "New Registrations",
          data,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };

    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Product Price Distribution
router.get("/price-distribution", async (req, res) => {
  try {
    const products = await Product.find({});

    const priceBrackets = {
      "0-500": 0,
      "500-1000": 0,
      "1000-5000": 0,
      "5000-10000": 0,
      "10000-200000": 0,
    };

    products.forEach((product) => {
      const price = product.price;
      if (price <= 500) priceBrackets["0-500"]++;
      else if (price <= 1000) priceBrackets["500-1000"]++;
      else if (price <= 5000) priceBrackets["1000-5000"]++;
      else if (price <= 10000) priceBrackets["5000-10000"]++;
      else priceBrackets["10000-200000"]++;
    });

    const responseData = {
      labels: Object.keys(priceBrackets),
      datasets: [
        {
          label: "Price Distribution",
          data: Object.values(priceBrackets),
          backgroundColor: "rgba(255, 159, 64, 0.7)",
          borderColor: "rgba(255, 159, 64, 1)",
          borderWidth: 1,
        },
      ],
    };

    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Product Category Popularity
router.get("/category-popularity", async (req, res) => {
  try {
    const products = await Product.find({});

    const categoryCounts = products.reduce((acc, product) => {
      const category = product.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const responseData = {
      labels: Object.keys(categoryCounts),
      datasets: [
        {
          data: Object.values(categoryCounts),
          backgroundColor: [
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 99, 132, 0.7)",
            "rgba(255, 206, 86, 0.7)",
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(255, 206, 86, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Product Quantity Availability Timeline
router.get("/quantity-availability", async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalQuantity: { $sum: "$bookQuantity" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const labels = products.map((item) => {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${monthNames[item._id.month - 1]} ${item._id.year}`;
    });

    const data = products.map((item) => item.totalQuantity);

    const responseData = {
      labels,
      datasets: [
        {
          label: "Available Quantity",
          data,
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          tension: 0.1,
          fill: true,
        },
      ],
    };

    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Function to update all analytics data
const updateAllAnalytics = async () => {
  try {
    // Gender Data
    const genderCustomers = await Customer.find({});
    const genderCounts = genderCustomers.reduce((acc, customer) => {
      const gender = customer.gender || "Unknown";
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});

    emitUpdate("gender", {
      labels: Object.keys(genderCounts),
      data: Object.values(genderCounts),
    });

    // Age Data
    const ageCustomers = await Customer.find({});
    const now = new Date();
    const ages = ageCustomers
      .map((customer) => {
        if (!customer.birthday) return null;
        const birthDate = new Date(customer.birthday);
        let age = now.getFullYear() - birthDate.getFullYear();
        const monthDiff = now.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && now.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        return age;
      })
      .filter((age) => age !== null);

    const ageBrackets = {
      "0-18": 0,
      "19-25": 0,
      "26-35": 0,
      "36-50": 0,
      "51+": 0,
    };

    ages.forEach((age) => {
      if (age <= 18) ageBrackets["0-18"]++;
      else if (age <= 25) ageBrackets["19-25"]++;
      else if (age <= 35) ageBrackets["26-35"]++;
      else if (age <= 50) ageBrackets["36-50"]++;
      else ageBrackets["51+"]++;
    });

    emitUpdate("age", {
      labels: Object.keys(ageBrackets),
      data: Object.values(ageBrackets),
    });

    // Registration Data
    const regCustomers = await Customer.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const regLabels = regCustomers.map((item) => {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${monthNames[item._id.month - 1]} ${item._id.year}`;
    });

    const regData = regCustomers.map((item) => item.count);

    emitUpdate("registration", {
      labels: regLabels,
      data: regData,
    });

    // Product Analytics
    // Price Distribution
    const products = await Product.find({});
    const priceBrackets = {
      "0-500": 0,
      "500-1000": 0,
      "1000-5000": 0,
      "5000-10000": 0,
      "10000-200000": 0,
    };

    products.forEach((product) => {
      const price = product.price;
      if (price <= 500) priceBrackets["0-500"]++;
      else if (price <= 1000) priceBrackets["500-1000"]++;
      else if (price <= 5000) priceBrackets["1000-5000"]++;
      else if (price <= 10000) priceBrackets["5000-10000"]++;
      else priceBrackets["10000-200000"]++;
    });

    emitUpdate("price", {
      labels: Object.keys(priceBrackets),
      data: Object.values(priceBrackets),
    });

    // Category Popularity
    const categoryCounts = products.reduce((acc, product) => {
      const category = product.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    emitUpdate("category", {
      labels: Object.keys(categoryCounts),
      data: Object.values(categoryCounts),
    });

    // Quantity Availability
    const quantityData = await Product.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalQuantity: { $sum: "$bookQuantity" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const quantityLabels = quantityData.map((item) => {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${monthNames[item._id.month - 1]} ${item._id.year}`;
    });

    const quantityValues = quantityData.map((item) => item.totalQuantity);

    emitUpdate("quantity", {
      labels: quantityLabels,
      data: quantityValues,
    });

    console.log("Analytics data updated");
  } catch (err) {
    console.error("Error updating analytics:", err);
  }
};

// Export router and update function
exports.router = router;
exports.updateAllAnalytics = updateAllAnalytics;
