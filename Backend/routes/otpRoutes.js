const express = require('express');
const transporter = require('../utils/mailer');
const router = express.Router();

router.post('/', async (req, res) => {
  const { email } = req.body;
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
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

module.exports = router;
