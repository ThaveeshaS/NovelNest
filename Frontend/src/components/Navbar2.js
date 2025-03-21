import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Button } from 'react-bootstrap'; // Import Bootstrap Button component

const Navbar2 = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleVoiceButtonClick = () => {
    navigate('/home1'); // Navigate to the home1 page
  };

  const handleWishlistIconClick = () => {
    navigate('/wishlist'); // Navigate to the wishlist page
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: 'rgb(0, 78, 156)' }}>
      <div className="container-fluid">
        {/* Center-aligned navigation links */}
        <div className="d-flex justify-content-center w-100">
          <Link to="/customerdashboard" className="nav-link text-white mx-3">Home</Link>
          <Link to="/books" className="nav-link text-white mx-3">Books</Link>
          <Link to="/author" className="nav-link text-white mx-3">Author</Link>
          
          {/* Voice Mic Button */}
          <Button variant="outline-light" className="mx-3" onClick={handleVoiceButtonClick}>
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
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </Button>
        </div>

        {/* Right-aligned icons */}
        <div className="ms-auto d-flex align-items-center">
          {/* Wishlist Icon */}
          <Link to="/wishlist" className="nav-link text-white mx-3" onClick={handleWishlistIconClick}>
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
          </Link>

          {/* Add to Cart Icon */}
          <Link to="/cart" className="nav-link text-white mx-3">
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
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar2;