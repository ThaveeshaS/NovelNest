/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Box } from '@mui/material';
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

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    console.log("Submitting data:", formData); // ✅ Debugging step

    try {
      const response = await axios.post('http://localhost:5000/api/deliveries', formData);

      console.log("Server Response:", response.data);
      alert('Delivery added successfully!');
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

      navigate('/admin/DeliveryDetails');

    } catch (error) {
      console.error('Error adding delivery:', error.response ? error.response.data : error.message);
      alert('Failed to add delivery. Please check console for more details.');
    }
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Billing Details</h2>
      <form
        onSubmit={handleSubmit}
        className="p-4 shadow-lg rounded" // Adding Bootstrap classes for padding, shadow, and rounded corners
        style={{ backgroundColor: '#f8f9fa' }} // Light background color for the form
      >
        <TextField
          label="Delivery ID"
          value={formData.deliveryId}
          onChange={(e) => setFormData({ ...formData, deliveryId: e.target.value })}
          fullWidth
          margin="normal"
          required
          variant="outlined"
          className="mb-3"
        />
        <TextField
          label="Order ID"
          value={formData.orderId}
          onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
          fullWidth
          margin="normal"
          required
          variant="outlined"
          className="mb-3"
        />
        <TextField
          label="Customer Name"
          value={formData.customerName}
          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
          fullWidth
          margin="normal"
          required
          variant="outlined"
          className="mb-3"
        />
        <TextField
          label="Delivery Address"
          value={formData.deliveryAddress}
          onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
          fullWidth
          margin="normal"
          required
          variant="outlined"
          className="mb-3"
        />

        {/* Phone Number Input */}
        <Box mt={2} mb={2}>
          <PhoneInput
            country={'us'}
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
          variant="outlined"
          className="mb-3"
        />

        {/* Email Input */}
        <TextField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          fullWidth
          margin="normal"
          required
          variant="outlined"
          className="mb-3"
        />

        {/* Delivery Fee Input */}
        <TextField
          label="Delivery Fee"
          type="number"
          value={formData.deliveryFee}
          onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })}
          fullWidth
          margin="normal"
          required
          variant="outlined"
          className="mb-3"
        />

        {/* Submit Button */}
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
