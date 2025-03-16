import React from "react";
import Sahan from '../components/images/Sahan.jpg'; // Import image
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
            src="https://static.vecteezy.com/system/resources/thumbnails/031/332/726/small_2x/a-book-pile-close-up-on-a-table-front-view-pile-book-for-festival-of-world-book-day-national-book-day-or-national-education-day-stack-of-colorful-books-on-white-background-by-ai-generated-free-photo.jpg"
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
            <div className="card shadow">
              <img
                src={Sahan} // Use the imported image
                alt="Sahan Viduranga"
                className="card-img-top rounded-circle p-3"
              />
              <div className="card-body">
                <h5 className="card-title">Sahan Viduranga</h5>
                <p className="card-text text-muted">Handling customer accounts</p>
              </div>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="col-md-3 mb-4">
            <div className="card shadow">
              <img
                src={Sahan} // Use the imported image
                alt="Sahan Viduranga"
                className="card-img-top rounded-circle p-3"
              />
              <div className="card-body">
                <h5 className="card-title">Thaveesha</h5>
                <p className="card-text text-muted">Product Handiling</p>
              </div>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="col-md-3 mb-4">
            <div className="card shadow">
              <img
                src={Sahan} // Use the imported image
                alt="Sahan Viduranga"
                className="card-img-top rounded-circle p-3"
              />
              <div className="card-body">
                <h5 className="card-title">Amesh</h5>
                <p className="card-text text-muted">Payment Gateway</p>
              </div>
            </div>
          </div>

          {/* Team Member 4 */}
          <div className="col-md-3 mb-4">
            <div className="card shadow">
              <img
                src={Sahan} // Use the imported image
                alt="Sahan Viduranga"
                className="card-img-top rounded-circle p-3"
              />
              <div className="card-body">
                <h5 className="card-title">Viraj</h5>
                <p className="card-text text-muted">Delivery Handiling</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;