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
  IconButton,
  ThemeProvider,
  createTheme,
  alpha,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Header2 from "../../components/Header2";
import Navbar2 from "../../components/Navbar2";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const AddDelivery = () => {
  // Custom theme
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
        light: '#4791db',
        dark: '#115293',
      },
      secondary: {
        main: '#f50057',
        light: '#ff4081',
        dark: '#c51162',
      },
      background: {
        default: '#f5f7fa',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: '0px 3px 15px rgba(0,0,0,0.08)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '10px 24px',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            marginBottom: 16,
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
    },
  });

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        message: 'Delivery scheduled successfully!',
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
        message: 'Failed to schedule delivery. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Customer Information', 'Delivery Details', 'Confirmation'];
  
  const handleNext = () => {
    if (activeStep === 0) {
      // Validate first step fields
      const errors = {};
      if (!formData.customerName) errors.customerName = 'Customer name is required';
      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
      if (!formData.contactNumber || formData.contactNumber.length < 8) {
        errors.contactNumber = 'Valid contact number is required';
      }
      
      setFormErrors(errors);
      if (Object.keys(errors).length > 0) {
        setNotification({
          open: true,
          message: 'Please fill all required fields correctly',
          severity: 'warning'
        });
        return;
      }
    } else if (activeStep === 1) {
      // Validate second step fields
      const errors = {};
      if (!formData.orderId) errors.orderId = 'Order ID is required';
      if (!formData.deliveryAddress) errors.deliveryAddress = 'Delivery address is required';
      
      setFormErrors(errors);
      if (Object.keys(errors).length > 0) {
        setNotification({
          open: true,
          message: 'Please fill all required fields correctly',
          severity: 'warning'
        });
        return;
      }
    }
    
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#f39c12';
      case 'Processing': return '#3498db';
      case 'In Transit': return '#2ecc71';
      case 'Delivered': return '#27ae60';
      case 'Cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ px: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
              <PersonIcon sx={{ color: 'primary.main', mr: 1, my: 0.5 }} />
              <TextField
                label="Customer Name"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                fullWidth
                variant="outlined"
                required
                error={!!formErrors.customerName}
                helperText={formErrors.customerName}
                sx={{ mb: 0 }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
              <EmailIcon sx={{ color: 'primary.main', mr: 1, my: 0.5 }} />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                fullWidth
                variant="outlined"
                required
                error={!!formErrors.email}
                helperText={formErrors.email}
                sx={{ mb: 0 }}
              />
            </Box>
            
            <Box mt={3} mb={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="subtitle1">Contact Number *</Typography>
              </Box>
              <PhoneInput
                country={'us'}
                value={formData.contactNumber}
                onChange={(phone) => setFormData({ ...formData, contactNumber: phone })}
                inputStyle={{ width: '100%', height: '56px', borderRadius: '8px' }}
                buttonStyle={{ borderRadius: '8px 0 0 8px' }}
                enableSearch
                placeholder="Enter contact number"
                required
              />
              {formErrors.contactNumber && (
                <Typography color="error" variant="caption" sx={{ ml: 4 }}>
                  {formErrors.contactNumber}
                </Typography>
              )}
            </Box>
            
            <Box 
              display="flex" 
              justifyContent="flex-end" 
              mt={4}
              sx={{
                '& .MuiButton-root': {
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  }
                }
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                endIcon={<ArrowBackIcon style={{ transform: 'rotate(180deg)' }} />}
                size="large"
              >
                Next
              </Button>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ px: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
              <TextField
                label="Order ID"
                value={formData.orderId}
                onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                fullWidth
                required
                variant="outlined"
                error={!!formErrors.orderId}
                helperText={formErrors.orderId}
                sx={{ mb: 0 }}
              />
            </Box>
            
            <TextField
              label="Delivery ID (Auto-generated)"
              value={formData.deliveryId}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              variant="outlined"
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: alpha(theme.palette.primary.light, 0.05),
                }
              }}
            />
            
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <LocationOnIcon sx={{ color: 'primary.main', mr: 1, mt: 2 }} />
              <TextField
                label="Delivery Address"
                value={formData.deliveryAddress}
                onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                fullWidth
                required
                variant="outlined"
                multiline
                rows={3}
                error={!!formErrors.deliveryAddress}
                helperText={formErrors.deliveryAddress}
                sx={{ mb: 0 }}
              />
            </Box>
            
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>Delivery Status</InputLabel>
              <Select
                value={formData.deliveryStatus}
                onChange={(e) => setFormData({ ...formData, deliveryStatus: e.target.value })}
                label="Delivery Status"
                sx={{
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }
                }}
              >
                <MenuItem value="Pending">
                  <Box component="span" sx={{ 
                    display: 'inline-block', 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    backgroundColor: '#f39c12',
                    mr: 1
                  }}/>
                  Pending
                </MenuItem>
                <MenuItem value="Processing">
                  <Box component="span" sx={{ 
                    display: 'inline-block', 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    backgroundColor: '#3498db',
                    mr: 1
                  }}/>
                  Processing
                </MenuItem>
                <MenuItem value="In Transit">
                  <Box component="span" sx={{ 
                    display: 'inline-block', 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    backgroundColor: '#2ecc71',
                    mr: 1
                  }}/>
                  In Transit
                </MenuItem>
                <MenuItem value="Delivered">
                  <Box component="span" sx={{ 
                    display: 'inline-block', 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    backgroundColor: '#27ae60',
                    mr: 1
                  }}/>
                  Delivered
                </MenuItem>
                <MenuItem value="Cancelled">
                  <Box component="span" sx={{ 
                    display: 'inline-block', 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    backgroundColor: '#e74c3c',
                    mr: 1
                  }}/>
                  Cancelled
                </MenuItem>
              </Select>
            </FormControl>
            
            <Box 
              display="flex" 
              justifyContent="space-between" 
              mt={4}
              sx={{
                '& .MuiButton-root': {
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  }
                }
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
                size="large"
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                endIcon={<ArrowBackIcon style={{ transform: 'rotate(180deg)' }} />}
                size="large"
              >
                Next
              </Button>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ px: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
              <CalendarTodayIcon sx={{ color: 'primary.main', mr: 1, my: 0.5 }} />
              <TextField
                label="Estimated Delivery Date"
                type="date"
                value={formData.estimatedDeliveryDate}
                onChange={(e) => setFormData({ ...formData, estimatedDeliveryDate: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
                variant="outlined"
                error={!!formErrors.estimatedDeliveryDate}
                helperText={formErrors.estimatedDeliveryDate}
                sx={{ mb: 0 }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 3 }}>
              <AttachMoneyIcon sx={{ color: 'primary.main', mr: 1, my: 0.5 }} />
              <TextField
                label="Delivery Fee"
                type="number"
                value={formData.deliveryFee}
                onChange={(e) => setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) })}
                fullWidth
                required
                variant="outlined"
                InputProps={{
                  startAdornment: '$',
                }}
                error={!!formErrors.deliveryFee}
                helperText={formErrors.deliveryFee}
                sx={{ mb: 0 }}
              />
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: 'primary.main',
                fontWeight: 600,
              }}>
                <CheckCircleIcon sx={{ mr: 1 }} />
                Order Summary
              </Typography>
              
              <Paper 
                elevation={0} 
                sx={{ 
                  backgroundColor: alpha(theme.palette.primary.light, 0.05), 
                  p: 3, 
                  borderRadius: 2, 
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1" color="text.secondary">Customer</Typography>
                    <Typography variant="body1" fontWeight="500">{formData.customerName || '—'}</Typography>
                  </Box>
                  
                  <Divider sx={{ opacity: 0.5 }} />
                  
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1" color="text.secondary">Order ID</Typography>
                    <Typography variant="body1" fontWeight="500">{formData.orderId || '—'}</Typography>
                  </Box>
                  
                  <Divider sx={{ opacity: 0.5 }} />
                  
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1" color="text.secondary">Delivery Status</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        component="span" 
                        sx={{ 
                          display: 'inline-block', 
                          width: 10, 
                          height: 10, 
                          borderRadius: '50%', 
                          backgroundColor: getStatusColor(formData.deliveryStatus),
                          mr: 1
                        }}
                      />
                      <Typography variant="body1" fontWeight="500">{formData.deliveryStatus}</Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ opacity: 0.5 }} />
                  
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1" color="text.secondary">Delivery Address</Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight="500" 
                      sx={{ maxWidth: '60%', textAlign: 'right' }}
                    >
                      {formData.deliveryAddress || '—'}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ opacity: 0.5 }} />
                  
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1" color="text.secondary">Expected Delivery</Typography>
                    <Typography variant="body1" fontWeight="500">
                      {formData.estimatedDeliveryDate ? 
                        new Date(formData.estimatedDeliveryDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric'
                        }) : '—'
                      }
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ opacity: 0.5 }} />
                  
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1" color="text.secondary">Delivery Fee</Typography>
                    <Typography variant="body1" fontWeight="700" color="primary.main">
                      ${Number(formData.deliveryFee).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
            
            <Box 
              display="flex" 
              justifyContent="space-between" 
              mt={4}
              sx={{
                '& .MuiButton-root': {
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  }
                }
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
                size="large"
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                size="large"
                sx={{
                  backgroundColor: theme.palette.success.main,
                  '&:hover': {
                    backgroundColor: theme.palette.success.dark,
                  }
                }}
              >
                {loading ? 'Processing...' : 'Confirm & Submit'}
              </Button>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Header2 />
      <Navbar2 />
      <Container maxWidth="md" sx={{ my: 5 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 2, sm: 4 }, 
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 8,
              background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
            }}
          />
          
          <Box display="flex" alignItems="center" mb={4} sx={{ mt: 1 }}>
            <Box 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 1.5,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                borderRadius: 2,
                mr: 2
              }}
            >
              <LocalShippingIcon sx={{ fontSize: 28, color: 'primary.main' }} />
            </Box>
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem' },
                fontWeight: 600,
              }}
            >
              Delivery Management
            </Typography>
          </Box>
          
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel={!isMobile} 
            orientation={isMobile ? 'vertical' : 'horizontal'}
            sx={{ 
              mb: 4,
              '& .MuiStepLabel-label': {
                mt: 1,
              },
              '& .MuiStepLabel-iconContainer': {
                '& .MuiStepIcon-root': {
                  color: 'primary.light',
                  '&.Mui-active': {
                    color: 'primary.main',
                  },
                  '&.Mui-completed': {
                    color: 'success.main',
                  },
                },
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <form onSubmit={handleSubmit}>
            <Box sx={{ minHeight: '350px', p: { xs: 1, sm: 2 } }}>
              {renderStepContent(activeStep)}
            </Box>
          </form>
        </Paper>
        
        <Box display="flex" justifyContent="center" mt={3}>
          <Button 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/admin/DeliveryDetails')}
            variant="text"
            sx={{ 
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'primary.main',
              }
            }}
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
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default AddDelivery;