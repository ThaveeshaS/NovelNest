/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./addDelivery.css"; 
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
  StepContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  IconButton,
  Zoom,
  Fade,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Tooltip,
  Chip,
  Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Header2 from "../../components/Header2";
import Navbar2 from "../../components/Navbar2";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import { motion } from 'framer-motion';

// Custom styled components with enhanced decorations
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  background: 'linear-gradient(145deg, #ffffff, #f9f9f9)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '6px',
    background: 'linear-gradient(90deg, #3f51b5, #2196f3)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -50,
    right: -50,
    width: '150px',
    height: '150px',
    background: 'radial-gradient(circle, rgba(63,81,181,0.1) 0%, rgba(255,255,255,0) 70%)',
    zIndex: 0,
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1),
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      boxShadow: '0 0 0 2px rgba(63, 81, 181, 0.2)',
    },
    '&.Mui-focused': {
      boxShadow: '0 0 0 2px rgba(63, 81, 181, 0.3)',
      '& fieldset': {
        borderWidth: '2px',
      }
    },
    '& fieldset': {
      borderColor: '#e0e0e0',
      transition: 'all 0.3s ease',
    }
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.95rem',
    transform: 'translate(14px, 16px) scale(1)',
    '&.Mui-focused': {
      color: theme.palette.primary.main,
      fontWeight: 500,
    }
  },
  '& .MuiInputLabel-shrink': {
    transform: 'translate(14px, -9px) scale(0.75)',
    backgroundColor: 'white',
    padding: '0 4px',
  },
  position: 'relative',
  '&:before': {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: '2px',
    background: 'linear-gradient(90deg, transparent, rgba(63,81,181,0.2), transparent)',
    transform: 'scaleX(0)',
    transition: 'transform 0.3s ease',
  },
  '&:hover:before': {
    transform: 'scaleX(1)',
  }
}));

const SummaryCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#f8f9ff',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1),
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  marginBottom: theme.spacing(3),
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    background: 'linear-gradient(to bottom, #3f51b5, #2196f3)',
  }
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  let color = theme.palette.info.main;
  let backgroundColor = theme.palette.info.light;
  
  switch (status) {
    case 'Pending':
      color = theme.palette.warning.main;
      backgroundColor = theme.palette.warning.light;
      break;
    case 'Processing':
      color = theme.palette.info.main;
      backgroundColor = theme.palette.info.light;
      break;
    case 'In Transit':
      color = theme.palette.primary.main;
      backgroundColor = theme.palette.primary.light;
      break;
    case 'Delivered':
      color = theme.palette.success.main;
      backgroundColor = theme.palette.success.light;
      break;
    case 'Cancelled':
      color = theme.palette.error.main;
      backgroundColor = theme.palette.error.light;
      break;
    default:
      break;
  }
  
  return {
    backgroundColor: backgroundColor,
    color: color,
    fontWeight: 600,
    borderRadius: '12px',
    padding: '4px 12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontSize: '0.75rem',
  };
});

// MotionBox component for animations
const MotionBox = motion(Box);

