import React from "react";
import Sahan from '../components/images/Sahan.jpg'; // Import image
import Thaveesha from '../components/images/Thaveesha.jpg'; // Import image
import Amesh from '../components/images/Amesh.jpg'; // Import image
import Viraj from '../components/images/Viraj.jpg'; // Import image
import "bootstrap/dist/css/bootstrap.min.css";

const AboutUs = () => {
  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <h1 className="display-4 text-primary">About Us</h1>
        <p className="lead">Welcome to Our Navel Nest Book Store</p>
      </div>

      {/* Our Story Section */}
      <div className="row mb-5">
        <div className="col-md-6">
          <img
            src="https://img.freepik.com/premium-photo/classical-library-books-wooden-background-study-living-room-education_872147-4741.jpg"
            alt="Our Story"
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-6">
          <h2 className="text-secondary">Our Story</h2>
          <p className="text-muted">
            Our bookstore was founded in 2023 with a simple mission: to connect readers with the books they love. 
            We believe that books have the power to inspire, educate, and transform lives. Over the years, we've grown 
            from a small local shop to a thriving online platform, serving book lovers worldwide.
          </p>
          <p className="text-muted">
            Our journey has been filled with countless stories, both from the books we sell and the customers we serve. 
            We're proud to be a part of your reading journey and look forward to many more chapters together.
          </p>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="row mb-5">
        <div className="col-md-6 order-md-2">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/024/571/657/small_2x/war-concept-military-man-in-uniform-of-world-war-ii-against-the-background-of-destroyed-buildings-a-soldier-standing-amidst-the-ruins-of-a-destroyed-city-after-a-nuclear-explosion-ai-generated-free-photo.jpg"
            alt="Our Mission"
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-6 order-md-1">
          <h2 className="text-secondary">Our Mission</h2>
          <p className="text-muted">
            Our mission is to make books accessible to everyone, everywhere. We strive to offer a wide selection of 
            titles, from bestsellers to hidden gems, at affordable prices. We're committed to fostering a love of 
            reading and supporting authors and publishers in sharing their stories with the world.
          </p>
          <p className="text-muted">
            We also believe in giving back to the community. A portion of every sale goes toward literacy programs 
            and initiatives that promote education and reading in underserved areas.
          </p>
        </div>
      </div>

      {/* Meet Our Team Section */}
      <div className="text-center mb-5">
        <h2 className="text-secondary">Meet Our Team</h2>
        <p className="text-muted">The passionate individuals behind our bookstore</p>
        <div className="row">
          {/* Team Member 1 - Sahan */}
          <div className="col-md-3 mb-4">
            <div className="card shadow h-100">
              <div className="d-flex justify-content-center mt-3">
                <img
                  src={Sahan}
                  alt="Sahan Viduranga"
                  className="rounded-circle"
                  style={{
                    width: '170px',
                    height: '170px',
                    objectFit: 'cover',
                    border: '3px solid #f8f9fa'
                  }}
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">Sahan Viduranga</h5>
                <p className="card-text text-muted">Handling customer accounts</p>
              </div>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="col-md-3 mb-4">
            <div className="card shadow h-100">
              <div className="d-flex justify-content-center mt-3">
                <img
                  src={Thaveesha}
                  alt="Thaveesha Sanjana"
                  className="rounded-circle"
                  style={{
                    width: '170px',
                    height: '170px',
                    objectFit: 'cover',
                    border: '3px solid #f8f9fa'
                  }}
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">Thaveesha Sanjana</h5>
                <p className="card-text text-muted">Product Handling</p>
              </div>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="col-md-3 mb-4">
            <div className="card shadow h-100">
              <div className="d-flex justify-content-center mt-3">
                <img
                  src={Amesh}
                  alt="Amesh Thishara"
                  className="rounded-circle"
                  style={{
                    width: '170px',
                    height: '170px',
                    objectFit: 'cover',
                    border: '3px solid #f8f9fa'
                  }}
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">Amesh Thishara</h5>
                <p className="card-text text-muted">Payment Gateway</p>
              </div>
            </div>
          </div>

          {/* Team Member 4 */}
          <div className="col-md-3 mb-4">
            <div className="card shadow h-100">
              <div className="d-flex justify-content-center mt-3">
                <img
                  src={Viraj}
                  alt="Viraj Pasindu"
                  className="rounded-circle"
                  style={{
                    width: '170px',
                    height: '170px',
                    objectFit: 'cover',
                    border: '3px solid #f8f9fa'
                  }}
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">Viraj Pasindu</h5>
                <p className="card-text text-muted">Delivery Handling</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;