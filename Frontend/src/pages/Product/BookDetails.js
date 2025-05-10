import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header2 from '../../components/Header2';
import Navbar2 from '../../components/Navbar2';
import { useWishlist } from '../../pages/Product/WishlistContext';
import { useCart } from '../../pages/Product/CartContext';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:5000/api/product/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error('Error fetching book details:', error);
        setError('Failed to load book details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleBack = () => {
    navigate('/bookslist');
  };

  const handleAddToCart = () => {
    if (book && book.bookQuantity > 0) {
      setIsCartLoading(true);
      const cartItem = {
        _id: book._id || id,
        bookTitle: book.bookTitle,
        price: book.price,
        coverPage: book.coverPage,
        authorName: book.authorName,
        bookQuantity: book.bookQuantity,
        quantity: selectedQuantity,
      };
      addToCart(cartItem, selectedQuantity);
      
      // Show success message
      setTimeout(() => {
        setIsCartLoading(false);
        setShowAddedMessage(true);
        setTimeout(() => {
          setShowAddedMessage(false);
        }, 3000);
      }, 1000);
    }
  };

  const handleBuyNow = () => {
    console.log(`Proceeding to buy ${book.bookTitle} with quantity: ${selectedQuantity}`);
    // Add your buy now functionality here
  };

  const handleWishlist = () => {
    if (isInWishlist(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist(book);
    }
  };

  const handleIncrement = () => {
    if (book && selectedQuantity < book.bookQuantity) {
      setSelectedQuantity(selectedQuantity + 1);
    }
  };

  const handleDecrement = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity(selectedQuantity - 1);
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) {
      return { text: 'Out of Stock', color: 'red', bgColor: '#ffebee' };
    } else if (quantity >= 1 && quantity <= 5) {
      return { text: 'Limited Stock', color: '#ff6d00', bgColor: '#fff3e0' };
    } else {
      return { text: 'In Stock', color: '#2e7d32', bgColor: '#e8f5e9' };
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="book">
          <div className="book__page"></div>
          <div className="book__page"></div>
          <div className="book__page"></div>
        </div>
        <p>Loading book details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">
          <i className="bi bi-exclamation-triangle"></i>
        </div>
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={handleBack}>
          Return to Books
        </button>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="error-container">
        <div className="error-icon">
          <i className="bi bi-question-circle"></i>
        </div>
        <h3>Book Not Found</h3>
        <p>We couldn't find the book you're looking for.</p>
        <button className="btn btn-primary" onClick={handleBack}>
          Return to Books
        </button>
      </div>
    );
  }

  const stockStatus = getStockStatus(book.bookQuantity);

  return (
    <div className="book-details-page">
      <Header2 />
      <Navbar2 />
      
      <div className="book-details-breadcrumb">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
              <li className="breadcrumb-item"><a href="/bookslist" className="text-decoration-none">Books</a></li>
              <li className="breadcrumb-item active" aria-current="page">{book.bookTitle}</li>
            </ol>
          </nav>
        </div>
      </div>
      
      <div className="container my-4">
        <div className="book-details-card">
          <div className="row g-0">
            <div className="col-lg-4 book-image-container">
              <div className="image-wrapper">
                <img
                  src={book.coverPage}
                  alt={book.bookTitle}
                  className="book-cover"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/300x450?text=No+Image')}
                />
                {book.bookQuantity === 0 && (
                  <div className="out-of-stock-overlay">
                    <span>Out of Stock</span>
                  </div>
                )}
                {book.discount > 0 && (
                  <div className="ribbon">
                    -{book.discount}%
                  </div>
                )}
              </div>
            </div>
            
            <div className="col-lg-8">
              <div className="book-info-container">
                <div className="book-header">
                  <h1 className="book-title">{book.bookTitle}</h1>
                </div>
                
                <div className="price-section">
                  <div className="price">Rs. {book.price ? Number(book.price).toFixed(2) : 'N/A'}</div>
                  {book.originalPrice && book.originalPrice > book.price && (
                    <span className="original-price">Rs. {Number(book.originalPrice).toFixed(2)}</span>
                  )}
                  <div className={`stock-badge ${stockStatus.text.toLowerCase().replace(/\s+/g, '-')}`} style={{ backgroundColor: stockStatus.bgColor, color: stockStatus.color }}>
                    {stockStatus.text}
                    {book.bookQuantity > 0 && book.bookQuantity <= 5 && (
                      <span> - Only {book.bookQuantity} left!</span>
                    )}
                  </div>
                </div>
                
                <div className="book-description">
                  <p>{book.bookDescription || 'No description available.'}</p>
                </div>
                
                <div className="actions-section">
                  <div className="quantity-selector">
                    <button
                      className="btn quantity-btn"
                      onClick={handleDecrement}
                      disabled={selectedQuantity <= 1 || book.bookQuantity === 0}
                    >
                      −
                    </button>
                    <div className="quantity-display">
                      {selectedQuantity}
                    </div>
                    <button
                      className="btn quantity-btn"
                      onClick={handleIncrement}
                      disabled={selectedQuantity >= book.bookQuantity || book.bookQuantity === 0}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="main-actions">
                    <button
                      className={`btn add-to-cart-btn ${book.bookQuantity === 0 ? 'disabled' : ''}`}
                      onClick={handleAddToCart}
                      disabled={book.bookQuantity === 0 || isCartLoading}
                    >
                      {isCartLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          <span className="ms-2">Adding...</span>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-cart-plus me-2"></i>
                          Add to Cart
                        </>
                      )}
                    </button>
                    
                    <button
                      className={`btn buy-now-btn ${book.bookQuantity === 0 ? 'disabled' : ''}`}
                      onClick={handleBuyNow}
                      disabled={book.bookQuantity === 0}
                    >
                      <i className="bi bi-lightning-charge-fill me-2"></i>
                      Buy Now
                    </button>
                  </div>
                  
                  <button
                    className={`btn wishlist-btn ${isInWishlist(id) ? 'in-wishlist' : ''}`}
                    onClick={handleWishlist}
                  >
                    <i className={`bi ${isInWishlist(id) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                    <span className="ms-2">
                      {isInWishlist(id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </span>
                  </button>
                </div>
                
                {showAddedMessage && (
                  <div className="added-to-cart-message">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Added to cart successfully!
                  </div>
                )}
                
                <div className="book-metadata">
                  <div className="metadata-item">
                    <span className="metadata-label">Author:</span>
                    <span className="metadata-value">{book.authorName || 'Unknown Author'}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">ISBN:</span>
                    <span className="metadata-value">{book.isbnNumber || 'N/A'}</span>
                  </div>
                  <div className="metadata-item">
                    <span className="metadata-label">Category:</span>
                    <span className="metadata-value">{book.category || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="back-button-container mt-4">
          <button className="btn btn-outline-primary" onClick={handleBack}>
            <i className="bi bi-arrow-left me-2"></i>
            Back to Book List
          </button>
        </div>
      </div>
      
      <style jsx>{`
        /* General Styling */
        .book-details-page {
          font-family: 'Poppins', sans-serif;
          background-color: #f8f9fa;
          color: #333;
        }
        
        .book-details-breadcrumb {
          background-color: white;
          padding: 10px 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          margin-bottom: 20px;
        }
        
        .breadcrumb {
          margin-bottom: 0;
          font-size: 0.85rem;
        }
        
        .breadcrumb-item a {
          color: #0066cc;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        
        .breadcrumb-item a:hover {
          color: #004c99;
        }
        
        .breadcrumb-item.active {
          color: #343a40;
          font-weight: 500;
        }
        
        /* Book Details Card */
        .book-details-card {
          background-color: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        
        .book-details-card:hover {
          box-shadow: 0 8px 30px rgba(0, 102, 204, 0.15);
          transform: translateY(-5px);
        }
        
        /* Book Image Section */
        .book-image-container {
          position: relative;
          background-color: #f8f9fa;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
          border-right: 1px solid #eee;
        }
        
        .image-wrapper {
          position: relative;
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .book-cover {
          max-height: 450px;
          max-width: 100%;
          object-fit: contain;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          border-radius: 8px;
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .book-cover:hover {
          transform: scale(1.05);
        }
        
        .out-of-stock-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255,255,255,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }
        
        .out-of-stock-overlay span {
          background-color: #ff0000;
          color: white;
          padding: 8px 20px;
          border-radius: 30px;
          font-weight: bold;
          font-size: 1.2rem;
          transform: rotate(-15deg);
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }
        
        .ribbon {
          position: absolute;
          top: 20px;
          left: 0;
          background: #ff3e3e;
          color: white;
          padding: 5px 15px;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 0 4px 4px 0;
          box-shadow: 2px 2px 10px rgba(0,0,0,0.2);
          z-index: 2;
        }
        
        /* Book Info Section */
        .book-info-container {
          padding: 30px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .book-header {
          margin-bottom: 20px;
        }
        
        .book-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 10px;
          color: #212529;
          line-height: 1.2;
        }
        
        /* Price Section */
        .price-section {
          display: flex;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        
        .price {
          font-size: 2rem;
          font-weight: 700;
          color: #0066cc;
          margin-right: 15px;
        }
        
        .original-price {
          font-size: 1.2rem;
          color: #999;
          text-decoration: line-through;
          margin-right: 15px;
        }
        
        .stock-badge {
          display: inline-block;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        
        .stock-badge.in-stock {
          background-color: #e8f5e9;
          color: #2e7d32;
        }
        
        .stock-badge.limited-stock {
          background-color: #fff3e0;
          color: #ff6d00;
        }
        
        .stock-badge.out-of-stock {
          background-color: #ffebee;
          color: #c62828;
        }
        
        /* Book Description */
        .book-description {
          margin-bottom: 30px;
        }
        
        .book-description p {
          font-size: 1rem;
          line-height: 1.6;
          color: #495057;
          margin-bottom: 15px;
        }
        
        /* Actions Section */
        .actions-section {
          margin-bottom: 20px;
        }
        
        .quantity-selector {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 5px;
          width: fit-content;
        }
        
        .quantity-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          background-color: white;
          border: none;
          border-radius: 6px;
          transition: all 0.2s ease;
          color: #495057;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        
        .quantity-btn:hover:not(:disabled) {
          background-color: #e9ecef;
          transform: translateY(-2px);
        }
        
        .quantity-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        
        .quantity-display {
          width: 50px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          font-weight: 500;
          color: #212529;
          margin: 0 5px;
        }
        
        .main-actions {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
        }
        
        .add-to-cart-btn, .buy-now-btn {
          padding: 12px 25px;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .add-to-cart-btn {
          background-color: #0066cc;
          border-color: #0066cc;
          color: white;
        }
        
        .add-to-cart-btn:hover:not(:disabled) {
          background-color: #004c99;
          transform: translateY(-3px);
          box-shadow: 0 8px 15px rgba(0, 102, 204, 0.3);
        }
        
        .buy-now-btn {
          background-color: #ff6b00;
          border-color: #ff6b00;
          color: white;
        }
        
        .buy-now-btn:hover:not(:disabled) {
          background-color: #e55f00;
          transform: translateY(-3px);
          box-shadow: 0 8px 15px rgba(255, 107, 0, 0.3);
        }
        
        .wishlist-btn {
          background-color: transparent;
          border: 1px solid #ced4da;
          color: #6c757d;
          border-radius: 8px;
          padding: 10px 15px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        
        .wishlist-btn:hover {
          background-color: #f8f9fa;
          transform: translateY(-2px);
        }
        
        .wishlist-btn.in-wishlist {
          color: #ff3e3e;
          border-color: #ff3e3e;
        }
        
        .wishlist-btn.in-wishlist:hover {
          background-color: #ffebee;
        }
        
        /* Added to Cart Message */
        .added-to-cart-message {
          display: flex;
          align-items: center;
          padding: 12px 15px;
          background-color: #e8f5e9;
          border-left: 4px solid #4caf50;
          color: #2e7d32;
          border-radius: 4px;
          margin-top: 15px;
          margin-bottom: 15px;
          animation: fadeInUp 0.5s ease-out;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        /* Book Metadata */
        .book-metadata {
          margin-top: auto;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        
        .metadata-item {
          display: flex;
          margin-bottom: 8px;
        }
        
        .metadata-label {
          font-weight: 600;
          color: #6c757d;
          width: 100px;
        }
        
        .metadata-value {
          color: #212529;
        }
        
        /* Back Button */
        .back-button-container {
          text-align: center;
        }
        
        .btn-outline-primary {
          color: #0066cc;
          border-color: #0066cc;
          transition: all 0.3s ease;
        }
        
        .btn-outline-primary:hover {
          background-color: #0066cc;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 102, 204, 0.2);
        }
        
        /* Loading Animation */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 60vh;
        }
        
        .book {
          --color: #0066cc;
          --duration: 6.8s;
          width: 32px;
          height: 12px;
          position: relative;
          margin: 32px 0 0 0;
          zoom: 1.5;
        }
        
        .book .book__page {
          width: 32px;
          height: 44px;
          background: var(--color);
          position: absolute;
          top: 0;
          right: 0;
          animation: pages var(--duration) infinite;
        }
        
        .book .book__page:nth-child(1) {
          --delay: 0.36s;
        }
        .book .book__page:nth-child(2) {
          --delay: 0.72s;
        }
        .book .book__page:nth-child(3) {
          --delay: 1.08s;
        }
        
        @keyframes pages {
          0% {
            transform: rotateY(0deg);
            right: 0;
          }
          20% {
            background: var(--color);
          }
          40% {
            transform: rotateY(-180deg);
            background: #e6f0ff;
            right: 32px;
            z-index: 1;
          }
          80% {
            transform: rotateY(-180deg);
            right: 32px;
            z-index: 1;
            background: #e6f0ff;
          }
          100% {
            transform: rotateY(0deg);
            right: 0;
          }
        }
        
        .loading-container p {
          color: #6c757d;
          margin-top: 20px;
          font-size: 1.1rem;
        }
        
        /* Error Container */
        .error-container {
          text-align: center;
          padding: 50px 20px;
          max-width: 500px;
          margin: 0 auto;
        }
        
        .error-icon {
          font-size: 3rem;
          color: #ff3e3e;
          margin-bottom: 20px;
        }
        
        .error-container h3 {
          margin-bottom: 15px;
          color: #343a40;
        }
        
        .error-container p {
          color: #6c757d;
          margin-bottom: 25px;
        }
        
        /* Responsive Styles */
        @media (max-width: 991.98px) {
          .book-image-container {
            padding: 20px;
            min-height: 400px;
            border-right: none;
            border-bottom: 1px solid #eee;
          }
          
          .book-info-container {
            padding: 20px;
          }
          
          .book-title {
            font-size: 2rem;
          }
          
          .price {
            font-size: 1.8rem;
          }
          
          .main-actions {
            flex-direction: column;
            gap: 10px;
          }
          
          .add-to-cart-btn, .buy-now-btn {
            width: 100%;
          }
        }
        
        @media (max-width: 767.98px) {
          .book-image-container {
            min-height: 300px;
          }
          
          .book-cover {
            max-height: 300px;
          }
          
          .book-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default BookDetails;