const AnimatedDivider = styled(Divider)(({ theme }) => ({
  '&::before, &::after': {
    borderColor: theme.palette.primary.light,
  },
  '& .MuiDivider-wrapper': {
    padding: theme.spacing(0, 2),
    backgroundColor: 'white',
    position: 'relative',
    zIndex: 1,
  }
}));

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
    specialInstructions: '',
    packageItems: [],
    packageWeight: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [formErrors, setFormErrors] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
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
      estimatedDeliveryDate: getDefaultDeliveryDate(),
    }));
  }, []);

  // Get default delivery date (current date + 3 days)
  const getDefaultDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split('T')[0];
  };

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
      setIsSubmitted(true);
      setNotification({
        open: true,
        message: 'Delivery added successfully!',
        severity: 'success'
      });
      
      // Navigate after a short delay
      setTimeout(() => {
        navigate('/admin/DeliveryDetails');
      }, 2500);
      
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

  const handleTrackDelivery = () => {
    navigate('/trackdelivery', { state: { deliveryId: formData.deliveryId } });
  };

  const steps = ['Customer Information', 'Delivery Details', 'Confirmation'];
  
  const handleNext = () => {
    if (activeStep === 0) {
      // Validate only customer information fields
      const errors = {};
      if (!formData.customerName) errors.customerName = 'Customer name is required';
      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
      if (!formData.contactNumber || formData.contactNumber.length < 8) errors.contactNumber = 'Valid contact number is required';
      
      setFormErrors(errors);
      if (Object.keys(errors).length !== 0) {
        setNotification({
          open: true,
          message: 'Please complete all required fields',
          severity: 'warning'
        });
        return;
      }
    } else if (activeStep === 1) {
      // Validate only delivery details fields
      const errors = {};
      if (!formData.orderId) errors.orderId = 'Order ID is required';
      if (!formData.deliveryAddress) errors.deliveryAddress = 'Delivery address is required';
      
      setFormErrors(errors);
      if (Object.keys(errors).length !== 0) {
        setNotification({
          open: true,
          message: 'Please complete all required fields',
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

  const getStepIconColor = (step) => {
    if (activeStep === step) {
      return theme.palette.primary.main;
    } else if (activeStep > step) {
      return theme.palette.success.main;
    }
    return theme.palette.grey[400];
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Fade in={activeStep === 0} timeout={500}>
            <Box>
              <Typography variant="h6" gutterBottom color="primary" sx={{ 
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                '&:after': {
                  content: '""',
                  flex: 1,
                  ml: 2,
                  height: '1px',
                  background: 'linear-gradient(to right, rgba(63,81,181,0.3), transparent)'
                }
              }}>
                <PersonIcon sx={{ 
                  mr: 1, 
                  verticalAlign: 'middle',
                  backgroundColor: 'rgba(63,81,181,0.1)',
                  borderRadius: '50%',
                  padding: '8px',
                  fontSize: '32px'
                }} />
                Customer Details
              </Typography>
              
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <StyledTextField
                  label="Customer Name"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  fullWidth
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <PersonIcon color="action" sx={{ 
                        mr: 1,
                        backgroundColor: 'rgba(63,81,181,0.05)',
                        borderRadius: '50%',
                        padding: '4px'
                      }} />
                    ),
                  }}
                  error={!!formErrors.customerName}
                  helperText={formErrors.customerName}
                />
              </MotionBox>
              
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <StyledTextField
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  fullWidth
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <EmailIcon color="action" sx={{ 
                        mr: 1,
                        backgroundColor: 'rgba(63,81,181,0.05)',
                        borderRadius: '50%',
                        padding: '4px'
                      }} />
                    ),
                  }}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                />
              </MotionBox>
              
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Typography variant="subtitle2" gutterBottom sx={{ 
                  mt: 2, 
                  display: 'flex', 
                  alignItems: 'center',
                  '&:after': {
                    content: '""',
                    flex: 1,
                    ml: 2,
                    height: '1px',
                    background: 'linear-gradient(to right, rgba(63,81,181,0.3), transparent)'
                  }
                }}>
                  <PhoneIcon color="action" sx={{ 
                    mr: 1,
                    backgroundColor: 'rgba(63,81,181,0.05)',
                    borderRadius: '50%',
                    padding: '4px'
                  }} />
                  Contact Number *
                </Typography>
                <PhoneInput
                  country={'us'}
                  value={formData.contactNumber}
                  onChange={(phone) => setFormData({ ...formData, contactNumber: phone })}
                  inputStyle={{ 
                    width: '100%', 
                    height: '56px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    borderColor: formErrors.contactNumber ? theme.palette.error.main : '#e0e0e0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&:focus': {
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 0 0 2px ${theme.palette.primary.light}`
                    }
                  }}
                  buttonStyle={{
                    borderTopLeftRadius: '8px',
                    borderBottomLeftRadius: '8px',
                    backgroundColor: 'rgba(63,81,181,0.05)',
                    borderColor: formErrors.contactNumber ? theme.palette.error.main : '#e0e0e0',
                    transition: 'all 0.3s ease',
                  }}
                  dropdownStyle={{
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                  containerStyle={{
                    marginBottom: '24px'
                  }}
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
                  <Typography color="error" variant="caption" sx={{ 
                    mt: -3, 
                    mb: 2, 
                    display: 'block',
                    animation: 'shake 0.5s ease',
                    '@keyframes shake': {
                      '0%, 100%': { transform: 'translateX(0)' },
                      '25%': { transform: 'translateX(-3px)' },
                      '75%': { transform: 'translateX(3px)' },
                    }
                  }}>
                    {formErrors.contactNumber}
                  </Typography>
                )}
              </MotionBox>
              
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  endIcon={<ArrowBackIcon style={{ transform: 'rotate(180deg)' }} />}
                  sx={{ 
                    borderRadius: '8px',
                    padding: '10px 24px',
                    boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(63, 81, 181, 0.4)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '5px',
                      height: '5px',
                      background: 'rgba(255, 255, 255, 0.5)',
                      opacity: 0,
                      borderRadius: '100%',
                      transform: 'scale(1, 1) translate(-50%)',
                      transformOrigin: '50% 50%',
                    },
                    '&:focus:not(:active)::after': {
                      animation: 'ripple 1s ease-out',
                    },
                    '@keyframes ripple': {
                      '0%': {
                        transform: 'scale(0, 0)',
                        opacity: 0.5,
                      },
                      '100%': {
                        transform: 'scale(20, 20)',
                        opacity: 0,
                      },
                    }
                  }}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </Fade>
        );
      case 1:
        return (
          <Fade in={activeStep === 1} timeout={500}>
            <Box>
              <Typography variant="h6" gutterBottom color="primary" sx={{ 
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                '&:after': {
                  content: '""',
                  flex: 1,
                  ml: 2,
                  height: '1px',
                  background: 'linear-gradient(to right, rgba(63,81,181,0.3), transparent)'
                }
              }}>
                <LocalShippingIcon sx={{ 
                  mr: 1, 
                  verticalAlign: 'middle',
                  backgroundColor: 'rgba(63,81,181,0.1)',
                  borderRadius: '50%',
                  padding: '8px',
                  fontSize: '32px'
                }} />
                Shipment Information
              </Typography>
              
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <StyledTextField
                  label="Order ID"
                  value={formData.orderId}
                  onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                  fullWidth
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InventoryIcon color="action" sx={{ 
                        mr: 1,
                        backgroundColor: 'rgba(63,81,181,0.05)',
                        borderRadius: '50%',
                        padding: '4px'
                      }} />
                    ),
                  }}
                  error={!!formErrors.orderId}
                  helperText={formErrors.orderId}
                />
              </MotionBox>
              
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <StyledTextField
                  label="Delivery ID (Auto-generated)"
                  value={formData.deliveryId}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <AssignmentIcon color="action" sx={{ 
                        mr: 1,
                        backgroundColor: 'rgba(63,81,181,0.05)',
                        borderRadius: '50%',
                        padding: '4px'
                      }} />
                    ),
                  }}
                  fullWidth
                  variant="outlined"
                />
              </MotionBox>
              
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <StyledTextField
                  label="Delivery Address"
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  fullWidth
                  required
                  variant="outlined"
                  multiline
                  rows={3}
                  InputProps={{
                    startAdornment: (
                      <HomeIcon color="action" sx={{ 
                        mr: 1, 
                        alignSelf: 'flex-start', 
                        mt: 1,
                        backgroundColor: 'rgba(63,81,181,0.05)',
                        borderRadius: '50%',
                        padding: '4px'
                      }} />
                    ),
                  }}
                  error={!!formErrors.deliveryAddress}
                  helperText={formErrors.deliveryAddress}
                />
              </MotionBox>
              
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <StyledTextField
                  label="Special Instructions (Optional)"
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={2}
                  placeholder="E.g., Leave with doorman, Call before delivery, etc."
                  InputProps={{
                    sx: {
                      '& textarea': {
                        backgroundImage: 'linear-gradient(to bottom, rgba(63,81,181,0.05) 0%, rgba(255,255,255,0) 20%)',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '100% 1.5em',
                        backgroundPosition: '0 0.8em',
                      }
                    }
                  }}
                />
              </MotionBox>
              
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
                  <InputLabel>Delivery Status</InputLabel>
                  <Select
                    value={formData.deliveryStatus}
                    onChange={(e) => setFormData({ ...formData, deliveryStatus: e.target.value })}
                    label="Delivery Status"
                    sx={{ 
                      borderRadius: '8px',
                      '& .MuiSelect-select': {
                        display: 'flex',
                        alignItems: 'center',
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          borderRadius: '8px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          marginTop: '8px',
                          '& .MuiMenuItem-root': {
                            padding: '10px 16px',
                            '&.Mui-selected': {
                              backgroundColor: 'rgba(63,81,181,0.08)',
                            }
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Processing">Processing</MenuItem>
                    <MenuItem value="In Transit">In Transit</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </MotionBox>
              
              <Box display="flex" justifyContent="space-between" mt={3}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleBack}
                  startIcon={<ArrowBackIcon />}
                  sx={{ 
                    borderRadius: '8px',
                    padding: '10px 24px',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      backgroundColor: 'rgba(63,81,181,0.04)',
                    }
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  endIcon={<ArrowBackIcon style={{ transform: 'rotate(180deg)' }} />}
                  sx={{ 
                    borderRadius: '8px',
                    padding: '10px 24px',
                    boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(63, 81, 181, 0.4)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </Fade>
        );
      case 2:
        return (
          <Fade in={activeStep === 2} timeout={500}>
            <Box>
              <Typography variant="h6" gutterBottom color="primary" sx={{ 
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                '&:after': {
                  content: '""',
                  flex: 1,
                  ml: 2,
                  height: '1px',
                  background: 'linear-gradient(to right, rgba(63,81,181,0.3), transparent)'
                }
              }}>
                <CalendarTodayIcon sx={{ 
                  mr: 1, 
                  verticalAlign: 'middle',
                  backgroundColor: 'rgba(63,81,181,0.1)',
                  borderRadius: '50%',
                  padding: '8px',
                  fontSize: '32px'
                }} />
                Delivery Schedule & Pricing
              </Typography>
              
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <StyledTextField
                  label="Estimated Delivery Date"
                  type="date"
                  value={formData.estimatedDeliveryDate}
                  onChange={(e) => setFormData({ ...formData, estimatedDeliveryDate: e.target.value })}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <CalendarTodayIcon color="action" sx={{ 
                        mr: 1,
                        backgroundColor: 'rgba(63,81,181,0.05)',
                        borderRadius: '50%',
                        padding: '4px'
                      }} />
                    ),
                  }}
                  error={!!formErrors.estimatedDeliveryDate}
                  helperText={formErrors.estimatedDeliveryDate}
                />
              </MotionBox>
              
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <StyledTextField
                  label="Package Weight (kg)"
                  type="number"
                  value={formData.packageWeight}
                  onChange={(e) => setFormData({ ...formData, packageWeight: e.target.value })}
                  fullWidth
                  variant="outlined"
                  placeholder="Optional"
                  inputProps={{ min: 0, step: 0.1 }}
                  InputProps={{
                    endAdornment: (
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        kg
                      </Typography>
                    ),
                  }}
                />
              </MotionBox>
              
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <StyledTextField
                  label="Delivery Fee (₹)"
                  type="number"
                  value={formData.deliveryFee}
                  onChange={(e) => setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) || 0 })}
                  fullWidth
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        ₹
                      </Typography>
                    ),
                  }}
                  inputProps={{ min: 0, step: 0.01 }}
                  error={!!formErrors.deliveryFee}
                  helperText={formErrors.deliveryFee}
                />
              </MotionBox>
              
              <AnimatedDivider sx={{ my: 4 }}>
                <Chip label="ORDER SUMMARY" sx={{ 
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                  backgroundColor: 'rgba(63,81,181,0.1)'
                }} />
              </AnimatedDivider>
              
              <MotionBox
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <SummaryCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" color="text.secondary">Customer</Typography>
                        <Typography variant="body1" fontWeight="600">{formData.customerName || "Not specified"}</Typography>
                      </Box>
                      
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" color="text.secondary">Order ID</Typography>
                        <Typography variant="body1" fontWeight="600">{formData.orderId || "Not specified"}</Typography>
                      </Box>
                      
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                        <StatusChip label={formData.deliveryStatus} status={formData.deliveryStatus} />
                      </Box>
                      
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                        <Typography variant="body2" fontWeight="500" textAlign="right" sx={{ maxWidth: '60%' }}>
                          {formData.deliveryAddress || "Not specified"}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" color="text.secondary">Delivery Date</Typography>
                        <Typography variant="body1" fontWeight="600">
                          {formData.estimatedDeliveryDate ? new Date(formData.estimatedDeliveryDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : "Not specified"}
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ 
                        borderColor: 'rgba(63,81,181,0.1)',
                        borderBottomWidth: '2px',
                        borderStyle: 'dashed'
                      }} />
                      
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" fontWeight="bold">Delivery Fee</Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                          ₹{Number(formData.deliveryFee).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </SummaryCard>
              </MotionBox>
              
              <Grid container spacing={2} mt={3}>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={handleBack}
                    startIcon={<ArrowBackIcon />}
                    sx={{ 
                      borderRadius: '8px',
                      padding: '10px 24px',
                      height: '48px',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        backgroundColor: 'rgba(63,81,181,0.04)',
                      }
                    }}
                  >
                    Back
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={loading || isSubmitted}
                    onClick={handleSubmit}
                    sx={{ 
                      borderRadius: '8px',
                      padding: '10px 24px',
                      boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
                      '&:hover': {
                        boxShadow: '0 6px 16px rgba(63, 81, 181, 0.4)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease',
                      height: '48px',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:disabled': {
                        backgroundColor: theme.palette.primary.main,
                        opacity: 0.7
                      }
                    }}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : 
                               isSubmitted ? <CheckCircleIcon /> : <SaveIcon />}
                  >
                    {loading ? 'Processing...' : isSubmitted ? 'Submitted!' : 'Confirm & Submit'}
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={handleTrackDelivery}
                    startIcon={<GpsFixedIcon />}
                    sx={{ 
                      borderRadius: '8px',
                      padding: '10px 24px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease',
                      height: '48px',
                      mt: 1,
                      background: 'linear-gradient(45deg, #ff6b6b, #ff8e53)',
                    }}
                  >
                    Track This Delivery
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Header2 />
      <Navbar2 />
      <Container className="my-5" maxWidth="md">
        <Zoom in={true} timeout={500}>
          <StyledPaper>
            <Box display="flex" alignItems="center" mb={4}>
              <LocalShippingIcon sx={{ 
                fontSize: 42, 
                color: 'primary.main', 
                mr: 2,
                p: 1,
                borderRadius: '50%',
                backgroundColor: 'rgba(63, 81, 181, 0.1)',
                boxShadow: '0 4px 8px rgba(63,81,181,0.2)'
              }} />
              <Typography variant="h4" component="h1" fontWeight="600" sx={{
                background: 'linear-gradient(45deg, #3f51b5, #2196f3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                Delivery Management
              </Typography>
            </Box>
            
            <Stepper 
              activeStep={activeStep} 
              alternativeLabel={!isMobile}
              orientation={isMobile ? 'vertical' : 'horizontal'}
              sx={{ 
                mb: 4,
                '& .MuiStepConnector-line': {
                  borderColor: theme.palette.primary.light,
                  borderTopWidth: '2px',
                }
              }}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel 
                    StepIconProps={{
                      sx: { 
                        color: getStepIconColor(index),
                        '& .MuiStepIcon-text': {
                          fontWeight: 'bold',
                          fontSize: '0.8rem'
                        }
                      }
                    }}
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontWeight: 600,
                        color: activeStep === index ? theme.palette.primary.main : 
                              activeStep > index ? theme.palette.success.main : 
                              theme.palette.text.secondary,
                        '&.Mui-completed': {
                          color: theme.palette.success.main,
                        }
                      }
                    }}
                  >
                    {label}
                  </StepLabel>
                  {isMobile && activeStep === index && (
                    <StepContent>
                      {renderStepContent(activeStep)}
                    </StepContent>
                  )}
                </Step>
              ))}
            </Stepper>
            
            {!isMobile && (
              <Box sx={{ 
                mt: 2, 
                minHeight: '400px',
                position: 'relative',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'radial-gradient(circle at 20% 50%, rgba(63,81,181,0.03) 0%, rgba(255,255,255,0) 50%)',
                  zIndex: 0,
                }
              }}>
                {renderStepContent(activeStep)}
              </Box>
            )}
          </StyledPaper>
        </Zoom>
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
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            borderRadius: '10px',
            '& .MuiAlert-icon': {
              fontSize: '24px'
            },
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(255,255,255,0.9)'
          }}
          elevation={6}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Success animation overlay */}
      {isSubmitted && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <MotionBox
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            sx={{
              backgroundColor: 'white',
              borderRadius: '20px',
              p: 4,
              textAlign: 'center',
              maxWidth: '400px',
              width: '80%',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              position: 'relative',
              overflow: 'hidden',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #4caf50, #8bc34a)',
              }
            }}
          >
            <CheckCircleIcon color="success" sx={{ 
              fontSize: 80,
              filter: 'drop-shadow(0 4px 8px rgba(76, 175, 80, 0.3))'
            }} />
            <Typography variant="h5" sx={{ 
              mt: 2, 
              mb: 1, 
              fontWeight: 600,
              background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Success!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Your delivery has been successfully added to the system.
            </Typography>
            <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
              Redirecting to delivery list...
            </Typography>
            <CircularProgress size={20} sx={{ mt: 2 }} />
          </MotionBox>
        </Box>
      )}
    </>
  );
};

export default AddDelivery;