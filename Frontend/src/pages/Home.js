import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import slideVideo1 from '../components/images/SlideVideo1.mp4';

const Home = () => {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {/* Carousel Section */}
      <div
        id="carouselExampleAutoplaying"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        data-bs-interval="5000"
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
            >
              <source src={slideVideo1} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>

      {/* Text Below the Carousel */}
      <h2>Home Page</h2>
      <p>Welcome to our simple React homepage.</p>
    </div>
  );
};

export default Home;
