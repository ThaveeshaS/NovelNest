import React from 'react';
import logo from './images/logo.jpg'; // Adjust the path to your logo image
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function Header2() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        {/* Company Logo and Name */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Company Logo" style={{ height: '55px' }} />
          <span className="ms-2" style={{ fontSize: '1.4rem', fontWeight: 'bold' }}> NovelNest Book Store</span>
        </Link>

        {/* Toggle Button for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Centered Search Bar */}
          <div className="mx-auto d-flex">
            <form className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-light" type="submit">Search</button>
            </form>
          </div>

          {/* Right Side: Profile Icon and Log Out Button */}
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/customeraccount">
                <i className="bi bi-person-circle" style={{ fontSize: '2rem', color: 'white' }}></i>
              </Link>
            </li>
            <li className="nav-item">
              <p>....</p>
            </li>
          </ul>
          <Link className="btn btn-outline-light" to="/">Log out</Link>
          <p>....</p>
        </div>
      </div>
    </nav>
  );
}

export default Header2;