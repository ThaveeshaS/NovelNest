/* eslint-disable no-unused-vars */
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
  LineElement,
  Filler,
} from "chart.js";
import axios from "axios";
import { io } from "socket.io-client";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Header2 from "../components/Header2";
import Navbar2 from "../components/Navbar2";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBook, FaUsers, FaComments, FaMoneyBillWave, FaExchangeAlt, FaTruck, FaArrowLeft, FaChartLine } from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";
import { BsGraphUp, BsGenderMale, BsPersonBoundingBox, BsStarFill, BsEmojiSmile, BsTagsFill } from "react-icons/bs";
import logo from "../components/images/logo.jpg"; // Import the logo

// Register ChartJS components with additional plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler
);

// Animation variants
const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Initial empty chart data structure
const emptyChartData = {
  labels: [],
  datasets: [{
    data: [],
    backgroundColor: [],
    borderColor: [],
    borderWidth: 1
  }]
};

// Common chart options for pie charts to ensure consistency
const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        padding: 20,
        usePointStyle: true,
        pointStyle: "circle",
        font: {
          family: "'Poppins', sans-serif",
          size: 12,
          weight: "bold"
        }
      },
    },
    tooltip: {
      backgroundColor: "rgba(0,0,0,0.9)",
      titleFont: { 
        family: "'Poppins', sans-serif",
        size: 14,
        weight: "bold"
      },
      bodyFont: { 
        family: "'Poppins', sans-serif",
        size: 12 
      },
      padding: 12,
      usePointStyle: true,
      cornerRadius: 8,
      displayColors: true,
      boxPadding: 6,
    },
  },
  animation: {
    animateScale: true,
    animateRotate: true
  }
};

