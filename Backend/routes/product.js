const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

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
    const category = req.params.category;
    const products = await Product.find({ category })
      .sort({ createdAt: -1 })
      .lean();

    const uniqueProducts = [];
    const seenIsbns = new Set();
    products.forEach(product => {
      if (!seenIsbns.has(product.isbnNumber)) {
        seenIsbns.add(product.isbnNumber);
        uniqueProducts.push(product);
      }
    });

    res.json(uniqueProducts);
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
router.post('/add', async (req, res) => {
  try {
    const {
      coverPage, // This will now be a Firebase Storage URL
      bookTitle,
      price,
      bookDescription,
      bookQuantity,
      category,
      authorName,
      isbnNumber,
      language,
    } = req.body;

    if (!coverPage) {
      return res.status(400).json({ message: 'Please provide a cover image URL' });
    }

    const newProduct = new Product({
      coverPage, // Store the Firebase Storage URL directly
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

// PUT (update) a product
router.put('/update/:id', async (req, res) => {
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

    if (req.body.coverPage) {
      updateData.coverPage = req.body.coverPage; // Update with new Firebase URL
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

// DELETE a product
router.delete('/delete/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Note: You might want to delete the image from Firebase Storage here
    // See Firebase Storage delete example below

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;