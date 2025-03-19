import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="d-flex justify-content-between flex-wrap">
          
          {/* Company Description and Newsletter - Left Corner */}
          <div className="col-md-4 mb-4">
            <h3>NovelNest Book Store</h3>
            <p>Our bookstore system helps customers easily browse, search, and purchase books online with a seamless shopping experience.</p>
            <form>
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your e-mail"
                  aria-label="Enter your e-mail"
                />
                <button className="btn btn-primary" type="button">
                  Join our community
                </button>
              </div>
            </form>
          </div>

          {/* Right Side Content */}
          <div className="d-flex justify-content-end flex-wrap col-md-8">
            
            {/* Quick Links */}
            <div className="col-md-3 mb-4">
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li><a href="/" className="text-white text-decoration-none">Home</a></li>
                <li><a href="#" className="text-white text-decoration-none">Product</a></li>
                <li><a href="/aboutus" className="text-white text-decoration-none">About us</a></li>
                <li><a href="/contactus" className="text-white text-decoration-none">Contact us</a></li>
              </ul>
            </div>

            {/* Policies */}
            <div className="col-md-3 mb-4">
              <h5>Policies</h5>
              <ul className="list-unstyled">
                <li><a href="/TermsAndConditions" className="text-white text-decoration-none">Terms and conditions</a></li>
                <li><a href="PrivacyPolicy" className="text-white text-decoration-none">Privacy policy</a></li>
              </ul>
            </div>

            {/* Help & Support & Follow Us */}
            <div className="col-md-3 mb-4">
              <h5>Help & Support</h5>
              <ul className="list-unstyled">
                <li><a href="Help" className="text-white text-decoration-none">Help</a></li>
                <li><a href="Tips" className="text-white text-decoration-none">Tips</a></li>
                <li><a href="CustomerService" className="text-white text-decoration-none">Customer service</a></li>
              </ul>

              <h5>Follow Us</h5>
              <div className="d-flex">
                <a href="#" className="text-white me-3 fs-4"><i className="fab fa-google"></i></a>
                <a href="#" className="text-white me-3 fs-4"><i className="fab fa-facebook"></i></a>
                <a href="#" className="text-white me-3 fs-4"><i className="fab fa-instagram"></i></a>
                <a href="#" className="text-white fs-4"><i className="fab fa-whatsapp"></i></a>
              </div>
            </div>

          </div>
        </div>

        {/* Copyright Section */}
        <div className="row mt-4">
          <div className="col-12 text-center">
            <p className="mb-0">© 2025 Navel Nest Book Store.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
