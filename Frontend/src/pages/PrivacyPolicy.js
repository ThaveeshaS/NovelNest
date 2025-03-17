import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const PrivacyPolicy = () => {
  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <h1 className="display-4 text-primary">Privacy Policy</h1>
        <p className="lead">Your Personal Information is Safe with NavelNest Book Store</p>
      </div>

      <div className="mb-4">
        <h4 className="text-secondary">Our Commitment to Your Privacy</h4>
        <p className="text-muted">
          At <strong>NavelNest Book Store</strong>, your privacy is important to us. We are committed to protecting your personal information and ensuring transparency about how we collect, use, and safeguard your data. This Privacy Policy explains our practices to help you feel confident when using our website.
        </p>
      </div>

      <div className="mb-4">
        <h4 className="text-secondary">Information We Collect</h4>
        <ul className="text-muted">
          <li>Your name, email address, shipping address, and payment details when you create an account or place an order.</li>
          <li>Information you provide when you subscribe to our newsletters or contact our support team.</li>
          <li>Data related to your interactions with our website to improve our services.</li>
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="text-secondary">How We Use Your Information</h4>
        <ul className="text-muted">
          <li>Process your orders and deliver your books.</li>
          <li>Communicate with you about your orders, account, and customer support inquiries.</li>
          <li>Send updates, special offers, and newsletters (only if you opt-in).</li>
          <li>Improve our website, products, and services to give you a better experience.</li>
        </ul>
        <p className="text-muted">We will only use your personal information for the purposes identified at the time of collection or as required by law.</p>
      </div>

      <div className="mb-4">
        <h4 className="text-secondary">How We Protect Your Information</h4>
        <p className="text-muted">
          At <strong>NavelNest Book Store</strong>, we use reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. Your information is stored securely and only kept for as long as necessary to fulfill the purposes outlined in this policy.
        </p>
      </div>

      <div className="mb-4">
        <h4 className="text-secondary">Sharing Your Information</h4>
        <p className="text-muted">
          We do <strong>not</strong> sell, trade, or rent your personal information to third parties. We may share limited information with trusted service providers who assist us in operating our website or fulfilling your orders—but only under strict confidentiality agreements.
        </p>
      </div>

      <div className="mb-4">
        <h4 className="text-secondary">Your Rights & Choices</h4>
        <ul className="text-muted">
          <li>You can access and update your personal details anytime through your account.</li>
          <li>You can opt out of marketing emails at any time by clicking the unsubscribe link.</li>
          <li>If you have any concerns about how we handle your data, you can contact us directly.</li>
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="text-secondary">Changes to Our Privacy Policy</h4>
        <p className="text-muted">
          We may update this Privacy Policy as needed to reflect changes in our practices or legal requirements. We encourage you to check this page periodically to stay informed.
        </p>
      </div>

      <div className="mb-4">
        <h4 className="text-secondary">Contact Us</h4>
        <p className="text-muted">
          If you have any questions or concerns regarding this Privacy Policy or your personal information, feel free to contact us at:
        </p>
        <p className="text-primary font-weight-bold">
          📧 support@navelnestbookstore.com
        </p>
      </div>

      <div className="text-center mt-5">
        <p className="text-success font-weight-bold">
          ✅ NavelNest Book Store is committed to protecting your privacy and providing a safe and secure shopping experience.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
