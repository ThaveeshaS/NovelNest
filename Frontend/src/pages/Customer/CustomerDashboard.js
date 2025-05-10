import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Header2 from '../../components/Header2';
import Navbar2 from '../../components/Navbar2';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import slideVideo1 from '../../components/images/SlideVideo1.mp4';
import logo2 from '../../components/images/logo2.png';
import axios from 'axios';
import { useWishlist } from '../../pages/Product/WishlistContext';
import { useCart } from '../../pages/Product/CartContext';

const CustomerDashboard = () => {
  const [fictionBooks, setFictionBooks] = useState([]);
  const [nonFictionBooks, setNonFictionBooks] = useState([]);
  const [childrenBooks, setChildrenBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { addToWishlist, isInWishlist } = useWishlist();
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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1400, settings: { slidesToShow: 4, slidesToScroll: 1 } },
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  const ProductCard = ({ product }) => {
    const handleCardClick = (e) => {
      if (e.target.closest('.hover-buttons')) return;
      navigate(`/bookdetails/${product._id}`);
    };

    const handleWishlistClick = (e) => {
      e.stopPropagation();
      addToWishlist(product);
    };

    const handleAddToCart = (e) => {
      e.stopPropagation();
      addToCart(product);
    };

    const isWishlisted = isInWishlist(product._id);
    const isCarted = isInCart(product._id);

    return (
      <div className="px-2">
        <div
          className="card shadow product-card"
          onClick={handleCardClick}
        >
          <div className="ribbon-container">
            {product.discount > 0 && (
              <div className="ribbon">
                -{product.discount}%
              </div>
            )}
          </div>
          
          <div className="product-image-wrapper">
            <img
              src={product.coverPage}
              className="card-img-top"
              alt={product.bookTitle}
              onError={(e) => (e.target.src = 'https://via.placeholder.com/160x200?text=No+Image')}
            />
            <div className="hover-buttons">
              <button 
                className={`btn-icon ${isCarted ? 'btn-added' : ''}`}
                onClick={handleAddToCart}
                title={isCarted ? "Added to Cart" : "Add to Cart"}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="22" 
                  height="22" 
                  viewBox="0 0 24 24" 
                  fill={isCarted ? 'currentColor' : 'none'}
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
                className={`btn-icon ${isWishlisted ? 'btn-wishlisted' : ''}`}
                onClick={handleWishlistClick}
                title={isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="22" 
                  height="22" 
                  viewBox="0 0 24 24" 
                  fill={isWishlisted ? 'currentColor' : 'none'}
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="card-body">
            <h5 className="book-title">{product.bookTitle}</h5>
            <p className="author-name">{product.authorName}</p>
            <div className="price-container">
              <span className="current-price">Rs. {Number(product.price).toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="original-price">Rs. {Number(product.originalPrice).toFixed(2)}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CategorySection = ({ title, books, bgColor }) => (
    <div className={`category-section ${bgColor}`} id={title === "Fiction" ? "fiction-section" : ""}>
      <div className="container">
        <div className="category-header">
          <h2 className="category-title">{title}</h2>
        </div>
        <div className="slider-container">
          <Slider {...sliderSettings}>
            {books.map((product) => (
              <ProductCard key={`${title}-${product._id}`} product={product} />
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );

  const scrollToFiction = () => {
    const fictionSection = document.getElementById('fiction-section');
    if (fictionSection) {
      fictionSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="dashboard-container">
      <Header2 />

      <div className="announcement-bar" style={{ position: 'relative', zIndex: 10 }}>
        <marquee-text
          scrolling-speed="13"
          className="announcement-bar__scrolling-list"
          style={{ ['--marquee-animation-duration']: '30s' }}
        >
          <span className="announcement-bar__item">
            <p className="bold text-xxs">FREE SL SHIPPING ON ORDERS OVER RS.10,000</p>
            <span className="shape-circle shape--sm"></span>
            <p className="bold text-xxs">ISLANDWIDE SHIPPING AVAILABLE</p>
            <span className="shape-circle shape--sm"></span>
            <p className="bold text-xxs">NEW ARRIVALS</p>
            <span className="shape-circle shape--sm"></span>
          </span>
          <span className="announcement-bar__item">
            <p className="bold text-xxs">FREE SL SHIPPING ON ORDERS OVER RS.10,000</p>
            <span className="shape-circle shape--sm"></span>
            <p className="bold text-xxs">ISLANDWIDE SHIPPING AVAILABLE</p>
            <span className="shape-circle shape--sm"></span>
            <p className="bold text-xxs">NEW ARRIVALS</p>
            <span className="shape-circle shape--sm"></span>
          </span>
          <span className="announcement-bar__item">
            <p className="bold text-xxs">FREE SL SHIPPING ON ORDERS OVER RS.10,000</p>
            <span className="shape-circle shape--sm"></span>
            <p className="bold text-xxs">ISLANDWIDE SHIPPING AVAILABLE</p>
            <span className="shape-circle shape--sm"></span>
            <p className="bold text-xxs">NEW ARRIVALS</p>
            <span className="shape-circle shape--sm"></span>
          </span>
          <span className="announcement-bar__item">
            <p className="bold text-xxs">FREE SL SHIPPING ON ORDERS OVER RS.10,000</p>
            <span className="shape-circle shape--sm"></span>
            <p className="bold text-xxs">ISLANDWIDE SHIPPING AVAILABLE</p>
            <span className="shape-circle shape--sm"></span>
            <p className="bold text-xxs">NEW ARRIVALS</p>
            <span className="shape-circle shape--sm"></span>
          </span>
          <span className="announcement-bar__item">
            <p className="bold text-xxs">FREE SL SHIPPING ON ORDERS OVER RS.10,000</p>
            <span className="shape-circle shape--sm"></span>
            <p className="bold text-xxs">ISLANDWIDE SHIPPING AVAILABLE</p>
            <span className="shape-circle shape--sm"></span>
            <p className="bold text-xxs">NEW ARRIVALS</p>
            <span className="shape-circle shape--sm"></span>
          </span>
        </marquee-text>
      </div>

      <Navbar2 />

      <div className="hero-section">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          aria-label="Background video showcasing our bookstore"
        >
          <source src={slideVideo1} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <div className="hero-overlay"></div>
        
        <div className="hero-content">
          <img src={logo2} alt="NovelNest Logo" className="hero-logo" />
          <h1 className="hero-title">NovelNest</h1>
          <p className="hero-tagline">Turn the Page to Endless Possibilities!</p>
          <div className="hero-buttons">
            <button className="btn btn-primary hero-btn" onClick={scrollToFiction}>
              Explore Collection
            </button>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <div className="row">
            <div className="col-md-3 col-6">
              <div className="feature-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                <h3>Free Shipping</h3>
                <p>On orders over Rs.10,000</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="feature-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <h3>24/7 Support</h3>
                <p>Customer service</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="feature-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
                <h3>Fast Delivery</h3>
                <p>2-3 business days</p>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="feature-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h3>Secure Payments</h3>
                <p>100% secure checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-alert">
          <div className="container">
            <div className="alert alert-danger" role="alert">
              {error}
              <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchBooks}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="book">
            <div className="book__page"></div>
            <div className="book__page"></div>
            <div className="book__page"></div>
          </div>
          <p>Loading amazing books for you...</p>
        </div>
      ) : (
        <>
          <CategorySection title="Fiction" books={fictionBooks} bgColor="bg-light" />
          <CategorySection title="Non-Fiction" books={nonFictionBooks} bgColor="" />
          <CategorySection title="Children and Young Adult" books={childrenBooks} bgColor="bg-light" />
        </>
      )}

      <style jsx>{`
        /* General Styles */
        .dashboard-container {
          font-family: 'Poppins', sans-serif;
          color: #333;
          overflow-x: hidden;
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          height: 80vh;
          min-height: 500px;
          overflow: hidden;
        }

        .hero-video {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 1;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7));
          z-index: 2;
        }

        .hero-content {
          position: relative;
          z-index: 3;
          text-align: center;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          padding: 0 20px;
        }

        .hero-logo {
          width: 140px;
          height: auto;
          margin-bottom: 20px;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        .hero-title {
          font-size: 5rem;
          font-weight: 800;
          margin-bottom: 15px;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
          font-family: 'Playfair Display', serif;
        }

        .hero-tagline {
          font-size: 1.8rem;
          margin-bottom: 30px;
          text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.6);
          font-family: 'Dancing Script', cursive;
        }

        .hero-buttons {
          display: flex;
          gap: 15px;
        }

        .hero-btn {
          padding: 12px 28px;
          font-weight: 600;
          border-radius: 30px;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
        }

        .hero-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        /* Features Section */
        .features-section {
          background-color: #fff;
          padding: 40px 0;
          border-bottom: 1px solid #eee;
        }

        .feature-item {
          text-align: center;
          padding: 20px 15px;
          transition: all 0.3s ease;
        }

        .feature-item:hover {
          transform: translateY(-5px);
        }

        .feature-item svg {
          stroke: #0066cc;
          width: 40px;
          height: 40px;
          margin-bottom: 15px;
        }

        .feature-item h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: #333;
        }

        .feature-item p {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0;
        }

        /* Announcement Bar */
        .announcement-bar {
          background-color: #f8f9fa;
          color: #333;
          padding: 6px 0; /* Reduced padding to decrease height */
          border-bottom: 1px solid #ddd;
          font-family: 'Poppins', sans-serif;
          width: 100%;
          overflow: hidden;
        }

        .announcement-bar__scrolling-list {
          display: flex;
          align-items: center;
          white-space: nowrap;
          animation: marquee 30s linear infinite; /* Slower animation duration */
          width: 100%;
        }

        .announcement-bar__item {
          display: inline-flex;
          align-items: center;
          margin-right: 30px; /* Equal spacing between items */
        }

        .bold {
          font-weight: 600;
          margin: 0 20px; /* Equal spacing between messages */
          font-size: 0.85rem; /* Reduced font size */
          white-space: nowrap; /* Prevent text wrapping */
        }

        .text-xxs {
          font-size: 0.75rem; /* Reduced font size */
        }

        .shape-circle {
          width: 5px; /* Slightly smaller circle */
          height: 5px;
          background-color: #0066cc;
          border-radius: 50%;
          display: inline-block;
          margin: 0 20px; /* Equal spacing around circles */
        }

        .shape--sm {
          width: 3px; /* Smaller circle */
          height: 3px;
        }

        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        /* Category Section */
        .category-section {
          padding: 60px 0;
        }

        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .category-title {
          font-size: 2rem;
          font-weight: 700;
          position: relative;
          padding-bottom: 10px;
          display: inline-block;
          color: #0066cc;
        }

        .category-title::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 60px;
          height: 3px;
          background: #0066cc;
        }

        /* Product Card */
        .product-card {
          border: none;
          border-radius: 12px;
          overflow: hidden;
          height: 380px;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          margin-bottom: 30px;
          position: relative;
          cursor: pointer;
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(0, 102, 204, 0.2) !important;
        }

        .ribbon-container {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
        }

        .ribbon {
          background: #ff3e3e;
          color: white;
          padding: 5px 12px;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: 0 0 12px 0;
        }

        .product-image-wrapper {
          height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: #f8f9fa;
        }

        .product-image-wrapper img {
          max-height: 200px;
          max-width: 80%;
          object-fit: contain;
          transition: transform 0.5s ease;
        }

        .product-card:hover .product-image-wrapper img {
          transform: scale(1.05);
        }

        .hover-buttons {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          padding: 10px;
          gap: 15px;
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
          transform: translateY(100%);
          transition: transform 0.3s ease;
          z-index: 3;
        }

        .product-card:hover .hover-buttons {
          transform: translateY(0);
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
        }

        .btn-icon:hover {
          transform: scale(1.1);
          background: #f0f0f0;
        }

        .btn-wishlisted {
          color: #ff3e3e;
          background: #ffeded;
        }

        .btn-added {
          color: #0066cc;
          background: #e6f0ff;
        }

        .card-body {
          padding: 15px;
          text-align: center;
        }

        .book-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: #333;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          height: 48px;
        }

        .author-name {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 12px;
          font-style: italic;
        }

        .price-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .current-price {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0066cc;
        }

        .original-price {
          font-size: 0.9rem;
          color: #999;
          text-decoration: line-through;
        }

        /* Slider Customization */
        .slider-container {
          margin-bottom: 20px;
        }

        .slick-list {
          margin: 0 -12px;
        }

        .slick-slide > div {
          padding: 0 12px;
        }

        .slick-dots {
          bottom: -35px;
        }

        .slick-dots li button:before {
          font-size: 10px;
          color: #0066cc;
        }

        .slick-dots li.slick-active button:before {
          color: #0066cc;
        }

        .slick-prev, .slick-next {
          width: 40px;
          height: 40px;
          z-index: 1;
          background: white;
          border-radius: 50%;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .slick-prev:before, .slick-next:before {
          color: #0066cc;
          font-size: 20px;
        }

        .slick-prev {
          left: -10px;
        }

        .slick-next {
          right: -10px;
        }

        /* Loading Animation */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 0;
        }

        .loading-container p {
          margin-top: 20px;
          color: #666;
          font-style: italic;
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

        /* Error Alert */
        .error-alert {
          padding: 20px 0;
        }

        /* Responsive Adjustments */
        @media (max-width: 992px) {
          .hero-title {
            font-size: 3.5rem;
          }
          .hero-tagline {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            height: 60vh;
          }
          .hero-title {
            font-size: 3rem;
          }
          .hero-tagline {
            font-size: 1.2rem;
          }
          .category-title {
            font-size: 1.5rem;
          }
          .hero-buttons {
            flex-direction: column;
            width: 100%;
            max-width: 200px;
          }
          .features-section {
            padding: 30px 0;
          }
          .category-section {
            padding: 40px 0;
          }
          .announcement-bar__item {
            margin-right: 20px; /* Adjust spacing for smaller screens */
          }
          .bold {
            font-size: 0.75rem; /* Further reduced font size */
            margin: 0 15px; /* Adjusted spacing */
          }
        }

        @media (max-width: 576px) {
          .hero-title {
            font-size: 2.5rem;
          }
          .feature-item {
            padding: 15px 10px;
          }
          .feature-item h3 {
            font-size: 0.9rem;
          }
          .feature-item p {
            font-size: 0.8rem;
          }
          .announcement-bar__item {
            margin-right: 15px; /* Further reduce spacing on very small screens */
          }
          .bold {
            font-size: 0.7rem; /* Further reduce font size on very small screens */
            margin: 0 10px;
          }
          .shape-circle {
            margin: 0 15px; /* Adjust spacing for smaller screens */
          }
        }
      `}</style>
    </div>
  );
};

export default CustomerDashboard;