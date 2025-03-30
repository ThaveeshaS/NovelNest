import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../components/images/logo.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaFilePdf, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

const AdminTransactionsPanel = () => {
  const [transactions, setTransactions] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ email: "", amount: "" });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await axios.delete(`http://localhost:5000/api/transactions/${id}`);
        fetchTransactions();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const handleEdit = (txn) => {
    setEditId(txn._id);
    setEditForm({ email: txn.email, amount: txn.amount.toFixed(2) });
  };

  const handleCancel = () => {
    setEditId(null);
    setEditForm({ email: "", amount: "" });
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/transactions/${id}`, {
        email: editForm.email,
        amount: parseFloat(editForm.amount),
      });
      fetchTransactions();
      handleCancel();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2);
  const averageSale = (transactions.length > 0 ? (totalRevenue / transactions.length) : 0).toFixed(2);
  const highest = Math.max(...transactions.map(t => t.amount)).toFixed(2);
  const lowest = Math.min(...transactions.map(t => t.amount)).toFixed(2);

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;

    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    doc.setDrawColor(0, 71, 171);
    doc.setLineWidth(1);
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
    doc.setFillColor(0, 71, 171);
    doc.rect(margin, margin, pageWidth - 2 * margin, 12, 'F');

    if (logo) {
      doc.addImage(logo, "JPEG", pageWidth / 2 - 20, margin + 18, 40, 40);
    }

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 71, 171);
    doc.text("NOVEL NEST BOOK STORE", pageWidth / 2, margin + 70, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text("123 Book Street, Colombo, Sri Lanka", pageWidth / 2, margin + 80, { align: "center" });
    doc.text("Phone: +94 123 456 789 | Email: info@bookstore.com", pageWidth / 2, margin + 88, { align: "center" });
    doc.text("www.novelnest.com", pageWidth / 2, margin + 96, { align: "center" });

    doc.setDrawColor(0, 71, 171);
    doc.setLineWidth(0.5);
    doc.line(margin + 10, margin + 105, pageWidth - margin - 10, margin + 105);

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("TRANSACTION HISTORY REPORT", pageWidth / 2, margin + 120, { align: "center" });

    const today = new Date();
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Report Generated: ${today.toLocaleDateString()} at ${today.toLocaleTimeString()}`, pageWidth / 2, margin + 130, { align: "center" });

    autoTable(doc, {
      startY: margin + 140,
      head: [["#", "Book", "Email", "Amount ($)", "Date"]],
      body: transactions.map((txn, i) => [
        i + 1,
        txn.bookId?.name || "Unknown",
        txn.email,
        `$${txn.amount.toFixed(2)}`,
        new Date(txn.date).toLocaleString(),
      ]),
      headStyles: {
        fillColor: [0, 71, 171],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak',
      },
      margin: { left: margin + 5, right: margin + 5 },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Summary:", margin + 5, finalY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`• Total Revenue: $${totalRevenue}`, margin + 10, finalY + 8);
    doc.text(`• Average Sale: $${averageSale}`, margin + 10, finalY + 13);
    doc.text(`• Highest Sale: $${highest}`, margin + 10, finalY + 18);
    doc.text(`• Lowest Sale: $${lowest}`, margin + 10, finalY + 23);

    const signY = pageHeight - margin - 22;
    doc.setDrawColor(0);
    doc.setLineDash([1, 1]);
    doc.line(margin + 10, signY, margin + 60, signY);
    doc.line(pageWidth - margin - 60, signY, pageWidth - margin - 10, signY);
    doc.setLineDash([]);

    doc.setFontSize(9);
    doc.text("Prepared By", margin + 10, signY + 5);
    doc.text("Manager Signature", pageWidth - margin - 60, signY + 5);

    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`© ${today.getFullYear()} Novel Nest Book Store. All Rights Reserved.`, pageWidth / 2, pageHeight - margin - 5, { align: "center" });
    doc.text(`Page ${doc.getCurrentPageInfo().pageNumber} of ${doc.getNumberOfPages()}`, pageWidth - margin - 5, pageHeight - margin - 5, { align: "right" });

    doc.save("Transaction_History_Report.pdf");
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h2>Admin Transactions Panel</h2>
        <p className="text-muted">Manage and export transaction history</p>
      </div>

      {/* 📊 Analytics Dashboard */}
      <div className="row mb-5 text-center">
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0 rounded-3 p-3">
            <div className="text-primary mb-2">
              <i className="bi bi-info-circle fs-3"></i>
            </div>
            <div className="fw-semibold text-muted">Total Revenue</div>
            <div className="fs-5 fw-bold">${totalRevenue}</div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0 rounded-3 p-3">
            <div className="text-primary mb-2">
              <i className="bi bi-bar-chart-line fs-3"></i>
            </div>
            <div className="fw-semibold text-muted">Average Sale</div>
            <div className="fs-5 fw-bold">${averageSale}</div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0 rounded-3 p-3">
            <div className="text-success mb-2">
              <i className="bi bi-graph-up-arrow fs-3"></i>
            </div>
            <div className="fw-semibold text-muted">Highest Sale</div>
            <div className="fs-5 fw-bold">${highest}</div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0 rounded-3 p-3">
            <div className="text-danger mb-2">
              <i className="bi bi-graph-down-arrow fs-3"></i>
            </div>
            <div className="fw-semibold text-muted">Lowest Sale</div>
            <div className="fs-5 fw-bold">${lowest}</div>
          </div>
        </div>
      </div>

      {/* PDF Button */}
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary" onClick={generatePDF}>
          <FaFilePdf className="me-2" />
          Download PDF
        </button>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Book</th>
              <th>Email</th>
              <th>Amount ($)</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, i) => (
              <tr key={txn._id}>
                <td>{i + 1}</td>
                <td>{txn.bookId?.name || "Unknown"}</td>
                <td>
                  {editId === txn._id ? (
                    <input type="text" name="email" value={editForm.email} onChange={handleChange} className="form-control form-control-sm" />
                  ) : txn.email}
                </td>
                <td>
                  {editId === txn._id ? (
                    <input type="number" name="amount" value={editForm.amount} onChange={handleChange} className="form-control form-control-sm" />
                  ) : `$${txn.amount.toFixed(2)}`}
                </td>
                <td>{new Date(txn.date).toLocaleString()}</td>
                <td>
                  <div className="btn-group">
                    {editId === txn._id ? (
                      <>
                        <button className="btn btn-success btn-sm" onClick={() => handleSave(txn._id)} title="Save">
                          <FaSave />
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={handleCancel} title="Cancel">
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(txn)} title="Edit">
                          <FaEdit />
                        </button>
                        <button className="btn btn-outline-danger btn-sm ms-2" onClick={() => handleDelete(txn._id)} title="Delete">
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTransactionsPanel;
