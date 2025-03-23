import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../components/images/logo.jpg";
import Header2 from "../../components/Header2";
import Navbar2 from "../../components/Navbar2";
import { FaSearch, FaFilePdf, FaEdit, FaSave, FaTrashAlt, FaSpinner, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ManageFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const navigate = useNavigate();

  // Fetch feedback data
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/feedback/all");
        setFeedback(response.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setError("Failed to fetch feedback. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // Delete feedback
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await axios.delete(`http://localhost:5000/api/feedback/delete/${id}`);
        setFeedback(feedback.filter((item) => item._id !== id));
      } catch (error) {
        console.error("Error deleting feedback:", error);
        setError("Failed to delete feedback. Please try again later.");
      }
    }
  };

  // Update feedback
  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/feedback/update/${id}`, {
        message: editedMessage,
      });
      setFeedback(
        feedback.map((item) =>
          item._id === id ? { ...item, message: editedMessage } : item
        )
      );
      setEditingId(null);
    } catch (error) {
      console.error("Error updating feedback:", error);
      setError("Failed to update feedback. Please try again later.");
    }
  };

  // Enable editing for a specific feedback
  const enableEditing = (id, message) => {
    setEditingId(id);
    setEditedMessage(message);
  };

  // Generate PDF report with professional company styling
  const generateReport = () => {
    const filteredFeedback = feedback.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;

    //rgb(255, 255, 255)

    doc.setFillColor(255, 252, 255); // Set RGB color
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Add borders to the entire page
    doc.setDrawColor(0, 71, 171); // Company blue color
    doc.setLineWidth(1);
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
    
    // Add decorative header bar
    doc.setFillColor(0, 71, 171);
    doc.rect(margin, margin, pageWidth - 2 * margin, 12, 'F');
    
    // Add company logo
    if (logo) {
      doc.addImage(logo, "JPEG", pageWidth / 2 - 20, margin + 18, 40, 40);
    }
    
    // Add Company Name
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 71, 171);
    doc.text("NOVEL NEST BOOK STORE", pageWidth / 2, margin + 70, { align: "center" });
    
    // Add company details
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text("123 Book Street, Colombo, Sri Lanka", pageWidth / 2, margin + 80, { align: "center" });
    doc.text("Phone: +94 123 456 789 | Email: info@bookstore.com", pageWidth / 2, margin + 88, { align: "center" });
    doc.text("www.novelnest.com", pageWidth / 2, margin + 96, { align: "center" });
    
    // Add horizontal separator
    doc.setDrawColor(0, 71, 171);
    doc.setLineWidth(0.5);
    doc.line(margin + 10, margin + 105, pageWidth - margin - 10, margin + 105);
    
    // Add report title and date
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("CUSTOMER FEEDBACK REPORT", pageWidth / 2, margin + 120, { align: "center" });
    
    const today = new Date();
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Report Generated: ${today.toLocaleDateString()} at ${today.toLocaleTimeString()}`, pageWidth / 2, margin + 130, { align: "center" });
    
    // Add table with styling
    autoTable(doc, {
      startY: margin + 140,
      head: [["Name", "Email", "Message", "Date"]],
      body: filteredFeedback.map((item) => [
        item.name,
        item.email,
        item.message,
        formatDate(item.createdAt),
      ]),
      headStyles: {
        fillColor: [0, 71, 171],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      margin: { top: margin, right: margin + 5, bottom: margin + 40, left: margin + 5 },
      styles: {
        cellPadding: 3,
        fontSize: 9,
        overflow: 'linebreak',
        lineWidth: 0.1,
      },
      columnStyles: {
        2: { cellWidth: 'auto' }, // Give message column more space
      },
    });
    
    // Add summary section
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Summary:", margin + 5, finalY);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`• Total Feedback Entries: ${feedback.length}`, margin + 10, finalY + 8);
    doc.text(`• Filtered Entries: ${filteredFeedback.length}`, margin + 10, finalY + 13);
    
    // Add signature section with dotted lines
    const signY = pageHeight - margin - 22; // Position the signature section near the bottom
    doc.setDrawColor(0); // Set line color to black
    doc.setLineWidth(0.5); // Set line thickness

    // Draw dotted lines for signatures
    doc.setLineDash([1, 1]); // Set dotted line pattern (1 units on, 1 units off)
    doc.line(margin + 10, signY, margin + 60, signY); // Left dotted line
    doc.line(pageWidth - margin - 60, signY, pageWidth - margin - 10, signY); // Right dotted line

    // Reset line dash to solid for other elements (if needed)
    doc.setLineDash([]); // Reset to solid line

    // Add labels for the signature section
    doc.setFontSize(9);
    doc.text("Prepared By", margin + 10, signY + 5); // Left label
    doc.text("Feedback Manager Signature", pageWidth - margin - 60, signY + 5); // Right label
    
    // Add footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`© ${today.getFullYear()} Novel Nest Book Store. All Rights Reserved.`, pageWidth / 2, pageHeight - margin - 5, { align: "center" });
    
    // Add page number
    doc.text(`Page ${doc.getCurrentPageInfo().pageNumber} of ${doc.getNumberOfPages()}`, pageWidth - margin - 5, pageHeight - margin - 5, { align: "right" });
    
    // Save the document
    doc.save("Novel Nest Feedback Report.pdf");
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Sort function
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sorted data
  const getSortedData = () => {
    const sortableItems = [...feedback];
    
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  const filteredFeedback = getSortedData();

  return (
    <div className="bg-light min-vh-100">
      <Header2 />
      <Navbar2 />

      <div className="container py-5">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h2 className="mb-0 text-center">Manage Customer Feedback</h2>
          </div>
          <div className="card-body">
            {/* Search and Generate Report */}
            <div className="row mb-4">
              <div className="col-md-8 mb-3 mb-md-0">
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <FaSearch className="text-primary" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="form-control"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4 d-flex justify-content-md-end">
                <button 
                  className="btn btn-primary w-100 w-md-auto" 
                  onClick={generateReport}
                  disabled={filteredFeedback.length === 0}
                >
                  <FaFilePdf className="me-2" /> Generate Report
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center" role="alert">
                <div>{error}</div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-5">
                <FaSpinner className="fa-spin text-primary mb-3" size={40} />
                <p className="text-muted">Loading feedback data...</p>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th onClick={() => requestSort('name')} className="cursor-pointer">
                          Name {getSortIndicator('name')}
                        </th>
                        <th onClick={() => requestSort('email')} className="cursor-pointer">
                          Email {getSortIndicator('email')}
                        </th>
                        <th>Message</th>
                        <th onClick={() => requestSort('createdAt')} className="cursor-pointer">
                          Date {getSortIndicator('createdAt')}
                        </th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFeedback.length > 0 ? (
                        filteredFeedback.map((item) => (
                          <tr key={item._id}>
                            <td className="fw-medium">{item.name}</td>
                            <td>{item.email}</td>
                            <td>
                              {editingId === item._id ? (
                                <textarea
                                  className="form-control"
                                  value={editedMessage}
                                  onChange={(e) => setEditedMessage(e.target.value)}
                                  rows="3"
                                />
                              ) : (
                                <div className="message-cell">{item.message}</div>
                              )}
                            </td>
                            <td>{formatDate(item.createdAt)}</td>
                            <td className="text-center">
                              <div className="btn-group">
                                {editingId === item._id ? (
                                  <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => handleUpdate(item._id)}
                                    title="Save changes"
                                  >
                                    <FaSave />
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => enableEditing(item._id, item.message)}
                                    title="Edit feedback"
                                  >
                                    <FaEdit />
                                  </button>
                                )}
                                <button
                                  className="btn btn-outline-danger btn-sm ms-2"
                                  onClick={() => handleDelete(item._id)}
                                  title="Delete feedback"
                                >
                                  <FaTrashAlt />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-4">
                            <div className="text-muted">
                              <p className="mb-0">No matching feedback found.</p>
                              {searchTerm && (
                                <small>Try adjusting your search criteria.</small>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <small className="text-muted">
                    Showing {filteredFeedback.length} of {feedback.length} entries
                  </small>
                  <button 
                    className="btn btn-outline-secondary" 
                    onClick={() => navigate("/admindashboard")}
                  >
                    <FaArrowLeft className="me-2" /> Back to Dashboard
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        .message-cell {
          max-width: 300px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .fa-spin {
          animation: fa-spin 2s infinite linear;
        }
        @keyframes fa-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}