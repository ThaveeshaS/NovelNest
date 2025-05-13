import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Header2 from '../../components/Header2';
import Navbar2 from '../../components/Navbar2';
import axios from 'axios';
import { useWishlist } from '../../pages/Product/WishlistContext';
import { useCart } from '../../pages/Product/CartContext';

const BookList = () => {
  const [fictionBooks, setFictionBooks] = useState([]);
  const [nonFictionBooks, setNonFictionBooks] = useState([]);
  const [childrenBooks, setChildrenBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [addedToCart, setAddedToCart] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();

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

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSearchQuery(''); // Reset search query when changing category
    if (category !== 'all') {
      const element = document.getElementById(`${category}-section`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filterBooks = (books) => {
    if (!searchQuery) return books;
    const query = searchQuery.toLowerCase();
    return books.filter(
      (book) =>
        book.bookTitle.toLowerCase().includes(query) ||
        book.authorName.toLowerCase().includes(query)
    );
  };

  const ProductCard = ({ product }) => {
    const handleCardClick = (e) => {
      if (e.target.closest('.card-action-button') || e.target.closest('.hover-buttons')) return;
      navigate(`/bookdetails/${product._id}`);
    };

    const handleWishlistClick = (e) => {
      e.stopPropagation();
      if (isInWishlist(product._id)) {
        removeFromWishlist(product._id);
      } else {
        addToWishlist(product);
      }
    };

    const handleAddToCart = (e) => {
      e.stopPropagation();
      addToCart(product);
      setAddedToCart(product._id);
      setTimeout(() => {
        setAddedToCart(null);
      }, 2000);
    };

    const stockStatus = (quantity) => {
      if (quantity === 0) return { text: 'Out of Stock', color: '#e53935', bgColor: '#ffebee' };
      if (quantity <= 5) return { text: 'Low Stock', color: '#ff6d00', bgColor: '#fff3e0' };
      return { text: 'In Stock', color: '#2e7d32', bgColor: '#e8f5e9' };
    };

    const status = stockStatus(product.bookQuantity || 0);

    return (
      <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
        <div 
          className="book-card"
          onClick={handleCardClick}
        >
          <div className="book-card-image">
            <img
              src={product.coverPage}
              alt={product.bookTitle}
              onError={(e) => (e.target.src = 'https://via.placeholder.com/160x200?text=No+Image')}
            />
            
            {product.bookQuantity === 0 && (
              <div className="out-of-stock-badge">
                Out of Stock
              </div>
            )}
            
            <div className="card-overlay">
              <div className="hover-buttons">
                <button 
                  className={`btn-icon ${isInCart(product._id) ? 'btn-added' : ''}`}
                  onClick={handleAddToCart}
                  disabled={product.bookQuantity === 0}
                  title={isInCart(product._id) ? "Added to Cart" : "Add to Cart"}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="22" 
                    height="22" 
                    viewBox="0 0 24 24" 
                    fill={isInCart(product._id) ? 'currentColor' : 'none'}
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </button>
                
                <button 
                  className={`btn-icon ${isInWishlist(product._id) ? 'btn-wishlisted' : ''}`}
                  onClick={handleWishlistClick}
                  title={isInWishlist(product._id) ? "Wishlisted" : "Add to Wishlist"}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="22" 
                    height="22" 
                    viewBox="0 0 24 24" 
                    fill={isInWishlist(product._id) ? 'currentColor' : 'none'}
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
              <div className="view-details-wrapper">
                <button 
                  className="view-details-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/bookdetails/${product._id}`);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
            
            {addedToCart === product._id && (
              <div className="added-to-cart-notification">
                <i className="bi bi-check-circle-fill"></i> Added to cart!
              </div>
            )}
          </div>
          
          <div className="book-card-content">
            <h3 className="book-title">{product.bookTitle}</h3>
            <p className="book-author">{product.authorName}</p>
            <div className="book-price-row">
              <span className="book-price" style={{ color: '#0066cc' }}>Rs. {Number(product.price).toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="original-price">Rs. {Number(product.originalPrice).toFixed(2)}</span>
              )}
              <span className="stock-status" style={{ backgroundColor: status.bgColor, color: status.color }}>
                {status.text}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getVisibleBooks = () => {
    const filteredFiction = filterBooks(fictionBooks);
    const filteredNonFiction = filterBooks(nonFictionBooks);
    const filteredChildren = filterBooks(childrenBooks);

    if (activeCategory === 'all') {
      return {
        fiction: filteredFiction,
        nonFiction: filteredNonFiction,
        children: filteredChildren
      };
    } else if (activeCategory === 'fiction') {
      return { fiction: filteredFiction, nonFiction: [], children: [] };
    } else if (activeCategory == 'nonFiction') {
      return { fiction: [], nonFiction: filteredNonFiction, children: [] };
    } else if (activeCategory === 'children') {
      return { fiction: [], nonFiction: [], children: filteredChildren };
    }
  };

  const visibleBooks = getVisibleBooks();

  return (
    <div className="book-list-page">
      <Header2 />
      <Navbar2 />
      
      <div className="book-list-hero">
        <div className="container">
          <div className="row">
            <div className="col-md-8 mx-auto text-center">
              <h1 className="hero-title">Discover Your Next Favorite Book</h1>
              <p className="hero-subtitle">Explore our curated collection of books across various genres</p>
              
              <div className="search-bar mb-4">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by title or author..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <i className="bi bi-search search-icon"></i>
              </div>
              
              <div className="category-tabs">
                <button 
                  className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('all')}
                >
                  All Categories
                </button>
                <button 
                  className={`category-tab ${activeCategory === 'fiction' ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('fiction')}
                >
                  Fiction
                </button>
                <button 
                  className={`category-tab ${activeCategory === 'nonFiction' ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('nonFiction')}
                >
                  Non-Fiction
                </button>
                <button 
                  className={`category-tab ${activeCategory === 'children' ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('children')}
                >
                  Children
                </button>
              </div>
              
              <button
                className="refresh-button"
                onClick={fetchBooks}
                disabled={loading}
              >
                <i className={`bi bi-arrow-repeat ${loading ? 'spinning' : ''}`}></i>
                {loading ? 'Refreshing...' : 'Refresh Books'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-alert">
          <div className="container">
            <div className="error-content">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="book-listing-container">
        <div className="container">
          {loading ? (
            <div className="loading-container">
              <div className="book-spinner">
                <div className="page page-1"></div>
                <div className="page page-2"></div>
                <div className="page page-3"></div>
                <div className="page page-4"></div>
              </div>
              <p>Loading books...</p>
            </div>
          ) : (
            <>
              {visibleBooks.fiction.length > 0 && (
                <div id="fiction-section" className="book-category-section">
                  <div className="section-header">
                    <h2 className="section-title">Fiction</h2>
                    <div className="section-divider"></div>
                    <p className="section-description">Explore captivating stories and worlds of imagination</p>
                  </div>
                  <div className="row">
                    {visibleBooks.fiction.map((product) => (
                      <ProductCard key={`fiction-${product._id}`} product={product} />
                    ))}
                  </div>
                </div>
              )}

              {visibleBooks.nonFiction.length > 0 && (
                <div id="nonFiction-section" className="book-category-section">
                  <div className="section-header">
                    <h2 className="section-title">Non-Fiction</h2>
                    <div className="section-divider"></div>
                    <p className="section-description">Discover knowledge, insights, and real-world perspectives</p>
                  </div>
                  <div className="row">
                    {visibleBooks.nonFiction.map((product) => (
                      <ProductCard key={`non-fiction-${product._id}`} product={product} />
                    ))}
                  </div>
                </div>
              )}

              {visibleBooks.children.length > 0 && (
                <div id="children-section" className="book-category-section">
                  <div className="section-header">
                    <h2 className="section-title">Children and Young Adult</h2>
                    <div className="section-divider"></div>
                    <p className="section-description">Books that inspire and entertain young readers</p>
                  </div>
                  <div className="row">
                    {visibleBooks.children.map((product) => (
                      <ProductCard key={`children-${product._id}`} product={product} />
                    ))}
                  </div>
                </div>
              )}
              
              {visibleBooks.fiction.length === 0 && visibleBooks.nonFiction.length === 0 && visibleBooks.children.length === 0 && (
                <div className="no-books-found">
                  <i className="bi bi-book"></i>
                  <h3>No books found</h3>
                  <p>We couldn't find any books matching your search or in the selected category.</p>
                  <button className="btn btn-primary" onClick={() => handleCategoryChange('all')}>
                    View All Categories
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <style jsx>{`
        /* General Styles */
        .book-list-page {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f8f9fa;
          color: #333;
        }
        
        /* Hero Section */
        .book-list-hero {
          background: linear-gradient(135deg, #0d6efd 0%, #0062cc 100%);
          color: white;
          padding: 60px 0;
          margin-bottom: 40px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .hero-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 15px;
        }
        
        .hero-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 30px;
        }
        
        /* Search Bar */
        .search-bar {
          position: relative;
          max-width: 500px;
          margin: 0 auto 20px;
        }
        
        .search-input {
          width: 100%;
          padding: 10px 40px 10px 15px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 25px;
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        
        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
        
        .search-input:focus {
          outline: none;
          border-color: white;
          background-color: white;
          color: #333;
        }
        
        .search-input:focus::placeholder {
          color: #6c757d;
        }
        
        .search-icon {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: white;
          font-size: 1.2rem;
        }
        
        .search-input:focus + .search-icon {
          color: #333;
        }
        
        /* Category Tabs */
        .category-tabs {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 25px;
        }
        
        .category-tab {
          padding: 10px 20px;
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          border-radius: 30px;
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .category-tab:hover {
          background-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }
        
        .category-tab.active {
          background-color: white;
          color: #0d6efd;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        /* Refresh Button */
        .refresh-button {
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid white;
          border-radius: 30px;
          padding: 10px 25px;
          font-weight: 600;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        
        .refresh-button:hover {
          background-color: white;
          color: #0d6efd;
        }
        
        .refresh-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .refresh-button i {
          font-size: 1.1rem;
        }
        
        .spinning {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* Error Alert */
        .error-alert {
          background-color: #ffebee;
          padding: 15px 0;
          margin-bottom: 30px;
        }
        
        .error-content {
          display: flex;
          align-items: center;
          gap: 15px;
          color: #c62828;
          padding: 10px 15px;
          border-left: 4px solid #c62828;
          background-color: white;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .error-content i {
          font-size: 1.5rem;
        }
        
        .error-content p {
          margin: 0;
          font-weight: 500;
        }
        
        /* Book Listing Container */
        .book-listing-container {
          padding-bottom: 60px;
        }
        
        /* Section Header */
        .book-category-section {
          margin-bottom: 60px;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .section-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 15px;
        }
        
        .section-divider {
          height: 3px;
          width: 60px;
          background: linear-gradient(90deg, #0d6efd, #63a4ff);
          margin: 0 auto 15px;
          border-radius: 3px;
        }
        
        .section-description {
          color: #6c757d;
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto;
        }
        
        /* Book Card */
        .book-card {
          background-color: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          position: relative;
        }
        
        .book-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 20px rgba(0, 0, 0, 0.12);
        }
        
        .book-card-image {
          position: relative;
          padding-top: 150%; /* Aspect ratio 2:3 for book covers */
          background-color: #f8f9fa;
          overflow: hidden;
        }
        
        .book-card-image img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .book-card:hover .book-card-image img {
          transform: scale(1.05);
        }
        
        .out-of-stock-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background-color: rgba(220, 53, 69, 0.9);
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          z-index: 2;
        }
        
        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.7) 100%);
          opacity: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 15px;
          transition: opacity 0.3s ease;
        }
        
        .book-card:hover .card-overlay {
          opacity: 1;
        }
        
        .hover-buttons {
          display: flex;
          justify-content: center;
          padding: 10px;
          gap: 15px;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
          z-index: 3;
        }
        
        .view-details-wrapper {
          display: flex;
          justify-content: center;
          padding: 5px 10px;
          z-index: 3;
        }
        
        .btn-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #555;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        
        .btn-icon:hover {
          transform: scale(1.1);
          background: #f0f0f0;
        }
        
        .btn-icon:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .btn-wishlisted {
          color: #ff3e3e;
          background: #ffeded;
        }
        
        .btn-added {
          color: #0066cc;
          background: #e6f0ff;
        }
        
        .view-details-btn {
          background-color: #0d6efd;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 15px;
          font-weight: 500;
          transition: all 0.2s ease;
          width: 100%;
        }
        
        .view-details-btn:hover {
          background-color: #0b5ed7;
        }
        
        .added-to-cart-notification {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: rgba(255, 255, 255, 0.95);
          color: #2e7d32;
          padding: 10px 15px;
          border-radius: 4px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          animation: fadeInOut 2s ease;
          z-index: 10;
        }
        
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          15% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
        
        .book-card-content {
          padding: 15px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        
        .book-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 5px;
          color: #333;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.3;
        }
        
        .book-author {
          font-size: 0.9rem;
          color: #6c757d;
          margin-bottom: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .book-price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }
        
        .book-price {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0066cc; /* Changed to blue */
        }
        
        .original-price {
          font-size: 0.9rem;
          color: #999;
          text-decoration: line-through;
          margin-right: 5px;
        }
        
        .stock-status {
          font-size: 0.75rem;
          padding: 3px 8px;
          border-radius: 20px;
          font-weight: 600;
        }
        
        /* Loading Animation */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 0;
        }
        
        .book-spinner {
          position: relative;
          width: 80px;
          height: 80px;
          margin-bottom: 20px;
          perspective: 200px;
        }
        
        .page {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 5px;
          background-color: #0d6efd;
          animation: page-flip 2s infinite ease-in-out;
          transform-origin: left center;
          transform-style: preserve-3d;
        }
        
        .page-1 {
          animation-delay: 0s;
          background-color: #0d6efd;
        }
        
        .page-2 {
          animation-delay: 0.5s;
          background-color: #198754;
        }
        
        .page-3 {
          animation-delay: 1s;
          background-color: #dc3545;
        }
        
        .page-4 {
          animation-delay: 1.5s;
          background-color: #fd7e14;
        }
        
        @keyframes page-flip {
          0%, 100% { transform: rotateY(0deg); }
          50% { transform: rotateY(-180deg); }
        }
        
        .loading-container p {
          color: #6c757d;
          font-size: 1.2rem;
          font-weight: 500;
        }
        
        /* No Books Found */
        .no-books-found {
          text-align: center;
          padding: 50px 20px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
        }
        
        .no-books-found i {
          font-size: 3rem;
          color: #6c757d;
          margin-bottom: 20px;
        }
        
        .no-books-found h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 10px;
          color: #333;
        }
        
        .no-books-found p {
          color: #6c757d;
          margin-bottom: 20px;
        }
        
        /* Responsive Styles */
        @media (max-width: 991.98px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-subtitle {
            font-size: 1.1rem;
          }
          
          .book-category-section {
            margin-bottom: 40px;
          }
        }
        
        @media (max-width: 767.98px) {
          .book-list-hero {
            padding: 40px 0;
          }
          
          .hero-title {
            font-size: 1.8rem;
          }
          
          .category-tabs {
            flex-direction: column;
            gap: 8px;
            max-width: 250px;
            margin-left: auto;
            margin-right: auto;
          }
          
          .category-tab {
            width: 100%;
          }
          
          .section-title {
            font-size: 1.5rem;
          }
        }
        
        @media (max-width: 575.98px) {
          .book-card-image {
            padding-top: 140%;
          }
          
          .book-title {
            font-size: 0.9rem;
          }
          
          .book-price {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default BookList;