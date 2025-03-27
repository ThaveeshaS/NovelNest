"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const AdminTransactionsPanel = () => {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [editTransactionId, setEditTransactionId] = useState(null)
  const [editForm, setEditForm] = useState({ email: "", amount: "" })
  const [hoveredRow, setHoveredRow] = useState(null)
  const [hoveredButton, setHoveredButton] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [titleAnimationComplete, setTitleAnimationComplete] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showTransactionDetails, setShowTransactionDetails] = useState(false)
  const detailsRef = useRef(null)

  // Add keyframes for animations
  useEffect(() => {
    // Create style element for keyframes
    const styleEl = document.createElement("style")
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
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
      @keyframes scaleIn {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      @keyframes floatUp {
        0% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0); }
      }
      @keyframes rotateIcon {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes borderPulse {
        0% { border-color: rgba(66, 153, 225, 0.3); }
        50% { border-color: rgba(66, 153, 225, 0.8); }
        100% { border-color: rgba(66, 153, 225, 0.3); }
      }
      @keyframes moneyFall {
        0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        100% { transform: translateY(1000px) rotate(360deg); opacity: 0; }
      }
      @keyframes coinSpin {
        0% { transform: rotateY(0deg); }
        100% { transform: rotateY(360deg); }
      }
      @keyframes receiptWave {
        0% { transform: skewX(0deg); }
        25% { transform: skewX(3deg); }
        75% { transform: skewX(-3deg); }
        100% { transform: skewX(0deg); }
      }
    `
    document.head.appendChild(styleEl)

    // Clean up
    return () => {
      document.head.removeChild(styleEl)
    }
  }, [])

  // Create background animation elements
  useEffect(() => {
    // Create money symbols falling in the background
    const createMoneySymbols = () => {
      const symbols = ["$", "€", "£", "¥", "₹", "₽", "₿"]
      const container = document.body

      // Create initial set of money symbols
      for (let i = 0; i < 20; i++) {
        setTimeout(() => createMoneySymbol(symbols, container), Math.random() * 3000)
      }

      // Continue creating money symbols at intervals
      const symbolInterval = setInterval(() => {
        createMoneySymbol(symbols, container)
      }, 2000)

      return () => {
        clearInterval(symbolInterval)
        const elements = document.querySelectorAll(".money-symbol")
        elements.forEach((el) => el.remove())
      }
    }

    const createMoneySymbol = (symbols, container) => {
      const symbol = document.createElement("div")
      symbol.className = "money-symbol"
      symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)]
      symbol.style.position = "fixed"
      symbol.style.left = `${Math.random() * 100}%`
      symbol.style.top = "0"
      symbol.style.fontSize = `${20 + Math.random() * 30}px`
      symbol.style.fontWeight = "bold"
      symbol.style.color = "rgba(56, 161, 105, 0.2)"
      symbol.style.zIndex = "-1"
      symbol.style.animation = `moneyFall ${5 + Math.random() * 10}s linear forwards`
      symbol.style.textShadow = "0 0 8px rgba(56, 161, 105, 0.2)"
      container.appendChild(symbol)

      // Remove the symbol after animation completes
      setTimeout(() => {
        symbol.remove()
      }, 15000)
    }

    // Create floating coins
    const createFloatingCoins = () => {
      const container = document.body

      for (let i = 0; i < 8; i++) {
        const coin = document.createElement("div")
        coin.className = "floating-coin"
        coin.style.position = "fixed"
        coin.style.left = `${Math.random() * 100}%`
        coin.style.top = `${20 + Math.random() * 60}%`
        coin.style.width = "40px"
        coin.style.height = "40px"
        coin.style.borderRadius = "50%"
        coin.style.background = "radial-gradient(circle at 30% 30%, #FFD700, #B8860B)"
        coin.style.boxShadow = "0 0 10px rgba(184, 134, 11, 0.5)"
        coin.style.zIndex = "-1"
        coin.style.animation = `coinSpin ${8 + Math.random() * 12}s linear infinite, floatUp ${6 + Math.random() * 8}s ease-in-out infinite`
        coin.style.animationDelay = `${Math.random() * 5}s`

        // Add dollar sign to coin
        const dollarSign = document.createElement("div")
        dollarSign.textContent = "$"
        dollarSign.style.position = "absolute"
        dollarSign.style.top = "50%"
        dollarSign.style.left = "50%"
        dollarSign.style.transform = "translate(-50%, -50%)"
        dollarSign.style.color = "#8B4513"
        dollarSign.style.fontWeight = "bold"
        coin.appendChild(dollarSign)

        container.appendChild(coin)
      }

      return () => {
        const elements = document.querySelectorAll(".floating-coin")
        elements.forEach((el) => el.remove())
      }
    }

    // Create receipt elements
    const createReceiptElements = () => {
      const container = document.body

      for (let i = 0; i < 5; i++) {
        const receipt = document.createElement("div")
        receipt.className = "receipt-element"
        receipt.style.position = "fixed"
        receipt.style.left = `${Math.random() * 100}%`
        receipt.style.top = `${Math.random() * 100}%`
        receipt.style.width = "80px"
        receipt.style.height = "120px"
        receipt.style.backgroundColor = "rgba(255, 255, 255, 0.15)"
        receipt.style.borderRadius = "3px"
        receipt.style.zIndex = "-1"
        receipt.style.animation = `receiptWave ${10 + Math.random() * 15}s ease-in-out infinite`
        receipt.style.animationDelay = `${Math.random() * 5}s`

        // Add receipt lines
        for (let j = 0; j < 8; j++) {
          const line = document.createElement("div")
          line.style.width = `${40 + Math.random() * 40}%`
          line.style.height = "2px"
          line.style.backgroundColor = "rgba(0, 0, 0, 0.1)"
          line.style.margin = "10px 5px"
          receipt.appendChild(line)
        }

        container.appendChild(receipt)
      }

      return () => {
        const elements = document.querySelectorAll(".receipt-element")
        elements.forEach((el) => el.remove())
      }
    }

    // Initialize all background elements
    const cleanupMoneySymbols = createMoneySymbols()
    const cleanupFloatingCoins = createFloatingCoins()
    const cleanupReceiptElements = createReceiptElements()

    // Cleanup function
    return () => {
      cleanupMoneySymbols()
      cleanupFloatingCoins()
      cleanupReceiptElements()
    }
  }, [])

  useEffect(() => {
    fetchTransactions()

    // Start title animation after a short delay
    setTimeout(() => {
      setTitleAnimationComplete(true)
    }, 2500) // Complete animation after 2.5 seconds
  }, [])

  const fetchTransactions = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get("http://localhost:5000/api/transactions")
      setTransactions(response.data)
      setTimeout(() => setIsLoading(false), 500) // Add slight delay for animation effect
    } catch (error) {
      console.error("Error fetching transactions:", error)
      alert("Failed to load transactions.")
      setIsLoading(false)
    }
  }

  const handleEdit = (transaction) => {
    setEditForm({ email: transaction.email, amount: transaction.amount })
    setEditTransactionId(transaction._id)
  }

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/transactions/${id}`, {
        email: editForm.email,
        amount: Number.parseFloat(editForm.amount),
      })
      setEditTransactionId(null)
      setEditForm({ email: "", amount: "" })
      fetchTransactions()
      showNotification("Transaction updated successfully!")
    } catch (error) {
      console.error("Error updating transaction:", error)
      showNotification("Failed to update transaction.", "error")
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await axios.delete(`http://localhost:5000/api/transactions/${id}`)
        fetchTransactions()
        showNotification("Transaction deleted successfully!")
      } catch (error) {
        console.error("Error deleting transaction:", error)
        showNotification("Failed to delete transaction.", "error")
      }
    }
  }

  const downloadPDF = async () => {
    try {
      setHoveredButton("download-loading")
      const response = await axios.get("http://localhost:5000/api/transactions/pdf", {
        responseType: "blob",
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "transactions.pdf")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      showNotification("PDF downloaded successfully!")
      setHoveredButton(null)
    } catch (error) {
      console.error("Error downloading PDF:", error)
      showNotification("Failed to download PDF.", "error")
      setHoveredButton(null)
    }
  }

  const showTransactionDetail = (transaction) => {
    setSelectedTransaction(transaction)
    setShowTransactionDetails(true)

    // Scroll to details section
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  // Custom notification function
  const showNotification = (message, type = "success") => {
    const notificationEl = document.createElement("div")
    notificationEl.style.position = "fixed"
    notificationEl.style.bottom = "20px"
    notificationEl.style.right = "20px"
    notificationEl.style.padding = "15px 25px"
    notificationEl.style.borderRadius = "8px"
    notificationEl.style.color = "white"
    notificationEl.style.fontWeight = "500"
    notificationEl.style.zIndex = "1000"
    notificationEl.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.2)"
    notificationEl.style.animation = "fadeIn 0.3s ease-out forwards"

    if (type === "success") {
      notificationEl.style.backgroundColor = "#38A169"
    } else {
      notificationEl.style.backgroundColor = "#E53E3E"
    }

    notificationEl.textContent = message
    document.body.appendChild(notificationEl)

    setTimeout(() => {
      notificationEl.style.opacity = "0"
      notificationEl.style.transform = "translateY(20px)"
      notificationEl.style.transition = "opacity 0.3s, transform 0.3s"
      setTimeout(() => {
        document.body.removeChild(notificationEl)
      }, 300)
    }, 3000)
  }

  // Animated title component
  const AnimatedTitle = () => {
    const titleText = "Transaction History"

    return (
      <h1 style={isMobile ? { ...styles.titleContainer, ...styles.responsiveTitle } : styles.titleContainer}>
        {titleText.split("").map((letter, index) => (
          <span
            key={index}
            style={{
              ...styles.titleLetter,
              animationDelay: `${index * 0.1}s`,
              opacity: titleAnimationComplete ? 1 : 0,
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </h1>
    )
  }

  // Transaction summary component
  const TransactionSummary = () => {
    if (!transactions.length) return null

    const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0)
    const averageAmount = totalAmount / transactions.length
    const maxTransaction = Math.max(...transactions.map((t) => t.amount))
    const minTransaction = Math.min(...transactions.map((t) => t.amount))

    return (
      <div style={styles.summaryContainer}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div style={styles.summaryContent}>
            <h3 style={styles.summaryTitle}>Total Revenue</h3>
            <p style={styles.summaryValue}>${totalAmount.toFixed(2)}</p>
          </div>
        </div>

        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div style={styles.summaryContent}>
            <h3 style={styles.summaryTitle}>Average Sale</h3>
            <p style={styles.summaryValue}>${averageAmount.toFixed(2)}</p>
          </div>
        </div>

        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div style={styles.summaryContent}>
            <h3 style={styles.summaryTitle}>Highest Sale</h3>
            <p style={styles.summaryValue}>${maxTransaction.toFixed(2)}</p>
          </div>
        </div>

        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16 18L18.29 15.71L13.41 10.83L9.41 14.83L2 7.41L3.41 6L9.41 12L13.41 8L19.71 14.29L22 12V18H16Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div style={styles.summaryContent}>
            <h3 style={styles.summaryTitle}>Lowest Sale</h3>
            <p style={styles.summaryValue}>${minTransaction.toFixed(2)}</p>
          </div>
        </div>
      </div>
    )
  }

  // Transaction details component
  const TransactionDetails = () => {
    if (!selectedTransaction) return null

    return (
      <div
        ref={detailsRef}
        style={{
          ...styles.detailsContainer,
          animation: showTransactionDetails ? "scaleIn 0.3s ease-out forwards" : "none",
          opacity: showTransactionDetails ? 1 : 0,
        }}
      >
        <div style={styles.detailsHeader}>
          <h2 style={styles.detailsTitle}>Transaction Details</h2>
          <button style={styles.closeButton} onClick={() => setShowTransactionDetails(false)}>
            ×
          </button>
        </div>

        <div style={styles.detailsContent}>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Transaction ID:</span>
            <span style={styles.detailValue}>{selectedTransaction._id}</span>
          </div>

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Book:</span>
            <span style={styles.detailValue}>
              {selectedTransaction.bookId ? selectedTransaction.bookId.name : "Unknown"}
            </span>
          </div>

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Customer Email:</span>
            <span style={styles.detailValue}>{selectedTransaction.email}</span>
          </div>

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Amount:</span>
            <span style={{ ...styles.detailValue, ...styles.amountValue }}>${selectedTransaction.amount}</span>
          </div>

          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Date:</span>
            <span style={styles.detailValue}>{new Date(selectedTransaction.date).toLocaleString()}</span>
          </div>

          <div style={styles.detailActions}>
            <button
              style={
                hoveredButton === "detail-edit"
                  ? { ...styles.editButton, ...styles.editButtonHover }
                  : styles.editButton
              }
              onClick={() => {
                handleEdit(selectedTransaction)
                setShowTransactionDetails(false)
              }}
              onMouseEnter={() => setHoveredButton("detail-edit")}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Edit Transaction
            </button>

            <button
              style={
                hoveredButton === "detail-delete"
                  ? { ...styles.deleteButton, ...styles.deleteButtonHover }
                  : styles.deleteButton
              }
              onClick={() => {
                handleDelete(selectedTransaction._id)
                setShowTransactionDetails(false)
              }}
              onMouseEnter={() => setHoveredButton("detail-delete")}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Delete Transaction
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Styles
  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "2rem",
      fontFamily: "'Poppins', sans-serif",
      color: "#2D3748",
      animation: "fadeIn 0.5s ease-out",
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(135deg, rgba(247, 250, 252, 0.9) 0%, rgba(237, 242, 247, 0.9) 100%)",
      borderRadius: "15px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2rem",
      borderBottom: "1px solid #E2E8F0",
      paddingBottom: "1rem",
      position: "relative",
    },
    titleContainer: {
      fontSize: "2.2rem",
      fontWeight: "700",
      margin: "0",
      display: "flex",
      overflow: "hidden",
    },
    titleLetter: {
      display: "inline-block",
      animation: "letterFadeIn 0.5s forwards",
      background: "linear-gradient(90deg, #2C5282, #4299E1, #63B3ED, #4299E1, #2C5282)",
      backgroundSize: "200% auto",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      color: "transparent",
      animationFillMode: "both",
      transform: "translateY(10px)",
      opacity: 0,
    },
    actionBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1.5rem",
      flexWrap: "wrap",
      gap: "1rem",
    },
    downloadButton: {
      padding: "0.75rem 1.5rem",
      backgroundColor: "#4299E1",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      transition: "all 0.2s ease",
      boxShadow: "0 4px 6px rgba(66, 153, 225, 0.2)",
      position: "relative",
      overflow: "hidden",
    },
    downloadButtonHover: {
      backgroundColor: "#3182CE",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 10px rgba(66, 153, 225, 0.3)",
    },
    downloadButtonLoading: {
      backgroundColor: "#3182CE",
      opacity: 0.8,
      cursor: "not-allowed",
    },
    tableContainer: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      overflow: "hidden",
      marginBottom: "2rem",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      transition: "box-shadow 0.3s ease",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "0.95rem",
    },
    tableHead: {
      backgroundColor: "#F7FAFC",
    },
    tableHeadCell: {
      padding: "1rem",
      textAlign: "left",
      fontWeight: "600",
      color: "#4A5568",
      borderBottom: "2px solid #E2E8F0",
      position: "relative",
    },
    tableRow: {
      borderBottom: "1px solid #EDF2F7",
      transition: "all 0.3s ease",
      cursor: "pointer",
    },
    tableRowHover: {
      backgroundColor: "#F7FAFC",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    },
    tableCell: {
      padding: "1rem",
      verticalAlign: "middle",
      fontSize: "0.9rem",
      transition: "all 0.2s ease",
    },
    idCell: {
      maxWidth: "100px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      color: "#718096",
      fontSize: "0.8rem",
    },
    bookCell: {
      fontWeight: "600",
      color: "#2D3748",
    },
    amountCell: {
      fontWeight: "700",
      color: "#38A169",
      position: "relative",
    },
    dateCell: {
      color: "#718096",
      fontSize: "0.85rem",
    },
    actionCell: {
      display: "flex",
      gap: "0.5rem",
    },
    editButton: {
      padding: "0.5rem 1rem",
      backgroundColor: "#ECC94B",
      color: "#744210",
      border: "none",
      borderRadius: "6px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
      fontSize: "0.8rem",
    },
    editButtonHover: {
      backgroundColor: "#D69E2E",
      transform: "translateY(-1px)",
      boxShadow: "0 2px 5px rgba(214, 158, 46, 0.3)",
    },
    saveButton: {
      padding: "0.5rem 1rem",
      backgroundColor: "#48BB78",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
      fontSize: "0.8rem",
    },
    saveButtonHover: {
      backgroundColor: "#38A169",
      transform: "translateY(-1px)",
      boxShadow: "0 2px 5px rgba(56, 161, 105, 0.3)",
    },
    deleteButton: {
      padding: "0.5rem 1rem",
      backgroundColor: "#FC8181",
      color: "#742A2A",
      border: "none",
      borderRadius: "6px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
      fontSize: "0.8rem",
    },
    deleteButtonHover: {
      backgroundColor: "#F56565",
      transform: "translateY(-1px)",
      boxShadow: "0 2px 5px rgba(245, 101, 101, 0.3)",
    },
    backButton: {
      padding: "0.75rem 1.5rem",
      backgroundColor: "#A0AEC0",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    backButtonHover: {
      backgroundColor: "#718096",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(113, 128, 150, 0.3)",
    },
    inputField: {
      padding: "0.5rem",
      border: "1px solid #CBD5E0",
      borderRadius: "4px",
      width: "100%",
      fontSize: "0.9rem",
      transition: "all 0.2s ease",
    },
    loadingContainer: {
      padding: "3rem 0",
      textAlign: "center",
    },
    loadingRow: {
      height: "60px",
      position: "relative",
      overflow: "hidden",
    },
    loadingShimmer: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%)",
      backgroundSize: "1000px 100%",
      animation: "shimmer 1.5s infinite linear",
    },
    emptyState: {
      padding: "3rem 0",
      textAlign: "center",
      color: "#718096",
    },
    // Transaction summary styles
    summaryContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "1rem",
      marginBottom: "2rem",
      animation: "fadeIn 0.5s ease-out",
    },
    summaryCard: {
      backgroundColor: "white",
      borderRadius: "10px",
      padding: "1.5rem",
      display: "flex",
      alignItems: "center",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
      transition: "all 0.3s ease",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      animation: "scaleIn 0.5s ease-out",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 8px 15px rgba(0, 0, 0, 0.1)",
      },
    },
    summaryIcon: {
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      backgroundColor: "rgba(66, 153, 225, 0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "1rem",
      color: "#4299E1",
      animation: "pulse 2s infinite",
    },
    summaryContent: {
      flex: 1,
    },
    summaryTitle: {
      fontSize: "0.9rem",
      color: "#718096",
      margin: "0 0 0.5rem 0",
    },
    summaryValue: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#2D3748",
      margin: 0,
    },
    // Transaction details styles
    detailsContainer: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      marginBottom: "2rem",
      overflow: "hidden",
      border: "1px solid rgba(226, 232, 240, 0.8)",
      animation: "scaleIn 0.3s ease-out",
    },
    detailsHeader: {
      backgroundColor: "#F7FAFC",
      padding: "1.5rem",
      borderBottom: "1px solid #E2E8F0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    detailsTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#2D3748",
      margin: 0,
    },
    closeButton: {
      backgroundColor: "transparent",
      border: "none",
      fontSize: "1.5rem",
      cursor: "pointer",
      color: "#A0AEC0",
      transition: "color 0.2s",
      "&:hover": {
        color: "#718096",
      },
    },
    detailsContent: {
      padding: "1.5rem",
    },
    detailRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0.75rem 0",
      borderBottom: "1px solid #EDF2F7",
    },
    detailLabel: {
      fontWeight: "600",
      color: "#4A5568",
    },
    detailValue: {
      color: "#2D3748",
    },
    amountValue: {
      fontWeight: "700",
      color: "#38A169",
    },
    detailActions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "1rem",
      marginTop: "1.5rem",
    },
    // Responsive styles
    responsiveContainer: {
      padding: "1rem",
    },
    responsiveTable: {
      display: "block",
      overflowX: "auto",
      WebkitOverflowScrolling: "touch",
    },
    responsiveTitle: {
      fontSize: "1.8rem",
    },
    responsiveActionBar: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
    responsiveSummary: {
      gridTemplateColumns: "1fr",
    },
    downloadIcon: {
      width: "16px",
      height: "16px",
      marginRight: "8px",
    },
    backIcon: {
      width: "16px",
      height: "16px",
      marginRight: "8px",
    },
  }

  // Check if screen is mobile
  const isMobile = window.innerWidth <= 768

  // Loading state UI
  if (isLoading) {
    return (
      <div style={isMobile ? { ...styles.container, ...styles.responsiveContainer } : styles.container}>
        <div style={styles.header}>
          <AnimatedTitle />
        </div>
        <div style={styles.tableContainer}>
          <table style={{ ...styles.table, ...(isMobile && styles.responsiveTable) }}>
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
    )
  }

  return (
    <div style={isMobile ? { ...styles.container, ...styles.responsiveContainer } : styles.container}>
      <div style={styles.header}>
        <AnimatedTitle />
      </div>

      {/* Transaction Summary Cards */}
      <TransactionSummary />

      <div style={isMobile ? { ...styles.actionBar, ...styles.responsiveActionBar } : styles.actionBar}>
        <button
          style={
            hoveredButton === "download"
              ? { ...styles.downloadButton, ...styles.downloadButtonHover }
              : hoveredButton === "download-loading"
                ? { ...styles.downloadButton, ...styles.downloadButtonLoading }
                : styles.downloadButton
          }
          onClick={downloadPDF}
          onMouseEnter={() => setHoveredButton("download")}
          onMouseLeave={() => setHoveredButton(null)}
          disabled={hoveredButton === "download-loading"}
        >
          <svg
            style={styles.downloadIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {hoveredButton === "download-loading" ? "Downloading..." : "Download PDF"}
        </button>
      </div>

      {/* Transaction Details Panel (conditionally rendered) */}
      {showTransactionDetails && <TransactionDetails />}

      <div style={styles.tableContainer}>
        {transactions.length > 0 ? (
          <table style={{ ...styles.table, ...(isMobile && styles.responsiveTable) }}>
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
                  style={hoveredRow === index ? { ...styles.tableRow, ...styles.tableRowHover } : styles.tableRow}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => showTransactionDetail(transaction)}
                >
                  <td style={{ ...styles.tableCell, ...styles.idCell }}>{transaction._id}</td>
                  <td style={{ ...styles.tableCell, ...styles.bookCell }}>
                    {transaction.bookId ? transaction.bookId.name : "Unknown"}
                  </td>
                  <td style={styles.tableCell}>
                    {editTransactionId === transaction._id ? (
                      <input
                        type="text"
                        style={styles.inputField}
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      transaction.email
                    )}
                  </td>
                  <td
                    style={
                      editTransactionId !== transaction._id
                        ? { ...styles.tableCell, ...styles.amountCell }
                        : styles.tableCell
                    }
                  >
                    {editTransactionId === transaction._id ? (
                      <input
                        type="number"
                        style={styles.inputField}
                        name="amount"
                        value={editForm.amount}
                        onChange={handleEditChange}
                        step="0.01"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      `$${transaction.amount}`
                    )}
                  </td>
                  <td style={{ ...styles.tableCell, ...styles.dateCell }}>
                    {new Date(transaction.date).toLocaleString()}
                  </td>
                  <td style={{ ...styles.tableCell, ...styles.actionCell }}>
                    {editTransactionId === transaction._id ? (
                      <button
                        style={
                          hoveredButton === `save-${index}`
                            ? { ...styles.saveButton, ...styles.saveButtonHover }
                            : styles.saveButton
                        }
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUpdate(transaction._id)
                        }}
                        onMouseEnter={() => setHoveredButton(`save-${index}`)}
                        onMouseLeave={() => setHoveredButton(null)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        style={
                          hoveredButton === `edit-${index}`
                            ? { ...styles.editButton, ...styles.editButtonHover }
                            : styles.editButton
                        }
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEdit(transaction)
                        }}
                        onMouseEnter={() => setHoveredButton(`edit-${index}`)}
                        onMouseLeave={() => setHoveredButton(null)}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      style={
                        hoveredButton === `delete-${index}`
                          ? { ...styles.deleteButton, ...styles.deleteButtonHover }
                          : styles.deleteButton
                      }
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(transaction._id)
                      }}
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
        style={hoveredButton === "back" ? { ...styles.backButton, ...styles.backButtonHover } : styles.backButton}
        onClick={() => navigate("/")}
        onMouseEnter={() => setHoveredButton("back")}
        onMouseLeave={() => setHoveredButton(null)}
      >
        <svg
          style={styles.backIcon}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </button>
    </div>
  )
}

export default AdminTransactionsPanel

