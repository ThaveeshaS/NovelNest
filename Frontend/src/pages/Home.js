import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import slide1 from '../components/images/slide1.jpg';
import slide2 from '../components/images/slide2.jpg';
import slide3 from '../components/images/slide3.jpg';

const Home = () => {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {/* Carousel Section */}
      <div
        id="carouselExampleAutoplaying"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        data-bs-interval="5000" // 5 seconds interval
      >
        <div className="carousel-inner">
          {/* First Slide */}
          <div className="carousel-item active">
            <img
              src={slide1}
              className="d-block w-100 rounded-3" // Curved edges here
              alt="First slide"
            />
          </div>
          {/* Second Slide */}
          <div className="carousel-item">
            <img
              src={slide2}
              className="d-block w-100 rounded-3"
              alt="Second slide"
            />
          </div>
          {/* Third Slide */}
          <div className="carousel-item">
            <img
              src={slide3}
              className="d-block w-100 rounded-3"
              alt="Third slide"
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

      {/* Text Below the Carousel */}
      <h1> </h1>
      <h2>Home Page</h2>
      <p>Welcome to our simple React homepage.</p>
    </div>
  );
};

export default Home;
