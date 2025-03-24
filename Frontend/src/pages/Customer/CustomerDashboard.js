import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header2 from '../../components/Header2';
import Navbar2 from '../../components/Navbar2';
import slideVideo1 from '../../components/images/SlideVideo1.mp4';

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
          data-bs-interval="5000" // 5 seconds
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
