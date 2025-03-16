import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Navbar2 = () => {
  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: 'rgb(0, 78, 156)' }}>
      <div className="container-fluid d-flex justify-content-center">
        <Link to="/" className="nav-link text-white mx-3">Home</Link>
        <Link to="/books" className="nav-link text-white mx-3">Books</Link>
        <Link to="/author" className="nav-link text-white mx-3">Author</Link>
      </div>
    </nav>
  );
};

export default Navbar2;