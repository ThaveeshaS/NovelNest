import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const AddDelivery = () => {
  const [formData, setFormData] = useState({
    deliveryId: '',
    orderId: '',
    customerName: '',
    deliveryAddress: '',
    contactNumber: '',
    email: '',
    deliveryStatus: 'Pending',
    estimatedDeliveryDate: '',
    deliveryFee: 0,
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      // Get the token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not authorized. Please log in.');
        return;
      }

      // Log the data being sent
      console.log('Sending delivery data:', formData);

      // Send the delivery data to the backend
      const response = await axios.post(
        'http://localhost:5000/api/delivery/add',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Log the response
      console.log('Response from backend:', response.data);

      if (response.status === 201) {
        alert('Delivery added successfully!');

        // Reset form after submission
        setFormData({
          deliveryId: '',
          orderId: '',
          customerName: '',
          deliveryAddress: '',
          contactNumber: '',
          email: '',
          deliveryStatus: 'Pending',
          estimatedDeliveryDate: '',
          deliveryFee: 0,
        });

        // Redirect to delivery management page
        navigate('/admin/DeliveryHandling');
      }
    } catch (err) {
      console.error('Error adding delivery:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to add delivery. Please try again.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Add New Delivery
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Delivery ID"
          value={formData.deliveryId}
          onChange={(e) => setFormData({ ...formData, deliveryId: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Order ID"
          value={formData.orderId}
          onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Customer Name"
          value={formData.customerName}
          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Delivery Address"
          value={formData.deliveryAddress}
          onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
          fullWidth
          margin="normal"
          required
        />

        {/* Country Code Phone Input */}
        <Box mt={2} mb={2}>
          <PhoneInput
            country={'us'} // Default country
            value={formData.contactNumber}
            onChange={(phone) => setFormData({ ...formData, contactNumber: phone })}
            inputStyle={{ width: '100%', height: '56px' }}
            enableSearch
            placeholder="Enter contact number"
            required
          />
        </Box>

        {/* Estimated Delivery Date */}
        <TextField
          label="Estimated Delivery Date"
          type="date"
          value={formData.estimatedDeliveryDate}
          onChange={(e) => setFormData({ ...formData, estimatedDeliveryDate: e.target.value })}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />

        {/* Enter Email */}
        <TextField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          fullWidth
          margin="normal"
          required
        />

        {/* Delivery Fee */}
        <TextField
          label="Delivery Fee"
          type="number"
          value={formData.deliveryFee}
          onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })}
          fullWidth
          margin="normal"
          required
        />

        {/* Centering the Button with spacing */}
        <Box display="flex" justifyContent="center" mt={3} mb={3}>
          <Button type="submit" variant="contained" color="primary">
            Add Delivery
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default AddDelivery;