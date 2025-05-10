import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from "../pages/Product/WishlistContext";
import { useCart } from "../pages/Product/CartContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Navbar2 = () => {
  const { wishlist } = useWishlist(); // Get wishlist from context
  const { cartItems } = useCart();   // Get cart items from context

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: 'rgb(0, 78, 156)' }}>
      <div className="container-fluid">
        {/* Center-aligned navigation links */}
        <div className="d-flex justify-content-center w-100">
          <Link to="/customerdashboard" className="nav-link text-white mx-3">Home</Link>
          <Link to="/bookslist" className="nav-link text-white mx-3">Books</Link>
          
          {/* Voice Mic Icon */}
          <Link to="/home1" className="nav-link text-white mx-3">
            <i className="bi bi-mic"></i>
          </Link>
        </div>

        {/* Right-aligned icons */}
        <div className="ms-auto d-flex align-items-center">
          {/* Wishlist Icon with Count */}
          <Link to="/wishlist" className="nav-link text-white mx-3 position-relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            {wishlist.length > 0 && (
              <span 
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: 'rgb(0, 78, 156)',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  padding: '2px 6px',
                  border: '1px solid rgb(0, 78, 156)'
                }}
              >
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Add to Cart Icon with Count */}
          <Link to="/cart" className="nav-link text-white mx-3 position-relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {cartItems.length > 0 && (
              <span 
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: 'rgb(0, 78, 156)',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  padding: '2px 6px',
                  border: '1px solid rgb(0, 78, 156)'
                }}
              >
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar2;