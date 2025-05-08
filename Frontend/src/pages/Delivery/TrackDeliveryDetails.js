import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Box, Paper, Typography, Button, CircularProgress, Card, CardContent,
  Grid, Chip, Alert, ThemeProvider, createTheme, alpha
} from '@mui/material';
import {
  Timeline, TimelineItem, TimelineSeparator, TimelineConnector, 
  TimelineContent, TimelineDot, TimelineOppositeContent
} from '@mui/lab';
import {
  LocalShipping, ArrowBack, LocationOn, CheckCircle, InfoOutlined, Schedule, Person
} from '@mui/icons-material';
import Header2 from '../../components/Header2';
import Navbar2 from '../../components/Navbar2';

const TrackDeliveryDetails = () => {
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
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const statusColors = {
    'Pending': '#f39c12', 'Processing': '#3498db', 'In Transit': '#2ecc71',
    'Out for Delivery': '#1abc9c', 'Delivered': '#27ae60', 'Cancelled': '#e74c3c',
    'Delayed': '#e67e22', 'Failed Attempt': '#95a5a6', 'Returned': '#9b59b6'
  };

  const getStatusColor = (status) => statusColors[status] || '#95a5a6';

  useEffect(() => {
    if (deliveryId) {
      fetchDelivery(deliveryId);
    }
  }, [deliveryId]);

  const fetchDelivery = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/deliveries/${id}`);
      if (response.data?._id) {
        setDelivery(response.data);
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
                <LocalShipping sx={{ mr: 1 }} /> Delivery Details
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<ArrowBack />} 
                onClick={() => navigate('/delivery/track')}
              >
                Back to Track Delivery
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
                        <Chip 
                          label={delivery.status} 
                          sx={{ bgcolor: getStatusColor(delivery.status), color: 'white', fontWeight: 'bold', mb: 1 }} 
                        />
                        <Typography variant="subtitle2" color="text.secondary">Estimated Delivery</Typography>
                        <Typography variant="body1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <Schedule fontSize="small" sx={{ mr: 1 }} />
                          {delivery.estimatedDelivery ? formatDate(delivery.estimatedDelivery) : 'Not specified'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3 }}>Delivery Timeline</Typography>
                <Timeline position="alternate">
                  {delivery.events?.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).map((event, index) => (
                    <TimelineItem key={index}>
                      <TimelineOppositeContent color="text.secondary">
                        {formatDate(event.timestamp)}
                      </TimelineOppositeContent>
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
                            <Typography 
                              variant="body2" 
                              color="text.secondary" 
                              sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
                            >
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
      </Box>
    </ThemeProvider>
  );
};

export default TrackDeliveryDetails;