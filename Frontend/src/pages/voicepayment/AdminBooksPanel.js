/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminBooksPanel = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', coverImage: '' });
  const [editBookId, setEditBookId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState('');
  const [hoveredBook, setHoveredBook] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [draggedBook, setDraggedBook] = useState(null);
  const [bookAnimation, setBookAnimation] = useState({});
  const [pageLoaded, setPageLoaded] = useState(false);
  const formRef = useRef(null);

  // Add keyframes for animations
  useEffect(() => {
    // Create style element for keyframes
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideIn {
        from { transform: translateX(-30px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes bookBounce {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-15px) rotate(2deg); }
      }
      @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
      }
      @keyframes float {
        0% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(2deg); }
        100% { transform: translateY(0px) rotate(0deg); }
      }
      @keyframes pageFlip {
        0% { transform: rotateY(0deg); transform-origin: left; }
        100% { transform: rotateY(-180deg); transform-origin: left; }
      }
      @keyframes bookOpen {
        from { transform: rotateY(0deg); }
        to { transform: rotateY(-180deg); }
      }
      @keyframes bookClose {
        from { transform: rotateY(-180deg); }
        to { transform: rotateY(0deg); }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes bookShelfSlide {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes inkDrop {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.2); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes bookRotate {
        0% { transform: rotate(0deg); }
        25% { transform: rotate(5deg); }
        75% { transform: rotate(-5deg); }
        100% { transform: rotate(0deg); }
      }
      @keyframes paperFly {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(-1000px) rotate(720deg); opacity: 0; }
      }
      @keyframes bookmarkSwing {
        0%, 100% { transform: rotate(0deg); transform-origin: top; }
        25% { transform: rotate(15deg); transform-origin: top; }
        75% { transform: rotate(-15deg); transform-origin: top; }
      }
    `;
    document.head.appendChild(styleEl);

    // Clean up
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  useEffect(() => {
    fetchBooks();
    
    // Set page as loaded after a small delay for animation
    setTimeout(() => setPageLoaded(true), 300);
    
    // Add book-related background elements
    createBookElements();
    
    return () => {
      // Clean up book elements
      const bookElements = document.querySelectorAll('.floating-book-element');
      bookElements.forEach(el => el.remove());
    };
  }, []);

  // Create floating book elements in the background
  const createBookElements = () => {
    const bookIcons = ['📚', '📖', '📕', '📗', '📘', '📙', '🔖', '✒️', '📝'];
    const container = document.body;
    
    for (let i = 0; i < 15; i++) {
      const element = document.createElement('div');
      element.className = 'floating-book-element';
      element.textContent = bookIcons[Math.floor(Math.random() * bookIcons.length)];
      element.style.position = 'fixed';
      element.style.left = `${Math.random() * 100}%`;
      element.style.top = `${Math.random() * 100}%`;
      element.style.fontSize = `${20 + Math.random() * 30}px`;
      element.style.opacity = '0.1';
      element.style.zIndex = '-1';
      element.style.animation = `float ${5 + Math.random() * 10}s infinite ease-in-out`;
      element.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(element);
    }
  };

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/books');
      setBooks(response.data);
      setTimeout(() => setIsLoading(false), 800); // Add delay for animation effect
    } catch (error) {
      console.error('Error fetching books:', error);
      showNotification('Failed to load books.', 'error');
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Update preview image when coverImage changes
    if (name === 'coverImage' && value) {
      setPreviewImage(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.price) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }
    
    setIsLoading(true);
    try {
      if (editBookId) {
        await axios.put(`http://localhost:5000/api/books/${editBookId}`, {
          name: formData.name,
          price: parseFloat(formData.price),
          coverImage: formData.coverImage || 'https://via.placeholder.com/150',
        });
        showNotification('Book updated successfully!', 'success');
        
        // Animate the updated book
        setBookAnimation({
          id: editBookId,
          animation: 'bookRotate 1s ease'
        });
      } else {
        const response = await axios.post('http://localhost:5000/api/books', {
          name: formData.name,
          price: parseFloat(formData.price),
          coverImage: formData.coverImage || 'https://via.placeholder.com/150',
        });
        showNotification('Book added successfully!', 'success');
        
        // Animate the new book
        setBookAnimation({
          id: response.data._id,
          animation: 'inkDrop 0.8s ease'
        });
      }
      setFormData({ name: '', price: '', coverImage: '' });
      setPreviewImage('');
      setEditBookId(null);
      setIsFormVisible(false);
      fetchBooks();
    } catch (error) {
      console.error('Error saving book:', error);
      showNotification('Failed to save book.', 'error');
      setIsLoading(false);
    }
  };

  const handleEdit = (book) => {
    setFormData({ name: book.name, price: book.price, coverImage: book.coverImage });
    setPreviewImage(book.coverImage);
    setEditBookId(book._id);
    setIsFormVisible(true);
    
    // Scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDelete = async (id) => {
    // Animate the book being deleted
    setBookAnimation({
      id: id,
      animation: 'paperFly 1s ease-in forwards'
    });
    
    // Delay the actual deletion to allow animation to play
    setTimeout(async () => {
      try {
        await axios.delete(`http://localhost:5000/api/books/${id}`);
        fetchBooks();
        showNotification('Book deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting book:', error);
        showNotification('Failed to delete book.', 'error');
      }
    }, 800);
  };

  // Custom notification function
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Drag and drop functionality
  const handleDragStart = (book) => {
    setDraggedBook(book);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetBook) => {
    if (draggedBook && targetBook && draggedBook._id !== targetBook._id) {
      // Reorder books (in a real app, you might want to save this order to the backend)
      const reorderedBooks = [...books];
      const draggedIndex = reorderedBooks.findIndex(book => book._id === draggedBook._id);
      const targetIndex = reorderedBooks.findIndex(book => book._id === targetBook._id);
      
      reorderedBooks.splice(draggedIndex, 1);
      reorderedBooks.splice(targetIndex, 0, draggedBook);
      
      setBooks(reorderedBooks);
      showNotification('Book order updated!', 'success');
    }
    setDraggedBook(null);
  };

  // Styles
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: "'Playfair Display', serif",
      position: 'relative',
      opacity: pageLoaded ? 1 : 0,
      transform: pageLoaded ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
    },
    backgroundImage: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: 'url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.1,
      zIndex: -2,
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      opacity: 0.8,
      zIndex: -1,
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
      position: 'relative',
    },
    title: {
      fontSize: '3rem',
      fontWeight: '700',
      marginBottom: '1rem',
      color: '#2d3748',
      position: 'relative',
      display: 'inline-block',
    },
    titleUnderline: {
      position: 'absolute',
      bottom: '-10px',
      left: '10%',
      width: '80%',
      height: '4px',
      background: 'linear-gradient(90deg, #4b6cb7, #182848)',
      borderRadius: '2px',
    },
    bookshelf: {
      position: 'relative',
      marginBottom: '3rem',
      padding: '2rem 0',
      borderBottom: '20px solid #8B4513',
      borderRadius: '0 0 5px 5px',
      boxShadow: '0 10px 15px -10px rgba(0, 0, 0, 0.3)',
      background: 'linear-gradient(to bottom, #D2B48C, #A0522D)',
      animation: 'bookShelfSlide 1s ease-out',
    },
    bookGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '2rem',
      marginBottom: '2rem',
    },
    bookCard: {
      position: 'relative',
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      transform: 'perspective(1000px) rotateY(0deg)',
      transformStyle: 'preserve-3d',
      cursor: 'grab',
    },
    bookCardHover: {
      transform: 'perspective(1000px) rotateY(10deg)',
      boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2), -10px 0 15px rgba(0, 0, 0, 0.1)',
    },
    bookCardDragging: {
      opacity: 0.5,
      transform: 'scale(0.95)',
    },
    bookImageContainer: {
      position: 'relative',
      height: '300px',
      overflow: 'hidden',
    },
    bookImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease',
    },
    bookImageHover: {
      transform: 'scale(1.05)',
    },
    bookSpine: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '20px',
      height: '100%',
      background: 'linear-gradient(to right, rgba(0,0,0,0.2), transparent)',
      zIndex: 1,
    },
    bookmarkRibbon: {
      position: 'absolute',
      top: '-10px',
      right: '20px',
      width: '30px',
      height: '60px',
      background: '#e53e3e',
      zIndex: 2,
      borderRadius: '0 0 5px 5px',
      boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
      animation: 'bookmarkSwing 5s ease-in-out infinite',
    },
    bookDetails: {
      padding: '1.5rem',
      position: 'relative',
    },
    bookTitle: {
      fontSize: '1.2rem',
      fontWeight: '700',
      marginBottom: '0.5rem',
      color: '#2d3748',
    },
    bookPrice: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#38a169',
      marginBottom: '1rem',
    },
    actionButtons: {
      display: 'flex',
      gap: '0.5rem',
    },
    editButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#f6e05e',
      color: '#744210',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontSize: '0.9rem',
      flex: 1,
    },
    editButtonHover: {
      backgroundColor: '#ecc94b',
      transform: 'translateY(-2px)',
      boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
    },
    deleteButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#fc8181',
      color: '#742a2a',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontSize: '0.9rem',
      flex: 1,
    },
    deleteButtonHover: {
      backgroundColor: '#f56565',
      transform: 'translateY(-2px)',
      boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
    },
    addBookButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.75rem 1.5rem',
      backgroundColor: '#4299e1',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '1rem',
      margin: '0 auto 2rem',
      boxShadow: '0 4px 6px rgba(66, 153, 225, 0.2)',
    },
    addBookButtonHover: {
      backgroundColor: '#3182ce',
      transform: 'translateY(-2px)',
      boxShadow: '0 7px 14px rgba(66, 153, 225, 0.3)',
    },
    formContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      maxHeight: isFormVisible ? '1000px' : '0',
      overflow: 'hidden',
      transition: 'all 0.5s ease',
      opacity: isFormVisible ? 1 : 0,
      transform: isFormVisible ? 'translateY(0)' : 'translateY(-20px)',
    },
    formTitle: {
      fontSize: '1.8rem',
      fontWeight: '700',
      marginBottom: '1.5rem',
      color: '#2d3748',
      textAlign: 'center',
    },
    formGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontSize: '1rem',
      fontWeight: '500',
      color: '#4a5568',
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      fontSize: '1rem',
      borderRadius: '8px',
      border: '2px solid #e2e8f0',
      transition: 'all 0.3s ease',
      outline: 'none',
    },
    inputFocus: {
      borderColor: '#4299e1',
      boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.2)',
    },
    formButtons: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1rem',
    },
    submitButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#48bb78',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '1rem',
      flex: 1,
    },
    submitButtonHover: {
      backgroundColor: '#38a169',
      transform: 'translateY(-2px)',
      boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
    },
    cancelButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#a0aec0',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '1rem',
      flex: 1,
    },
    cancelButtonHover: {
      backgroundColor: '#718096',
      transform: 'translateY(-2px)',
      boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
    },
    previewContainer: {
      marginTop: '1rem',
      textAlign: 'center',
    },
    previewImage: {
      maxWidth: '200px',
      maxHeight: '200px',
      objectFit: 'cover',
      borderRadius: '8px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
      animation: 'fadeIn 0.5s ease',
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.75rem 1.5rem',
      backgroundColor: '#a0aec0',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '1rem',
      marginTop: '2rem',
    },
    backButtonHover: {
      backgroundColor: '#718096',
      transform: 'translateY(-2px)',
      boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
    },
    loadingOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    loadingBook: {
      fontSize: '5rem',
      animation: 'bookBounce 1s infinite ease-in-out',
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '12px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    },
    emptyStateIcon: {
      fontSize: '4rem',
      marginBottom: '1rem',
      color: '#a0aec0',
    },
    emptyStateText: {
      fontSize: '1.2rem',
      color: '#4a5568',
      marginBottom: '1.5rem',
    },
    notification: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '15px 25px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '500',
      zIndex: 1000,
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
      animation: 'fadeIn 0.3s ease-out',
    },
    notificationSuccess: {
      backgroundColor: '#38A169',
    },
    notificationError: {
      backgroundColor: '#E53E3E',
    },
    // Responsive styles
    responsiveContainer: {
      padding: '1rem',
    },
    responsiveGrid: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    },
    responsiveTitle: {
      fontSize: '2rem',
    },
  };

  // Check if screen is mobile
  const isMobile = window.innerWidth <= 768;

  // Input focus states
  const [focusedInput, setFocusedInput] = useState(null);

  return (
    <div style={isMobile ? {...styles.container, ...styles.responsiveContainer} : styles.container}>
      <div style={styles.backgroundImage}></div>
      <div style={styles.overlay}></div>
      
      <div style={styles.header}>
        <h1 style={isMobile ? {...styles.title, ...styles.responsiveTitle} : styles.title}>
          Book Collection Manager
          <div style={styles.titleUnderline}></div>
        </h1>
      </div>
      
      <button 
        style={
          hoveredButton === 'add' 
            ? {...styles.addBookButton, ...styles.addBookButtonHover} 
            : styles.addBookButton
        }
        onClick={() => setIsFormVisible(!isFormVisible)}
        onMouseEnter={() => setHoveredButton('add')}
        onMouseLeave={() => setHoveredButton(null)}
      >
        {isFormVisible ? '✖ Close Form' : '📚 Add New Book'}
      </button>
      
      <div ref={formRef} style={styles.formContainer}>
        <h2 style={styles.formTitle}>
          {editBookId ? 'Edit Book Details' : 'Add New Book'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Book Title</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(focusedInput === 'name' ? styles.inputFocus : {})
              }}
              onFocus={() => setFocusedInput('name')}
              onBlur={() => setFocusedInput(null)}
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              style={{
                ...styles.input,
                ...(focusedInput === 'price' ? styles.inputFocus : {})
              }}
              onFocus={() => setFocusedInput('price')}
              onBlur={() => setFocusedInput(null)}
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Cover Image URL</label>
            <input
              type="text"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="e.g., https://via.placeholder.com/150"
              style={{
                ...styles.input,
                ...(focusedInput === 'coverImage' ? styles.inputFocus : {})
              }}
              onFocus={() => setFocusedInput('coverImage')}
              onBlur={() => setFocusedInput(null)}
            />
          </div>
          
          {previewImage && (
            <div style={styles.previewContainer}>
              <img 
                src={previewImage || "/placeholder.svg"} 
                alt="Cover Preview" 
                style={styles.previewImage}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150?text=Invalid+Image';
                }}
              />
            </div>
          )}
          
          <div style={styles.formButtons}>
            <button 
              type="submit" 
              style={
                hoveredButton === 'submit' 
                  ? {...styles.submitButton, ...styles.submitButtonHover} 
                  : styles.submitButton
              }
              onMouseEnter={() => setHoveredButton('submit')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              {editBookId ? 'Update Book' : 'Add Book'}
            </button>
            
            <button 
              type="button" 
              style={
                hoveredButton === 'cancel' 
                  ? {...styles.cancelButton, ...styles.cancelButtonHover} 
                  : styles.cancelButton
              }
              onClick={() => {
                setFormData({ name: '', price: '', coverImage: '' });
                setPreviewImage('');
                setEditBookId(null);
                setIsFormVisible(false);
              }}
              onMouseEnter={() => setHoveredButton('cancel')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      
      <div style={styles.bookshelf}>
        {books.length > 0 ? (
          <div style={isMobile ? {...styles.bookGrid, ...styles.responsiveGrid} : styles.bookGrid}>
            {books.map(book => (
              <div 
                key={book._id} 
                style={{
                  ...styles.bookCard,
                  ...(hoveredBook === book._id ? styles.bookCardHover : {}),
                  ...(draggedBook && draggedBook._id === book._id ? styles.bookCardDragging : {}),
                  ...(bookAnimation.id === book._id ? { animation: bookAnimation.animation } : {})
                }}
                onMouseEnter={() => setHoveredBook(book._id)}
                onMouseLeave={() => setHoveredBook(null)}
                draggable
                onDragStart={() => handleDragStart(book)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(book)}
              >
                <div style={styles.bookSpine}></div>
                {Math.random() > 0.5 && <div style={styles.bookmarkRibbon}></div>}
                <div style={styles.bookImageContainer}>
                  <img 
                    src={book.coverImage || "/placeholder.svg"} 
                    alt={book.name} 
                    style={hoveredBook === book._id ? 
                      {...styles.bookImage, ...styles.bookImageHover} : 
                      styles.bookImage
                    }
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150?text=Book+Cover';
                    }}
                  />
                </div>
                <div style={styles.bookDetails}>
                  <h5 style={styles.bookTitle}>{book.name}</h5>
                  <p style={styles.bookPrice}>${book.price.toFixed(2)}</p>
                  <div style={styles.actionButtons}>
                    <button 
                      style={
                        hoveredButton === `edit-${book._id}` 
                          ? {...styles.editButton, ...styles.editButtonHover} 
                          : styles.editButton
                      }
                      onClick={() => handleEdit(book)}
                      onMouseEnter={() => setHoveredButton(`edit-${book._id}`)}
                      onMouseLeave={() => setHoveredButton(null)}
                    >
                      Edit
                    </button>
                    <button 
                      style={
                        hoveredButton === `delete-${book._id}` 
                          ? {...styles.deleteButton, ...styles.deleteButtonHover} 
                          : styles.deleteButton
                      }
                      onClick={() => handleDelete(book._id)}
                      onMouseEnter={() => setHoveredButton(`delete-${book._id}`)}
                      onMouseLeave={() => setHoveredButton(null)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>📚</div>
            <p style={styles.emptyStateText}>Your bookshelf is empty. Add some books to get started!</p>
            <button 
              style={
                hoveredButton === 'add-empty' 
                  ? {...styles.addBookButton, ...styles.addBookButtonHover} 
                  : styles.addBookButton
              }
              onClick={() => setIsFormVisible(true)}
              onMouseEnter={() => setHoveredButton('add-empty')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Add Your First Book
            </button>
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
        ← Back to Home
      </button>
      
      {isLoading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingBook}>📚</div>
        </div>
      )}
      
      {notification.show && (
        <div 
          style={{
            ...styles.notification,
            ...(notification.type === 'success' ? styles.notificationSuccess : styles.notificationError)
          }}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default AdminBooksPanel;