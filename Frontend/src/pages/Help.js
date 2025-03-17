import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Help = () => {
  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <h1 className="display-4 text-primary">🆘 Help Center</h1>
        <p className="lead text-muted">
          Need help? You've come to the right place! Find answers to common questions and learn how to get the most out of NavelNest Book Store.
        </p>
      </div>

      {/* How to Place an Order */}
      <section className="mb-5">
        <h3 className="text-secondary mb-3">📚 How to Place an Order</h3>
        <ol className="list-group list-group-numbered">
          <li className="list-group-item">
            Browse our collection and find the book(s) you love.
          </li>
          <li className="list-group-item">
            Click on the "Add to Cart" button on the product page.
          </li>
          <li className="list-group-item">
            Go to your cart by clicking the cart icon at the top of the page.
          </li>
          <li className="list-group-item">
            Review your items and click "Proceed to Checkout."
          </li>
          <li className="list-group-item">
            Enter your shipping details and choose a payment method.
          </li>
          <li className="list-group-item">
            Confirm your order and wait for your confirmation email!
          </li>
        </ol>
      </section>

      {/* Managing Your Account */}
      <section className="mb-5">
        <h3 className="text-secondary mb-3">👤 Managing Your Account</h3>
        <ul className="list-group">
          <li className="list-group-item">
            <strong>Creating an Account:</strong> Click on the "Sign Up" button on the top-right corner and fill in your details.
          </li>
          <li className="list-group-item">
            <strong>Resetting Password:</strong> Go to the login page, click "Forgot Password," and follow the instructions.
          </li>
          <li className="list-group-item">
            <strong>Updating Profile:</strong> After logging in, go to "My Account" to update your personal details or view your orders.
          </li>
        </ul>
      </section>

      {/* Common Issues & Troubleshooting */}
      <section className="mb-5">
        <h3 className="text-secondary mb-3">⚙️ Common Issues & Troubleshooting</h3>

        <div className="mb-3">
          <h5 className="text-primary">I didn't receive my confirmation email!</h5>
          <p className="text-muted">
            Please check your spam or junk folder. If it's not there, contact us at{" "}
            <a href="mailto:support@navelnestbookstore.com" className="text-decoration-none text-primary">
              support@navelnestbookstore.com
            </a>
            .
          </p>
        </div>

        <div className="mb-3">
          <h5 className="text-primary">My payment didn't go through!</h5>
          <p className="text-muted">
            Double-check your payment details. If the issue persists, try a different payment method or contact your bank.
          </p>
        </div>

        <div className="mb-3">
          <h5 className="text-primary">How do I track my shipment?</h5>
          <p className="text-muted">
            Once your order ships, we send a tracking link to your email. You can also find it under "My Orders" in your account.
          </p>
        </div>

        <div className="mb-3">
          <h5 className="text-primary">What if I receive a damaged book?</h5>
          <p className="text-muted">
            We're sorry! Please email us a photo of the damaged item at{" "}
            <a href="mailto:support@navelnestbookstore.com" className="text-decoration-none text-primary">
              support@navelnestbookstore.com
            </a>{" "}
            and we'll arrange a replacement or refund.
          </p>
        </div>
      </section>

      {/* Contact Support CTA */}
      <section className="text-center mb-5">
        <h4 className="text-primary mb-3">Still Need Help?</h4>
        <p className="text-muted">
          Our friendly support team is here for you Monday to Friday, 9 AM - 5 PM.
        </p>
        <a href="/customer-service" className="btn btn-primary px-4 py-2">
          Contact Customer Service
        </a>
      </section>
    </div>
  );
};

export default Help;
