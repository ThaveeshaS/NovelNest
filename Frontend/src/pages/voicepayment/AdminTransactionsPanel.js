import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminTransactionsPanel = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [editTransactionId, setEditTransactionId] = useState(null);
  const [editForm, setEditForm] = useState({ email: '', amount: '' });
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [titleAnimationComplete, setTitleAnimationComplete] = useState(false);

  // Add keyframes for animations
  useEffect(() => {
    // Create style element for keyframes
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.5); }
        70% { box-shadow: 0 0 0 10px rgba(66, 153, 225, 0); }
        100% { box-shadow: 0 0 0 0 rgba(66, 153, 225, 0); }
      }
      @keyframes letterFadeIn {
        0% { opacity: 0; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }
    `;
    document.head.appendChild(styleEl);

    // Clean up
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  useEffect(() => {
    fetchTransactions();
    
    // Start title animation after a short delay
    setTimeout(() => {
      setTitleAnimationComplete(true);
    }, 2500); // Complete animation after 2.5 seconds
  }, []);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/transactions');
      setTransactions(response.data);
      setTimeout(() => setIsLoading(false), 500); // Add slight delay for animation effect
    } catch (error) {
      console.error('Error fetching transactions:', error);
      alert('Failed to load transactions.');
      setIsLoading(false);
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
      showNotification('Transaction updated successfully!');
    } catch (error) {
      console.error('Error updating transaction:', error);
      showNotification('Failed to update transaction.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await axios.delete(`http://localhost:5000/api/transactions/${id}`);
        fetchTransactions();
        showNotification('Transaction deleted successfully!');
      } catch (error) {
        console.error('Error deleting transaction:', error);
        showNotification('Failed to delete transaction.', 'error');
      }
    }
  };

  const downloadPDF = async () => {
    try {
      setHoveredButton('download-loading');
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
      showNotification('PDF downloaded successfully!');
      setHoveredButton(null);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      showNotification('Failed to download PDF.', 'error');
      setHoveredButton(null);
    }
  };

  // Custom notification function
  const showNotification = (message, type = 'success') => {
    const notificationEl = document.createElement('div');
    notificationEl.style.position = 'fixed';
    notificationEl.style.bottom = '20px';
    notificationEl.style.right = '20px';
    notificationEl.style.padding = '15px 25px';
    notificationEl.style.borderRadius = '8px';
    notificationEl.style.color = 'white';
    notificationEl.style.fontWeight = '500';
    notificationEl.style.zIndex = '1000';
    notificationEl.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    notificationEl.style.animation = 'fadeIn 0.3s ease-out forwards';
    
    if (type === 'success') {
      notificationEl.style.backgroundColor = '#38A169';
    } else {
      notificationEl.style.backgroundColor = '#E53E3E';
    }
    
    notificationEl.textContent = message;
    document.body.appendChild(notificationEl);
    
    setTimeout(() => {
      notificationEl.style.opacity = '0';
      notificationEl.style.transform = 'translateY(20px)';
      notificationEl.style.transition = 'opacity 0.3s, transform 0.3s';
      setTimeout(() => {
        document.body.removeChild(notificationEl);
      }, 300);
    }, 3000);
  };

  // Animated title component
  const AnimatedTitle = () => {
    const titleText = "Transaction History";
    
    return (
      <h1 style={isMobile ? {...styles.titleContainer, ...styles.responsiveTitle} : styles.titleContainer}>
        {titleText.split('').map((letter, index) => (
          <span 
            key={index} 
            style={{
              ...styles.titleLetter,
              animationDelay: `${index * 0.1}s`,
              opacity: titleAnimationComplete ? 1 : 0,
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        ))}
      </h1>
    );
  };

  // Styles
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: "'Poppins', sans-serif",
      color: '#2D3748',
      animation: 'fadeIn 0.5s ease-out',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      borderBottom: '1px solid #E2E8F0',
      paddingBottom: '1rem',
    },
    titleContainer: {
      fontSize: '2.2rem',
      fontWeight: '700',
      margin: '0',
      display: 'flex',
      overflow: 'hidden',
    },
    titleLetter: {
      display: 'inline-block',
      animation: 'letterFadeIn 0.5s forwards',
      background: 'linear-gradient(90deg, #2C5282, #4299E1, #63B3ED, #4299E1, #2C5282)',
      backgroundSize: '200% auto',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      color: 'transparent',
      animationFillMode: 'both',
      transform: 'translateY(10px)',
      opacity: 0,
    },
    actionBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    downloadButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#4299E1',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 6px rgba(66, 153, 225, 0.2)',
    },
    downloadButtonHover: {
      backgroundColor: '#3182CE',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 10px rgba(66, 153, 225, 0.3)',
    },
    downloadButtonLoading: {
      backgroundColor: '#3182CE',
      opacity: 0.8,
      cursor: 'not-allowed',
    },
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden',
      marginBottom: '2rem',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '0.95rem',
    },
    tableHead: {
      backgroundColor: '#F7FAFC',
    },
    tableHeadCell: {
      padding: '1rem',
      textAlign: 'left',
      fontWeight: '600',
      color: '#4A5568',
      borderBottom: '2px solid #E2E8F0',
      position: 'relative',
    },
    tableRow: {
      borderBottom: '1px solid #EDF2F7',
      transition: 'background-color 0.2s',
    },
    tableRowHover: {
      backgroundColor: '#F7FAFC',
    },
    tableCell: {
      padding: '1rem',
      verticalAlign: 'middle',
      fontSize: '0.9rem',
    },
    idCell: {
      maxWidth: '100px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      color: '#718096',
      fontSize: '0.8rem',
    },
    bookCell: {
      fontWeight: '600',
      color: '#2D3748',
    },
    amountCell: {
      fontWeight: '700',
      color: '#38A169',
    },
    dateCell: {
      color: '#718096',
      fontSize: '0.85rem',
    },
    actionCell: {
      display: 'flex',
      gap: '0.5rem',
    },
    editButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#ECC94B',
      color: '#744210',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontSize: '0.8rem',
    },
    editButtonHover: {
      backgroundColor: '#D69E2E',
      transform: 'translateY(-1px)',
    },
    saveButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#48BB78',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontSize: '0.8rem',
    },
    saveButtonHover: {
      backgroundColor: '#38A169',
      transform: 'translateY(-1px)',
    },
    deleteButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#FC8181',
      color: '#742A2A',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontSize: '0.8rem',
    },
    deleteButtonHover: {
      backgroundColor: '#F56565',
      transform: 'translateY(-1px)',
    },
    backButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#A0AEC0',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    backButtonHover: {
      backgroundColor: '#718096',
      transform: 'translateY(-2px)',
    },
    inputField: {
      padding: '0.5rem',
      border: '1px solid #CBD5E0',
      borderRadius: '4px',
      width: '100%',
      fontSize: '0.9rem',
    },
    loadingContainer: {
      padding: '3rem 0',
      textAlign: 'center',
    },
    loadingRow: {
      height: '60px',
      position: 'relative',
      overflow: 'hidden',
    },
    loadingShimmer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%)',
      backgroundSize: '1000px 100%',
      animation: 'shimmer 1.5s infinite linear',
    },
    emptyState: {
      padding: '3rem 0',
      textAlign: 'center',
      color: '#718096',
    },
    // Responsive styles
    responsiveContainer: {
      padding: '1rem',
    },
    responsiveTable: {
      display: 'block',
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
    },
    responsiveTitle: {
      fontSize: '1.8rem',
    },
    responsiveActionBar: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    downloadIcon: {
      width: '16px',
      height: '16px',
      marginRight: '8px',
    },
    backIcon: {
      width: '16px',
      height: '16px',
      marginRight: '8px',
    },
  };

  // Check if screen is mobile
  const isMobile = window.innerWidth <= 768;

  // Loading state UI
  if (isLoading) {
    return (
      <div style={isMobile ? {...styles.container, ...styles.responsiveContainer} : styles.container}>
        <div style={styles.header}>
          <AnimatedTitle />
        </div>
        <div style={styles.tableContainer}>
          <table style={{...styles.table, ...(isMobile && styles.responsiveTable)}}>
            <thead style={styles.tableHead}>
              <tr>
                <th style={styles.tableHeadCell}>ID</th>
                <th style={styles.tableHeadCell}>Book</th>
                <th style={styles.tableHeadCell}>Email</th>
                <th style={styles.tableHeadCell}>Amount</th>
                <th style={styles.tableHeadCell}>Date</th>
                <th style={styles.tableHeadCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index} style={styles.loadingRow}>
                  <td colSpan="6">
                    <div style={styles.loadingShimmer}></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div style={isMobile ? {...styles.container, ...styles.responsiveContainer} : styles.container}>
      <div style={styles.header}>
        <AnimatedTitle />
      </div>
      
      <div style={isMobile ? {...styles.actionBar, ...styles.responsiveActionBar} : styles.actionBar}>
        <button 
          style={
            hoveredButton === 'download' 
              ? {...styles.downloadButton, ...styles.downloadButtonHover}
              : hoveredButton === 'download-loading'
                ? {...styles.downloadButton, ...styles.downloadButtonLoading}
                : styles.downloadButton
          }
          onClick={downloadPDF}
          onMouseEnter={() => setHoveredButton('download')}
          onMouseLeave={() => setHoveredButton(null)}
          disabled={hoveredButton === 'download-loading'}
        >
          <svg style={styles.downloadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {hoveredButton === 'download-loading' ? 'Downloading...' : 'Download PDF'}
        </button>
      </div>
      
      <div style={styles.tableContainer}>
        {transactions.length > 0 ? (
          <table style={{...styles.table, ...(isMobile && styles.responsiveTable)}}>
            <thead style={styles.tableHead}>
              <tr>
                <th style={styles.tableHeadCell}>ID</th>
                <th style={styles.tableHeadCell}>Book</th>
                <th style={styles.tableHeadCell}>Email</th>
                <th style={styles.tableHeadCell}>Amount</th>
                <th style={styles.tableHeadCell}>Date</th>
                <th style={styles.tableHeadCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr 
                  key={transaction._id} 
                  style={hoveredRow === index ? {...styles.tableRow, ...styles.tableRowHover} : styles.tableRow}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={{...styles.tableCell, ...styles.idCell}}>{transaction._id}</td>
                  <td style={{...styles.tableCell, ...styles.bookCell}}>
                    {transaction.bookId ? transaction.bookId.name : 'Unknown'}
                  </td>
                  <td style={styles.tableCell}>
                    {editTransactionId === transaction._id ? (
                      <input
                        type="text"
                        style={styles.inputField}
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                      />
                    ) : (
                      transaction.email
                    )}
                  </td>
                  <td style={editTransactionId !== transaction._id ? {...styles.tableCell, ...styles.amountCell} : styles.tableCell}>
                    {editTransactionId === transaction._id ? (
                      <input
                        type="number"
                        style={styles.inputField}
                        name="amount"
                        value={editForm.amount}
                        onChange={handleEditChange}
                        step="0.01"
                      />
                    ) : (
                      `$${transaction.amount}`
                    )}
                  </td>
                  <td style={{...styles.tableCell, ...styles.dateCell}}>
                    {new Date(transaction.date).toLocaleString()}
                  </td>
                  <td style={{...styles.tableCell, ...styles.actionCell}}>
                    {editTransactionId === transaction._id ? (
                      <button 
                        style={
                          hoveredButton === `save-${index}` 
                            ? {...styles.saveButton, ...styles.saveButtonHover} 
                            : styles.saveButton
                        }
                        onClick={() => handleUpdate(transaction._id)}
                        onMouseEnter={() => setHoveredButton(`save-${index}`)}
                        onMouseLeave={() => setHoveredButton(null)}
                      >
                        Save
                      </button>
                    ) : (
                      <button 
                        style={
                          hoveredButton === `edit-${index}` 
                            ? {...styles.editButton, ...styles.editButtonHover} 
                            : styles.editButton
                        }
                        onClick={() => handleEdit(transaction)}
                        onMouseEnter={() => setHoveredButton(`edit-${index}`)}
                        onMouseLeave={() => setHoveredButton(null)}
                      >
                        Edit
                      </button>
                    )}
                    <button 
                      style={
                        hoveredButton === `delete-${index}` 
                          ? {...styles.deleteButton, ...styles.deleteButtonHover} 
                          : styles.deleteButton
                      }
                      onClick={() => handleDelete(transaction._id)}
                      onMouseEnter={() => setHoveredButton(`delete-${index}`)}
                      onMouseLeave={() => setHoveredButton(null)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={styles.emptyState}>
            <p>No transactions found. Transactions will appear here when customers make purchases.</p>
          </div>
        )}
      </div>
      
      <button 
        style={
          hoveredButton === 'back' 
            ? {...styles.backButton, ...styles.backButtonHover} 
            : styles.backButton
        }
        onClick={() => navigate('/')}
        onMouseEnter={() => setHoveredButton('back')}
        onMouseLeave={() => setHoveredButton(null)}
      >
        <svg style={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </button>
    </div>
  );
};

export default AdminTransactionsPanel;