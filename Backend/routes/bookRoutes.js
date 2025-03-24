const express = require('express');
const Book = require('../models/Book');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books' });
  }
});

router.post('/', async (req, res) => {
  const { name, price, coverImage } = req.body;
  if (!name || !price || !coverImage) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const newBook = new Book({ name, price, coverImage });
    await newBook.save();
    res.json({ message: 'Book added successfully', book: newBook });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add book' });
  }
});

router.put('/:id', async (req, res) => {
  const { name, price, coverImage } = req.body;
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, { name, price, coverImage }, { new: true });
    res.json({ message: 'Book updated successfully', book });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update book' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book' });
  }
});

module.exports = router;
