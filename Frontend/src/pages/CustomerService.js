import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomerService = () => {
  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <h1 className="display-4 text-primary">📞 Customer Service</h1>
        <p className="lead text-muted">
          We're here to help! If you have questions, concerns, or need assistance, feel free to reach out to us.
        </p>
      </div>

      {/* Contact Info Section */}
      <div className="row mb-5">
        <div className="col-md-6 mb-4">
          <h4 className="text-secondary">📧 Email Support</h4>
          <p className="text-muted">
            Email us at{" "}
            <a
              href="mailto:support@navelnestbookstore.com"
              className="text-primary text-decoration-none"
            >
              support@navelnestbookstore.com
            </a>{" "}
            for any inquiries. We typically respond within 24 hours.
          </p>
        </div>

        <div className="col-md-6 mb-4">
          <h4 className="text-secondary">📞 Phone Support</h4>
          <p className="text-muted">
            Call us at{" "}
            <a href="tel:+1234567890" className="text-primary text-decoration-none">
              +1 234 567 890
            </a>{" "}
            Monday to Friday, 9 AM - 5 PM.
          </p>
        </div>

        <div className="col-md-6 mb-4">
          <h4 className="text-secondary">📍 Address</h4>
          <p className="text-muted">
            NavelNest Book Store Headquarters
            <br />
            123 Book Street, Knowledge City
            <br />
            Country: Imaginaria, ZIP 456789
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-5">
        <h3 className="text-primary mb-4">❓ Frequently Asked Questions</h3>

        <div className="mb-4">
          <h5 className="text-secondary">How can I track my order?</h5>
          <p className="text-muted">
            Once your order has shipped, you'll receive an email with a tracking number and link to track your package.
          </p>
        </div>

        <div className="mb-4">
          <h5 className="text-secondary">What is your return policy?</h5>
          <p className="text-muted">
            We offer a 14-day return policy on eligible items. Please review our{" "}
            <a href="/return-policy" className="text-primary text-decoration-none">
              Return & Refund Policy
            </a>{" "}
            for more details.
          </p>
        </div>

        <div className="mb-4">
          <h5 className="text-secondary">How do I cancel or change my order?</h5>
          <p className="text-muted">
            Contact us as soon as possible at{" "}
            <a
              href="mailto:support@navelnestbookstore.com"
              className="text-primary text-decoration-none"
            >
              support@navelnestbookstore.com
            </a>{" "}
            or call{" "}
            <a href="tel:+1234567890" className="text-primary text-decoration-none">
              +1 234 567 890
            </a>
            . If your order has not shipped yet, we can make changes or cancel it.
          </p>
        </div>

        <div className="mb-4">
          <h5 className="text-secondary">Do you offer international shipping?</h5>
          <p className="text-muted">
            Yes! We offer international shipping. Shipping rates and delivery times vary based on location.
          </p>
        </div>

        <div className="mb-4">
          <h5 className="text-secondary">What payment methods do you accept?</h5>
          <p className="text-muted">
            We accept major credit/debit cards (Visa, MasterCard), PayPal, and other secure payment methods.
          </p>
        </div>
      </div>

      {/* Contact Form Section (Optional) */}
      <div className="mb-5">
        <h3 className="text-primary mb-4">💬 Send Us a Message</h3>
        <form>
          <div className="mb-3">
            <label htmlFor="name" className="form-label text-secondary">
              Name
            </label>
            <input type="text" className="form-control" id="name" placeholder="Your Name" required />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label text-secondary">
              Email
            </label>
            <input type="email" className="form-control" id="email" placeholder="Your Email" required />
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label text-secondary">
              Message
            </label>
            <textarea
              className="form-control"
              id="message"
              rows="4"
              placeholder="Your message..."
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary px-4">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerService;
