import React from 'react';
import Navbar2 from '../../components/Navbar2';
import Header2 from '../../components/Header2';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from "lucide-react";

const AddToCartPage = () => {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce((total, item) => 
    total + (item.price * item.quantity), 0
  );

  return (
    <div className="cart-container">
      <Header2 />
      <Navbar2 />

      <div className="main-content">
        <div className="section-header">
          <h2 className="display-4 fw-bold text-primary mb-3">Shopping Cart</h2>
          <p className="lead text-secondary">Review your selected items</p>
        </div>

        <div className="cart-header">
          <div className="item-count">{cartItems.length} Items</div>
        </div>

        <hr className="divider" />

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <ShoppingCart size={70} color="#0066cc" className="empty-icon" />
            <h3 className="text-primary mt-4">Your cart is empty</h3>
            <p className="text-secondary mb-4">Add items to your cart to proceed with purchase</p>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/customerdashboard')}
            >
              Continue Shopping <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <table className="cart-table">
              <thead>
                <tr>
                  <th className="item-column">Item</th>
                  <th className="price-column">Price</th>
                  <th className="quantity-column">Quantity</th>
                  <th className="action-column"></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item._id} className="cart-item">
                    <td className="item-column">
                      <div className="product-info">
                        <div className="product-image">
                          <img
                            src={item.coverPage}
                            alt={item.bookTitle}
                            onError={(e) => (e.target.src = "https://via.placeholder.com/80x120?text=No+Image")}
                          />
                        </div>
                        <div className="product-details">
                          <h3 
                            className="product-title" 
                            onClick={() => navigate(`/bookdetails/${item._id}`)}
                          >
                            {item.bookTitle}
                          </h3>
                          <p className="product-author">{item.authorName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="price-column">
                      <div className="current-price">RS. {item.price}</div>
                    </td>
                    <td className="quantity-column">
                      {item.quantity}
                    </td>
                    <td className="action-column">
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromCart(item._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="cart-footer">
              <div className="cart-total">
                <h3>Total Price: RS. {totalPrice.toFixed(2)}</h3>
                <button className="btn btn-success checkout-btn">
                  Proceed to Checkout
                </button>
              </div>
              <div className="continue-shopping">
                <button
                  className="continue-btn"
                  onClick={() => navigate("/customerdashboard")}
                >
                  Continue Shopping <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .cart-container {
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

        .cart-header {
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

        .cart-content {
          background-color: white;
          border-radius: 3px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .cart-table {
          width: 100%;
          border-collapse: collapse;
        }

        .cart-table th {
          text-align: left;
          padding: 15px;
          border-bottom: 1px solid #e5e5e5;
          font-weight: 500;
          color: #333;
        }

        .cart-table td {
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

        .current-price {
          font-weight: bold;
          color: #333;
        }

        .remove-btn {
          background-color: #ff3333;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .remove-btn:hover {
          background-color: #cc0000;
        }

        .item-column {
          width: 45%;
        }

        .price-column {
          width: 15%;
        }

        .quantity-column {
          width: 15%;
        }

        .action-column {
          width: 25%;
          text-align: center;
        }

        .cart-footer {
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cart-total {
          text-align: right;
        }

        .checkout-btn {
          margin-top: 10px;
          padding: 10px 20px;
          font-weight: 500;
        }

        .continue-shopping {
          display: flex;
          justify-content: flex-end;
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
          .cart-table th:not(:first-child),
          .cart-table td:not(:first-child) {
            display: none;
          }

          .cart-table th:first-child,
          .cart-table td:first-child {
            width: 100%;
          }

          .product-info {
            flex-direction: column;
            align-items: flex-start;
          }

          .product-image {
            margin-bottom: 10px;
          }

          .cart-footer {
            flex-direction: column;
            gap: 20px;
          }

          .cart-total {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AddToCartPage;