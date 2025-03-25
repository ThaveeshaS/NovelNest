/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import slideVideo1 from '../components/images/SlideVideo1.mp4';
import Bookimage1 from '../components/images/Bookimage1.jpeg';
import Bookimage2 from '../components/images/Bookimage2.jpg';
import Bookimage3 from '../components/images/Bookimage3.jpg';
import Bookimage4 from '../components/images/Bookimage4.jpg';
import Bookimage5 from '../components/images/Bookimage5.jpg';
import Bookimage6 from '../components/images/Bookimage6.jpg';
import Bookimage7 from '../components/images/Bookimage7.png';
import Bookimage8 from '../components/images/Bookimage8.jpg';
import Bookimage9 from '../components/images/Bookimage9.jpg';
import Bookimage10 from '../components/images/Bookimage10.jpg';
import Bookimage11 from '../components/images/Bookimage11.jpg';
import Bookimage12 from '../components/images/Bookimage12.jpg';
import Bookimage13 from '../components/images/Bookimage13.jpg';
import Bookimage14 from '../components/images/Bookimage14.jpg';
import Bookimage15 from '../components/images/Bookimage15.jpg';
import Bookimage16 from '../components/images/Bookimage16.jpg';

const Home = () => {
  // Product data divided into two sets
  const featuredProducts = [
    {
      image: Bookimage1,
      title: "MEIN KAMPF",
      author: "ADOLF HITLER",
      price: "RS. 1,895.00",
    },
    {
      image: Bookimage2,
      title: "Mai Mara Prasangaya",
      author: "Charitha Prawardhi Bandara",
      price: "RS. 1,200.00",
    },
    {
      image: Bookimage3,
      title: "Jamila",
      author: "Dedigama V. Rodrigo",
      price: "RS. 800.00",
    },
    {
      image: Bookimage4,
      title: "The Seven Moons of Maali Almeida",
      author: "KARUNATILAKA SHEHAN",
      price: "RS. 1,960.00",
    },
    {
      image: Bookimage5,
      title: "Harry Potter and the Philosopher's Stone",
      author: "J.K. Rowling",
      price: "RS. 3,200.00",
    },
    {
      image: Bookimage6,
      title: "It Ends With Us",
      author: "Colleen Hoover",
      price: "RS. 2,700.00",
    },
    {
      image: Bookimage7,
      title: "Forget me not",
      author: "Charitha Prawardhi Bandara,Chathuri Damayanthi",
      price: "RS. 1,200.00",
    },
    {
      image: Bookimage8,
      title: "Power",
      author: "Robert Greene",
      price: "RS. 5,405.00",
    }
  ];

  const newArrivals = [
    {
      image: Bookimage9,
      title: "Ratan N. Tata: A Life",
      author: "Thomas Mathew",
      price: "RS. 7,950.00",
    },
    {
      image: Bookimage10,
      title: "An Eye For An Eye",
      author: "Jeffrey Archer",
      price: "RS. 2,700.00",
    },
    {
      image: Bookimage11,
      title: "Baddegama",
      author: "Gunaratne, A.P.",
      price: "RS. 675.00",
    },
    {
      image: Bookimage12,
      title: "Mandodari",
      author: "Mohan Raj Madawala",
      price: "RS. 1,650.00",
    },
    {
      image: Bookimage13,
      title: "Revenge of the Tipping Point",
      author: "Malcolm Gladwell",
      price: "RS. 4,000.00",
    },
    {
      image: Bookimage14,
      title: "Harry Potter And The Chamber Of Secrets Illustrated Edition (Paperback)",
      author: "J.K. Rowling",
      price: "RS. 6,770.00",
    },
    {
      image: Bookimage15,
      title: "The Testaments",
      author: "Margaret Atwood",
      price: "RS. 1,935.00",
    },
    {
      image: Bookimage16,
      title: "Raavan: Enemy Of Aryavarta",
      author: "Amish Tripathi",
      price: "RS. 2,160.00",
    }
  ];

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
          height: '340px', // Adjusted height
          width: '220px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          marginBottom: '20px',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          position: 'relative', // Important for absolute positioning of hover elements
          overflow: 'hidden', // To contain the hover elements
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
            height: '200px', // Adjusted height
            position: 'relative', // For hover overlay
          }}
          className="product-image-container"
        >
          <img
            src={product.image}
            className="card-img-top"
            alt={product.title}
            style={{
              maxHeight: '200px', // Increased size
              width: 'auto',
              maxWidth: '160px', // Increased size
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
              color: '#0066cc', // Blue text color for title
            }}
          >
            {product.title}
          </h5>
          <p
            className="card-text text-center"
            style={{ 
              fontSize: '0.9rem', 
              color: '#004080', // Darker blue for author
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
          {/* First Slide - VIDEO */}
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
              {/* Fallback Image */}
              <img
                src="path/to/fallback-image.jpg"
                alt="Fallback Image"
                className="d-block w-100"
              />
            </video>
          </div>
        </div>
      </div>

      {/* Text Below the Carousel */}
      <div className="my-5">
        <h2 className="display-4 fw-bold text-primary mb-3">Welcome to NovelNest</h2>
        <p className="lead text-secondary">Explore Our Featured Arrivals</p>
      </div>

      {/* First Set of Products - Featured Books */}
      <div className="container mt-4">
        <h3 className="text-start mb-3 ps-2">Featured Books</h3>
        <div className="slider-container">
          <Slider {...sliderSettings}>
            {featuredProducts.map((product, index) => (
              <ProductCard key={`featured-${index}`} product={product} />
            ))}
          </Slider>
        </div>
      </div>

      {/* Second Set of Products - New Arrivals */}
      <div className="container mt-5 mb-4">
        <h3 className="text-start mb-3 ps-2">New Arrivals</h3>
        <div className="slider-container">
          <Slider {...sliderSettings}>
            {newArrivals.map((product, index) => (
              <ProductCard key={`new-${index}`} product={product} />
            ))}
          </Slider>
        </div>
      </div>

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
  );
};

export default Home;