import React from "react";
import Navbar2 from "../../components/Navbar2";
import Header2 from "../../components/Header2";
import { useWishlist } from "../../pages/Product/WishlistContext";
import { useNavigate } from "react-router-dom";
import { X, ArrowRight, Heart, ShoppingCart } from "lucide-react";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  return (
    <div className="wishlist-container">
      <Header2 />
      <Navbar2 />

      <div className="main-content">
        <div className="section-header">
          <h2 className="display-4 fw-bold text-primary mb-3">My Wishlist</h2>
          <p className="lead text-secondary">Items you've saved for later</p>
        </div>

        <div className="wishlist-header">
          <div className="item-count">{wishlist.length} Items</div>
        </div>

        <hr className="divider" />

        {wishlist.length === 0 ? (
          <div className="empty-state">
            <Heart size={70} color="#0066cc" className="empty-icon" />
            <h3 className="text-primary mt-4">Your wishlist is empty</h3>
            <p className="text-secondary mb-4">Add items to your wishlist to keep track of what you like</p>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate("/bookslist")}
            >
              Browse Books <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div className="wishlist-table-container">
            <table className="wishlist-table">
              <thead>
                <tr>
                  <th className="item-column">Item</th>
                  <th className="price-column">Price</th>
                  <th className="stock-column">Stock Status</th>
                  <th className="action-column"></th>
                  <th className="remove-column"></th>
                </tr>
              </thead>
              <tbody>
                {wishlist.map((product) => (
                  <tr key={product._id} className="wishlist-item">
                    <td className="item-column">
                      <div className="product-info">
                        <div className="product-image">
                          <img
                            src={product.coverPage}
                            alt={product.bookTitle}
                            onError={(e) => (e.target.src = "https://via.placeholder.com/80x120?text=No+Image")}
                          />
                        </div>
                        <div className="product-details">
                          <h3 className="product-title" onClick={() => navigate(`/bookdetails/${product._id}`)}>
                            {product.bookTitle}
                          </h3>
                          <p className="product-author">{product.authorName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="price-column">
                      {product.originalPrice && (
                        <div className="original-price">LKR {Number(product.originalPrice).toFixed(2)}</div>
                      )}
                      <div className="current-price">LKR {Number(product.price).toFixed(2)}</div>
                    </td>
                    <td className="stock-column">
                      <span className="in-stock">In Stock</span>
                    </td>
                    <td className="action-column">
                      <button 
                        className="add-to-cart-btn" 
                        onClick={() => navigate(`/bookdetails/${product._id}`)}
                      >
                        ADD TO CART
                      </button>
                    </td>
                    <td className="remove-column">
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromWishlist(product._id)}
                      >
                        <X size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="continue-shopping">
              <button
                className="continue-btn"
                onClick={() => navigate("/bookslist")}
              >
                Continue Shopping <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .wishlist-container {
          min-height: 100vh;
          background-color: #ffffff;
          padding-bottom: 50px;
        }

        .main-content {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin: 30px 0;
        }

        .wishlist-header {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin: 30px 0 10px;
        }

        .item-count {
          font-size: 1.25rem;
          font-weight: 500;
          color: #333;
        }

        .divider {
          border: none;
          height: 1px;
          background-color: #e5e5e5;
          margin: 15px 0 30px;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          max-width: 600px;
          margin: 40px auto;
        }

        .wishlist-table-container {
          background-color: white;
          border-radius: 3px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .wishlist-table {
          width: 100%;
          border-collapse: collapse;
        }

        .wishlist-table th {
          text-align: left;
          padding: 15px;
          border-bottom: 1px solid #e5e5e5;
          font-weight: 500;
          color: #333;
        }

        .wishlist-table td {
          padding: 15px;
          border-bottom: 1px solid #e5e5e5;
          vertical-align: middle;
        }

        .product-info {
          display: flex;
          align-items: center;
        }

        .product-image {
          width: 80px;
          height: 120px;
          overflow: hidden;
          margin-right: 15px;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-details {
          flex: 1;
        }

        .product-title {
          font-size: 1rem;
          font-weight: bold;
          margin-bottom: 5px;
          color: #333;
          cursor: pointer;
        }

        .product-title:hover {
          color: #0066cc;
        }

        .product-author {
          font-size: 0.9rem;
          color: #666;
          margin: 0;
        }

        .original-price {
          text-decoration: line-through;
          color: #999;
          font-size: 0.9rem;
        }

        .current-price {
          font-weight: bold;
          color: #333;
        }

        .in-stock {
          color: #4CAF50;
          font-weight: 500;
        }

        .add-to-cart-btn {
          background-color: #0099e5;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .add-to-cart-btn:hover {
          background-color: #0077cc;
        }

        .remove-btn {
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 5px;
          transition: color 0.2s;
        }

        .remove-btn:hover {
          color: #ff3333;
        }

        .item-column {
          width: 45%;
        }

        .price-column {
          width: 15%;
        }

        .stock-column {
          width: 15%;
        }

        .action-column {
          width: 15%;
        }

        .remove-column {
          width: 10%;
          text-align: center;
        }

        .continue-shopping {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
          padding: 10px;
        }

        .continue-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: none;
          color: #333;
          font-weight: 500;
          cursor: pointer;
          padding: 5px 10px;
          transition: color 0.2s;
        }

        .continue-btn:hover {
          color: #0066cc;
        }

        @media (max-width: 768px) {
          .wishlist-table th:not(:first-child),
          .wishlist-table td:not(:first-child) {
            display: none;
          }

          .wishlist-table th:first-child,
          .wishlist-table td:first-child {
            width: 100%;
          }

          .product-info {
            flex-direction: column;
            align-items: flex-start;
          }

          .product-image {
            margin-bottom: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default WishlistPage;