import React from 'react';
import Navbar2 from '../../components/Navbar2';
import Header2 from '../../components/Header2';
import { useWishlist } from '../../pages/Product/WishlistContext';
import { useNavigate } from 'react-router-dom';
// Make sure to import Bootstrap CSS in your main index.js or App.js
// import 'bootstrap/dist/css/bootstrap.min.css';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 bg-light">
      <Header2 />
      <Navbar2 />
      <div className="container px-4 py-5">
        <h1 className="display-4 fw-bold text-center mb-5 text-dark">
          My Wishlist
        </h1>
        
        {wishlist.length === 0 ? (
          <div className="card shadow-sm p-5 text-center">
            <p className="fs-4 text-muted mb-0">
              Your wishlist is empty
            </p>
            <button 
              className="btn btn-outline-primary mt-3"
              onClick={() => navigate('/books')}
            >
              Explore Books
            </button>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {wishlist.map(product => (
              <div key={product._id} className="col">
                <div className="card h-100 shadow-sm border-0 hover-lift">
                  <div className="card-img-top p-4 bg-white">
                    <img
                      src={product.coverPage}
                      alt={product.bookTitle}
                      className="img-fluid"
                      style={{ maxHeight: '200px', objectFit: 'contain' }}
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/150?text=No+Image')}
                    />
                  </div>
                  <div className="card-body">
                    <h2 
                      className="card-title fs-5 fw-semibold text-dark cursor-pointer hover-title"
                      onClick={() => navigate(`/bookdetails/${product._id}`)}
                    >
                      {product.bookTitle}
                    </h2>
                    <p className="text-muted mb-2">{product.authorName}</p>
                    <p className="fs-5 fw-bold text-success mb-3">
                      RS. {product.price}
                    </p>
                  </div>
                  <div className="card-footer bg-white border-0 pb-3">
                    <button 
                      onClick={() => removeFromWishlist(product._id)}
                      className="btn btn-danger w-100 fw-medium"
                    >
                      Remove from Wishlist
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inline styles */}
      <style jsx>{`
        .hover-lift {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .hover-title:hover {
          color: #007bff !important;
          text-decoration: underline;
        }
        .card {
          border-radius: 10px;
          overflow: hidden;
        }
        .btn-danger {
          transition: background-color 0.2s ease-in-out;
        }
        .btn-danger:hover {
          background-color: #dc3545;
          border-color: #dc3545;
        }
      `}</style>
    </div>
  );
};

export default WishlistPage;