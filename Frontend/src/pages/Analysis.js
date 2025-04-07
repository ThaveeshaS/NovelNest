import React, { useState, useEffect } from "react";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
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
  LineElement,
} from "chart.js";
import axios from "axios";
import { io } from "socket.io-client";
import Header2 from "../components/Header2";
import Navbar2 from "../components/Navbar2";
import { useNavigate } from "react-router-dom";

// Register ChartJS components (unchanged)
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
  // Existing state variables
  const [genderData, setGenderData] = useState(null);
  const [ageData, setAgeData] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);
  const [ratingData, setRatingData] = useState(null);
  const [feedbackSentimentData, setFeedbackSentimentData] = useState(null);
  const [feedbackTopicsData, setFeedbackTopicsData] = useState(null);
  // New state variables for product analytics
  const [priceData, setPriceData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [quantityData, setQuantityData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const newSocket = io(
      process.env.REACT_APP_API_URL || "http://localhost:5000"
    );
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleDataUpdate = (data) => {
      switch (data.type) {
        case "gender":
          setGenderData({
            labels: data.labels,
            datasets: [
              {
                label: "Gender Distribution",
                data: data.data,
                backgroundColor: [
                  "rgba(54, 162, 235, 0.7)",
                  "rgba(255, 99, 132, 0.7)",
                  "rgba(255, 206, 86, 0.7)",
                ],
                borderColor: [
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 99, 132, 1)",
                  "rgba(255, 206, 86, 1)",
                ],
                borderWidth: 1,
              },
            ],
          });
          break;
        case "age":
          setAgeData({
            labels: data.labels,
            datasets: [
              {
                label: "Age Distribution",
                data: data.data,
                backgroundColor: "rgba(9, 175, 87, 0.7)",
                borderColor: "rgba(9, 175, 87, 1)",
                borderWidth: 1,
              },
            ],
          });
          break;
        case "registration":
          setRegistrationData({
            labels: data.labels,
            datasets: [
              {
                label: "Registrations",
                data: data.data,
                backgroundColor: "rgba(153, 102, 255, 0.2)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 2,
                tension: 0.1,
                fill: true,
              },
            ],
          });
          break;
        case "ratings":
          setRatingData({
            labels: data.labels,
            datasets: [
              {
                label: "Customer Ratings",
                data: data.data,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.7)",
                  "rgba(255, 159, 64, 0.7)",
                  "rgba(255, 206, 86, 0.7)",
                  "rgba(75, 192, 192, 0.7)",
                  "rgba(54, 162, 235, 0.7)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(255, 159, 64, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(54, 162, 235, 1)",
                ],
                borderWidth: 1,
              },
            ],
          });
          break;
        case "feedback-sentiment":
          setFeedbackSentimentData({
            labels: data.labels,
            datasets: [
              {
                label: "Feedback Sentiment",
                data: data.data,
                backgroundColor: [
                  "rgba(75, 192, 192, 0.7)",
                  "rgba(255, 99, 132, 0.7)",
                  "rgba(255, 206, 86, 0.7)",
                ],
                borderColor: [
                  "rgba(75, 192, 192, 1)",
                  "rgba(255, 99, 132, 1)",
                  "rgba(255, 206, 86, 1)",
                ],
                borderWidth: 1,
              },
            ],
          });
          break;
        case "feedback-topics":
          setFeedbackTopicsData({
            labels: data.labels,
            datasets: [
              {
                label: "Feedback Topics",
                data: data.data,
                backgroundColor: [
                  "rgba(153, 102, 255, 0.7)",
                  "rgba(54, 162, 235, 0.7)",
                  "rgba(255, 159, 64, 0.7)",
                  "rgba(75, 192, 192, 0.7)",
                  "rgba(255, 99, 132, 0.7)",
                ],
                borderColor: [
                  "rgba(153, 102, 255, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 159, 64, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(255, 99, 132, 1)",
                ],
                borderWidth: 1,
              },
            ],
          });
          break;
        // New cases for product analytics
        case "price":
          setPriceData({
            labels: data.labels,
            datasets: [
              {
                label: "Price Distribution",
                data: data.data,
                backgroundColor: "rgba(255, 159, 64, 0.7)",
                borderColor: "rgba(255, 159, 64, 1)",
                borderWidth: 1,
              },
            ],
          });
          break;
        case "category":
          setCategoryData({
            labels: data.labels,
            datasets: [
              {
                label: "Category Popularity",
                data: data.data,
                backgroundColor: [
                  "rgba(54, 162, 235, 0.7)",
                  "rgba(255, 99, 132, 0.7)",
                  "rgba(255, 206, 86, 0.7)",
                ],
                borderColor: [
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 99, 132, 1)",
                  "rgba(255, 206, 86, 1)",
                ],
                borderWidth: 1,
              },
            ],
          });
          break;
        case "quantity":
          setQuantityData({
            labels: data.labels,
            datasets: [
              {
                label: "Available Quantity",
                data: data.data,
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2,
                tension: 0.1,
                fill: true,
              },
            ],
          });
          break;
        default:
          break;
      }
    };

    socket.on("dataUpdate", handleDataUpdate);

    const fetchData = async () => {
      try {
        const [
          genderRes,
          ageRes,
          registrationRes,
          ratingRes,
          sentimentRes,
          topicsRes,
          priceRes, // New
          categoryRes, // New
          quantityRes, // New
        ] = await Promise.all([
          axios.get("/api/analysis/gender-distribution"),
          axios.get("/api/analysis/age-distribution"),
          axios.get("/api/analysis/registration-timeline"),
          axios.get("/api/feedback/ratings"),
          axios.get("/api/feedback/sentiment"),
          axios.get("/api/feedback/topics"),
          axios.get("/api/analysis/price-distribution"), // New
          axios.get("/api/analysis/category-popularity"), // New
          axios.get("/api/analysis/quantity-availability"), // New
        ]);

        // Existing data setup (unchanged)
        setGenderData({
          labels: genderRes.data.labels,
          datasets: [
            {
              label: "Gender Distribution",
              data: genderRes.data.datasets[0].data,
              backgroundColor: [
                "rgba(54, 162, 235, 0.7)",
                "rgba(255, 99, 132, 0.7)",
                "rgba(255, 206, 86, 0.7)",
              ],
              borderColor: [
                "rgba(54, 162, 235, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 206, 86, 1)",
              ],
              borderWidth: 1,
            },
          ],
        });

        setAgeData({
          labels: ageRes.data.labels,
          datasets: [
            {
              label: "Age Distribution",
              data: ageRes.data.datasets[0].data,
              backgroundColor: "rgba(9, 175, 87, 0.7)",
              borderColor: "rgba(9, 175, 87, 1)",
              borderWidth: 1,
            },
          ],
        });

        setRegistrationData({
          labels: registrationRes.data.labels,
          datasets: [
            {
              label: "Registrations",
              data: registrationRes.data.datasets[0].data,
              backgroundColor: "rgba(153, 102, 255, 0.2)",
              borderColor: "rgba(153, 102, 255, 1)",
              borderWidth: 2,
              tension: 0.1,
              fill: true,
            },
          ],
        });

        setRatingData({
          labels: ratingRes.data.labels,
          datasets: [
            {
              label: "Customer Ratings",
              data: ratingRes.data.datasets[0].data,
              backgroundColor: [
                "rgba(255, 99, 132, 0.7)",
                "rgba(255, 159, 64, 0.7)",
                "rgba(255, 206, 86, 0.7)",
                "rgba(75, 192, 192, 0.7)",
                "rgba(54, 162, 235, 0.7)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(54, 162, 235, 1)",
              ],
              borderWidth: 1,
            },
          ],
        });

        setFeedbackSentimentData({
          labels: sentimentRes.data.labels,
          datasets: [
            {
              label: "Feedback Sentiment",
              data: sentimentRes.data.datasets[0].data,
              backgroundColor: [
                "rgba(75, 192, 192, 0.7)",
                "rgba(255, 99, 132, 0.7)",
                "rgba(255, 206, 86, 0.7)",
              ],
              borderColor: [
                "rgba(75, 192, 192, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 206, 86, 1)",
              ],
              borderWidth: 1,
            },
          ],
        });

        setFeedbackTopicsData({
          labels: topicsRes.data.labels,
          datasets: [
            {
              label: "Feedback Topics",
              data: topicsRes.data.datasets[0].data,
              backgroundColor: [
                "rgba(9, 175, 87, 0.7)",
                "rgba(9, 175, 87, 0.7)",
                "rgba(9, 175, 87, 0.7)",
                "rgba(9, 175, 87, 0.7)",
                "rgba(9, 175, 87, 0.7)",
              ],
              borderColor: [
                "rgba(9, 175, 87, 1)",
                "rgba(9, 175, 87, 1)",
                "rgba(9, 175, 87, 1)",
                "rgba(9, 175, 87, 1)",
                "rgba(9, 175, 87, 1)",
              ],
              borderWidth: 1,
            },
          ],
        });

        // New product data setup
        setPriceData({
          labels: priceRes.data.labels,
          datasets: [
            {
              label: "Price Distribution",
              data: priceRes.data.datasets[0].data,
              backgroundColor: "rgba(255, 159, 64, 0.7)",
              borderColor: "rgba(255, 159, 64, 1)",
              borderWidth: 1,
            },
          ],
        });

        setCategoryData({
          labels: categoryRes.data.labels,
          datasets: [
            {
              label: "Category Popularity",
              data: categoryRes.data.datasets[0].data,
              backgroundColor: [
                "rgba(54, 162, 235, 0.7)",
                "rgba(255, 99, 132, 0.7)",
                "rgba(255, 206, 86, 0.7)",
              ],
              borderColor: [
                "rgba(54, 162, 235, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 206, 86, 1)",
              ],
              borderWidth: 1,
            },
          ],
        });

        setQuantityData({
          labels: quantityRes.data.labels,
          datasets: [
            {
              label: "Available Quantity",
              data: quantityRes.data.datasets[0].data,
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 2,
              tension: 0.1,
              fill: true,
            },
          ],
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setLoading(false);
      }
    };

    fetchData();
    return () => socket.off("dataUpdate", handleDataUpdate);
  }, [socket]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
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
            <h1 className="display-4 fw-bold text-primary mb-2">
              Novel Nest Book Store Analytics Dashboard
            </h1>
            <p className="text-muted lead">Real-time data visualization</p>
          </div>
        </div>

        {/* Customer Analytics Section (unchanged) */}
        <div className="row mb-4">
          <div className="col-12">
            <h3 className="display-5 fw-bold text-primary mb-0">
              Customer Analytics
            </h3>
          </div>
        </div>

        <div className="row g-4 mb-5">
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
                          position: "bottom",
                          labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: "circle",
                          },
                        },
                        tooltip: {
                          backgroundColor: "rgba(0,0,0,0.8)",
                          titleFont: { size: 14 },
                          bodyFont: { size: 12 },
                          padding: 10,
                          usePointStyle: true,
                        },
                      },
                    }}
                    height={300}
                  />
                )}
              </div>
            </div>
          </div>

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
                          grid: { color: "rgba(0,0,0,0.05)" },
                        },
                        x: { grid: { display: false } },
                      },
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: "rgba(0,0,0,0.8)",
                          titleFont: { size: 14 },
                          bodyFont: { size: 12 },
                          padding: 10,
                        },
                      },
                    }}
                    height={300}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Analytics Section (unchanged) */}
        <div className="row mb-4">
          <div className="col-12">
            <h3 className="display-5 fw-bold text-primary mb-0">
              Feedback Analytics
            </h3>
          </div>
        </div>

        <div className="row g-4 mb-5">
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
                          position: "bottom",
                          labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: "circle",
                          },
                        },
                        tooltip: {
                          backgroundColor: "rgba(0,0,0,0.8)",
                          titleFont: { size: 14 },
                          bodyFont: { size: 12 },
                          padding: 10,
                          usePointStyle: true,
                        },
                      },
                    }}
                    height={300}
                  />
                )}
              </div>
            </div>
          </div>

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
                          position: "bottom",
                          labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: "circle",
                          },
                        },
                        tooltip: {
                          backgroundColor: "rgba(0,0,0,0.8)",
                          titleFont: { size: 14 },
                          bodyFont: { size: 12 },
                          padding: 10,
                          usePointStyle: true,
                        },
                      },
                    }}
                    height={300}
                  />
                )}
              </div>
            </div>
          </div>

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
                          grid: { color: "rgba(0,0,0,0.05)" },
                        },
                        x: { grid: { display: false } },
                      },
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: "rgba(0,0,0,0.8)",
                          titleFont: { size: 14 },
                          bodyFont: { size: 12 },
                          padding: 10,
                        },
                      },
                    }}
                    height={300}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* New Product Analytics Section */}
        <div className="row mb-4">
          <div className="col-12">
            <h3 className="display-5 fw-bold text-primary mb-0">
              Product Analytics
            </h3>
          </div>
        </div>

        <div className="row g-4 mb-5">
          {/* Price Distribution */}
          <div className="col-lg-4 col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-white border-bottom-0">
                <h4 className="card-title mb-0 text-primary">
                  <i className="bi bi-currency-dollar me-2"></i>
                  Price Distribution
                </h4>
              </div>
              <div className="card-body">
                {priceData && (
                  <Bar
                    data={priceData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: { color: "rgba(0,0,0,0.05)" },
                        },
                        x: { grid: { display: false } },
                      },
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: "rgba(0,0,0,0.8)",
                          titleFont: { size: 14 },
                          bodyFont: { size: 12 },
                          padding: 10,
                        },
                      },
                    }}
                    height={300}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Category Popularity */}
          <div className="col-lg-4 col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-white border-bottom-0">
                <h4 className="card-title mb-0 text-primary">
                  <i className="bi bi-book-fill me-2"></i>
                  Category Popularity
                </h4>
              </div>
              <div className="card-body d-flex align-items-center justify-content-center">
                {categoryData && (
                  <Pie
                    data={categoryData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: "circle",
                          },
                        },
                        tooltip: {
                          backgroundColor: "rgba(0,0,0,0.8)",
                          titleFont: { size: 14 },
                          bodyFont: { size: 12 },
                          padding: 10,
                          usePointStyle: true,
                        },
                      },
                    }}
                    height={300}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Quantity Availability */}
          <div className="col-lg-4 col-md-12">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-white border-bottom-0">
                <h4 className="card-title mb-0 text-primary">
                  <i className="bi bi-box-seam me-2"></i>
                  Quantity Availability
                </h4>
              </div>
              <div className="card-body">
                {quantityData && (
                  <Line
                    data={quantityData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: { color: "rgba(0,0,0,0.05)" },
                        },
                        x: { grid: { display: false } },
                      },
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: { padding: 20, usePointStyle: true },
                        },
                        tooltip: {
                          backgroundColor: "rgba(0,0,0,0.8)",
                          titleFont: { size: 14 },
                          bodyFont: { size: 12 },
                          padding: 10,
                        },
                      },
                    }}
                    height={300}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

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
