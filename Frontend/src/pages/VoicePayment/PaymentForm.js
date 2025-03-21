import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const book = location.state?.book;

  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    email: ''
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');

  useEffect(() => {
    if (!book) {
      navigate('/');
      alert('No book selected. Please use voice input on the home page.');
    }
  }, [book, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    setEnteredOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/send-otp', { email: formData.email });
      console.log('OTP Response:', response.data);
      setOtp(response.data.otp);
      setOtpSent(true);
    } catch (error) {
      console.error('OTP error:', error);
      alert('Failed to send OTP. Check console.');
    }
  };

  const handleConfirm = async () => {
    console.log('Stored OTP:', otp);
    console.log('Entered OTP:', enteredOtp);
    if (otp === enteredOtp) {
      try {
        await axios.post('http://localhost:5000/api/transactions', {
          bookId: book._id,
          email: formData.email,
          amount: book.price,
        });
        console.log('Transaction recorded, navigating to success');
        navigate('/success');
      } catch (error) {
        console.error('Transaction error:', error);
        alert('Failed to record transaction.');
      }
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  if (!book) return null;

  return (
    <div className="container mt-5">
      <div className="card p-4">
        <h3>Payment Gateway</h3>
        <div className="row mb-3 align-items-center">
          <div className="col-md-4">
            <img src={book.coverImage} alt={book.name} className="img-fluid" />
          </div>
          <div className="col-md-8">
            <h4>{book.name}</h4>
            <p>Price: ${book.price.toFixed(2)}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              name="cardNumber"
              placeholder="Card Number (e.g., 1234567890123456)"
              value={formData.cardNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              name="expiry"
              placeholder="MM/YY (e.g., 12/25)"
              value={formData.expiry}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              name="cvv"
              placeholder="CVV (e.g., 123)"
              value={formData.cvv}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Email (e.g., user@example.com)"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          {!otpSent ? (
            <button type="submit" className="btn btn-primary">Proceed</button>
          ) : (
            <div>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter OTP"
                  value={enteredOtp}
                  onChange={handleOtpChange}
                  required
                />
              </div>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;