const express = require('express');
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const PDFDocument = require('pdfkit');
const router = express.Router();

router.post('/', async (req, res) => {
  const { bookId, email, amount } = req.body;
  try {
    const transaction = new Transaction({ bookId, email, amount });
    await transaction.save();
    res.json({ message: 'Transaction recorded', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Failed to record transaction' });
  }
});

router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('bookId');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

router.put('/:id', async (req, res) => {
  const { email, amount } = req.body;
  try {
    const transaction = await Transaction.findByIdAndUpdate(req.params.id, { email, amount }, { new: true });
    res.json({ message: 'Transaction updated', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update transaction' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete transaction' });
  }
});

// Generate PDF
router.get('/pdf', async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('bookId');
    const doc = new PDFDocument();
    res.setHeader('Content-Disposition', 'attachment; filename="transactions.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);
    doc.fontSize(20).text('Transaction History', { align: 'center' }).moveDown();
    transactions.forEach((t, i) => {
      doc.fontSize(12).text(`Transaction #${i + 1}`);
      doc.text(`Book: ${t.bookId ? t.bookId.name : 'Unknown'}`);
      doc.text(`Email: ${t.email}`);
      doc.text(`Amount: $${t.amount}`);
      doc.text(`Date: ${new Date(t.date).toLocaleString()}`);
      doc.moveDown();
    });
    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
});

module.exports = router;
