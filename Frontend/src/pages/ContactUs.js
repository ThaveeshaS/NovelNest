import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting us! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" }); // Reset form
  };

  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <h1 className="display-4 text-primary">Contact Us</h1>
        <p className="lead">We'd love to hear from you!</p>
      </div>

      <div className="row">
        {/* Contact Form */}
        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="text-secondary mb-4">Send Us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Contact Information and Map */}
        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="text-secondary mb-4">Our Location</h2>
              <div className="mb-4">
                <iframe
                  title="Bookstore Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798511757686!2d79.860755415365!3d6.914657295003654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2596b8d5f3b9f%3A0x8b9b9b9b9b9b9b9b!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1633025000000!5m2!1sen!2sus"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
              <div className="mb-3">
                <h5 className="text-secondary">Address</h5>
                <p className="text-muted">
                  123 Book Street, Colombo, Sri Lanka
                </p>
              </div>
              <div className="mb-3">
                <h5 className="text-secondary">Email</h5>
                <p className="text-muted">info@bookstore.com</p>
              </div>
              <div className="mb-3">
                <h5 className="text-secondary">Phone</h5>
                <p className="text-muted">+94 123 456 789</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;