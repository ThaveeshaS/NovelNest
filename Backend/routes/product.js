const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const upload = require('../middleware/uploadMiddleware');
const path = require('path');
const fs = require('fs');

// Serve static files from the uploads directory
router.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// GET all products
router.get('/all', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET products by category
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category; // Extract category from the URL
    const products = await Product.find({ category }).sort({ createdAt: -1 }); // Fetch products by category
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST a new product
router.post('/add', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a cover image' });
    }

    try {
      const {
        bookTitle,
        price,
        bookDescription,
        bookQuantity,
        category,
        authorName,
        isbnNumber,
        language,
      } = req.body;

      const newProduct = new Product({
        coverPage: `/uploads/${req.file.filename}`,
        bookTitle,
        price,
        bookDescription,
        bookQuantity,
        category,
        authorName,
        isbnNumber,
        language,
      });

      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      console.error('Error saving product:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
});

// PUT (update) a product
router.put('/update/:id', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const updateData = {
        bookTitle: req.body.bookTitle,
        price: req.body.price,
        bookDescription: req.body.bookDescription,
        bookQuantity: req.body.bookQuantity,
        category: req.body.category,
        authorName: req.body.authorName,
        isbnNumber: req.body.isbnNumber,
        language: req.body.language,
      };

      if (req.file) {
        // Delete the old image file if it exists
        if (product.coverPage) {
          const oldImagePath = path.join(__dirname, '..', product.coverPage);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath); // Old image deleted, but no log message
          }
        }

        // Update with new image path
        updateData.coverPage = `/uploads/${req.file.filename}`;
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updateData,
        { new: true }
      );

      res.json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
});

// DELETE a product
router.delete('/delete/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete the image file
    if (product.coverPage) {
      const imagePath = path.join(__dirname, '..', product.coverPage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Image deleted, but no log message
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;