const Analysis = () => {
  // State variables with proper initial values
  const [genderData, setGenderData] = useState(emptyChartData);
  const [ageData, setAgeData] = useState(emptyChartData);
  const [registrationData, setRegistrationData] = useState(emptyChartData);
  const [ratingData, setRatingData] = useState(emptyChartData);
  const [feedbackSentimentData, setFeedbackSentimentData] = useState(emptyChartData);
  const [feedbackTopicsData, setFeedbackTopicsData] = useState(emptyChartData);
  const [priceData, setPriceData] = useState(emptyChartData);
  const [categoryData, setCategoryData] = useState(emptyChartData);
  const [quantityData, setQuantityData] = useState(emptyChartData);
  const [transactionAmountData, setTransactionAmountData] = useState(emptyChartData);
  const [transactionTimelineData, setTransactionTimelineData] = useState({
    labels: [],
    datasets: [{
      label: "Number of Transactions",
      data: [],
      borderColor: "rgb(75, 192, 192)",
      backgroundColor: "rgba(75, 192, 192, 0.1)",
      borderWidth: 3,
      yAxisID: "y",
    }, {
      label: "Total Amount ($)",
      data: [],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.1)",
      borderWidth: 3,
      yAxisID: "y1",
    }]
  });
  const [deliveryStatusData, setDeliveryStatusData] = useState(emptyChartData);
  const [deliveryFeeData, setDeliveryFeeData] = useState({
    labels: [],
    datasets: [{
      label: "Total Delivery Fee ($)",
      data: [],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.1)",
      borderWidth: 3,
      yAxisID: "y",
    }, {
      label: "Number of Deliveries",
      data: [],
      borderColor: "rgb(75, 192, 192)",
      backgroundColor: "rgba(75, 192, 192, 0.1)",
      borderWidth: 3,
      yAxisID: "y1",
    }]
  });
  const [activeTab, setActiveTab] = useState("all");
  const [timeRange, setTimeRange] = useState("monthly");
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
      try {
        switch (data.type) {
          case "gender":
            setGenderData(prev => ({
              ...prev,
              datasets: [{
                ...prev.datasets[0],
                data: data.data || []
              }]
            }));
            break;
          case "age":
            setAgeData(prev => ({
              ...prev,
              datasets: [{
                ...prev.datasets[0],
                data: data.data || []
              }]
            }));
            break;
          case "registration":
            setRegistrationData(prev => ({
              ...prev,
              datasets: [{
                ...prev.datasets[0],
                data: data.data || []
              }]
            }));
            break;
          case "rating":
            setRatingData(prev => ({
              ...prev,
              datasets: [{
                ...prev.datasets[0],
                data: data.data || []
              }]
            }));
            break;
          case "sentiment":
            setFeedbackSentimentData(prev => ({
              ...prev,
              datasets: [{
                ...prev.datasets[0],
                data: data.data || []
              }]
            }));
            break;
          case "topics":
            setFeedbackTopicsData(prev => ({
              ...prev,
              datasets: [{
                ...prev.datasets[0],
                data: data.data || []
              }]
            }));
            break;
          case "price":
            setPriceData(prev => ({
              ...prev,
              datasets: [{
                ...prev.datasets[0],
                data: data.data || []
              }]
            }));
            break;
          case "category":
            setCategoryData(prev => ({
              ...prev,
              datasets: [{
                ...prev.datasets[0],
                data: data.data || []
              }]
            }));
            break;
          case "quantity":
            setQuantityData(prev => ({
              ...prev,
              datasets: [{
                ...prev.datasets[0],
                data: data.data || []
              }]
            }));
            break;
          case "transactionAmount":
            setTransactionAmountData(prev => ({
              ...prev,
              datasets: [{
                ...prev.datasets[0],
                data: data.data || []
              }]
            }));
            break;
          case "transactionTimeline":
            setTransactionTimelineData(prev => ({
              ...prev,
              labels: data.labels || [],
              datasets: [{
                ...prev.datasets[0],
                data: data.transactionCounts || []
              }, {
                ...prev.datasets[1],
                data: data.transactionAmounts || []
              }]
            }));
            break;
          case "deliveryStatus":
            setDeliveryStatusData(prev => ({
              ...prev,
              datasets: [{
                ...prev.datasets[0],
                data: data.data || []
              }]
            }));
            break;
          case "deliveryFee":
            setDeliveryFeeData(prev => ({
              ...prev,
              labels: data.labels || [],
              datasets: [{
                ...prev.datasets[0],
                data: data.fees || []
              }, {
                ...prev.datasets[1],
                data: data.counts || []
              }]
            }));
            break;
          default:
            break;
        }
      } catch (err) {
        console.error("Error handling data update:", err);
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
          priceRes,
          categoryRes,
          quantityRes,
          transactionAmountRes,
          transactionTimelineRes,
          deliveryStatusRes,
          deliveryFeeRes,
        ] = await Promise.all([
          axios.get("/api/analysis/gender-distribution"),
          axios.get("/api/analysis/age-distribution"),
          axios.get("/api/analysis/registration-timeline"),
          axios.get("/api/feedback/ratings"),
          axios.get("/api/feedback/sentiment"),
          axios.get("/api/feedback/topics"),
          axios.get("/api/analysis/price-distribution"),
          axios.get("/api/analysis/category-popularity"),
          axios.get("/api/analysis/quantity-availability"),
          axios.get("/api/transaction-analysis/amount-distribution"),
          axios.get("/api/transaction-analysis/timeline"),
          axios.get("/api/analysis/delivery-status"),
          axios.get("/api/analysis/delivery-fee-timeline"),
        ]);

        // Set all data with enhanced visual styles
        setGenderData({
          labels: genderRes.data?.labels || [],
          datasets: [
            {
              label: "Gender Distribution",
              data: genderRes.data?.datasets?.[0]?.data || [],
              backgroundColor: [
                "rgba(54, 162, 235, 0.8)",
                "rgba(255, 99, 132, 0.8)",
                "rgba(255, 206, 86, 0.8)",
              ],
              borderColor: [
                "rgba(54, 162, 235, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 206, 86, 1)",
              ],
              borderWidth: 2,
              hoverOffset: 20,
            },
          ],
        });

        setAgeData({
          labels: ageRes.data?.labels || [],
          datasets: [
            {
              label: "Age Distribution",
              data: ageRes.data?.datasets?.[0]?.data || [],
              backgroundColor: "rgba(9, 175, 87, 0.7)",
              borderColor: "rgba(9, 175, 87, 1)",
              borderWidth: 2,
              borderRadius: 6,
              borderSkipped: false,
            },
          ],
        });

        setRegistrationData({
          labels: registrationRes.data?.labels || [],
          datasets: [
            {
              label: "Registrations",
              data: registrationRes.data?.datasets?.[0]?.data || [],
              backgroundColor: (context) => {
                const bg = [];
                const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, "rgba(153, 102, 255, 0.5)");
                gradient.addColorStop(1, "rgba(153, 102, 255, 0.1)");
                return gradient;
              },
              borderColor: "rgba(153, 102, 255, 1)",
              borderWidth: 3,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "rgba(153, 102, 255, 1)",
              pointRadius: 5,
              pointHoverRadius: 8,
            },
          ],
        });

        setRatingData({
          labels: ratingRes.data?.labels || [],
          datasets: [
            {
              label: "Customer Ratings",
              data: ratingRes.data?.datasets?.[0]?.data || [],
              backgroundColor: [
                "rgba(255, 99, 132, 0.8)",
                "rgba(255, 159, 64, 0.8)",
                "rgba(255, 206, 86, 0.8)",
                "rgba(75, 192, 192, 0.8)",
                "rgba(54, 162, 235, 0.8)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(54, 162, 235, 1)",
              ],
              borderWidth: 2,
              cutout: "70%",
              radius: "90%",
            },
          ],
        });

        setFeedbackSentimentData({
          labels: sentimentRes.data?.labels || ["Positive", "Neutral", "Negative"],
          datasets: [
            {
              label: "Feedback Sentiment",
              data: sentimentRes.data?.datasets?.[0]?.data || [],
              backgroundColor: [
                "rgba(75, 192, 192, 0.8)", // Teal for Positive
                "rgba(255, 182, 193, 0.8)", // Pink for Neutral
                "rgba(255, 206, 86, 0.8)", // Yellow for Negative
              ],
              borderColor: [
                "rgba(75, 192, 192, 1)",
                "rgba(255, 182, 193, 1)",
                "rgba(255, 206, 86, 1)",
              ],
              borderWidth: 2,
              hoverOffset: 20,
            },
          ],
        });

        setFeedbackTopicsData({
          labels: topicsRes.data?.labels || [],
          datasets: [
            {
              label: "Feedback Topics",
              data: topicsRes.data?.datasets?.[0]?.data || [],
              backgroundColor: [
                "rgba(153, 102, 255, 0.8)",
                "rgba(54, 162, 235, 0.8)",
                "rgba(255, 159, 64, 0.8)",
                "rgba(75, 192, 192, 0.8)",
                "rgba(255, 99, 132, 0.8)",
              ],
              borderColor: [
                "rgba(153, 102, 255, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(255, 99, 132, 1)",
              ],
              borderWidth: 2,
              borderRadius: 6,
            },
          ],
        });

        setPriceData({
          labels: priceRes.data?.labels || [],
          datasets: [
            {
              label: "Price Distribution",
              data: priceRes.data?.datasets?.[0]?.data || [],
              backgroundColor: (context) => {
                const bg = [];
                for (let i = 0; i < context.chart.data.labels.length; i++) {
                  const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 300);
                  gradient.addColorStop(0, "rgba(255, 159, 64, 0.8)");
                  gradient.addColorStop(1, "rgba(255, 159, 64, 0.2)");
                  bg.push(gradient);
                }
                return bg;
              },
              borderColor: "rgba(255, 159, 64, 1)",
              borderWidth: 2,
              borderRadius: 6,
            },
          ],
        });

        setCategoryData({
          labels: categoryRes.data?.labels || [],
          datasets: [
            {
              label: "Category Popularity",
              data: categoryRes.data?.datasets?.[0]?.data || [],
              backgroundColor: [
                "rgba(54, 162, 235, 0.8)",
                "rgba(255, 99, 132, 0.8)",
                "rgba(255, 206, 86, 0.8)",
                "rgba(75, 192, 192, 0.8)",
                "rgba(153, 102, 255, 0.8)",
              ],
              borderColor: [
                "rgba(54, 162, 235, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
              ],
              borderWidth: 2,
              hoverOffset: 20,
            },
          ],
        });

        setQuantityData({
          labels: quantityRes.data?.labels || [],
          datasets: [
            {
              label: "Available Quantity",
              data: quantityRes.data?.datasets?.[0]?.data || [],
              backgroundColor: (context) => {
                const bg = [];
                const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, "rgba(54, 162, 235, 0.5)");
                gradient.addColorStop(1, "rgba(54, 162, 235, 0.1)");
                return gradient;
              },
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 3,
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "rgba(54, 162, 235, 1)",
              pointRadius: 5,
              pointHoverRadius: 8,
            },
          ],
        });

        setTransactionAmountData({
          labels: transactionAmountRes.data?.labels || [],
          datasets: [
            {
              label: "Transaction Amount Distribution",
              data: transactionAmountRes.data?.datasets?.[0]?.data || [],
              backgroundColor: (context) => {
                const bg = [];
                for (let i = 0; i < context.chart.data.labels.length; i++) {
                  const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 300);
                  gradient.addColorStop(0, "rgba(255, 99, 132, 0.8)");
                  gradient.addColorStop(1, "rgba(255, 99, 132, 0.2)");
                  bg.push(gradient);
                }
                return bg;
              },
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 2,
              borderRadius: 6,
            },
          ],
        });

        setTransactionTimelineData({
          labels: transactionTimelineRes.data?.labels || [],
          datasets: [
            {
              label: "Number of Transactions",
              data: transactionTimelineRes.data?.datasets?.[0]?.data || [],
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.1)",
              borderWidth: 3,
              tension: 0.4,
              yAxisID: "y",
              fill: true,
              pointBackgroundColor: "rgb(75, 192, 192)",
              pointRadius: 5,
              pointHoverRadius: 8,
            },
            {
              label: "Total Amount ($)",
              data: transactionTimelineRes.data?.datasets?.[1]?.data || [],
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.1)",
              borderWidth: 3,
              tension: 0.4,
              yAxisID: "y1",
              fill: true,
              pointBackgroundColor: "rgb(255, 99, 132)",
              pointRadius: 5,
              pointHoverRadius: 8,
            },
          ],
        });

        setDeliveryStatusData({
          labels: deliveryStatusRes.data?.labels || [],
          datasets: [
            {
              label: "Delivery Status",
              data: deliveryStatusRes.data?.datasets?.[0]?.data || [],
              backgroundColor: [
                "rgba(255, 99, 132, 0.8)", // Delayed
                "rgba(255, 206, 86, 0.8)", // Soon
                "rgba(75, 192, 192, 0.8)", // On Track
                "rgba(54, 162, 235, 0.8)", // Completed
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(54, 162, 235, 1)",
              ],
              borderWidth: 2,
              hoverOffset: 20,
            },
          ],
        });

        setDeliveryFeeData({
          labels: deliveryFeeRes.data?.labels || [],
          datasets: [
            {
              label: "Total Delivery Fee ($)",
              data: deliveryFeeRes.data?.datasets?.[0]?.data || [],
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.1)",
              borderWidth: 3,
              tension: 0.4,
              yAxisID: "y",
              fill: true,
              pointBackgroundColor: "rgb(255, 99, 132)",
              pointRadius: 5,
              pointHoverRadius: 8,
            },
            {
              label: "Number of Deliveries",
              data: deliveryFeeRes.data?.datasets?.[1]?.data || [],
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.1)",
              borderWidth: 3,
              tension: 0.4,
              yAxisID: "y1",
              fill: true,
              pointBackgroundColor: "rgb(75, 192, 192)",
              pointRadius: 5,
              pointHoverRadius: 8,
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
    return () => {
      socket.off("dataUpdate", handleDataUpdate);
    };
  }, [socket, timeRange]);

  const generateReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;

    // Set background color
    doc.setFillColor(255, 252, 255); // Light background
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Add borders to the entire page
    doc.setDrawColor(0, 71, 171); // Company blue color
    doc.setLineWidth(1);
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

    // Add decorative header bar
    doc.setFillColor(0, 71, 171);
    doc.rect(margin, margin, pageWidth - 2 * margin, 12, "F");

    // Add company logo
    if (logo) {
      doc.addImage(logo, "JPEG", pageWidth / 2 - 20, margin + 18, 40, 40);
    }

    // Add Company Name
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 71, 171);
    doc.text("NOVEL NEST BOOK STORE", pageWidth / 2, margin + 70, {
      align: "center",
    });

    // Add company details
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text("123 Book Street, Colombo, Sri Lanka", pageWidth / 2, margin + 80, {
      align: "center",
    });
    doc.text(
      "Phone: +94 123 456 789 | Email: info@bookstore.com",
      pageWidth / 2,
      margin + 88,
      { align: "center" }
    );
    doc.text("www.novelnest.com", pageWidth / 2, margin + 96, {
      align: "center",
    });

    // Add horizontal separator
    doc.setDrawColor(0, 71, 171);
    doc.setLineWidth(0.5);
    doc.line(margin + 10, margin + 105, pageWidth - margin - 10, margin + 105);

    // Add report title and date
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("ANALYTICS REPORT", pageWidth / 2, margin + 120, {
      align: "center",
    });

    const today = new Date();
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Report Generated: ${today.toLocaleDateString()} at ${today.toLocaleTimeString()}`,
      pageWidth / 2,
      margin + 130,
      { align: "center" }
    );

    // Prepare data for the table
    const tableData = [];

    // Customer Analytics
    if (activeTab === "all" || activeTab === "customers") {
      const genderSummary = genderData.labels.map((label, index) => `${label}: ${genderData.datasets[0].data[index] || 0}`).join(", ");
      const ageSummary = ageData.labels.map((label, index) => `${label}: ${ageData.datasets[0].data[index] || 0}`).join(", ");
      tableData.push(["Customer Analytics", "Gender Distribution", genderSummary]);
      tableData.push(["", "Age Distribution", ageSummary]);
    }

    // Feedback Analytics
    if (activeTab === "all" || activeTab === "customers") {
      const sentimentSummary = feedbackSentimentData.labels.map((label, index) => `${label}: ${feedbackSentimentData.datasets[0].data[index] || 0}`).join(", ");
      const ratingSummary = ratingData.labels.map((label, index) => `${label}: ${ratingData.datasets[0].data[index] || 0}`).join(", ");
      const topicsSummary = feedbackTopicsData.labels.map((label, index) => `${label}: ${feedbackTopicsData.datasets[0].data[index] || 0}`).join(", ");
      tableData.push(["Feedback Analytics", "Sentiment Distribution", sentimentSummary]);
      tableData.push(["", "Customer Ratings", ratingSummary]);
      tableData.push(["", "Feedback Topics", topicsSummary]);
    }

    // Product Analytics
    if (activeTab === "all" || activeTab === "products") {
      const priceSummary = priceData.labels.map((label, index) => `${label}: ${priceData.datasets[0].data[index] || 0}`).join(", ");
      const categorySummary = categoryData.labels.map((label, index) => `${label}: ${categoryData.datasets[0].data[index] || 0}`).join(", ");
      const quantitySummary = quantityData.labels.map((label, index) => `${label}: ${quantityData.datasets[0].data[index] || 0}`).join(", ");
      tableData.push(["Product Analytics", "Price Distribution", priceSummary]);
      tableData.push(["", "Category Popularity", categorySummary]);
      tableData.push(["", "Quantity Availability", quantitySummary]);
    }

    // Transaction Analytics
    if (activeTab === "all" || activeTab === "transactions") {
      const transactionAmountSummary = transactionAmountData.labels.map((label, index) => `${label}: ${transactionAmountData.datasets[0].data[index] || 0}`).join(", ");
      const transactionTimelineSummary = transactionTimelineData.labels.map((label, index) => `${label}: Transactions: ${transactionTimelineData.datasets[0].data[index] || 0}, Amount: $${transactionTimelineData.datasets[1].data[index] || 0}`).join("; ");
      tableData.push(["Transaction Analytics", "Amount Distribution", transactionAmountSummary]);
      tableData.push(["", "Transaction Timeline", transactionTimelineSummary]);
    }

    // Delivery Analytics
    if (activeTab === "all" || activeTab === "delivery") {
      const deliveryStatusSummary = deliveryStatusData.labels.map((label, index) => `${label}: ${deliveryStatusData.datasets[0].data[index] || 0}`).join(", ");
      const deliveryFeeSummary = deliveryFeeData.labels.map((label, index) => `${label}: Fee: $${deliveryFeeData.datasets[0].data[index] || 0}, Deliveries: ${deliveryFeeData.datasets[1].data[index] || 0}`).join("; ");
      tableData.push(["Delivery Analytics", "Delivery Status", deliveryStatusSummary]);
      tableData.push(["", "Delivery Fee Timeline", deliveryFeeSummary]);
    }

    // Add table with styling
    autoTable(doc, {
      startY: margin + 140,
      head: [["Section", "Metric", "Details"]],
      body: tableData,
      headStyles: {
        fillColor: [0, 71, 171],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      margin: {
        top: margin,
        right: margin + 5,
        bottom: margin + 40,
        left: margin + 5,
      },
      styles: {
        cellPadding: 3,
        fontSize: 9,
        overflow: "linebreak",
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 40 },
        2: { cellWidth: "auto" },
      },
    });

    // Add summary section
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Summary:", margin + 5, finalY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    let summaryY = finalY + 8;
    if (activeTab === "all" || activeTab === "customers") {
      doc.text(`• Total Gender Categories: ${genderData.labels.length}`, margin + 10, summaryY);
      summaryY += 5;
      doc.text(`• Total Age Groups: ${ageData.labels.length}`, margin + 10, summaryY);
      summaryY += 5;
      doc.text(`• Total Feedback Sentiments: ${feedbackSentimentData.labels.length}`, margin + 10, summaryY);
      summaryY += 5;
      doc.text(`• Total Rating Levels: ${ratingData.labels.length}`, margin + 10, summaryY);
      summaryY += 5;
      doc.text(`• Total Feedback Topics: ${feedbackTopicsData.labels.length}`, margin + 10, summaryY);
      summaryY += 5;
    }
    if (activeTab === "all" || activeTab === "products") {
      doc.text(`• Total Price Ranges: ${priceData.labels.length}`, margin + 10, summaryY);
      summaryY += 5;
      doc.text(`• Total Categories: ${categoryData.labels.length}`, margin + 10, summaryY);
      summaryY += 5;
      doc.text(`• Total Quantity Periods: ${quantityData.labels.length}`, margin + 10, summaryY);
      summaryY += 5;
    }
    if (activeTab === "all" || activeTab === "transactions") {
      doc.text(`• Total Transaction Amount Ranges: ${transactionAmountData.labels.length}`, margin + 10, summaryY);
      summaryY += 5;
      doc.text(`• Total Transaction Periods: ${transactionTimelineData.labels.length}`, margin + 10, summaryY);
      summaryY += 5;
    }
    if (activeTab === "all" || activeTab === "delivery") {
      doc.text(`• Total Delivery Statuses: ${deliveryStatusData.labels.length}`, margin + 10, summaryY);
      summaryY += 5;
      doc.text(`• Total Delivery Fee Periods: ${deliveryFeeData.labels.length}`, margin + 10, summaryY);
      summaryY += 5;
    }

    // Add signature section with dotted lines
    const signY = pageHeight - margin - 22; // Position near the bottom
    doc.setDrawColor(0); // Black color
    doc.setLineWidth(0.5);

    // Draw dotted lines for signatures
    doc.setLineDash([1, 1]); // Dotted line pattern
    doc.line(margin + 10, signY, margin + 60, signY); // Left dotted line
    doc.line(pageWidth - margin - 60, signY, pageWidth - margin - 10, signY); // Right dotted line
    doc.setLineDash([]); // Reset to solid line

    // Add labels for the signature section
    doc.setFontSize(9);
    doc.text("Prepared By", margin + 10, signY + 5); // Left label
    doc.text("Analytics Manager Signature", pageWidth - margin - 60, signY + 5); // Right label

    // Add footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `© ${today.getFullYear()} Novel Nest Book Store. All Rights Reserved.`,
      pageWidth / 2,
      pageHeight - margin - 5,
      { align: "center" }
    );

    // Add page number
    doc.text(
      `Page ${doc.getCurrentPageInfo().pageNumber} of ${doc.getNumberOfPages()}`,
      pageWidth - margin - 5,
      pageHeight - margin - 5,
      { align: "right" }
    );

    // Save the document
    doc.save("Novel Nest Analytics Report.pdf");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-grow text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="mt-3 text-primary">Loading Dashboard...</h4>
          <p className="text-muted">Gathering your bookstore insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <Header2 />
      <Navbar2 />

      <div className="container-fluid py-4">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="row mb-4 py-3"
        >
          <div className="col-12 text-center">
            <h1 className="display-4 fw-bold text-primary mb-2">
              <GiBookshelf className="me-2" />
              Novel Nest Analytics Dashboard
            </h1>
            <p className="text-muted lead">Real-time insights for your bookstore</p>
          </div>
        </motion.div>

        {/* Dashboard Controls */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="row mb-4"
        >
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body py-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      className={`btn ${activeTab === "all" ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => setActiveTab("all")}
                    >
                      All Analytics
                    </button>
                    <button
                      type="button"
                      className={`btn ${activeTab === "customers" ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => setActiveTab("customers")}
                    >
                      Customers
                    </button>
                    <button
                      type="button"
                      className={`btn ${activeTab === "products" ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => setActiveTab("products")}
                    >
                      Products
                    </button>
                    <button
                      type="button"
                      className={`btn ${activeTab === "transactions" ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => setActiveTab("transactions")}
                    >
                      Transactions
                    </button>
                    <button
                      type="button"
                      className={`btn ${activeTab === "delivery" ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => setActiveTab("delivery")}
                    >
                      Delivery
                    </button>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="btn-group me-2" role="group">
                      <button
                        type="button"
                        className={`btn ${timeRange === "weekly" ? "btn-info" : "btn-outline-info"}`}
                        onClick={() => setTimeRange("weekly")}
                      >
                        Weekly
                      </button>
                      <button
                        type="button"
                        className={`btn ${timeRange === "monthly" ? "btn-info" : "btn-outline-info"}`}
                        onClick={() => setTimeRange("monthly")}
                      >
                        Monthly
                      </button>
                      <button
                        type="button"
                        className={`btn ${timeRange === "yearly" ? "btn-info" : "btn-outline-info"}`}
                        onClick={() => setTimeRange("yearly")}
                      >
                        Yearly
                      </button>
                    </div>
                    <button
                      className="btn btn-success"
                      onClick={generateReport}
                    >
                      <i className="fas fa-file-pdf me-2"></i> Generate Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Customer Analytics Section */}
        {(activeTab === "all" || activeTab === "customers") && (
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="row mb-4"
          >
            <div className="col-12">
              <h3 className="display-5 fw-bold text-primary mb-3">
                <FaUsers className="me-2" />
                Customer Analytics
              </h3>
            </div>

            <motion.div variants={cardVariants} className="col-lg-4 col-md-6 mb-4">
              <div className="card shadow-sm h-100 border-primary border-2">
                <div className="card-header bg-white border-bottom-0">
                  <h4 className="card-title mb-0 text-primary">
                    <BsGenderMale className="me-2" />
                    Gender Distribution
                  </h4>
                </div>
                <div className="card-body d-flex align-items-center justify-content-center">
                  {genderData && (
                    <Pie
                      data={genderData}
                      options={pieChartOptions}
                      height={300}
                    />
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div variants={cardVariants} className="col-lg-4 col-md-6 mb-4">
              <div className="card shadow-sm h-100 border-success border-2">
                <div className="card-header bg-white border-bottom-0">
                  <h4 className="card-title mb-0 text-primary">
                    <BsPersonBoundingBox className="me-2" />
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
                              color: "rgba(0,0,0,0.05)",
                              drawBorder: false
                            },
                            ticks: {
                              font: {
                                family: "'Poppins', sans-serif"
                              }
                            }
                          },
                          x: { 
                            grid: { display: false },
                            ticks: {
                              font: {
                                family: "'Poppins', sans-serif"
                              }
                            }
                          },
                        },
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            backgroundColor: "rgba(0,0,0,0.9)",
                            titleFont: { 
                              family: "'Poppins', sans-serif",
                              size: 14,
                              weight: "bold"
                            },
                            bodyFont: { 
                              family: "'Poppins', sans-serif",
                              size: 12 
                            },
                            padding: 12,
                            cornerRadius: 8,
                            displayColors: false,
                          },
                        },
                        animation: {
                          delay: (context) => {
                            if (context.type === 'data' && context.mode === 'default') {
                              return context.dataIndex * 100;
                            }
                          },
                        }
                      }}
                      height={300}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Feedback Analytics Section */}
        {(activeTab === "all" || activeTab === "customers") && (
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="row mb-4"
          >
            <div className="col-12">
              <h3 className="display-5 fw-bold text-primary mb-3">
                <FaComments className="me-2" />
                Feedback Analytics
              </h3>
            </div>

            <motion.div variants={cardVariants} className="col-lg-4 col-md-6 mb-4">
              <div className="card shadow-sm h-100 border-warning border-2">
                <div className="card-header bg-white border-bottom-0">
                  <h4 className="card-title mb-0 text-primary">
                    <BsStarFill className="me-2" />
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
                              font: {
                                family: "'Poppins', sans-serif"
                              }
                            },
                          },
                          tooltip: {
                            backgroundColor: "rgba(0,0,0,0.9)",
                            titleFont: { 
                              family: "'Poppins', sans-serif",
                              size: 14,
                              weight: "bold"
                            },
                            bodyFont: { 
                              family: "'Poppins', sans-serif",
                              size: 12 
                            },
                            padding: 12,
                            usePointStyle: true,
                            cornerRadius: 8,
                          },
                        },
                        animation: {
                          animateScale: true,
                          animateRotate: true
                        }
                      }}
                      height={300}
                    />
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div variants={cardVariants} className="col-lg-4 col-md-6 mb-4">
              <div className="card shadow-sm h-100 border-success border-2">
                <div className="card-header bg-white border-bottom-0">
                  <h4 className="card-title mb-0 text-primary">
                    <BsEmojiSmile className="me-2" />
                    Feedback Sentiment
                  </h4>
                </div>
                <div className="card-body d-flex align-items-center justify-content-center">
                  {feedbackSentimentData && (
                    <Pie
                      data={feedbackSentimentData}
                      options={pieChartOptions}
                      height={300}
                    />
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div variants={cardVariants} className="col-lg-4 col-md-12 mb-4">
              <div className="card shadow-sm h-100 border-info border-2">
                <div className="card-header bg-white border-bottom-0">
                  <h4 className="card-title mb-0 text-primary">
                    <BsTagsFill className="me-2" />
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
                              color: "rgba(0,0,0,0.05)",
                              drawBorder: false
                            },
                            ticks: {
                              font: {
                                family: "'Poppins', sans-serif"
                              }
                            }
                          },
                          x: { 
                            grid: { display: false },
                            ticks: {
                              font: {
                                family: "'Poppins', sans-serif"
                              }
                            }
                          },
                        },
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            backgroundColor: "rgba(0,0,0,0.9)",
                            titleFont: { 
                              family: "'Poppins', sans-serif",
                              size: 14,
                              weight: "bold"
                            },
                            bodyFont: { 
                              family: "'Poppins', sans-serif",
                              size: 12 
                            },
                            padding: 12,
                            cornerRadius: 8,
                          },
                        },
                      }}
                      height={300}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Product Analytics Section */}
        {(activeTab === "all" || activeTab === "products") && (
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="row mb-4"
          >
            <div className="col-12">
              <h3 className="display-5 fw-bold text-primary mb-3">
                <FaBook className="me-2" />
                Product Analytics
              </h3>
            </div>

            <motion.div variants={cardVariants} className="col-lg-4 col-md-6 mb-4">
              <div className="card shadow-sm h-100 border-warning border-2">
                <div className="card-header bg-white border-bottom-0">
                  <h4 className="card-title mb-0 text-primary">
                    <FaMoneyBillWave className="me-2" />
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
                            grid: { 
                              color: "rgba(0,0,0,0.05)",
                              drawBorder: false
                            },
                            ticks: {
                              font: {
                                family: "'Poppins', sans-serif"
                              }
                            }
                          },
                          x: { 
                            grid: { display: false },
                            ticks: {
                              font: {
                                family: "'Poppins', sans-serif"
                              }
                            }
                          },
                        },
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            backgroundColor: "rgba(0,0,0,0.9)",
                            titleFont: { 
                              family: "'Poppins', sans-serif",
                              size: 14,
                              weight: "bold"
                            },
                            bodyFont: { 
                              family: "'Poppins', sans-serif",
                              size: 12 
                            },
                            padding: 12,
                            cornerRadius: 8,
                          },
                        },
                      }}
                      height={300}
                    />
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div variants={cardVariants} className="col-lg-4 col-md-6 mb-4">
              <div className="card shadow-sm h-100 border-primary border-2">
                <div className="card-header bg-white border-bottom-0">
                  <h4 className="card-title mb-0 text-primary">
                    <GiBookshelf className="me-2" />
                    Category Popularity
                  </h4>
                </div>
                <div className="card-body d-flex align-items-center justify-content-center">
                  {categoryData && (
                    <Pie
                      data={categoryData}
                      options={pieChartOptions}
                      height={300}
                    />
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div variants={cardVariants} className="col-lg-4 col-md-12 mb-4">
              <div className="card shadow-sm h-100 border-success border-2">
                <div className="card-header bg-white border-bottom-0">
                  <h4 className="card-title mb-0 text-primary">
                    <BsGraphUp className="me-2" />
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
                            grid: { 
                              color: "rgba(0,0,0,0.05)",
                              drawBorder: false
                            },
                            ticks: {
                              font: {
                                family: "'Poppins', sans-serif"
                              }
                            }
                          },
                          x: { 
                            grid: { display: false },
                            ticks: {
                              font: {
                                family: "'Poppins', sans-serif"
                              }
                            }
                          },
                        },
                        plugins: {
                          legend: {
                            position: "bottom",
                            labels: { 
                              padding: 20, 
                              usePointStyle: true,
                              font: {
                                family: "'Poppins', sans-serif"
                              }
                            },
                          },
                          tooltip: {
                            backgroundColor: "rgba(0,0,0,0.9)",
                            titleFont: { 
                              family: "'Poppins', sans-serif",
                              size: 14,
                              weight: "bold"
                            },
                            bodyFont: { 
                              family: "'Poppins', sans-serif",
                              size: 12 
                            },
                            padding: 12,
                            cornerRadius: 8,
                          },
                        },
                      }}
                      height={300}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Transaction Analytics Section */}
        {(activeTab === "all" || activeTab === "transactions") && (
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="row mb-4"
          >
            <div className="col-12">
              <h3 className="display-5 fw-bold text-primary mb-3">
                <FaExchangeAlt className="me-2" />
                Transaction Analytics
              </h3>
            </div>

            <motion.div variants={cardVariants} className="col-lg-6 col-md-6 mb-4">
              <div className="card shadow-sm h-100 border-danger border-2">
                <div className="card-header bg-white border-bottom-0">
                  <h4 className="card-title mb-0 text-primary">
                    <FaMoneyBillWave className="me-2" />
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
                              color: "rgba(0,0,0,0.05)",
                              drawBorder: false
                            },
                            ticks: {
                              font: {
                                family: "'Poppins', sans-serif"
                              }
                            }
                          },
                          x: { 
                            grid: { display: false },
                            ticks: {
                              font: {
                                family: "'Poppins', sans-serif"
                              }
                            }
                          },
                        },
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            backgroundColor: "rgba(0,0,0,0.9)",
                            titleFont: { 
                              family: "'Poppins', sans-serif",
                              size: 14,
                              weight: "bold"
                            },
                            bodyFont: { 
                              family: "'Poppins', sans-serif",
                              size: 12 
                            },
                            padding: 12,
                            cornerRadius: 8,
                          },
                        },
                      }}
                      height={300}
                    />
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div variants={cardVariants} className="col-lg-6 col-md-12 mb-4">
              <div className="card shadow-sm h-100 border-info border-2">
                <div className="card-header bg-white border-bottom-0">
                  <h4 className="card-title mb-0 text-primary">
                    <BsGraphUp className="me-2" />
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
                        interaction: {
                          mode: 'index',
                          intersect: false,
                        },
                        scales: {
                          y: {
                            position: "left",
                            beginAtZero: true,
                            grid: { 
                              color: "rgba(0,0,0,0.05)",
                              drawBorder: false
                            },
                            title: {
                              display: true,
                              text: "Number of Transactions",
                              font: {
                                family: "'Poppins', sans-serif",
                                weight: "bold"
                              }
                            },
                            ticks: {
                              font: {
                                family: "'Poppins', sans-serif"
                              }
                            }
                          },
                          y1: {
                            position: "right",
                            beginAtZero: true,
                            grid: { 
                              drawOnChartArea: false,
                              drawBorder: false
                            },
                            title: {
                              display: true,
                              text: "Total Amount ($)",
                              font: {
                                family: "'Poppins', sans-serif",
                                weight: "bold"
                              }
                            },
                            ticks: {
                              font: {
                                family: "'Poppins', sans-serif"
                              }
                            }
                          },
                          x: { 
                            grid: { display: false },
                            ticks: {
                              font: {
                                family: "'Poppins', sans-serif"
                              }
                            }
                          },
                        },
                        plugins: {
                          legend: {
                            position: "bottom",
                            labels: { 
                              padding: 20, 
                              usePointStyle: true,
                              font: {
                                family: "'Poppins', sans-serif"
                              }
                            },
                          },
                          tooltip: {
                            backgroundColor: "rgba(0,0,0,0.9)",
                            titleFont: { 
                              family: "'Poppins', sans-serif",
                              size: 14,
                              weight: "bold"
                            },
                            bodyFont: { 
                              family: "'Poppins', sans-serif",
                              size: 12 
                            },
                            padding: 12,
                            cornerRadius: 8,
                          },
                        },
                      }}
                      height={300}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Delivery Analytics Section */}
        {(activeTab === "all" || activeTab === "delivery") && (
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="row mb-4"
          >
            <div className="col-12">
              <h3 className="display-5 fw-bold text-primary mb-3">
                <FaTruck className="me-2" />
                Delivery Analytics
              </h3>
            </div>

            <motion.div variants={cardVariants} className="col-lg-6 col-md-6 mb-4">
              <div className="card shadow-sm h-100 border-primary border-2">
                <div className="card-header bg-white border-bottom-0">
                  <h4 className="card-title mb-0 text-primary">
                    <FaTruck className="me-2" />
                    Delivery Status Distribution
                  </h4>
                </div>
                <div className="card-body d-flex align-items-center justify-content-center">
                  {deliveryStatusData && (
                    <Pie
                      data={deliveryStatusData}
                      options={pieChartOptions}
                      height={300}
                    />
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div variants={cardVariants} className="col-lg-6 col-md-12 mb-4">
              <div className="card shadow-sm h-100 border-success border-2">
                <div className="card-header bg-white border-bottom-0">
                  <h4 className="card-title mb-0 text-primary">
                    <FaMoneyBillWave className="me-2" />
                    Delivery Fee Timeline
                  </h4>
                </div>
                <div className="card-body">
                  {deliveryFeeData && (
                    <Line
                      data={deliveryFeeData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: {
                          mode: 'index',
                          intersect: false,
                        },
                        scales: {
                          y: {
                            position: "left",
                            beginAtZero: true,
                            grid: { 
                              color: "rgba(0,0,0,0.05)",
                              drawBorder: false
                            },
                            title: {
                              display: true,
                              text: "Total Fee ($)",
                              font: {
                                family: "'Poppins', sans-serif",
                                weight: "bold"
                              }
                            },
                            ticks: {
                              font: {
                                family: "'Poppins', sans-serif"
                              }
                            }
                          },
                          y1: {
                            position: "right",
                            beginAtZero: true,
                            grid: { 
                              drawOnChartArea: false,
                              drawBorder: false
                            },
                            title: {
                              display: true,
                              text: "Number of Deliveries",
                              font: {
                                family: "'Poppins', sans-serif",
                                weight: "bold"
                              }
                            },
                            ticks: {
                              font: {
                                family: "'Poppins', sans-serif"
                              }
                            }
                          },
                          x: { 
                            grid: { display: false },
                            ticks: {
                              font: {
                                family: "'Poppins', sans-serif"
                              }
                            }
                          },
                        },
                        plugins: {
                          legend: {
                            position: "bottom",
                            labels: { 
                              padding: 20, 
                              usePointStyle: true,
                              font: {
                                family: "'Poppins', sans-serif"
                              }
                            },
                          },
                          tooltip: {
                            backgroundColor: "rgba(0,0,0,0.9)",
                            titleFont: { 
                              family: "'Poppins', sans-serif",
                              size: 14,
                              weight: "bold"
                            },
                            bodyFont: { 
                              family: "'Poppins', sans-serif",
                              size: 12 
                            },
                            padding: 12,
                            cornerRadius: 8,
                          },
                        },
                      }}
                      height={300}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Back Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="d-flex justify-content-end mt-3 me-3 mb-3"
        >
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate("/admindashboard")}
          >
            <FaArrowLeft className="me-2" />
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Analysis;