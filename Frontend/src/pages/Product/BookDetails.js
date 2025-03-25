import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header2 from '../../components/Header2';
import Navbar2 from '../../components/Navbar2';

const BookDetails = () => {
  const { id } = useParams(); // Get the book ID from the URL
  const navigate = useNavigate(); // For navigating back to the book list
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1); // State for the selected quantity

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
    navigate('/bookslist'); // Navigate back to the book list page
  };

  const handleAddToCart = () => {
    // Placeholder for Add to Cart functionality
    console.log(`Added ${book.bookTitle} to cart with quantity: ${selectedQuantity}`);
  };

  const handleBuyNow = () => {
    // Placeholder for Buy Now functionality
    console.log(`Proceeding to buy ${book.bookTitle} with quantity: ${selectedQuantity}`);
  };

  const handleWishlist = () => {
    // Placeholder for Wishlist functionality
    console.log(`Added ${book.bookTitle} to wishlist`);
  };

  const handleIncrement = () => {
    // Increment the selected quantity, but not beyond the available quantity
    if (book && selectedQuantity < book.bookQuantity) {
      setSelectedQuantity(selectedQuantity + 1);
    }
  };

  const handleDecrement = () => {
    // Decrement the selected quantity, but not below 1
    if (selectedQuantity > 1) {
      setSelectedQuantity(selectedQuantity - 1);
    }
  };

  // Determine stock status and color
  const getStockStatus = (quantity) => {
    if (quantity === 0) {
      return { text: 'Out of Stock', color: 'red' };
    } else if (quantity >= 1 && quantity <= 5) {
      return { text: 'Limited Stock', color: 'orange' };
    } else if (quantity > 10) {
      return { text: 'In Stock', color: 'green' };
    } else {
      return { text: 'In Stock', color: 'green' };
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (!book) {
    return <div>Book not found.</div>;
  }

  // Get stock status for the current book
  const stockStatus = getStockStatus(book.bookQuantity);

  return (
    <div>
      <Header2 />
      <Navbar2 />
      <div className="container my-5">
        <div className="row">
          {/* Left Column: Book Cover */}
          <div className="col-md-4 text-center mb-4 mb-md-0">
            <img
              src={book.coverPage}
              alt={book.bookTitle}
              style={{
                maxHeight: '400px',
                width: 'auto',
                maxWidth: '100%',
                objectFit: 'contain',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              }}
              onError={(e) => (e.target.src = 'https://via.placeholder.com/200x300?text=No+Image')}
            />
          </div>

          {/* Right Column: Book Details */}
          <div className="col-md-8">
            {/* Title */}
            <h1 className="mb-3" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333' }}>
              {book.bookTitle}
            </h1>

            {/* Price */}
            <p className="mb-1" style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#e60000' }}>
              RS. {book.price || 'N/A'}
            </p>

            {/* Stock Status Indicator and Hurry Message */}
            <div className="mb-3">
              <p className="mb-1" style={{ fontSize: '0.9rem', color: stockStatus.color }}>
                {stockStatus.text}
              </p>
              {book.bookQuantity > 0 && book.bookQuantity <= 5 && (
                <p className="text-danger" style={{ fontSize: '0.9rem' }}>
                  Hurry, Only {book.bookQuantity} left!
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.6' }}>
                {book.bookDescription || 'No description available.'}
              </p>
              {/* Example bullet points (you can customize these based on your data) */}
              <ul style={{ fontSize: '1rem', color: '#555', lineHeight: '1.6', paddingLeft: '20px' }}>
                <li>The inner game of selling.</li>
                <li>How to eliminate the fear of rejection.</li>
                <li>How to build unshakeable confidence.</li>
              </ul>
            </div>

            {/* Quantity Selector and Action Buttons */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-secondary rounded-circle"
                  onClick={handleDecrement}
                  disabled={selectedQuantity <= 1 || book.bookQuantity === 0}
                  style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <span style={{ fontSize: '1.5rem', lineHeight: '1' }}>-</span>
                </button>
                <div
                  className="border rounded text-center"
                  style={{ width: '50px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}
                >
                  {selectedQuantity}
                </div>
                <button
                  className="btn btn-outline-secondary rounded-circle"
                  onClick={handleIncrement}
                  disabled={selectedQuantity >= book.bookQuantity || book.bookQuantity === 0}
                  style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <span style={{ fontSize: '1.5rem', lineHeight: '1' }}>+</span>
                </button>
              </div>
              <button
                className="btn btn-primary text-uppercase"
                onClick={handleAddToCart}
                disabled={book.bookQuantity === 0}
                style={{ backgroundColor: '#007bff', borderColor: '#007bff', padding: '10px 20px', fontWeight: 'bold' }}
              >
                Add to Cart
              </button>
              <button
                className="btn btn-warning text-uppercase"
                onClick={handleBuyNow}
                disabled={book.bookQuantity === 0}
                style={{ backgroundColor: '#ff6200', borderColor: '#ff6200', padding: '10px 20px', fontWeight: 'bold', color: '#fff' }}
              >
                Buy Now
              </button>
            </div>

            {/* Wishlist Link */}
            <div className="mb-4">
              <button
                className="btn p-0 d-flex align-items-center"
                onClick={handleWishlist}
                style={{ color: '#007bff', fontSize: '0.9rem', border: 'none', background: 'none' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="me-1"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                Add to Wishlist
              </button>
            </div>

            {/* Author, ISBN, Category */}
            <div>
              <p className="mb-1" style={{ fontSize: '0.9rem', color: '#555' }}>
                <strong>Author:</strong> {book.authorName || 'Unknown'}
              </p>
              <p className="mb-1" style={{ fontSize: '0.9rem', color: '#555' }}>
                <strong>SKU:</strong> {book.isbnNumber || 'N/A'}
              </p>
              <p className="mb-3" style={{ fontSize: '0.9rem', color: '#555' }}>
                <strong>Category:</strong> {book.category || 'N/A'}
              </p>
            </div>

            {/* Back Button */}
            <button className="btn btn-secondary" onClick={handleBack}>
              Back to Book List
            </button>
          </div>
        </div>
      </div>

      {/* Optional Custom Styles */}
      <style jsx>{`
        .btn-primary, .btn-warning {
          transition: transform 0.2s ease;
        }
        .btn-primary:hover, .btn-warning:hover {
          transform: scale(1.05);
        }
        .btn-outline-secondary:disabled,
        .btn-primary:disabled,
        .btn-warning:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        ul {
          list-style-type: disc;
        }
      `}</style>
    </div>
  );
};

export default BookDetails;