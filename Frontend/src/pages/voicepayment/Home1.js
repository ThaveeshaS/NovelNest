import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [recognition, setRecognition] = useState(null);

  // Add keyframes for animations
  useEffect(() => {
    // Create style element for keyframes
    const styleEl = document.createElement('style');
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
    `;
    document.head.appendChild(styleEl);

    // Clean up
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/books');
        setBooks(response.data);
        console.log('Books loaded:', response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
        alert('Failed to load books. Check backend.');
      }
    };
    fetchBooks();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.interimResults = false;
      recognitionInstance.maxAlternatives = 1;

      recognitionInstance.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        console.log('Voice command:', command);
        if (command.includes('i want book')) {
          const bookName = command.replace('i want book', '').trim();
          const book = books.find(b => b.name.toLowerCase().includes(bookName));
          if (book) {
            navigate('/payment', { state: { book } });
            console.log('Redirecting to payment with book:', book);
          } else {
            alert('Book not found. Try "I want book [book name]".');
          }
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech error:', event.error);
        alert('Voice recognition failed. Check microphone.');
      };

      setRecognition(recognitionInstance);
    } else {
      alert('Speech recognition not supported. Use Chrome.');
    }
  }, [navigate, books]);

  const startListening = () => {
    if (recognition && !recognition.isActive) {
      recognition.start();
      console.log('Listening for voice...');
    }
  };

  // Styles
  const styles = {
    bookstoreContainer: {
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden',
      fontFamily: "'Poppins', sans-serif",
    },
    animatedBackground: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
      backgroundSize: '400% 400%',
      animation: 'gradient 15s ease infinite',
      opacity: 0.15,
      zIndex: -1,
    },
    contentWrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
    },
    bookstoreHeader: {
      textAlign: 'center',
      marginBottom: '3rem',
      padding: '2rem',
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontSize: '3rem',
      fontWeight: 700,
      marginBottom: '1rem',
      background: 'linear-gradient(90deg, #4b6cb7, #182848)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      color: 'transparent',
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#555',
      marginBottom: '2rem',
    },
    voiceButton: {
      position: 'relative',
      padding: '0.8rem 2rem',
      fontSize: '1.1rem',
      fontWeight: 600,
      color: 'white',
      background: 'linear-gradient(135deg, #6e8efb, #a777e3)',
      border: 'none',
      borderRadius: '50px',
      cursor: 'pointer',
      transition: 'transform 0.3s, box-shadow 0.3s',
      boxShadow: '0 5px 15px rgba(110, 142, 251, 0.4)',
    },
    voiceButtonHover: {
      transform: 'translateY(-3px)',
      boxShadow: '0 8px 20px rgba(110, 142, 251, 0.6)',
    },
    pulse: {
      position: 'absolute',
      top: '50%',
      left: '1rem',
      transform: 'translateY(-50%)',
      width: '12px',
      height: '12px',
      backgroundColor: '#fff',
      borderRadius: '50%',
      animation: 'pulse 2s infinite',
    },
    buttonText: {
      marginLeft: '1rem',
    },
    booksGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '2rem',
      marginBottom: '3rem',
    },
    bookCard: {
      height: '100%',
      perspective: '1000px',
      transition: 'transform 0.3s',
    },
    bookCardHover: {
      transform: 'translateY(-10px)',
    },
    bookCardInner: {
      height: '100%',
      background: 'white',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
      transition: 'box-shadow 0.3s',
    },
    bookCardInnerHover: {
      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
    },
    bookImageContainer: {
      height: '250px',
      overflow: 'hidden',
    },
    bookImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s',
    },
    bookImageHover: {
      transform: 'scale(1.05)',
    },
    bookDetails: {
      padding: '1.5rem',
    },
    bookTitle: {
      fontSize: '1.2rem',
      fontWeight: 600,
      marginBottom: '0.5rem',
      color: '#333',
    },
    bookPrice: {
      fontSize: '1.1rem',
      fontWeight: 700,
      color: '#6e8efb',
    },
    noBooksMessage: {
      gridColumn: '1 / -1',
      textAlign: 'center',
      padding: '2rem',
      background: 'white',
      borderRadius: '15px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
      fontSize: '1.1rem',
      color: '#555',
    },
    adminControls: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      marginTop: '2rem',
    },
    adminButton: {
      padding: '0.8rem 1.5rem',
      fontSize: '1rem',
      fontWeight: 500,
      color: '#555',
      background: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    },
    adminButtonHover: {
      background: '#f8f8f8',
      color: '#333',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
    },
    // Responsive styles
    responsiveTitle: {
      fontSize: '2.2rem',
    },
    responsiveBooksGrid: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '1.5rem',
    },
    responsiveAdminControls: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    responsiveAdminButton: {
      width: '100%',
      maxWidth: '300px',
    }
  };

  // State for hover effects
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(false);
  const [hoveredAdminButton, setHoveredAdminButton] = useState(null);

  // Check if screen is mobile
  const isMobile = window.innerWidth <= 768;

  return (
    <div style={styles.bookstoreContainer}>
      <div style={styles.animatedBackground}></div>
      <div style={styles.contentWrapper}>
        <header style={styles.bookstoreHeader}>
          <h1 style={isMobile ? {...styles.title, ...styles.responsiveTitle} : styles.title}>
            Voice-Enabled Book Store
          </h1>
          <p style={styles.subtitle}>Say "I want book [book name]" to buy.</p>
          <button 
            style={hoveredButton ? {...styles.voiceButton, ...styles.voiceButtonHover} : styles.voiceButton}
            onClick={startListening}
            onMouseEnter={() => setHoveredButton(true)}
            onMouseLeave={() => setHoveredButton(false)}
          >
            <span style={styles.pulse}></span>
            <span style={styles.buttonText}>Start Voice Input</span>
          </button>
        </header>
        
        <div style={isMobile ? {...styles.booksGrid, ...styles.responsiveBooksGrid} : styles.booksGrid}>
          {books.length > 0 ? (
            books.map((book, index) => (
              <div 
                key={book._id} 
                style={hoveredCard === index ? {...styles.bookCard, ...styles.bookCardHover} : styles.bookCard}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div 
                  style={hoveredCard === index ? 
                    {...styles.bookCardInner, ...styles.bookCardInnerHover} : 
                    styles.bookCardInner
                  }
                >
                  <div style={styles.bookImageContainer}>
                    <img 
                      src={book.coverImage || "/placeholder.svg"} 
                      alt={book.name} 
                      style={hoveredCard === index ? 
                        {...styles.bookImage, ...styles.bookImageHover} : 
                        styles.bookImage
                      } 
                    />
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
        
        <div style={isMobile ? {...styles.adminControls, ...styles.responsiveAdminControls} : styles.adminControls}>
          <button 
            style={hoveredAdminButton === 0 ? 
              {...styles.adminButton, ...styles.adminButtonHover, ...(isMobile && styles.responsiveAdminButton)} : 
              {...styles.adminButton, ...(isMobile && styles.responsiveAdminButton)}
            }
            onClick={() => navigate('/adminbookspanel')}
            onMouseEnter={() => setHoveredAdminButton(0)}
            onMouseLeave={() => setHoveredAdminButton(null)}
          >
            Manage Books
          </button>
          <button 
            style={hoveredAdminButton === 1 ? 
              {...styles.adminButton, ...styles.adminButtonHover, ...(isMobile && styles.responsiveAdminButton)} : 
              {...styles.adminButton, ...(isMobile && styles.responsiveAdminButton)}
            }
            onClick={() => navigate('/admin/transactions')}
            onMouseEnter={() => setHoveredAdminButton(1)}
            onMouseLeave={() => setHoveredAdminButton(null)}
          >
            View Transactions
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;