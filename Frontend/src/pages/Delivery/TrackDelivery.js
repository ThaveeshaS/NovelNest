/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Box, Paper, Typography, Stepper, Step, StepLabel, StepContent,
  TextField, Button, Divider, ThemeProvider, createTheme, alpha, CircularProgress,
  Card, CardContent, Grid, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Snackbar, Alert, IconButton,
  Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent
} from '@mui/material';
import {
  LocalShipping as LocalShippingIcon,
  SearchOutlined as SearchIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Edit as EditIcon,
  LocationOn as LocationOnIcon,
  CheckCircle as CheckCircleIcon,
  InfoOutlined as InfoIcon,
  Schedule as ScheduleIcon,
  Save as SaveIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import Header2 from '../../components/Header2';
import Navbar2 from '../../components/Navbar2';

const TrackDelivery = () => {
  const theme = createTheme({
    palette: {
      primary: { main: '#1976d2', light: '#4791db', dark: '#115293' },
      secondary: { main: '#f50057', light: '#ff4081', dark: '#c51162' },
      background: { default: '#f5f7fa' }
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 500 }
    },
    components: {
      MuiPaper: { styleOverrides: { root: { boxShadow: '0px 3px 15px rgba(0,0,0,0.08)' } } },
      MuiButton: { styleOverrides: { root: { borderRadius: 8, padding: '10px 24px' } } },
      MuiTextField: { styleOverrides: { root: { marginBottom: 16, '& .MuiOutlinedInput-root': { borderRadius: 8 } } } }
    }
  });
  
  const { deliveryId } = useParams();
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState(deliveryId || '');
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    status: '',
    description: '',
    location: ''
  });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  const statusColors = {
    'Pending': '#f39c12', 
    'Processing': '#3498db', 
    'In Transit': '#2ecc71',
    'Out for Delivery': '#1abc9c',
    'Delivered': '#27ae60', 
    'Cancelled': '#e74c3c',
    'Delayed': '#e67e22',
    'Failed Attempt': '#95a5a6',
    'Returned': '#9b59b6'
  };
  
  const getStatusColor = (status) => statusColors[status] || '#95a5a6';
  const handleCloseNotification = () => setNotification({...notification, open: false});
  
  useEffect(() => {
    if (deliveryId) {
      fetchDelivery(deliveryId);
    }
  }, [deliveryId]);
  
  const fetchDelivery = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/deliveries/track/${id}`);
      setDelivery(response.data);
    } catch (err) {
      setError('Delivery not found or error fetching delivery information.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchId.trim()) {
      setError('Please enter a delivery ID');
      return;
    }
    
    navigate(`/delivery/track/${searchId}`);
    fetchDelivery(searchId);
  };
  
  const handleOpenUpdateDialog = () => {
    setNewEvent({
      status: delivery?.status || '',
      description: '',
      location: delivery?.events[0]?.location || ''
    });
    setUpdateDialogOpen(true);
  };
  
  const handleCloseUpdateDialog = () => {
    setUpdateDialogOpen(false);
  };
  
  const handleNewEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddEvent = async () => {
    if (!newEvent.status || !newEvent.description) {
      setNotification({
        open: true,
        message: 'Status and description are required',
        severity: 'error'
      });
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/deliveries/${delivery._id}/events`, {
        status: newEvent.status,
        description: newEvent.description,
        location: newEvent.location,
        timestamp: new Date().toISOString()
      });
      
      // Update local state with the new event
      setDelivery(response.data);
      setUpdateDialogOpen(false);
      setNotification({
        open: true,
        message: 'Delivery status updated successfully',
        severity: 'success'
      });
    } catch (err) {
      setNotification({
        open: true,
        message: 'Failed to update delivery status',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Generate steps for the stepper component based on delivery events
  const getSteps = () => {
    if (!delivery || !delivery.events || delivery.events.length === 0) {
      return [];
    }
    
    // Sort events by timestamp in descending order (newest first)
    const sortedEvents = [...delivery.events].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    return sortedEvents.map(event => ({
      label: event.status,
      description: event.description,
      location: event.location,
      timestamp: event.timestamp
    }));
  };
  
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Header2 />
        <Navbar2 />
        
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalShippingIcon sx={{ mr: 1 }} />
              Track Delivery
            </Typography>
            
            <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TextField
                fullWidth
                label="Delivery ID"
                variant="outlined"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter delivery tracking number"
                sx={{ mr: 2, mb: 0 }}
              />
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                startIcon={<SearchIcon />}
                disabled={loading}
              >
                Track
              </Button>
            </Box>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            )}
            
            {delivery && !loading && (
              <Box sx={{ mt: 4 }}>
                <Card sx={{ mb: 4 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Delivery ID
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {delivery._id}
                        </Typography>
                        
                        <Typography variant="subtitle2" color="text.secondary">
                          Customer
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                          {delivery.customerName}
                        </Typography>
                        
                        <Typography variant="subtitle2" color="text.secondary">
                          Delivery Address
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                          {delivery.deliveryAddress}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Current Status
                        </Typography>
                        <Chip 
                          label={delivery.status} 
                          sx={{ 
                            bgcolor: getStatusColor(delivery.status),
                            color: 'white',
                            fontWeight: 'bold',
                            mb: 1
                          }}
                        />
                        
                        <Typography variant="subtitle2" color="text.secondary">
                          Estimated Delivery
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <ScheduleIcon fontSize="small" sx={{ mr: 1 }} />
                          {formatDate(delivery.estimatedDelivery)}
                        </Typography>
                        
                        <Typography variant="subtitle2" color="text.secondary">
                          Order Date
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {formatDate(delivery.createdAt)}
                        </Typography>
                        
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          startIcon={<AddIcon />}
                          onClick={handleOpenUpdateDialog}
                          sx={{ mt: 2 }}
                        >
                          Update Status
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                
                <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3 }}>
                  Delivery Timeline
                </Typography>
                
                <Timeline position="alternate">
                  {delivery.events && delivery.events.map((event, index) => (
                    <TimelineItem key={index}>
                      <TimelineOppositeContent color="text.secondary">
                        {formatDate(event.timestamp)}
                      </TimelineOppositeContent>
                      
                      <TimelineSeparator>
                        <TimelineDot sx={{ bgcolor: getStatusColor(event.status) }}>
                          {event.status === 'Delivered' ? <CheckCircleIcon /> : <InfoIcon />}
                        </TimelineDot>
                        {index < delivery.events.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      
                      <TimelineContent>
                        <Paper elevation={3} sx={{ p: 2, bgcolor: alpha(getStatusColor(event.status), 0.1) }}>
                          <Typography variant="h6" component="h3">
                            {event.status}
                          </Typography>
                          <Typography>{event.description}</Typography>
                          {event.location && (
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                              {event.location}
                            </Typography>
                          )}
                        </Paper>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Box>
            )}
          </Paper>
        </Container>
        
        {/* Update Status Dialog */}
        <Dialog open={updateDialogOpen} onClose={handleCloseUpdateDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            Update Delivery Status
          </DialogTitle>
          
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={newEvent.status}
                onChange={handleNewEventChange}
                label="Status"
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Processing">Processing</MenuItem>
                <MenuItem value="In Transit">In Transit</MenuItem>
                <MenuItem value="Out for Delivery">Out for Delivery</MenuItem>
                <MenuItem value="Delivered">Delivered</MenuItem>
                <MenuItem value="Delayed">Delayed</MenuItem>
                <MenuItem value="Failed Attempt">Failed Attempt</MenuItem>
                <MenuItem value="Returned">Returned</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              margin="normal"
              label="Description"
              name="description"
              value={newEvent.description}
              onChange={handleNewEventChange}
              multiline
              rows={3}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Location"
              name="location"
              value={newEvent.location}
              onChange={handleNewEventChange}
            />
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleCloseUpdateDialog} color="inherit">
              Cancel
            </Button>
            <Button 
              onClick={handleAddEvent} 
              color="primary" 
              variant="contained" 
              startIcon={<SaveIcon />}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Notification Snackbar */}
        <Snackbar 
          open={notification.open} 
          autoHideDuration={6000} 
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity} 
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default TrackDelivery;