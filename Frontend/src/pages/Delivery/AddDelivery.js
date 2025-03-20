/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TextField, 
  Button, 
  Container, 
  Box, 
  Paper, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Header2 from "../../components/Header2";
import Navbar2 from "../../components/Navbar2";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

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
  
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [formErrors, setFormErrors] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  
  const navigate = useNavigate();
  
  // Generate a unique delivery ID when component mounts
  useEffect(() => {
    const generateDeliveryId = () => {
      const prefix = 'DEL';
      const timestamp = new Date().getTime().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `${prefix}-${timestamp}-${random}`;
    };
    
    setFormData(prev => ({
      ...prev,
      deliveryId: generateDeliveryId(),
    }));
  }, []);

  const handleCloseNotification = () => {
    setNotification({...notification, open: false});
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.orderId) errors.orderId = 'Order ID is required';
    if (!formData.customerName) errors.customerName = 'Customer name is required';
    if (!formData.deliveryAddress) errors.deliveryAddress = 'Delivery address is required';
    if (!formData.contactNumber || formData.contactNumber.length < 8) errors.contactNumber = 'Valid contact number is required';
    
    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.estimatedDeliveryDate) errors.estimatedDeliveryDate = 'Delivery date is required';
    if (formData.deliveryFee <= 0) errors.deliveryFee = 'Delivery fee must be greater than 0';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setNotification({
        open: true,
        message: 'Please fix the errors in the form',
        severity: 'error'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/deliveries', formData);
      
      console.log("Server Response:", response.data);
      setNotification({
        open: true,
        message: 'Delivery added successfully!',
        severity: 'success'
      });
      
      // Reset form after successful submission
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
      
      // Navigate after a short delay
      setTimeout(() => {
        navigate('/admin/DeliveryDetails');
      }, 1500);
      
    } catch (error) {
      console.error('Error adding delivery:', error.response ? error.response.data : error.message);
      setNotification({
        open: true,
        message: 'Failed to add delivery. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Customer Information', 'Delivery Details', 'Confirmation'];
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              label="Customer Name"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              fullWidth
              margin="normal"
              required
              variant="outlined"
              className="mb-3"
              error={!!formErrors.customerName}
              helperText={formErrors.customerName}
            />
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
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            <Box mt={2} mb={2}>
              <Typography variant="subtitle2" gutterBottom>Contact Number *</Typography>
              <PhoneInput
                country={'us'}
                value={formData.contactNumber}
                onChange={(phone) => setFormData({ ...formData, contactNumber: phone })}
                inputStyle={{ width: '100%', height: '56px' }}
                enableSearch
                placeholder="Enter contact number"
                required
                isValid={(value, country) => {
                  if (value.length < 8) {
                    return 'Phone number is too short';
                  }
                  return true;
                }}
              />
              {formErrors.contactNumber && (
                <Typography color="error" variant="caption">
                  {formErrors.contactNumber}
                </Typography>
              )}
            </Box>
            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                endIcon={<ArrowBackIcon style={{ transform: 'rotate(180deg)' }} />}
              >
                Next
              </Button>
            </Box>
          </>
        );
      case 1:
        return (
          <>
            <TextField
              label="Order ID"
              value={formData.orderId}
              onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
              fullWidth
              margin="normal"
              required
              variant="outlined"
              className="mb-3"
              error={!!formErrors.orderId}
              helperText={formErrors.orderId}
            />
            <TextField
              label="Delivery ID (Auto-generated)"
              value={formData.deliveryId}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              margin="normal"
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
              multiline
              rows={3}
              error={!!formErrors.deliveryAddress}
              helperText={formErrors.deliveryAddress}
            />
            <FormControl fullWidth margin="normal" variant="outlined" className="mb-3">
              <InputLabel>Delivery Status</InputLabel>
              <Select
                value={formData.deliveryStatus}
                onChange={(e) => setFormData({ ...formData, deliveryStatus: e.target.value })}
                label="Delivery Status"
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Processing">Processing</MenuItem>
                <MenuItem value="In Transit">In Transit</MenuItem>
                <MenuItem value="Delivered">Delivered</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <Box display="flex" justifyContent="space-between" mt={3}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                endIcon={<ArrowBackIcon style={{ transform: 'rotate(180deg)' }} />}
              >
                Next
              </Button>
            </Box>
          </>
        );
      case 2:
        return (
          <>
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
              error={!!formErrors.estimatedDeliveryDate}
              helperText={formErrors.estimatedDeliveryDate}
            />
            <TextField
              label="Delivery Fee"
              type="number"
              value={formData.deliveryFee}
              onChange={(e) => setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) })}
              fullWidth
              margin="normal"
              required
              variant="outlined"
              className="mb-3"
              InputProps={{
                startAdornment: '$',
              }}
              error={!!formErrors.deliveryFee}
              helperText={formErrors.deliveryFee}
            />
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            <Box sx={{ backgroundColor: '#f3f4f6', p: 2, borderRadius: 1, mb: 3 }}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body1">Customer:</Typography>
                <Typography variant="body1" fontWeight="500">{formData.customerName}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="body1">Order ID:</Typography>
                <Typography variant="body1" fontWeight="500">{formData.orderId}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="body1">Delivery Address:</Typography>
                <Typography variant="body1" fontWeight="500" sx={{ maxWidth: '60%', textAlign: 'right' }}>
                  {formData.deliveryAddress}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="body1">Expected Delivery:</Typography>
                <Typography variant="body1" fontWeight="500">
                  {formData.estimatedDeliveryDate ? new Date(formData.estimatedDeliveryDate).toLocaleDateString() : ''}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="body1">Delivery Fee:</Typography>
                <Typography variant="body1" fontWeight="500">${Number(formData.deliveryFee).toFixed(2)}</Typography>
              </Box>
            </Box>
            
            <Box display="flex" justifyContent="space-between" mt={3}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              >
                {loading ? 'Processing...' : 'Confirm & Submit'}
              </Button>
            </Box>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Header2 />
      <Navbar2 />
      <Container className="my-5">
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <LocalShippingIcon sx={{ fontSize: 36, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h2">
              Billing Details
            </Typography>
          </Box>
          
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <form onSubmit={handleSubmit}>
            <Box sx={{ minHeight: '350px', p: 2 }}>
              {renderStepContent(activeStep)}
            </Box>
          </form>
        </Paper>
        
        <Box display="flex" justifyContent="center" mt={3}>
          <Button 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/admin/DeliveryDetails')}
            variant="text"
          >
            Return to Delivery List
          </Button>
        </Box>
      </Container>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddDelivery;