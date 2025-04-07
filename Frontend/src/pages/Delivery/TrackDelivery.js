import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Box, Paper, Typography, TextField, Button, Divider,
  ThemeProvider, createTheme, alpha, CircularProgress, Card, CardContent,
  Grid, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Snackbar, Alert
} from '@mui/material';
import {
  Timeline, TimelineItem, TimelineSeparator, TimelineConnector, 
  TimelineContent, TimelineDot, TimelineOppositeContent
} from '@mui/lab';
import {
  LocalShipping, SearchOutlined, ArrowBack, Add, 
  LocationOn, CheckCircle, InfoOutlined, Schedule, Save, Person, Map
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
    }
  });
  
  const { deliveryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const deliveryIdFromState = location.state?.deliveryId;
  
  const [searchId, setSearchId] = useState(deliveryId || deliveryIdFromState || '');
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
  const [showMap, setShowMap] = useState(false);
  
  const statusColors = {
    'Pending': '#f39c12', 'Processing': '#3498db', 'In Transit': '#2ecc71',
    'Out for Delivery': '#1abc9c', 'Delivered': '#27ae60', 'Cancelled': '#e74c3c',
    'Delayed': '#e67e22', 'Failed Attempt': '#95a5a6', 'Returned': '#9b59b6'
  };
  
  const getStatusColor = (status) => statusColors[status] || '#95a5a6';
  const handleCloseNotification = () => setNotification({...notification, open: false});
  
  useEffect(() => {
    const idToFetch = deliveryId || deliveryIdFromState;
    if (idToFetch) {
      setSearchId(idToFetch);
      fetchDelivery(idToFetch);
    }
  }, [deliveryId, deliveryIdFromState]);
  
  const fetchDelivery = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/deliveries/${id}`);
      if (response.data?._id) {
        setDelivery(response.data);
        if (deliveryIdFromState && !deliveryId) {
          navigate(`/delivery/track/${id}`, { replace: true });
        }
      } else {
        setError('Delivery not found. Please check the ID and try again.');
      }
    } catch (err) {
      console.error('Error fetching delivery:', err);
      let errorMessage = 'Error fetching delivery information';
      if (err.response) {
        errorMessage = err.response.status === 404 
          ? 'Delivery not found. Please check the ID and try again.'
          : err.response.data.message || errorMessage;
      }
      setError(errorMessage);
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
  
  const handleAddEvent = async () => {
    if (!newEvent.status || !newEvent.description || !newEvent.location) {
      setNotification({
        open: true,
        message: 'Status, description and location are required',
        severity: 'error'
      });
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/deliveries/${delivery._id}/events`,
        newEvent
      );
      setDelivery(response.data);
      setUpdateDialogOpen(false);
      setNotification({
        open: true,
        message: 'Delivery status updated successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error updating delivery:', err);
      setNotification({
        open: true,
        message: err.response?.data?.message || 'Failed to update delivery status',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };
  
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Header2 />
        <Navbar2 />
        
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 0 }}>
                <LocalShipping sx={{ mr: 1 }} /> Track Delivery
              </Typography>
              <Button variant="outlined" color="primary" startIcon={<ArrowBack />} onClick={() => navigate('/admin/AddDelivery')}>
                Back to Add Delivery
              </Button>
            </Box>
            
            <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TextField
                fullWidth label="Delivery ID" variant="outlined" value={searchId}
                onChange={(e) => setSearchId(e.target.value)} placeholder="Enter delivery tracking number"
                sx={{ mr: 2, mb: 0 }}
              />
              <Button type="submit" variant="contained" color="primary" startIcon={<SearchOutlined />} disabled={loading}>
                Track
              </Button>
            </Box>
            
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}
            
            {delivery && !loading && (
              <Box sx={{ mt: 4 }}>
                <Card sx={{ mb: 4 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Delivery ID</Typography>
                        <Typography variant="body1" gutterBottom>{delivery._id}</Typography>
                        <Typography variant="subtitle2" color="text.secondary">Customer</Typography>
                        <Typography variant="body1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <Person fontSize="small" sx={{ mr: 1 }} /> {delivery.customerName}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">Delivery Address</Typography>
                        <Typography variant="body1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOn fontSize="small" sx={{ mr: 1 }} /> {delivery.deliveryAddress}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Current Status</Typography>
                        <Chip label={delivery.status} sx={{ bgcolor: getStatusColor(delivery.status), color: 'white', fontWeight: 'bold', mb: 1 }} />
                        <Typography variant="subtitle2" color="text.secondary">Estimated Delivery</Typography>
                        <Typography variant="body1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <Schedule fontSize="small" sx={{ mr: 1 }} />
                          {delivery.estimatedDelivery ? formatDate(delivery.estimatedDelivery) : 'Not specified'}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                          <Button variant="outlined" color="primary" startIcon={<Add />} onClick={() => setUpdateDialogOpen(true)}>
                            Update Status
                          </Button>
                          <Button variant="outlined" color="secondary" startIcon={<Map />} onClick={() => setShowMap(!showMap)}>
                            {showMap ? 'Hide Map' : 'Show Map'}
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Timeline Section */}
                <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3 }}>Delivery Timeline</Typography>
                <Timeline position="alternate">
                  {delivery.events?.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).map((event, index) => (
                    <TimelineItem key={index}>
                      <TimelineOppositeContent color="text.secondary">{formatDate(event.timestamp)}</TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot sx={{ bgcolor: getStatusColor(event.status) }}>
                          {event.status === 'Delivered' ? <CheckCircle /> : <InfoOutlined />}
                        </TimelineDot>
                        {index < delivery.events.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Paper elevation={3} sx={{ p: 2, bgcolor: alpha(getStatusColor(event.status), 0.1) }}>
                          <Typography variant="h6" component="h3">{event.status}</Typography>
                          <Typography>{event.description}</Typography>
                          {event.location && (
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <LocationOn fontSize="small" sx={{ mr: 0.5 }} /> {event.location}
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
        
        {/* Update Dialog */}
        <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Update Delivery Status</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label" name="status" value={newEvent.status}
                onChange={(e) => setNewEvent({...newEvent, status: e.target.value})}
                label="Status"
              >
                {Object.keys(statusColors).map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth margin="normal" label="Description" name="description" value={newEvent.description}
              onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} multiline rows={3} required
            />
            <TextField
              fullWidth margin="normal" label="Location" name="location" value={newEvent.location}
              onChange={(e) => setNewEvent({...newEvent, location: e.target.value})} required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUpdateDialogOpen(false)} color="inherit">Cancel</Button>
            <Button onClick={handleAddEvent} color="primary" variant="contained" startIcon={<Save />} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Notification */}
        <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
          <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default TrackDelivery;