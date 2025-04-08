import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import axios from 'axios';
import { io } from 'socket.io-client';
import Header2 from '../components/Header2'; 
import Navbar2 from '../components/Navbar2'; 
import { useNavigate } from 'react-router-dom';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const Analysis = () => {
  const [genderData, setGenderData] = useState(null);
  const [ageData, setAgeData] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);
  const [ratingData, setRatingData] = useState(null);
  const [feedbackSentimentData, setFeedbackSentimentData] = useState(null);
  const [feedbackTopicsData, setFeedbackTopicsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  // 👇 Added state for transaction data
  const [transactionAmountData, setTransactionAmountData] = useState(null);
  const [transactionTimelineData, setTransactionTimelineData] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    setSocket(newSocket);

    // Clean up on unmount
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Listen for data updates
    const handleDataUpdate = (data) => {
      switch (data.type) {
        case 'gender':
          setGenderData({
            labels: data.labels,
            datasets: [{
              label: 'Gender Distribution',
              data: data.data,
              backgroundColor: [
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 99, 132, 0.7)',
                'rgba(255, 206, 86, 0.7)',
              ],
              borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)',
              ],
              borderWidth: 1
            }]
          });
          break;
        case 'age':
          setAgeData({
            labels: data.labels,
            datasets: [{
              label: 'Age Distribution',
              data: data.data,
              backgroundColor: 'rgba(9, 175, 87, 0.7)',
              borderColor: 'rgba(9, 175, 87, 1)',
              borderWidth: 1
            }]
          });
          break;
        case 'registration':
          setRegistrationData({
            labels: data.labels,
            datasets: [{
              label: 'Registrations',
              data: data.data,
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 2,
              tension: 0.1,
              fill: true
            }]
          });
          break;
        case 'ratings':
          setRatingData({
            labels: data.labels,
            datasets: [{
              label: 'Customer Ratings',
              data: data.data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(255, 159, 64, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(54, 162, 235, 0.7)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)'
              ],
              borderWidth: 1
            }]
          });
          break;
        case 'feedback-sentiment':
          setFeedbackSentimentData({
            labels: data.labels,
            datasets: [{
              label: 'Feedback Sentiment',
              data: data.data,
              backgroundColor: [
                'rgba(75, 192, 192, 0.7)',
                'rgba(255, 99, 132, 0.7)',
                'rgba(255, 206, 86, 0.7)'
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(255, 206, 86, 1)'
              ],
              borderWidth: 1
            }]
          });
          break;
        case 'feedback-topics':
          setFeedbackTopicsData({
            labels: data.labels,
            datasets: [{
              label: 'Feedback Topics',
              data: data.data,
              backgroundColor: [
                'rgba(153, 102, 255, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 159, 64, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(255, 99, 132, 0.7)'
              ],
              borderColor: [
                'rgba(153, 102, 255, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)'
              ],
              borderWidth: 1
            }]
          });
          break;
        default:
          break;
      }
    };

    // 👇 Added handler for transaction updates
    const handleTransactionUpdate = (data) => {
      switch (data.type) {
        case 'amount':
          setTransactionAmountData({
            labels: data.labels,
            datasets: [{
              label: 'Transaction Amount Distribution',
              data: data.data,
              backgroundColor: 'rgba(255, 159, 64, 0.7)',
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1
            }]
          });
          break;
        case 'timeline':
          setTransactionTimelineData({
            labels: data.labels,
            datasets: [
              {
                label: 'Number of Transactions',
                data: data.countData,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                yAxisID: 'y'
              },
              {
                label: 'Total Amount',
                data: data.amountData,
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1,
                yAxisID: 'y1'
              }
            ]
          });
          break;
        default:
          break;
      }
    };

    socket.on('dataUpdate', handleDataUpdate);
    // 👇 Added socket listener for transaction updates
    socket.on('transactionUpdate', handleTransactionUpdate);

    // Initial data fetch
    const fetchData = async () => {
      try {
        const [
          genderRes, 
          ageRes, 
          registrationRes,
          ratingRes,
          sentimentRes,
          topicsRes,
          // 👇 Added transaction API calls
          transactionAmountRes,
          transactionTimelineRes
        ] = await Promise.all([
          axios.get('/api/analysis/gender-distribution'),
          axios.get('/api/analysis/age-distribution'),
          axios.get('/api/analysis/registration-timeline'),
          axios.get('/api/feedback/ratings'),
          axios.get('/api/feedback/sentiment'),
          axios.get('/api/feedback/topics'),
          // 👇 Added transaction endpoints
          axios.get('/api/transaction-analysis/amount-distribution'),
          axios.get('/api/transaction-analysis/timeline')
        ]);

        setGenderData({
          labels: genderRes.data.labels,
          datasets: [{
            label: 'Gender Distribution',
            data: genderRes.data.datasets[0].data,
            backgroundColor: [
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 99, 132, 0.7)',
              'rgba(255, 206, 86, 0.7)',
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1
          }]
        });

        setAgeData({
          labels: ageRes.data.labels,
          datasets: [{
            label: 'Age Distribution',
            data: ageRes.data.datasets[0].data,
            backgroundColor: 'rgba(9, 175, 87, 0.7)',
            borderColor: 'rgba(9, 175, 87, 1)',
            borderWidth: 1
          }]
        });

        setRegistrationData({
          labels: registrationRes.data.labels,
          datasets: [{
            label: 'Registrations',
            data: registrationRes.data.datasets[0].data,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 2,
            tension: 0.1,
            fill: true
          }]
        });

        setRatingData({
          labels: ratingRes.data.labels,
          datasets: [{
            label: 'Customer Ratings',
            data: ratingRes.data.datasets[0].data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(255, 159, 64, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(54, 162, 235, 0.7)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
          }]
        });

        setFeedbackSentimentData({
          labels: sentimentRes.data.labels,
          datasets: [{
            label: 'Feedback Sentiment',
            data: sentimentRes.data.datasets[0].data,
            backgroundColor: [
              'rgba(75, 192, 192, 0.7)',
              'rgba(255, 99, 132, 0.7)',
              'rgba(255, 206, 86, 0.7)'
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
          }]
        });

        setFeedbackTopicsData({
          labels: topicsRes.data.labels,
          datasets: [{
            label: 'Feedback Topics',
            data: topicsRes.data.datasets[0].data,
            backgroundColor: [
              'rgba(9, 175, 87, 0.7)',
              'rgba(9, 175, 87, 0.7)',
              'rgba(9, 175, 87, 0.7)',
              'rgba(9, 175, 87, 0.7)',
              'rgba(9, 175, 87, 0.7)'
            ],
            borderColor: [
              'rgba(9, 175, 87, 1)',
              'rgba(9, 175, 87, 1)',
              'rgba(9, 175, 87, 1)',
              'rgba(9, 175, 87, 1)',
              'rgba(9, 175, 87, 1)'
            ],
            borderWidth: 1
          }]
        });

        // 👇 Added transaction data setting
        setTransactionAmountData({
          labels: transactionAmountRes.data.labels,
          datasets: [{
            label: 'Transaction Amount Distribution',
            data: transactionAmountRes.data.datasets[0].data,
            backgroundColor: 'rgba(255, 159, 64, 0.7)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1
          }]
        });

        setTransactionTimelineData({
          labels: transactionTimelineRes.data.labels,
          datasets: [
            {
              label: 'Number of Transactions',
              data: transactionTimelineRes.data.datasets[0].data,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
              yAxisID: 'y'
            },
            {
              label: 'Total Amount',
              data: transactionTimelineRes.data.datasets[1].data,
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1,
              yAxisID: 'y1'
            }
          ]
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      socket.off('dataUpdate', handleDataUpdate);
      // 👇 Added cleanup for transaction updates
      socket.off('transactionUpdate', handleTransactionUpdate);
    };
  }, [socket]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <Header2 />
      <Navbar2 />
      
      <div className="container-fluid py-4">
        <div className="row mb-4 py-3">
          <div className="col-12 text-center">
            <h1 className="display-4 fw-bold text-primary mb-2">Novel Nest Book Store Analytics Dashboard</h1>
            <p className="text-muted lead">Real-time data visualization</p>
          </div>
        </div>
        
        {/* Customer Analytics Section */}
        <div className="row mb-4">
          <div className="col-12">
            <h3 className="display-5 fw-bold text-primary mb-0">Customer Analytics</h3>
          </div>
        </div>
        
        <div className="row g-4 mb-5">
          {/* Gender Distribution */}
          <div className="col-lg-4 col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-white border-bottom-0">
                <h4 className="card-title mb-0 text-primary">
                  <i className="bi bi-gender-male me-2"></i>
                  Gender Distribution
                </h4>
              </div>
              <div className="card-body d-flex align-items-center justify-content-center">
                {genderData && (
                  <Pie 
                    data={genderData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { 
                          position: 'bottom',
                          labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          titleFont: { size: 14 },
                          bodyFont: { size: 12 },
                          padding: 10,
                          usePointStyle: true
                        }
                      }
                    }} 
                    height={300}
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Age Distribution */}
          <div className="col-lg-4 col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-white border-bottom-0">
                <h4 className="card-title mb-0 text-primary">
                  <i className="bi bi-people-fill me-2"></i>
                  Age Distribution
                </h4>
              </div>
              <div className="card-body">
                {ageData && (
                  <Bar 
                    data={ageData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: { 
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(0,0,0,0.05)'
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          }
                        }
                      },
                      plugins: { 
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          titleFont: { size: 14 },
                          bodyFont: { size: 12 },
                          padding: 10
                        }
                      }
                    }} 
                    height={300}
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Registration Timeline */}
          <div className="col-lg-4 col-md-12">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-white border-bottom-0">
                <h4 className="card-title mb-0 text-primary">
                  <i className="bi bi-calendar-event me-2"></i>
                  Registration Timeline
                </h4>
              </div>
              <div className="card-body">
                {registrationData && (
                  <Line 
                    data={registrationData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: { 
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(0,0,0,0.05)'
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          }
                        }
                      },
                      plugins: { 
                        legend: { 
                          position: 'bottom',
                          labels: {
                            padding: 20,
                            usePointStyle: true
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          titleFont: { size: 14 },
                          bodyFont: { size: 12 },
                          padding: 10
                        }
                      }
                    }} 
                    height={300}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Feedback Analytics Section */}
        <div className="row mb-4">
          <div className="col-12">
            <h3 className="display-5 fw-bold text-primary mb-0">Feedback Analytics</h3>
          </div>
        </div>
        
        <div className="row g-4">
          {/* Customer Ratings */}
          <div className="col-lg-4 col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-white border-bottom-0">
                <h4 className="card-title mb-0 text-primary">
                  <i className="bi bi-star-fill me-2"></i>
                  Customer Ratings
                </h4>
              </div>
              <div className="card-body d-flex align-items-center justify-content-center">
                {ratingData && (
                  <Doughnut 
                    data={ratingData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { 
                          position: 'bottom',
                          labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          titleFont: { size: 14 },
                          bodyFont: { size: 12 },
                          padding: 10,
                          usePointStyle: true
                        }
                      }
                    }} 
                    height={300}
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Feedback Sentiment */}
          <div className="col-lg-4 col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-white border-bottom-0">
                <h4 className="card-title mb-0 text-primary">
                  <i className="bi bi-emoji-smile me-2"></i>
                  Feedback Sentiment
                </h4>
              </div>
              <div className="card-body">
                {feedbackSentimentData && (
                  <Pie 
                    data={feedbackSentimentData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { 
                          position: 'bottom',
                          labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          titleFont: { size: 14 },
                          bodyFont: { size: 12 },
                          padding: 10,
                          usePointStyle: true
                        }
                      }
                    }} 
                    height={300}
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Feedback Topics */}
          <div className="col-lg-4 col-md-12">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-white border-bottom-0">
                <h4 className="card-title mb-0 text-primary">
                  <i className="bi bi-tags-fill me-2"></i>
                  Feedback Topics
                </h4>
              </div>
              <div className="card-body">
                {feedbackTopicsData && (
                  <Bar 
                    data={feedbackTopicsData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: { 
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(0,0,0,0.05)'
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          }
                        }
                      },
                      plugins: { 
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          titleFont: { size: 14 },
                          bodyFont: { size: 12 },
                          padding: 10
                        }
                      }
                    }} 
                    height={300}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 👇 Added Transaction Analytics Section */}
        <div className="row mb-4">
          <div className="col-12">
            <h3 className="display-5 fw-bold text-primary mb-0">Transaction Analytics</h3>
          </div>
        </div>
        
        <div className="row g-4 mb-5">
          {/* Transaction Amount Distribution */}
          <div className="col-lg-6 col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-white border-bottom-0">
                <h4 className="card-title mb-0 text-primary">
                  <i className="bi bi-currency-dollar me-2"></i>
                  Transaction Amount Distribution
                </h4>
              </div>
              <div className="card-body">
                {transactionAmountData && (
                  <Bar 
                    data={transactionAmountData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: { 
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(0,0,0,0.05)'
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          }
                        }
                      },
                      plugins: { 
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          titleFont: { size: 14 },
                          bodyFont: { size: 12 },
                          padding: 10
                        }
                      }
                    }} 
                    height={300}
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Transaction Timeline */}
          <div className="col-lg-6 col-md-12">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-white border-bottom-0">
                <h4 className="card-title mb-0 text-primary">
                  <i className="bi bi-graph-up me-2"></i>
                  Transaction Timeline
                </h4>
              </div>
              <div className="card-body">
                {transactionTimelineData && (
                  <Line 
                    data={transactionTimelineData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: { 
                          position: 'left',
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(0,0,0,0.05)'
                          }
                        },
                        y1: { 
                          position: 'right',
                          beginAtZero: true,
                          grid: {
                            drawOnChartArea: false
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          }
                        }
                      },
                      plugins: { 
                        legend: { 
                          position: 'bottom',
                          labels: {
                            padding: 20,
                            usePointStyle: true
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          titleFont: { size: 14 },
                          bodyFont: { size: 12 },
                          padding: 10
                        }
                      }
                    }} 
                    height={300}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {/* 👆 End of Transaction Analytics Section */}

      </div>

      {/* Back to Dashboard Button */}
      <div className="d-flex justify-content-end mt-3 me-3 mb-3">
        <button 
          className="btn btn-primary" 
          onClick={() => navigate("/admindashboard")}
        >
          <i className="fas fa-arrow-left me-2"></i> Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Analysis;