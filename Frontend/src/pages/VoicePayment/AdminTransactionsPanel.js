import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminTransactionsPanel = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [editTransactionId, setEditTransactionId] = useState(null);
  const [editForm, setEditForm] = useState({ email: '', amount: '' });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      alert('Failed to load transactions.');
    }
  };

  const handleEdit = (transaction) => {
    setEditForm({ email: transaction.email, amount: transaction.amount });
    setEditTransactionId(transaction._id);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/transactions/${id}`, {
        email: editForm.email,
        amount: parseFloat(editForm.amount),
      });
      setEditTransactionId(null);
      setEditForm({ email: '', amount: '' });
      fetchTransactions();
      alert('Transaction updated successfully!');
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Failed to update transaction.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await axios.delete(`http://localhost:5000/api/transactions/${id}`);
        fetchTransactions();
        alert('Transaction deleted successfully!');
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Failed to delete transaction.');
      }
    }
  };

  const downloadPDF = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/transactions/pdf', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF.');
    }
  };

  return (
    <div className="container mt-5">
      <h1>Admin - Transaction History</h1>
      <div className="mb-3">
        <button className="btn btn-primary" onClick={downloadPDF}>
          Download PDF
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Book</th>
            <th>Email</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction._id}>
              <td>{transaction._id}</td>
              <td>{transaction.bookId ? transaction.bookId.name : 'Unknown'}</td>
              <td>
                {editTransactionId === transaction._id ? (
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                  />
                ) : (
                  transaction.email
                )}
              </td>
              <td>
                {editTransactionId === transaction._id ? (
                  <input
                    type="number"
                    className="form-control"
                    name="amount"
                    value={editForm.amount}
                    onChange={handleEditChange}
                    step="0.01"
                  />
                ) : (
                  `$${transaction.amount}`
                )}
              </td>
              <td>{new Date(transaction.date).toLocaleString()}</td>
              <td>
                {editTransactionId === transaction._id ? (
                  <button className="btn btn-success btn-sm" onClick={() => handleUpdate(transaction._id)}>
                    Save
                  </button>
                ) : (
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(transaction)}>
                    Edit
                  </button>
                )}
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(transaction._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default AdminTransactionsPanel;