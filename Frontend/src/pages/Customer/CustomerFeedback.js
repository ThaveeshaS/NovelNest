import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header2 from '../../components/Header2';
import Navbar2 from '../../components/Navbar2';

const CustomerFeedbackPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    feedbackTopic: 'general',
    message: '',
    rating: 0,
    sentiment: 'positive',
  });

  const [submitStatus, setSubmitStatus] = useState({
    submitted: false,
    success: false,
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    rating: '',
  });

  // Feedback topics options
  const feedbackTopics = [
    { value: 'general', label: 'General Feedback' },
    { value: 'product', label: 'Product Feedback' },
    { value: 'service', label: 'Service Feedback' },
    { value: 'website', label: 'Website Experience' },
    { value: 'delivery', label: 'Delivery Experience' },
    { value: 'other', label: 'Other' },
  ];

  // Sentiment options
  const sentimentOptions = [
    { value: 'positive', label: 'Positive', icon: 'bi-emoji-smile' },
    { value: 'neutral', label: 'Neutral', icon: 'bi-emoji-neutral' },
    { value: 'negative', label: 'Negative', icon: 'bi-emoji-frown' },
  ];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Filter out non-letter characters for the fullName field
    if (name === 'fullName') {
      const filteredValue = value.replace(/[^a-zA-Z\s]/g, ''); // Allow only letters and spaces
      setFormData({
        ...formData,
        [name]: filteredValue,
      });
    } else if (name === 'email') {
      // Convert email to lowercase and filter out invalid characters
      const filteredValue = value.toLowerCase().replace(/[^a-z0-9@.]/g, '');
      setFormData({
        ...formData,
        [name]: filteredValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Validate the field as the user types
    validateField(name, name === 'fullName' ? value.replace(/[^a-zA-Z\s]/g, '') : value);
  };

  // Handle star rating selection
  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating: rating,
    });
    validateField('rating', rating);
  };

  // Validate individual fields
  const validateField = (name, value) => {
    let fieldErrors = { ...errors };

    switch (name) {
      case 'fullName':
        if (!/^[a-zA-Z\s]{2,}$/.test(value)) {
          fieldErrors.fullName = 'Full name must contain only letters and be at least 2 characters long.';
        } else {
          fieldErrors.fullName = '';
        }
        break;
      case 'email':
        if (!value) {
          fieldErrors.email = 'Email is required.';
        } else if (!/^[a-z0-9@.]+@[a-z0-9]+\.[a-z]{2,}$/.test(value)) {
          fieldErrors.email = 'Please enter a valid email address.';
        } else {
          fieldErrors.email = '';
        }
        break;
      case 'rating':
        if (value === 0) {
          fieldErrors.rating = 'Please select a rating.';
        } else {
          fieldErrors.rating = '';
        }
        break;
      default:
        break;
    }

    setErrors(fieldErrors);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields before submission
    validateField('fullName', formData.fullName);
    validateField('email', formData.email);
    validateField('rating', formData.rating);

    // Check if there are any errors
    if (errors.fullName || errors.email || errors.rating) {
      alert('Please fix the errors in the form before submitting.');
      return;
    }

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
        setSubmitStatus({ submitted: true, success: true });
        // Clear the form after submission
        setFormData({
          fullName: '',
          email: '',
          feedbackTopic: 'general',
          message: '',
          rating: 0,
          sentiment: 'positive',
        });

        // Reset status after 5 seconds
        setTimeout(() => {
          setSubmitStatus({ submitted: false, success: false });
        }, 5000);
      } else {
        setSubmitStatus({ submitted: true, success: false });

        // Reset status after 5 seconds
        setTimeout(() => {
          setSubmitStatus({ submitted: false, success: false });
        }, 5000);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus({ submitted: true, success: false });

      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ submitted: false, success: false });
      }, 5000);
    }
  };

  // Prevent non-letter keys from being entered in the fullName field
  const handleKeyDown = (e) => {
    const { name, key } = e;
    if (name === 'fullName' && !/^[a-zA-Z\s]$/.test(key) && key !== 'Backspace' && key !== 'Delete' && key !== 'ArrowLeft' && key !== 'ArrowRight') {
      e.preventDefault();
    } else if (name === 'email' && !/^[a-z0-9@.]$/.test(key) && key !== 'Backspace' && key !== 'Delete' && key !== 'ArrowLeft' && key !== 'ArrowRight') {
      e.preventDefault();
    }
  };

  return (
    <div className="feedback-page bg-light min-vh-100">
      <Header2 />
      <Navbar2 />

      <div className="container py-5">
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h1 className="display-4 fw-bold text-primary">Your Opinion Matters</h1>
            <p className="lead text-muted">We value your feedback to improve our services and experience</p>
          </div>
        </div>

        <div className="row g-4 align-items-center">
          <div className="col-lg-7 mb-4">
            <div className="position-relative rounded-4 overflow-hidden shadow-lg">
              <img
                src="https://s1.picswalls.com/wallpapers/2016/03/29/beautiful-nature-high-definition_042323787_304.jpg"
                alt="Customer Feedback"
                className="img-fluid w-100"
                style={{ height: '1010px', objectFit: 'cover' }}
              />
              <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex flex-column justify-content-start px-4 px-lg-5 text-white pt-5">
                <h2 className="fw-bold mb-3">Help Us Serve You Better</h2>
                <p className="fs-5 mb-4">Your insights help us understand what we're doing right and where we can improve.</p>
                <div className="d-flex gap-3 mb-3">
                  <div className="bg-white bg-opacity-25 p-3 rounded-3 text-center" style={{ width: '100px' }}>
                    <div className="fw-bold fs-1 mb-1">24h</div>
                    <div className="small">Response Time</div>
                  </div>
                  <div className="bg-white bg-opacity-25 p-3 rounded-3 text-center" style={{ width: '100px' }}>
                    <div className="fw-bold fs-1 mb-1">98%</div>
                    <div className="small">Resolution Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-5 mb-4">
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-4 p-lg-5">
                <h2 className="card-title fw-bold text-primary mb-4">Send Us Your Feedback</h2>

                {submitStatus.submitted && (
                  <div className={`alert ${submitStatus.success ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert">
                    {submitStatus.success
                      ? 'Thank you for your feedback! We appreciate your input.'
                      : 'Failed to submit feedback. Please try again.'}
                    <button type="button" className="btn-close" onClick={() => setSubmitStatus({ submitted: false, success: false })}></button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                  {/* Full Name Field */}
                  <div className="mb-4">
                    <label htmlFor="fullName" className="form-label fw-semibold">
                      Full Name
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-person-fill"></i>
                      </span>
                      <input
                        type="text"
                        className={`form-control form-control-lg bg-light ${errors.fullName ? 'is-invalid' : ''}`}
                        id="fullName"
                        name="fullName"
                        placeholder="Your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        required
                        style={{ fontSize: '14px' }}
                      />
                    </div>
                    {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                  </div>

                  {/* Email Field */}
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-envelope-fill"></i>
                      </span>
                      <input
                        type="email"
                        className={`form-control form-control-lg bg-light ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        placeholder="Your email address"
                        value={formData.email}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        required
                        style={{ fontSize: '14px' }}
                      />
                    </div>
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  {/* Feedback Topic Field */}
                  <div className="mb-4">
                    <label htmlFor="feedbackTopic" className="form-label fw-semibold">
                      Feedback Topic
                    </label>
                    <select
                      className="form-select form-select-lg bg-light"
                      id="feedbackTopic"
                      name="feedbackTopic"
                      value={formData.feedbackTopic}
                      onChange={handleChange}
                      style={{ fontSize: '14px' }}
                    >
                      {feedbackTopics.map((topic) => (
                        <option key={topic.value} value={topic.value}>
                          {topic.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Star Rating Field */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold d-block">Your Rating</label>
                    <div className="d-flex align-items-center">
                      <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`star-btn ${star <= formData.rating ? 'text-warning' : 'text-secondary'}`}
                            onClick={() => handleRatingChange(star)}
                            style={{ background: 'none', border: 'none', fontSize: '24px' }}
                          >
                            <i className="bi bi-star-fill"></i>
                          </button>
                        ))}
                      </div>
                      <span className="ms-2 text-muted small">
                        {formData.rating === 0 ? 'Select a rating' : `${formData.rating} star${formData.rating !== 1 ? 's' : ''}`}
                      </span>
                    </div>
                    {errors.rating && <div className="invalid-feedback d-block">{errors.rating}</div>}
                  </div>

                  {/* Feedback Sentiment Field */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold d-block">How do you feel?</label>
                    <div className="d-flex gap-3">
                      {sentimentOptions.map((sentiment) => (
                        <div key={sentiment.value} className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="sentiment"
                            id={`sentiment-${sentiment.value}`}
                            value={sentiment.value}
                            checked={formData.sentiment === sentiment.value}
                            onChange={handleChange}
                          />
                          <label className="form-check-label d-flex align-items-center" htmlFor={`sentiment-${sentiment.value}`}>
                            <i className={`bi ${sentiment.icon} me-1`}></i>
                            {sentiment.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Message Field */}
                  <div className="mb-4">
                    <label htmlFor="message" className="form-label fw-semibold">
                      Your Feedback Message
                    </label>
                    <textarea
                      className="form-control form-control-lg bg-light"
                      id="message"
                      name="message"
                      rows="5"
                      placeholder="Share your detailed thoughts, suggestions, or concerns with us..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      style={{ fontSize: '14px' }}
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="d-flex justify-content-end mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary btn-sm rounded-pill py-2 px-4 shadow-sm"
                      style={{ fontSize: '14px' }}
                    >
                      Submit Feedback
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Contact info card */}
            <div className="card mt-4 border-0 bg-primary text-white rounded-4 shadow">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Need immediate assistance?</h5>
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-telephone-fill me-2"></i>
                  <span>+94 123 456 789</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="bi bi-envelope-fill me-2"></i>
                  <span>info@bookstore.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerFeedbackPage;