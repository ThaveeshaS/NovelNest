import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import Header2 from '../../components/Header2'; // Adjust the import path as needed
import Navbar2 from '../../components/Navbar2'; // Adjust the import path as needed

const CustomerFeedbackPage = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send form data to the backend
      const response = await fetch('http://localhost:5000/api/feedback/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Thank you for your feedback!');
        // Clear the form after submission
        setFormData({
          name: '',
          email: '',
          message: '',
        });
      } else {
        alert('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      {/* Include Header2 */}
      <Header2 />

      {/* Include Navbar2 */}
      <Navbar2 />

      {/* Feedback Page Content */}
      <div className="container my-5">
        <div className="row">
          {/* Left Side: Image */}
          <div className="col-md-7 mb-4">
            <img
              src="https://wallpaperaccess.com/full/4954173.jpg" // Replace with your image URL 1280*780
              alt="Customer Feedback"
              className="img-fluid rounded"
            />
          </div>

          {/* Right Side: Feedback Form */}
          <div className="col-md-5 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h2 className="text-secondary mb-4">Send Us Your Feedback</h2>
                <form onSubmit={handleSubmit}>
                  {/* Name Field */}
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

                  {/* Email Field */}
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

                  {/* Feedback Message Field */}
                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">
                      Feedback Message
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

                  {/* Submit Button */}
                  <button type="submit" className="btn btn-primary w-100">
                    Submit Feedback Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerFeedbackPage;