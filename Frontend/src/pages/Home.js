import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {/* Carousel Section */}
      <div
        id="carouselExampleAutoplaying"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        data-bs-interval="1500" // Set interval to 1 second (1000ms)
      >
        <div className="carousel-inner">
          {/* First Slide */}
          <div className="carousel-item active">
            <img
              src="https://juliaveenstra.com/wp-content/uploads/2025/03/Driftwood-24-by-72-1200x400.jpg"
              className="d-block w-100"
              alt="First slide"
            />
          </div>
          {/* Second Slide */}
          <div className="carousel-item">
            <img
              src="https://www.dieboldnixdorf.com/-/media/diebold/images/article/header-image/header-fitbanking-philosophy-1200x400.jpg"
              className="d-block w-100"
              alt="Second slide"
            />
          </div>
          {/* Third Slide */}
          <div className="carousel-item">
            <img
              src="https://static.zerochan.net/Aoha.(Twintail).full.2145423.jpg"
              className="d-block w-100"
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
