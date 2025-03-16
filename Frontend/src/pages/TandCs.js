import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const TermsAndConditions = () => {
  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <h1 className="display-4 text-primary">📜 Terms and Conditions</h1>
        <p className="lead text-muted">Last Updated: March 2025</p>
      </div>

      <p className="mb-4 text-secondary">
        Welcome to <strong>NavelNest Book Store!</strong> These Terms and Conditions outline the rules and regulations for the use of our website, located at{" "}
        <a href="http://www.navelnestbookstore.com" className="text-decoration-none text-primary">
          www.navelnestbookstore.com
        </a>. By accessing or using our site, you agree to comply with and be bound by these Terms. If you do not agree with any part of these Terms, please do not use our website.
      </p>

      <div className="mb-4">
        <h4 className="text-secondary">1. Acceptance of Terms</h4>
        <p className="text-muted">
          By accessing or using NavelNest Book Store, you confirm that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy.
        </p>
      </div>

      <div className="mb-4">
        <h4 className="text-secondary">2. Eligibility</h4>
        <p className="text-muted">
          You must be at least 18 years old or accessing the site under the supervision of a parent or legal guardian to use this website.
        </p>
      </div>

      <div className="mb-4">
        <h4 className="text-secondary">3. Use of the Website</h4>
        <ul className="text-muted">
          <li>You agree to use the site for lawful purposes only.</li>
          <li>You may not use our website in any way that causes damage or disrupts the availability of the site.</li>
          <li>You must not use the site for fraudulent purposes or conduct any illegal activities.</li>
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="text-secondary">4. User Accounts</h4>
        <ul className="text-muted">
          <li>To access certain features of the website, such as placing orders, you may be required to create an account.</li>
          <li>You are responsible for maintaining the confidentiality of your account information and password.</li>
          <li>You agree to accept responsibility for all activities that occur under your account.</li>
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="text-secondary">5. Products and Orders</h4>
        <ul className="text-muted">
          <li>All products listed on our site are subject to availability.</li>
          <li>We reserve the right to refuse or cancel orders at our discretion. If we cancel an order, you will be notified and refunded accordingly.</li>
          <li>Prices for our products are subject to change without notice.</li>
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="text-secondary">6. Payments</h4>
        <ul className="text-muted">
          <li>Payments for purchases are processed securely through trusted third-party payment gateways.</li>
          <li>We do not store or have access to your payment card details.</li>
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="text-secondary">7. Shipping and Delivery</h4>
        <ul className="text-muted">
          <li>We aim to deliver your orders promptly as per our Shipping Policy.</li>
          <li>Delivery times may vary based on your location and other external factors beyond our control.</li>
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="text-secondary">8. Returns and Refunds</h4>
        <ul className="text-muted">
          <li>We accept returns and provide refunds according to our Return & Refund Policy.</li>
          <li>Products must be returned in their original condition within the specified return period.</li>
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="text-secondary">9. Intellectual Property</h4>
        <p className="text-muted">
          All content on the website, including images, text, logos, and graphics, is the property of NavelNest Book Store and is protected by copyright laws.
          You may not reproduce, distribute, or use any content from our website without prior written consent.
        </p>
      </div>

      <div className="mb-4">
        <h4 className="text-secondary">10. Limitation of Liability</h4>
        <p className="text-muted">
          NavelNest Book Store is not liable for any indirect, incidental, or consequential damages arising out of your use of our website or the purchase of our products.
          We do not guarantee that the website will always be available, uninterrupted, or error-free.
        </p>
      </div>

      <div className="mb-4">
        <h4 className="text-secondary">11. Third-Party Links</h4>
        <p className="text-muted">
          Our website may include links to external websites. We are not responsible for the content, privacy practices, or terms of those third-party sites.
        </p>
      </div>

      <div className="mb-4">
        <h4 className="text-secondary">12. Termination</h4>
        <p className="text-muted">
          We reserve the right to terminate or suspend your access to our website if you violate these Terms and Conditions.
        </p>
      </div>

      <div className="mb-4">
        <h4 className="text-secondary">13. Changes to the Terms</h4>
        <p className="text-muted">
          We may update these Terms and Conditions from time to time. Any changes will be posted on this page with an updated effective date.
          Your continued use of the website after changes are posted constitutes your acceptance of the revised terms.
        </p>
      </div>

      <div className="mb-4">
        <h4 className="text-secondary">14. Contact Us</h4>
        <p className="text-muted">
          If you have any questions about these Terms and Conditions, please contact us:
        </p>
        <p className="text-primary font-weight-bold">📧 support@navelnestbookstore.com</p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
