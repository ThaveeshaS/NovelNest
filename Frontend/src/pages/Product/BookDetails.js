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
    console.log(`Added ${book.bookTitle} to cart`);
  };

  const handleBuyNow = () => {
    // Placeholder for Buy Now functionality
    console.log(`Proceeding to buy ${book.bookTitle}`);
  };

  const handleWishlist = () => {
    // Placeholder for Wishlist functionality
    console.log(`Added ${book.bookTitle} to wishlist`);
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
            <h2 className="text-primary mb-3">{book.bookTitle}</h2>

            {/* Price */}
            <p className="mb-2"><strong>Price:</strong> RS. {book.price || 'N/A'}</p>

            {/* Description */}
            <p className="mb-2"><strong>Description:</strong> {book.bookDescription || 'No description available.'}</p>

            {/* Quantity */}
            <p className="mb-2"><strong>Quantity Available:</strong> {book.bookQuantity !== undefined ? book.bookQuantity : 'N/A'}</p>

            {/* Author */}
            <p className="mb-2"><strong>Author:</strong> {book.authorName || 'Unknown'}</p>

            {/* ISBN */}
            <p className="mb-2"><strong>ISBN:</strong> {book.isbnNumber || 'N/A'}</p>

            {/* Category */}
            <p className="mb-3"><strong>Category:</strong> {book.category || 'N/A'}</p>

            {/* Action Buttons */}
            <div className="d-flex gap-2 mb-4">
              <button className="btn btn-primary d-flex align-items-center" onClick={handleAddToCart}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                Add to Cart
              </button>
              <button className="btn btn-success d-flex align-items-center" onClick={handleBuyNow}>
                Buy Now
              </button>
              <button className="btn btn-outline-danger d-flex align-items-center" onClick={handleWishlist}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                Wishlist
              </button>
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
        .btn-primary, .btn-success, .btn-outline-danger {
          transition: transform 0.2s ease;
        }
        .btn-primary:hover, .btn-success:hover, .btn-outline-danger:hover {
          transform: scale(1.05);
        }
        p {
          font-size: 1rem;
          line-height: 1.5;
        }
        h2 {
          font-size: 2rem;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default BookDetails;