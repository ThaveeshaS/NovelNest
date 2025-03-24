"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Home = () => {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [recognition, setRecognition] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const canvasRef = useRef(null)

  // Add keyframes for animations
  useEffect(() => {
    // Create style element for keyframes
    const styleEl = document.createElement("style")
    styleEl.innerHTML = `
      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes pulse {
        0% { transform: translateY(-50%) scale(1); opacity: 1; }
        70% { transform: translateY(-50%) scale(1.5); opacity: 0; }
        100% { transform: translateY(-50%) scale(1); opacity: 0; }
      }
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
      @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      @keyframes scan {
        0% { height: 0%; top: 0%; opacity: 0.8; }
        50% { height: 100%; top: 0%; opacity: 0.5; }
        100% { height: 0%; top: 100%; opacity: 0.8; }
      }
      @keyframes dataFlow {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100%); }
      }
      @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-5px, 5px); }
        40% { transform: translate(-5px, -5px); }
        60% { transform: translate(5px, 5px); }
        80% { transform: translate(5px, -5px); }
        100% { transform: translate(0); }
      }
      @keyframes circuitPulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
    `
    document.head.appendChild(styleEl)

    // Clean up
    return () => {
      document.head.removeChild(styleEl)
    }
  }, [])

  // Initialize canvas for tech background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Create circuit-like patterns
    const circuits = []
    const nodes = []

    // Create nodes (connection points)
    for (let i = 0; i < 30; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 2 + Math.random() * 3,
        color: `rgba(66, 153, 225, ${0.3 + Math.random() * 0.5})`,
        pulse: Math.random() * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      })
    }

    // Create connections between nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = Math.sqrt(Math.pow(nodes[i].x - nodes[j].x, 2) + Math.pow(nodes[i].y - nodes[j].y, 2))

        if (distance < 200) {
          circuits.push({
            start: nodes[i],
            end: nodes[j],
            width: 1 + Math.random(),
            color: `rgba(66, 153, 225, ${0.1 + Math.random() * 0.2})`,
            dataParticles: [],
            speed: 0.5 + Math.random() * 1.5,
            active: Math.random() > 0.7, // Some circuits start active
            activeTime: 0,
            maxActiveTime: 100 + Math.random() * 200,
          })

          // Add data particles to some circuits
          if (Math.random() > 0.7) {
            for (let k = 0; k < 3; k++) {
              circuits[circuits.length - 1].dataParticles.push({
                pos: Math.random(),
                size: 2 + Math.random() * 3,
                speed: 0.002 + Math.random() * 0.005,
              })
            }
          }
        }
      }
    }

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw circuits
      circuits.forEach((circuit) => {
        // Update circuit activity
        if (circuit.active) {
          circuit.activeTime++
          if (circuit.activeTime > circuit.maxActiveTime) {
            circuit.active = false
            circuit.activeTime = 0
          }
        } else if (Math.random() > 0.995) {
          circuit.active = true
        }

        // Draw circuit line
        ctx.beginPath()
        ctx.moveTo(circuit.start.x, circuit.start.y)
        ctx.lineTo(circuit.end.x, circuit.end.y)
        ctx.strokeStyle = circuit.active ? `rgba(66, 153, 225, ${0.3 + Math.random() * 0.3})` : circuit.color
        ctx.lineWidth = circuit.width
        ctx.stroke()

        // Update and draw data particles
        if (circuit.active && circuit.dataParticles.length > 0) {
          circuit.dataParticles.forEach((particle) => {
            particle.pos += particle.speed
            if (particle.pos > 1) particle.pos = 0

            const x = circuit.start.x + (circuit.end.x - circuit.start.x) * particle.pos
            const y = circuit.start.y + (circuit.end.y - circuit.start.y) * particle.pos

            ctx.beginPath()
            ctx.arc(x, y, particle.size, 0, Math.PI * 2)
            ctx.fillStyle = "rgba(66, 153, 225, 0.8)"
            ctx.fill()
          })
        }
      })

      // Draw nodes
      nodes.forEach((node) => {
        // Update pulse
        node.pulse += node.pulseSpeed
        if (node.pulse > 2) node.pulse = 0

        const pulseRadius = node.radius * (1 + Math.sin(node.pulse * Math.PI) * 0.5)

        // Draw outer glow
        ctx.beginPath()
        ctx.arc(node.x, node.y, pulseRadius * 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(66, 153, 225, ${0.1 * Math.sin(node.pulse * Math.PI)})`
        ctx.fill()

        // Draw node
        ctx.beginPath()
        ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/books")
        setBooks(response.data)
        console.log("Books loaded:", response.data)
      } catch (error) {
        console.error("Error fetching books:", error)
        alert("Failed to load books. Check backend.")
      }
    }
    fetchBooks()

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = false
      recognitionInstance.lang = "en-US"
      recognitionInstance.interimResults = false
      recognitionInstance.maxAlternatives = 1

      recognitionInstance.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase()
        console.log("Voice command:", command)
        if (command.includes("i want book")) {
          const bookName = command.replace("i want book", "").trim()
          const book = books.find((b) => b.name.toLowerCase().includes(bookName))
          if (book) {
            navigate("/payment", { state: { book } })
            console.log("Redirecting to payment with book:", book)
          } else {
            alert('Book not found. Try "I want book [book name]".')
          }
        }
        setIsListening(false)
      }

      recognitionInstance.onerror = (event) => {
        console.error("Speech error:", event.error)
        alert("Voice recognition failed. Check microphone.")
        setIsListening(false)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    } else {
      alert("Speech recognition not supported. Use Chrome.")
    }
  }, [navigate, books])

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start()
      setIsListening(true)
      console.log("Listening for voice...")
    }
  }

  // Styles
  const styles = {
    bookstoreContainer: {
      position: "relative",
      minHeight: "100vh",
      overflow: "hidden",
      fontFamily: "'Poppins', sans-serif",
    },
    canvas: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: -2,
    },
    animatedBackground: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "linear-gradient(-45deg, #1a1a2e, #16213e, #0f3460, #1a1a2e)",
      backgroundSize: "400% 400%",
      animation: "gradient 15s ease infinite",
      opacity: 0.9,
      zIndex: -3,
    },
    contentWrapper: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "2rem",
      position: "relative",
      zIndex: 1,
    },
    bookstoreHeader: {
      textAlign: "center",
      marginBottom: "3rem",
      padding: "2rem",
      background: "rgba(26, 32, 44, 0.8)",
      borderRadius: "15px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2), 0 0 15px rgba(66, 153, 225, 0.3)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(66, 153, 225, 0.3)",
      position: "relative",
      overflow: "hidden",
    },
    headerScanLine: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "5px",
      background: "linear-gradient(90deg, transparent, rgba(66, 153, 225, 0.8), transparent)",
      animation: "scan 3s linear infinite",
      zIndex: 1,
    },
    title: {
      fontSize: "3rem",
      fontWeight: 700,
      marginBottom: "1rem",
      background: "linear-gradient(90deg, #63b3ed, #4299e1, #3182ce)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      color: "transparent",
      textShadow: "0 0 15px rgba(66, 153, 225, 0.3)",
      position: "relative",
    },
    subtitle: {
      fontSize: "1.2rem",
      color: "#e2e8f0",
      marginBottom: "2rem",
    },
    voiceButton: {
      position: "relative",
      padding: "0.8rem 2rem",
      fontSize: "1.1rem",
      fontWeight: 600,
      color: "white",
      background: "linear-gradient(135deg, #3182ce, #4299e1)",
      border: "none",
      borderRadius: "50px",
      cursor: "pointer",
      transition: "transform 0.3s, box-shadow 0.3s",
      boxShadow: "0 0 15px rgba(66, 153, 225, 0.5)",
      overflow: "hidden",
    },
    voiceButtonHover: {
      transform: "translateY(-3px)",
      boxShadow: "0 0 25px rgba(66, 153, 225, 0.8)",
    },
    voiceButtonActive: {
      background: "linear-gradient(135deg, #4299e1, #63b3ed)",
      boxShadow: "0 0 30px rgba(99, 179, 237, 0.8)",
    },
    voiceButtonRipple: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "120%",
      height: "120%",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.3)",
      opacity: 0,
      transition: "all 0.6s",
    },
    voiceButtonRippleActive: {
      opacity: 1,
      transform: "translate(-50%, -50%) scale(0)",
    },
    pulse: {
      position: "absolute",
      top: "50%",
      left: "1rem",
      transform: "translateY(-50%)",
      width: "12px",
      height: "12px",
      backgroundColor: isListening ? "#f56565" : "#fff",
      borderRadius: "50%",
      animation: isListening ? "blink 1s infinite" : "pulse 2s infinite",
    },
    buttonText: {
      marginLeft: "1rem",
      position: "relative",
      zIndex: 2,
    },
    booksGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "2rem",
      marginBottom: "3rem",
    },
    bookCard: {
      height: "100%",
      perspective: "1000px",
      transition: "transform 0.3s",
    },
    bookCardHover: {
      transform: "translateY(-10px)",
    },
    bookCardInner: {
      height: "100%",
      background: "rgba(26, 32, 44, 0.8)",
      borderRadius: "15px",
      overflow: "hidden",
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1), 0 0 10px rgba(66, 153, 225, 0.2)",
      transition: "all 0.3s",
      backdropFilter: "blur(5px)",
      border: "1px solid rgba(66, 153, 225, 0.2)",
    },
    bookCardInnerHover: {
      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2), 0 0 15px rgba(66, 153, 225, 0.4)",
      border: "1px solid rgba(66, 153, 225, 0.4)",
    },
    bookImageContainer: {
      height: "250px",
      overflow: "hidden",
      position: "relative",
    },
    bookImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.5s",
    },
    bookImageHover: {
      transform: "scale(1.05)",
    },
    bookImageOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "linear-gradient(to bottom, transparent, rgba(26, 32, 44, 0.8))",
      opacity: 0,
      transition: "opacity 0.3s",
    },
    bookImageOverlayHover: {
      opacity: 1,
    },
    bookDetails: {
      padding: "1.5rem",
    },
    bookTitle: {
      fontSize: "1.2rem",
      fontWeight: 600,
      marginBottom: "0.5rem",
      color: "#e2e8f0",
    },
    bookPrice: {
      fontSize: "1.1rem",
      fontWeight: 700,
      color: "#63b3ed",
    },
    noBooksMessage: {
      gridColumn: "1 / -1",
      textAlign: "center",
      padding: "2rem",
      background: "rgba(26, 32, 44, 0.8)",
      borderRadius: "15px",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1), 0 0 10px rgba(66, 153, 225, 0.2)",
      fontSize: "1.1rem",
      color: "#e2e8f0",
      backdropFilter: "blur(5px)",
      border: "1px solid rgba(66, 153, 225, 0.2)",
    },
    adminControls: {
      display: "flex",
      justifyContent: "center",
      gap: "1rem",
      marginTop: "2rem",
    },
    adminButton: {
      padding: "0.8rem 1.5rem",
      fontSize: "1rem",
      fontWeight: 500,
      color: "#e2e8f0",
      background: "rgba(45, 55, 72, 0.8)",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.3s",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1), 0 0 10px rgba(66, 153, 225, 0.1)",
      backdropFilter: "blur(5px)",
      border: "1px solid rgba(66, 153, 225, 0.2)",
    },
    adminButtonHover: {
      background: "rgba(45, 55, 72, 0.9)",
      color: "#fff",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15), 0 0 15px rgba(66, 153, 225, 0.3)",
      border: "1px solid rgba(66, 153, 225, 0.4)",
    },
    // Responsive styles
    responsiveTitle: {
      fontSize: "2.2rem",
    },
    responsiveBooksGrid: {
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      gap: "1.5rem",
    },
    responsiveAdminControls: {
      flexDirection: "column",
      alignItems: "center",
    },
    responsiveAdminButton: {
      width: "100%",
      maxWidth: "300px",
    },
  }

  // State for hover effects
  const [hoveredCard, setHoveredCard] = useState(null)
  const [hoveredButton, setHoveredButton] = useState(false)
  const [hoveredAdminButton, setHoveredAdminButton] = useState(null)

  // Check if screen is mobile
  const isMobile = window.innerWidth <= 768

  return (
    <div style={styles.bookstoreContainer}>
      <canvas ref={canvasRef} style={styles.canvas}></canvas>
      <div style={styles.animatedBackground}></div>

      <div style={styles.contentWrapper}>
        <header style={styles.bookstoreHeader}>
          <div style={styles.headerScanLine}></div>
          <h1 style={isMobile ? { ...styles.title, ...styles.responsiveTitle } : styles.title}>
            Voice-Enabled Book Store
          </h1>
          <p style={styles.subtitle}>Say "I want book [book name]" to buy.</p>
          <button
            style={{
              ...styles.voiceButton,
              ...(hoveredButton ? styles.voiceButtonHover : {}),
              ...(isListening ? styles.voiceButtonActive : {}),
            }}
            onClick={startListening}
            onMouseEnter={() => setHoveredButton(true)}
            onMouseLeave={() => setHoveredButton(false)}
          >
            <span style={styles.pulse}></span>
            <span style={styles.buttonText}>{isListening ? "Listening..." : "Start Voice Input"}</span>
            <div
              style={{
                ...styles.voiceButtonRipple,
                ...(isListening ? styles.voiceButtonRippleActive : {}),
              }}
            ></div>
          </button>
        </header>

        <div style={isMobile ? { ...styles.booksGrid, ...styles.responsiveBooksGrid } : styles.booksGrid}>
          {books.length > 0 ? (
            books.map((book, index) => (
              <div
                key={book._id}
                style={hoveredCard === index ? { ...styles.bookCard, ...styles.bookCardHover } : styles.bookCard}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  style={
                    hoveredCard === index
                      ? { ...styles.bookCardInner, ...styles.bookCardInnerHover }
                      : styles.bookCardInner
                  }
                >
                  <div style={styles.bookImageContainer}>
                    <img
                      src={book.coverImage || "/placeholder.svg"}
                      alt={book.name}
                      style={
                        hoveredCard === index ? { ...styles.bookImage, ...styles.bookImageHover } : styles.bookImage
                      }
                    />
                    <div
                      style={
                        hoveredCard === index
                          ? { ...styles.bookImageOverlay, ...styles.bookImageOverlayHover }
                          : styles.bookImageOverlay
                      }
                    ></div>
                  </div>
                  <div style={styles.bookDetails}>
                    <h5 style={styles.bookTitle}>{book.name}</h5>
                    <p style={styles.bookPrice}>${book.price}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={styles.noBooksMessage}>No books available. Add some via the admin panel.</p>
          )}
        </div>

        <div style={isMobile ? { ...styles.adminControls, ...styles.responsiveAdminControls } : styles.adminControls}>
          <button
            style={
              hoveredAdminButton === 0
                ? { ...styles.adminButton, ...styles.adminButtonHover, ...(isMobile && styles.responsiveAdminButton) }
                : { ...styles.adminButton, ...(isMobile && styles.responsiveAdminButton) }
            }
            onClick={() => navigate("/adminbookspanel")}
            onMouseEnter={() => setHoveredAdminButton(0)}
            onMouseLeave={() => setHoveredAdminButton(null)}
          >
            Manage Books
          </button>
          <button
            style={
              hoveredAdminButton === 1
                ? { ...styles.adminButton, ...styles.adminButtonHover, ...(isMobile && styles.responsiveAdminButton) }
                : { ...styles.adminButton, ...(isMobile && styles.responsiveAdminButton) }
            }
            onClick={() => navigate("/admin/transactions")}
            onMouseEnter={() => setHoveredAdminButton(1)}
            onMouseLeave={() => setHoveredAdminButton(null)}
          >
            View Transactions
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home

