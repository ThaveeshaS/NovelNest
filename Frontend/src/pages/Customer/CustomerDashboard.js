import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Header2 from '../../components/Header2';
import Navbar2 from '../../components/Navbar2';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import slideVideo1 from '../../components/images/SlideVideo1.mp4';
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
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  const ProductCard = ({ product }) => {
    const handleCardClick = (e) => {
      if (e.target.closest('.hover-overlay')) return;
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

    return (
      <div className="px-2">
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
            marginBottom: '20px',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
          onClick={handleCardClick}
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
              <div 
                className="add-to-cart-icon"
                onClick={handleAddToCart}
                style={{ color: isInCart(product._id) ? '#007bff' : '#6c757d' }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill={isInCart(product._id) ? '#007bff' : 'none'}
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  {isInCart(product._id) ? (
                    <path d="M20 6H4l2 12h12l2-12zM9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                  ) : (
                    <>
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </>
                  )}
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
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
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
        <div
          id="carouselExampleAutoplaying"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
          data-bs-interval="5000"
          aria-label="Homepage Carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <video
                className="d-block w-100 rounded-3"
                autoPlay
                muted
                loop
                playsInline
                style={{ maxHeight: '600px', objectFit: 'cover' }}
                aria-label="Background video showcasing our product"
              >
                <source src={slideVideo1} type="video/mp4" />
                Your browser does not support the video tag.
                <img
                  src="path/to/fallback-image.jpg"
                  alt="Fallback Image"
                  className="d-block w-100"
                />
              </video>
            </div>
          </div>
        </div>

        <div className="my-5">
          <h2 className="display-4 fw-bold text-primary mb-3">Welcome to NovelNest</h2>
          <p className="lead text-secondary">Explore Our Book Collection</p>
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
          <>
            <div className="container mt-4">
              <h3 className="text-start mb-3 ps-2">Fiction</h3>
              <div className="slider-container">
                <Slider {...sliderSettings}>
                  {fictionBooks.map((product) => (
                    <ProductCard key={`fiction-${product._id}`} product={product} />
                  ))}
                </Slider>
              </div>
            </div>

            <div className="container mt-5">
              <h3 className="text-start mb-3 ps-2">Non-Fiction</h3>
              <div className="slider-container">
                <Slider {...sliderSettings}>
                  {nonFictionBooks.map((product) => (
                    <ProductCard key={`non-fiction-${product._id}`} product={product} />
                  ))}
                </Slider>
              </div>
            </div>

            <div className="container mt-5 mb-4">
              <h3 className="text-start mb-3 ps-2">Children and Young Adult</h3>
              <div className="slider-container">
                <Slider {...sliderSettings}>
                  {childrenBooks.map((product) => (
                    <ProductCard key={`children-${product._id}`} product={product} />
                  ))}
                </Slider>
              </div>
            </div>
          </>
        )}

        <style jsx>{`
          .slider-container {
            margin-bottom: 40px;
          }
          .slider-container .slick-track {
            display: flex !important;
          }
          .slider-container .slick-slide {
            height: inherit !important;
            display: flex !important;
            justify-content: center;
            align-items: center;
          }
          .slick-dots {
            bottom: -30px !important;
          }
          .slick-dots li button:before {
            fontSize: 12px !important;
          }
          .slick-slider {
            padding-bottom: 40px;
          }
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
            transition: transform 0.2s ease;
          }
          .add-to-cart-icon:hover {
            color: #007bff;
            transform: scale(1.2);
          }
          .wishlist-icon:hover {
            transform: scale(1.2);
          }
          .wishlist-icon:hover svg {
            stroke: #ff0000;
          }
          .add-to-cart-icon svg,
          .wishlist-icon svg {
            width: 24px;
            height: 24px;
            transition: stroke 0.2s ease;
          }
        `}</style>
      </div>
    </div>
  );
};

export default CustomerDashboard;