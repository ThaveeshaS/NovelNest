/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import slideVideo1 from '../components/images/SlideVideo1.mp4';
import logo2 from '../components/images/logo2.png';
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
  const navigate = useNavigate();

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
      navigate('/login');
    };

    return (
      <div className="px-2">
        <div
          className="card shadow product-card"
          onClick={handleCardClick}
        >
          <div className="product-image-wrapper">
            <img
              src={product.image}
              className="card-img-top"
              alt={product.title}
              onError={(e) => (e.target.src = 'https://via.placeholder.com/160x200?text=No+Image')}
            />
            <div className="hover-buttons">
              <button 
                className="btn-icon"
                title="Add to Cart"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="22" 
                  height="22" 
                  viewBox="0 0 24 24" 
                  fill="none"
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
                className="btn-icon"
                title="Add to Wishlist"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="22" 
                  height="22" 
                  viewBox="0 0 24 24" 
                  fill="none"
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
            <h5 className="book-title">{product.title}</h5>
            <p className="author-name">{product.author}</p>
            <div className="price-container">
              <span className="current-price">{product.price}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CategorySection = ({ title, books, bgColor }) => (
    <div className={`category-section ${bgColor}`} id={title === "Featured Books" ? "featured-section" : ""}>
      <div className="container">
        <div className="category-header">
          <h2 className="category-title">{title}</h2>
        </div>
        <div className="slider-container">
          <Slider {...sliderSettings}>
            {books.map((product, index) => (
              <ProductCard key={`${title}-${index}`} product={product} />
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
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

      <CategorySection title="Featured Books" books={featuredProducts} bgColor="bg-light" />
      <CategorySection title="New Arrivals" books={newArrivals} bgColor="" />

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
          .features-section {
            padding: 30px 0;
          }
          .category-section {
            padding: 40px 0;
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
        }
      `}</style>
    </div>
  );
};

export default Home;