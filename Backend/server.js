const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const customerRoutes = require('./routes/customer');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Log environment variables to verify they are loaded (for debugging)
console.log('GMAIL_USER:', process.env.GMAIL_USER);
console.log('GMAIL_PASS:', process.env.GMAIL_PASS ? 'Set' : 'Not set');

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || process.env.MONGO_URL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Book Schema
const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  coverImage: { type: String, required: true },
});
const Book = mongoose.model('Book', bookSchema);

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});
const Transaction = mongoose.model('Transaction', transactionSchema);

// Email Transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Verify the transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Transporter verification failed:', error);
  } else {
    console.log('Transporter is ready to send emails');
  }
});

// Routes from first code
app.use('/api/customer', customerRoutes);
app.use('/api/admin', adminRoutes);

// Book Routes
app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Failed to fetch books' });
  }
});

app.post('/api/books', async (req, res) => {
  const { name, price, coverImage } = req.body;
  if (!name || !price || !coverImage) {
    return res.status(400).json({ message: 'Name, price, and cover image are required' });
  }
  try {
    const newBook = new Book({ name, price, coverImage });
    await newBook.save();
    res.json({ message: 'Book added successfully', book: newBook });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ message: 'Failed to add book' });
  }
});

app.put('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, coverImage } = req.body;
  if (!name || !price || !coverImage) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const book = await Book.findByIdAndUpdate(id, { name, price, coverImage }, { new: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book updated successfully', book });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Failed to update book' });
  }
});

app.delete('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findByIdAndDelete(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Failed to delete book' });
  }
});

// OTP Route
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Your OTP for Payment',
    text: `Your OTP is ${otp}. Valid for 5 minutes.`,
  };
  try {
    await transporter.sendMail(mailOptions);
    res.json({ otp, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Transaction Routes
app.post('/api/transactions', async (req, res) => {
  const { bookId, email, amount } = req.body;
  try {
    const newTransaction = new Transaction({ bookId, email, amount });
    await newTransaction.save();
    res.json({ message: 'Transaction recorded', transaction: newTransaction });
  } catch (error) {
    console.error('Error recording transaction:', error);
    res.status(500).json({ message: 'Failed to record transaction' });
  }
});

app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('bookId');
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

app.put('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;
  const { email, amount } = req.body;
  if (!email || !amount) {
    return res.status(400).json({ message: 'Email and amount are required' });
  }
  try {
    const transaction = await Transaction.findByIdAndUpdate(id, { email, amount }, { new: true });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction updated successfully', transaction });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Failed to update transaction' });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Failed to delete transaction' });
  }
});

app.get('/api/transactions/pdf', async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('bookId');
    const doc = new PDFDocument();
    res.setHeader('Content-Disposition', 'attachment; filename="transactions.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);
    doc.fontSize(20).text('Transaction History', { align: 'center' });
    doc.moveDown();
    transactions.forEach((t, index) => {
      doc.fontSize(12).text(`Transaction #${index + 1}`);
      doc.text(`ID: ${t.id}`);
      doc.text(`Book: ${t.bookId ? t.bookId.name : 'Unknown'}`);
      doc.text(`Email: ${t.email}`);
      doc.text(`Amount: $${t.amount}`);
      doc.text(`Date: ${new Date(t.date).toLocaleString()}`);
      doc.moveDown();
    });
    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});