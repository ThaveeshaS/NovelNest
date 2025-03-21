import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../components/images/logo.jpg"; // Import the logo directly
import Header2 from "../../components/Header2"; // Import Header2
import Navbar2 from "../../components/Navbar2"; // Import Navbar2

export default function ManageFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null); // Track which feedback is being edited
  const [editedMessage, setEditedMessage] = useState(""); // Track the edited message

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
      setEditingId(null); // Exit edit mode
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

  // Generate PDF report
  const generateReport = () => {
    const filteredFeedback = feedback.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const doc = new jsPDF();

    // Add company logo
    if (logo) {
      doc.addImage(logo, "JPEG", 80, 10, 40, 40); // Adjust position and size as needed
    }

    // Add company details
    doc.setFontSize(10);
    doc.text("Call us : +94 123 456 789", 15, 60);
    doc.text("Mail us : info@bookstore.com", 15, 68);
    doc.text("Find us : 123 Book Street, Colombo, Sri Lanka", 15, 76);

    // Add a title
    doc.setFontSize(16);
    doc.text("Feedback Report", 14, 92);

    // Add table
    autoTable(doc, {
      startY: 97,
      head: [["Name", "Email", "Message", "Date"]],
      body: filteredFeedback.map((item) => [
        item.name,
        item.email,
        item.message,
        formatDate(item.createdAt),
      ]),
    });

    doc.save("Feedback Report.pdf");
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Filter feedback based on search term
  const filteredFeedback = feedback.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Add Header2 and Navbar2 */}
      <Header2 />
      <Navbar2 />

      <div className="container mt-5">
        <h1 className="mb-4 text-center">Manage Feedback</h1>
        {/* Search and Generate Report */}
        <div className="mb-4">
          <div className="input-group">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary" onClick={generateReport}>
              <i className="fas fa-file-pdf"></i> Generate Report
            </button>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedback.length > 0 ? (
                  filteredFeedback.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>
                        {editingId === item._id ? (
                          <textarea
                            className="form-control"
                            value={editedMessage}
                            onChange={(e) => setEditedMessage(e.target.value)}
                          />
                        ) : (
                          item.message
                        )}
                      </td>
                      <td>{formatDate(item.createdAt)}</td>
                      <td>
                        {editingId === item._id ? (
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => handleUpdate(item._id)}
                          >
                            <i className="fas fa-save"></i> Save
                          </button>
                        ) : (
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => enableEditing(item._id, item.message)}
                          >
                            <i className="fas fa-edit"></i> Edit
                          </button>
                        )}
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item._id)}
                        >
                          <i className="fas fa-trash-alt"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-danger">
                      No matching feedback found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}