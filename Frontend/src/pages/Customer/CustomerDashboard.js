import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header2 from '../../components/Header2';
import Navbar2 from '../../components/Navbar2';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import slideVideo1 from '../../components/images/SlideVideo1.mp4';

const CustomerDashboard = () => {
  // State to store books from backend
  const [fictionBooks, setFictionBooks] = useState([]);
  const [nonFictionBooks, setNonFictionBooks] = useState([]);
  const [childrenBooks, setChildrenBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from backend when component mounts
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const fictionResponse = await fetch('/api/books/fiction');
      const nonFictionResponse = await fetch('/api/books/non-fiction');
      const childrenResponse = await fetch('/api/books/children');
  
      const fictionData = await fictionResponse.json();
      const nonFictionData = await nonFictionResponse.json();
      const childrenData = await childrenResponse.json();
  
      setFictionBooks(fictionData);
      setNonFictionBooks(nonFictionData);
      setChildrenBooks(childrenData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };
  
  // Slick slider settings with added paddingBottom for spacing
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const ProductCard = ({ product }) => (
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
        }}
      >
        {/* Product Image - Centered */}
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
            src={product.image}
            className="card-img-top"
            alt={product.title}
            style={{
              maxHeight: '200px',
              width: 'auto',
              maxWidth: '160px',
              objectFit: 'contain',
              borderRadius: '10px 10px 0 0',
              transition: 'transform 0.3s ease',
            }}
          />
          
          {/* Hover overlay with icons - initially hidden */}
          <div className="hover-overlay">
            <div className="add-to-cart-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <div className="wishlist-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Product Information - All Text Centered */}
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
            {product.title}
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
              WebkitBoxOrient: 'vertical'
            }}
          >
            {product.author}
          </p>
          <p
            className="card-text text-center"
            style={{ fontSize: '0.9rem', color: '#0066cc', fontWeight: 'bold' }}
          >
            {product.price}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Use Header2 Component */}
      <Header2 />
      <Navbar2 />

      {/* Main Content */}
      <div style={{ padding: "20px", textAlign: "center" }}>
        {/* Carousel Section */}
        <div
          id="carouselExampleAutoplaying"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
          data-bs-interval="5000"
          aria-label="Homepage Carousel"
        >
          <div className="carousel-inner">
            {/* Only Slide - VIDEO */}
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
              </video>
            </div>
          </div>
        </div>

        {/* Text Below the Carousel */}
        <div className="my-5">
          <h2 className="display-4 fw-bold text-primary mb-3">Welcome to NovelNest</h2>
          <p className="lead text-secondary">Explore Our Book Collection</p>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Fiction Books */}
            <div className="container mt-4">
              <h3 className="text-start mb-3 ps-2">Fiction</h3>
              <div className="slider-container">
                <Slider {...sliderSettings}>
                  {fictionBooks.map((product, index) => (
                    <ProductCard key={`fiction-${index}`} product={product} />
                  ))}
                </Slider>
              </div>
            </div>

            {/* Non-Fiction Books */}
            <div className="container mt-5">
              <h3 className="text-start mb-3 ps-2">Non-Fiction</h3>
              <div className="slider-container">
                <Slider {...sliderSettings}>
                  {nonFictionBooks.map((product, index) => (
                    <ProductCard key={`non-fiction-${index}`} product={product} />
                  ))}
                </Slider>
              </div>
            </div>

            {/* Children and Young Adult Books */}
            <div className="container mt-5 mb-4">
              <h3 className="text-start mb-3 ps-2">Children and Young Adult</h3>
              <div className="slider-container">
                <Slider {...sliderSettings}>
                  {childrenBooks.map((product, index) => (
                    <ProductCard key={`children-${index}`} product={product} />
                  ))}
                </Slider>
              </div>
            </div>
          </>
        )}

        {/* Add some custom CSS to ensure slider uniformity and proper spacing */}
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
            font-size: 12px !important;
          }
          
          .slick-slider {
            padding-bottom: 40px;
          }
          
          /* Add hover effect for product cards */
          .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 102, 204, 0.37) !important;
            cursor: pointer;
          }
          
          /* Hover overlay styles */
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
            pointer-events: none; /* Initially non-interactive */
          }
          
          .product-card-container:hover .hover-overlay {
            opacity: 1;
            pointer-events: auto; /* Make interactive on hover */
          }
          
          .add-to-cart-icon,
          .wishlist-icon {
            cursor: pointer;
            color: #6c757d;
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

export default CustomerDashboard;