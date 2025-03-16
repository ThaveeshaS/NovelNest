import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header2 from '../../components/Header2'; 
import Navbar2 from '../../components/Navbar2'; 
import slide1 from '../../components/images/slide1.jpg';
import slide2 from '../../components/images/slide2.jpg';
import slide3 from '../../components/images/slide3.jpg';

const CustomerDashboard = () => {
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
          data-bs-interval="1500" // Set interval to 1.5 seconds
        >
          <div className="carousel-inner">
            {/* First Slide */}
            <div className="carousel-item active">
              <img
                src={slide1}
                className="d-block w-100"
                alt="Welcome Slide"
              />
            </div>
            {/* Second Slide */}
            <div className="carousel-item">
              <img
                src={slide2}
                className="d-block w-100"
                alt="Manage Account Slide"
              />
            </div>
            {/* Third Slide */}
            <div className="carousel-item">
              <img
                src={slide3}
                className="d-block w-100"
                alt="Explore Services Slide"
              />
            </div>
          </div>
          {/* Carousel Controls */}
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="mt-5">
          <h1>Customer Dashboard</h1>
          <p>Welcome back! Here's an overview of your account and activities.</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;