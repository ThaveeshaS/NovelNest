import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Header2 from '../../components/Header2';
import Navbar2 from '../../components/Navbar2';
import axios from 'axios';
import { useWishlist } from '../../pages/Product/WishlistContext'; // Added import

const BookList = () => {
  const [fictionBooks, setFictionBooks] = useState([]);
  const [nonFictionBooks, setNonFictionBooks] = useState([]);
  const [childrenBooks, setChildrenBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      setFictionBooks([]);
      setNonFictionBooks([]);
      setChildrenBooks([]);

      const [fictionResponse, nonFictionResponse, childrenResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/product/category/Fiction'),
        axios.get('http://localhost:5000/api/product/category/Non-Fiction'),
        axios.get('http://localhost:5000/api/product/category/Children\'s & Young Adult'),
      ]);

      const uniqueFiction = removeDuplicates(fictionResponse.data, 'isbnNumber');
      const uniqueNonFiction = removeDuplicates(nonFictionResponse.data, 'isbnNumber');
      const uniqueChildren = removeDuplicates(childrenResponse.data, 'isbnNumber');

      setFictionBooks(uniqueFiction);
      setNonFictionBooks(uniqueNonFiction);
      setChildrenBooks(uniqueChildren);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to load books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const removeDuplicates = (array, key) => {
    if (!Array.isArray(array)) return [];
    const seen = new Set();
    return array.filter(item => {
      const value = item[key]?.toString().trim().toLowerCase();
      if (!value || seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  };

  // Updated ProductCard component
  const ProductCard = ({ product }) => {
    const { addToWishlist, isInWishlist } = useWishlist();
    const handleWishlistClick = (e) => {
      e.stopPropagation();
      addToWishlist(product);
    };

    return (
      <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
        <div
          className="card shadow-sm mx-auto product-card-container"
          style={{
            border: 'none',
            padding: '5px',
            height: '340px',
            width: '220px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
          onClick={() => navigate(`/bookdetails/${product._id}`)}
        >
          <div
            style={{
              padding: '10px',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              position: 'relative',
            }}
            className="product-image-container"
          >
            <img
              src={product.coverPage}
              className="card-img-top"
              alt={product.bookTitle}
              style={{
                maxHeight: '200px',
                width: 'auto',
                maxWidth: '160px',
                objectFit: 'contain',
                borderRadius: '10px 10px 0 0',
                transition: 'transform 0.3s ease',
              }}
              onError={(e) => (e.target.src = 'https://via.placeholder.com/160x200?text=No+Image')}
            />
            <div className="hover-overlay">
              <div className="add-to-cart-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <div 
                className="wishlist-icon"
                onClick={handleWishlistClick}
                style={{ color: isInWishlist(product._id) ? '#ff0000' : '#6c757d' }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill={isInWishlist(product._id) ? '#ff0000' : 'none'}
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div
            className="card-body text-center"
            style={{
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '120px',
            }}
          >
            <h5
              className="card-title text-center"
              style={{
                fontSize: '1rem',
                fontWeight: 'bold',
                marginBottom: '5px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                color: '#0066cc',
              }}
            >
              {product.bookTitle}
            </h5>
            <p
              className="card-text text-center"
              style={{
                fontSize: '0.9rem',
                color: '#004080',
                marginBottom: '5px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {product.authorName}
            </p>
            <p
              className="card-text text-center"
              style={{ fontSize: '0.9rem', color: '#0066cc', fontWeight: 'bold' }}
            >
              RS. {product.price}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Header2 />
      <Navbar2 />
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div className="my-5">
          <h2 className="display-4 fw-bold text-primary mb-3">Book List</h2>
          <p className="lead text-secondary">Browse Our Entire Collection</p>
          <button
            className="btn btn-primary mt-3"
            onClick={fetchBooks}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh Books'}
          </button>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="container">
            <h3 className="text-start mb-3 ps-2">Fiction</h3>
            <div className="row">
              {fictionBooks.map((product) => (
                <ProductCard key={`fiction-${product._id}`} product={product} />
              ))}
            </div>

            <h3 className="text-start mb-3 ps-2 mt-5">Non-Fiction</h3>
            <div className="row">
              {nonFictionBooks.map((product) => (
                <ProductCard key={`non-fiction-${product._id}`} product={product} />
              ))}
            </div>

            <h3 className="text-start mb-3 ps-2 mt-5">Children and Young Adult</h3>
            <div className="row">
              {childrenBooks.map((product) => (
                <ProductCard key={`children-${product._id}`} product={product} />
              ))}
            </div>
          </div>
        )}

        <style jsx>{`
          .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 102, 204, 0.37) !important;
            cursor: pointer;
          }
          .product-image-container {
            position: relative;
          }
          .hover-overlay {
            position: absolute;
            top: 10px;
            right: 10px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
          }
          .product-card-container:hover .hover-overlay {
            opacity: 1;
            pointer-events: auto;
          }
          .add-to-cart-icon,
          .wishlist-icon {
            cursor: pointer;
            transition: color 0.2s;
          }
          .add-to-cart-icon:hover,
          .wishlist-icon:hover {
            color: #007bff;
          }
          .add-to-cart-icon svg,
          .wishlist-icon svg {
            width: 24px;
            height: 24px;
          }
        `}</style>
      </div>
    </div>
  );
};

export default BookList;