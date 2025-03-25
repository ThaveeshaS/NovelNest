/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TextField, Button, Container, Box, Paper, Typography, Stepper, Step, StepLabel,
  FormControl, InputLabel, Select, MenuItem, CircularProgress, Snackbar, Alert,
  Divider, ThemeProvider, createTheme, alpha, useMediaQuery, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, Pagination
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Header2 from "../../components/Header2";
import Navbar2 from "../../components/Navbar2";
import { 
  LocalShipping as ShippingIcon, ArrowBack as BackIcon, 
  Save as SaveIcon, LocationOn as LocationIcon, Person as PersonIcon, 
  Email as EmailIcon, Phone as PhoneIcon, CalendarToday as CalendarIcon, 
  AttachMoney as MoneyIcon, CheckCircle as CheckIcon,
  List as ListIcon, Search as SearchIcon, Refresh as RefreshIcon,
  DirectionsRun as TrackIcon
} from '@mui/icons-material';



const AddDelivery = () => {
  // Theme with enhanced aesthetics
  const theme = createTheme({
    palette: {
      primary: { main: '#2962ff', light: '#5e91ff', dark: '#0039cb' },
      secondary: { main: '#f50057', light: '#ff4081', dark: '#c51162' },
      background: { default: '#f8faff' }
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", sans-serif',
      h4: { fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: 600 }
    },
    components: {
      MuiPaper: { styleOverrides: { root: { boxShadow: '0 6px 20px rgba(0,0,0,0.07)' } } },
      MuiButton: { styleOverrides: { root: { borderRadius: 12, padding: '10px 24px' } } },
      MuiTextField: { styleOverrides: { root: { marginBottom: 16, '& .MuiOutlinedInput-root': { borderRadius: 12 } } } }
    }
  });

  // Variables and state initialization
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const steps = ['Customer Information', 'Delivery Details', 'Confirmation'];
  const statuses = ['Pending', 'Processing', 'In Transit', 'Delivered', 'Cancelled'];
  const statusColors = {
    'Pending': '#ff9800', 'Processing': '#2196f3', 'In Transit': '#00c853',
    'Delivered': '#00a839', 'Cancelled': '#f44336'
  };
  
  const initialFormState = {
    deliveryId: '', orderId: '', customerName: '', deliveryAddress: '', contactNumber: '',
    email: '', deliveryStatus: 'Pending', estimatedDeliveryDate: '', deliveryFee: 0
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [formErrors, setFormErrors] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [allDeliveries, setAllDeliveries] = useState([]);
  const [deliveriesLoading, setDeliveriesLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const rowsPerPage = 5;
  
  // Generate delivery ID and fetch deliveries on component mount
  useEffect(() => {
    generateDeliveryId();
    fetchDeliveries();
  }, []);

  // Helper functions
  const generateDeliveryId = () => {
    const prefix = 'DEL';
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setFormData(prev => ({ ...prev, deliveryId: `${prefix}-${timestamp}-${random}` }));
  };

  const fetchDeliveries = async () => {
    setDeliveriesLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/deliveries');
      setAllDeliveries(response.data);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      showNotification('Failed to fetch delivery details.', 'error');
    } finally {
      setDeliveriesLoading(false);
    }
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => setNotification({...notification, open: false});
  const handleNext = () => validateStep(activeStep) && setActiveStep(prevStep => prevStep + 1);
  const handleBack = () => setActiveStep(prevStep => prevStep - 1);
  const getStatusColor = (status) => statusColors[status] || '#9e9e9e';
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleSearchChange = (e) => { setSearchTerm(e.target.value); setPage(1); };
  const handleTrackDelivery = (deliveryId) => navigate(`/admin/TrackDelivery/${deliveryId}`);
  const handleInputChange = (field, value) => setFormData({ ...formData, [field]: value });
  
  // Filter and pagination logic
  const filteredDeliveries = allDeliveries.filter(delivery => 
    delivery.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.deliveryId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedDeliveries = filteredDeliveries.slice(
    (page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage
  );

  const currentPageTotalFee = paginatedDeliveries.reduce((total, delivery) => 
    total + (parseFloat(delivery.deliveryFee) || 0), 0);
    
  const allFilteredTotalFee = filteredDeliveries.reduce((total, delivery) => 
    total + (parseFloat(delivery.deliveryFee) || 0), 0);

  // Form validation
  const validateStep = (step) => {
    const errors = {};
    if (step === 0) {
      if (!formData.customerName) errors.customerName = 'Customer name is required';
      if (!formData.email) errors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Please enter a valid email address';
      if (!formData.contactNumber || formData.contactNumber.length < 8) errors.contactNumber = 'Valid contact number is required';
    } else if (step === 1) {
      if (!formData.orderId) errors.orderId = 'Order ID is required';
      if (!formData.deliveryAddress) errors.deliveryAddress = 'Delivery address is required';
    }
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      showNotification('Please fill all required fields correctly', 'warning');
      return false;
    }
    return true;
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.orderId) errors.orderId = 'Order ID is required';
    if (!formData.customerName) errors.customerName = 'Customer name is required';
    if (!formData.deliveryAddress) errors.deliveryAddress = 'Delivery address is required';
    if (!formData.contactNumber || formData.contactNumber.length < 8) errors.contactNumber = 'Valid contact number is required';
    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Please enter a valid email address';
    if (!formData.estimatedDeliveryDate) errors.estimatedDeliveryDate = 'Delivery date is required';
    if (formData.deliveryFee <= 0) errors.deliveryFee = 'Delivery fee must be greater than 0';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showNotification('Please fix the errors in the form', 'error');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/deliveries', formData);
      showNotification('Delivery scheduled successfully!', 'success');
      fetchDeliveries();
      generateDeliveryId();
      setFormData(prev => ({ ...initialFormState, deliveryId: prev.deliveryId }));
      setTimeout(() => navigate('/admin/DeliveryDetails'), 1500);
    } catch (error) {
      showNotification('Failed to schedule delivery. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // UI Components
  const InputWithIcon = ({ icon, children }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
      {icon}
      {children}
    </Box>
  );

  // Delivery Details Table Component
 // Delivery Details Table Component
const DeliveryDetailsTable = () => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" gutterBottom sx={{ 
      display: 'flex', alignItems: 'center', color: 'primary.main', fontWeight: 600 
    }}>
      <ListIcon sx={{ mr: 1 }} />
      All Delivery Details
    </Typography>
    
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, gap: 2 }}>
      <TextField placeholder="Search by customer, order ID, or delivery ID" variant="outlined"
        fullWidth value={searchTerm} onChange={handleSearchChange} size="small"
        InputProps={{ startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} /> }} />
      <Button variant="outlined" color="primary" startIcon={<RefreshIcon />}
        onClick={fetchDeliveries} size="small">Refresh</Button>
    </Box>
    
    <TableContainer component={Paper} sx={{ 
      borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', mb: 2 
    }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.light, 0.1) }}>
            {['Delivery ID', 'Customer', 'Order ID', 'Delivery Date', 'Status', 'Fee']
              .map(header => <TableCell key={header} sx={{ fontWeight: 600 }}>{header}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {deliveriesLoading ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                <CircularProgress size={30} />
                <Typography variant="body2" sx={{ mt: 1 }}>Loading delivery data...</Typography>
              </TableCell>
            </TableRow>
          ) : paginatedDeliveries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                <Typography variant="body1">No deliveries found</Typography>
                {searchTerm && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Try adjusting your search</Typography>}
              </TableCell>
            </TableRow>
          ) : (
            paginatedDeliveries.map((delivery) => (
              <TableRow key={delivery._id || delivery.deliveryId} hover>
                <TableCell sx={{ 
                  color: 'primary.main', fontWeight: 500, cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' } 
                }}>
                  {delivery.deliveryId}
                </TableCell>
                <TableCell>{delivery.customerName}</TableCell>
                <TableCell>{delivery.orderId}</TableCell>
                <TableCell>{delivery.estimatedDeliveryDate 
                  ? new Date(delivery.estimatedDeliveryDate).toLocaleDateString() : '—'}</TableCell>
                <TableCell>
                  <Chip label={delivery.deliveryStatus} size="small" sx={{ 
                    backgroundColor: alpha(getStatusColor(delivery.deliveryStatus), 0.1),
                    color: getStatusColor(delivery.deliveryStatus), fontWeight: 500,
                    '& .MuiChip-label': { px: 1 } }} />
                </TableCell>
                <TableCell>${Number(delivery.deliveryFee).toFixed(2)}</TableCell>
              </TableRow>
            ))
          )}
          
          {/* Fee Subtotal Row */}
          {paginatedDeliveries.length > 0 && (
            <TableRow sx={{ 
              backgroundColor: alpha(theme.palette.primary.light, 0.05),
              '& td': { fontWeight: 600 } 
            }}>
              <TableCell colSpan={5} align="right">
                <Typography variant="subtitle2">Subtotal (Current Page):</Typography>
              </TableCell>
              <TableCell sx={{ 
                color: theme.palette.primary.main, fontWeight: 700,
                borderTop: `2px solid ${alpha(theme.palette.primary.main, 0.2)}` 
              }}>
                ${currentPageTotalFee.toFixed(2)}
              </TableCell>
            </TableRow>
          )}
          
          {/* Total Fee Row (if filtered/search is applied) */}
          {filteredDeliveries.length > rowsPerPage && (
            <TableRow sx={{ 
              backgroundColor: alpha(theme.palette.secondary.light, 0.05),
              '& td': { fontWeight: 600 } 
            }}>
              <TableCell colSpan={5} align="right">
                <Typography variant="subtitle2">
                  Total (All {filteredDeliveries.length} deliveries):
                </Typography>
              </TableCell>
              <TableCell sx={{ 
                color: theme.palette.secondary.main, fontWeight: 700,
                borderTop: `2px solid ${alpha(theme.palette.secondary.main, 0.2)}` 
              }}>
                ${allFilteredTotalFee.toFixed(2)}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
    
    {filteredDeliveries.length > rowsPerPage && (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination count={Math.ceil(filteredDeliveries.length / rowsPerPage)}
          page={page} onChange={handleChangePage} color="primary" size="small" />
      </Box>
    )}

    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
      Showing {paginatedDeliveries.length} of {filteredDeliveries.length} deliveries
    </Typography>
  </Box>
);

  // Order Summary Component
  const OrderSummary = () => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ 
        display: 'flex', alignItems: 'center', color: 'primary.main', fontWeight: 600 
      }}>
        <CheckIcon sx={{ mr: 1 }} />
        Order Summary
      </Typography>
      <Paper elevation={0} sx={{ 
        backgroundColor: alpha(theme.palette.primary.light, 0.05), 
        p: 3, borderRadius: 2, border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` 
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            { label: 'Customer', value: formData.customerName || '—' },
            { label: 'Order ID', value: formData.orderId || '—' },
            { label: 'Delivery Status', value: (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box component="span" sx={{ 
                    display: 'inline-block', width: 10, height: 10, 
                    borderRadius: '50%', backgroundColor: getStatusColor(formData.deliveryStatus), mr: 1 
                  }} />
                  <Typography variant="body1" fontWeight="500">{formData.deliveryStatus}</Typography>
                </Box>
              ), isComponent: true },
            { label: 'Delivery Address', value: formData.deliveryAddress || '—', 
              style: { maxWidth: '60%', textAlign: 'right' } },
            { label: 'Expected Delivery', value: formData.estimatedDeliveryDate ? 
                new Date(formData.estimatedDeliveryDate).toLocaleDateString('en-US', {
                  weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                }) : '—' },
            { label: 'Delivery Fee', value: `$${Number(formData.deliveryFee).toFixed(2)}`,
              valueStyle: { fontWeight: '700', color: 'primary.main' } }
          ].map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <Divider sx={{ opacity: 0.5 }} />}
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body1" color="text.secondary">{item.label}</Typography>
                {item.isComponent ? item.value : (
                  <Typography variant="body1" fontWeight="500" sx={item.style || {}}
                    color={item.valueStyle?.color} style={{ fontWeight: item.valueStyle?.fontWeight }}>
                    {item.value}
                  </Typography>
                )}
              </Box>
            </React.Fragment>
          ))}
        </Box>
      </Paper>
    </Box>
  );

  // Step Content Components
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ px: 1 }}>
            <InputWithIcon icon={<PersonIcon sx={{ color: 'primary.main', mr: 1, my: 0.5 }} />}>
              <TextField label="Customer Name" value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                fullWidth variant="outlined" required error={!!formErrors.customerName}
                helperText={formErrors.customerName} sx={{ mb: 0 }} />
            </InputWithIcon>
            <InputWithIcon icon={<EmailIcon sx={{ color: 'primary.main', mr: 1, my: 0.5 }} />}>
              <TextField label="Email" type="email" value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                fullWidth variant="outlined" required error={!!formErrors.email}
                helperText={formErrors.email} sx={{ mb: 0 }} />
            </InputWithIcon>
            <Box mt={3} mb={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="subtitle1">Contact Number *</Typography>
              </Box>
              <PhoneInput country={'us'} value={formData.contactNumber}
                onChange={(phone) => handleInputChange('contactNumber', phone)}
                inputStyle={{ width: '100%', height: '56px', borderRadius: '12px' }}
                buttonStyle={{ borderRadius: '12px 0 0 12px' }} enableSearch
                placeholder="Enter contact number" />
              {formErrors.contactNumber && (
                <Typography color="error" variant="caption" sx={{ ml: 4 }}>
                  {formErrors.contactNumber}
                </Typography>
              )}
            </Box>

            {/* Track Delivery Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 3 }}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<TrackIcon />}
                onClick={() => navigate('/trackdelivery')}
                sx={{ 
                  borderRadius: 4,
                  px: 4,
                  py: 1.5,
                  boxShadow: '0 4px 10px rgba(245, 0, 87, 0.25)',
                  '&:hover': {
                    boxShadow: '0 6px 15px rgba(245, 0, 87, 0.35)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Track Delivery
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />
            <DeliveryDetailsTable />
            
            <Box display="flex" justifyContent="flex-end" mt={4} sx={{
              '& .MuiButton-root': {
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }
              }
            }}>
              <Button variant="contained" color="primary" onClick={handleNext}
                endIcon={<BackIcon style={{ transform: 'rotate(180deg)' }} />} size="large">
                Next
              </Button>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ px: 1 }}>
            <TextField label="Order ID" value={formData.orderId}
              onChange={(e) => handleInputChange('orderId', e.target.value)}
              fullWidth required variant="outlined" error={!!formErrors.orderId}
              helperText={formErrors.orderId} sx={{ mb: 2 }} />
            <TextField label="Delivery ID (Auto-generated)" value={formData.deliveryId}
              InputProps={{ readOnly: true }} fullWidth variant="outlined"
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { 
                backgroundColor: alpha(theme.palette.primary.light, 0.05) 
              } }} />
            <InputWithIcon icon={<LocationIcon sx={{ color: 'primary.main', mr: 1, mt: 2 }} />}>
              <TextField label="Delivery Address" value={formData.deliveryAddress}
                onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                fullWidth required variant="outlined" multiline rows={3}
                error={!!formErrors.deliveryAddress} helperText={formErrors.deliveryAddress} sx={{ mb: 0 }} />
            </InputWithIcon>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>Delivery Status</InputLabel>
              <Select value={formData.deliveryStatus}
                onChange={(e) => handleInputChange('deliveryStatus', e.target.value)}
                label="Delivery Status"
                sx={{ '& .MuiSelect-select': { display: 'flex', alignItems: 'center', gap: 1 } }}>
                {statuses.map(status => (
                  <MenuItem key={status} value={status}>
                    <Box component="span" sx={{ 
                      display: 'inline-block', width: 12, height: 12, 
                      borderRadius: '50%', backgroundColor: getStatusColor(status), mr: 1 
                    }} />
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box display="flex" justifyContent="space-between" mt={4} sx={{
              '& .MuiButton-root': {
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }
              }
            }}>
              <Button variant="outlined" color="primary" onClick={handleBack}
                startIcon={<BackIcon />} size="large">Back</Button>
              <Button variant="contained" color="primary" onClick={handleNext}
                endIcon={<BackIcon style={{ transform: 'rotate(180deg)' }} />} size="large">Next</Button>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ px: 1 }}>
            <InputWithIcon icon={<CalendarIcon sx={{ color: 'primary.main', mr: 1, my: 0.5 }} />}>
              <TextField label="Estimated Delivery Date" type="date" value={formData.estimatedDeliveryDate}
                onChange={(e) => handleInputChange('estimatedDeliveryDate', e.target.value)}
                fullWidth InputLabelProps={{ shrink: true }} required variant="outlined"
                error={!!formErrors.estimatedDeliveryDate} helperText={formErrors.estimatedDeliveryDate} sx={{ mb: 0 }} />
            </InputWithIcon>
            <InputWithIcon icon={<MoneyIcon sx={{ color: 'primary.main', mr: 1, my: 0.5 }} />}>
              <TextField label="Delivery Fee" type="number" value={formData.deliveryFee}
                onChange={(e) => handleInputChange('deliveryFee', parseFloat(e.target.value))}
                fullWidth required variant="outlined" InputProps={{ startAdornment: '$' }}
                error={!!formErrors.deliveryFee} helperText={formErrors.deliveryFee} sx={{ mb: 0 }} />
            </InputWithIcon>
            
            <Divider sx={{ my: 3 }} />
            <OrderSummary />
            <Divider sx={{ my: 3 }} />
            <DeliveryDetailsTable />
            
            <Box display="flex" justifyContent="space-between" mt={4} sx={{
              '& .MuiButton-root': {
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }
              }
            }}>
              <Button variant="outlined" color="primary" onClick={handleBack}
                startIcon={<BackIcon />} size="large">Back</Button>
              <Button variant="contained" color="primary" type="submit" onClick={handleSubmit}
                disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                size="large" sx={{ backgroundColor: theme.palette.success.main,
                  '&:hover': { backgroundColor: theme.palette.success.dark } }}>
                {loading ? 'Processing...' : 'Confirm & Submit'}
              </Button>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  // Main component render
  return (
    <ThemeProvider theme={theme}>
      <Header2 />
      <Navbar2 />
      <Container maxWidth="md" sx={{ my: 5 }}>
        <Paper elevation={3} sx={{ 
          p: { xs: 2, sm: 4 }, borderRadius: 3, overflow: 'hidden', position: 'relative' 
        }}>
          <Box sx={{ 
            position: 'absolute', top: 0, left: 0, right: 0, height: 8,
            background: 'linear-gradient(90deg, #2962ff 0%, #5e91ff 100%)' 
          }}/>
          <Box display="flex" alignItems="center" mb={4} sx={{ mt: 1 }}>
            <Box sx={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              p: 1.5, backgroundColor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2, mr: 2 
            }}>
              <ShippingIcon sx={{ fontSize: 28, color: 'primary.main' }} />
            </Box>
            <Typography variant="h4" component="h2" sx={{ 
              fontSize: { xs: '1.5rem', sm: '2rem' }, fontWeight: 600 
            }}>
              Delivery Management
            </Typography>
          </Box>
          <Stepper activeStep={activeStep} alternativeLabel={!isMobile} orientation={isMobile ? 'vertical' : 'horizontal'} 
            sx={{ mb: 4, '& .MuiStepLabel-label': { mt: 1 },
              '& .MuiStepLabel-iconContainer': {
                '& .MuiStepIcon-root': {
                  color: 'primary.light',
                  '&.Mui-active': { color: 'primary.main' },
                  '&.Mui-completed': { color: 'success.main' },
                },
              },
            }}>
            {steps.map((label) => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>
          <form onSubmit={handleSubmit}>
            <Box sx={{ minHeight: '350px', p: { xs: 1, sm: 2 } }}>
              {renderStepContent(activeStep)}
            </Box>
          </form>
        </Paper>
      </Container>
      <Snackbar open={notification.open} autoHideDuration={6000} 
        onClose={handleCloseNotification} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseNotification} severity={notification.severity} 
          sx={{ width: '100%', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default AddDelivery;