import React, { useState } from 'react';
import Navbar2 from '../../components/Navbar2';
import Header2 from '../../components/Header2';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Trash2, Plus, Minus } from "lucide-react";

const AddToCartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [quantityErrors, setQuantityErrors] = useState({});

  const handleQuantityChange = async (itemId, delta) => {
    const item = cartItems.find(i => i._id === itemId);
    const newQuantity = item.quantity + delta;

    if (newQuantity < 1) return;

    await updateQuantity(itemId, newQuantity);

    const updatedItem = cartItems.find(i => i._id === itemId);
    if (newQuantity > updatedItem?.bookQuantity) {
      setQuantityErrors(prev => ({
        ...prev,
        [itemId]: `Only ${updatedItem.bookQuantity} items available in stock`
      }));
    } else {
      setQuantityErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[itemId];
        return newErrors;
      });
    }
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = 370.00;
  const totalPrice = subtotal + deliveryFee;

  const handleApplyCoupon = () => {
    console.log("Coupon applied:", couponCode);
  };

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
          <div className="cart-content-wrapper">
            <div className="cart-content">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th className="item-column">PRODUCT</th>
                    <th className="price-column">PRICE</th>
                    <th className="quantity-column">QUANTITY</th>
                    <th className="subtotal-column">SUBTOTAL</th>
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
                        <div className="current-price">Rs. {Number(item.price).toFixed(2)}</div>
                      </td>
                      <td className="quantity-column">
                        <div className="quantity-controls">
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item._id, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="quantity-value">{item.quantity}</span>
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item._id, 1)}
                            disabled={item.quantity >= item.bookQuantity}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        {quantityErrors[item._id] && (
                          <p className="quantity-error">{quantityErrors[item._id]}</p>
                        )}
                      </td>
                      <td className="subtotal-column">
                        <div className="current-price">Rs. {(item.price * item.quantity).toFixed(2)}</div>
                      </td>
                      <td className="action-column">
                        <button
                          className="remove-btn"
                          onClick={() => removeFromCart(item._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="cart-actions">
                <div className="coupon-section">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="coupon-input"
                  />
                  <button
                    className="apply-coupon-btn"
                    onClick={handleApplyCoupon}
                  >
                    APPLY COUPON
                  </button>
                </div>
                <button className="update-cart-btn">
                  UPDATE CART
                </button>
              </div>
            </div>

            <div className="cart-summary">
              <h3 className="summary-title">CART DETAILS</h3>
              <div className="summary-item">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span>Courier</span>
                <span>Rs. {deliveryFee.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span>Delivery within 2-5 days</span>
                <span>In-Store Pickup Available Shipping Options to Colombo</span>
              </div>
              <div className="summary-item total">
                <span>TOTAL</span>
                <span>Rs. {totalPrice.toFixed(2)}</span>
              </div>
              <button
                className="checkout-btn"
                onClick={() => navigate('/checkout')}
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .cart-container {
          min-height: 100vh;
          background-color: #f5f5f5;
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

        .cart-content-wrapper {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .cart-content {
          flex: 1;
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
          font-size: 0.9rem;
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

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .quantity-btn {
          background-color: #f0f0f0;
          border: 1px solid #ddd;
          padding: 5px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .quantity-btn:disabled {
          background-color: #e0e0e0;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .quantity-btn:hover:not(:disabled) {
          background-color: #e0e0e0;
        }

        .quantity-value {
          font-weight: 500;
          color: #333;
        }

        .quantity-error {
          color: #ff3333;
          font-size: 0.8rem;
          margin-top: 5px;
        }

        .remove-btn {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          transition: color 0.2s;
        }

        .remove-btn:hover {
          color: #ff3333;
        }

        .item-column {
          width: 40%;
        }

        .price-column {
          width: 15%;
        }

        .quantity-column {
          width: 15%;
        }

        .subtotal-column {
          width: 15%;
        }

        .action-column {
          width: 15%;
          text-align: center;
        }

        .cart-actions {
          display: flex;
          justify-content: space-between;
          padding: 20px;
          border-top: 1px solid #e5e5e5;
        }

        .coupon-section {
          display: flex;
          gap: 10px;
        }

        .coupon-input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
          width: 200px;
        }

        .apply-coupon-btn {
          background-color: #0066cc;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .apply-coupon-btn:hover {
          background-color: #0055b3;
        }

        .update-cart-btn {
          background-color: #e0e0e0;
          color: #333;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .update-cart-btn:hover {
          background-color: #d0d0d0;
        }

        .cart-summary {
          width: 300px;
          background-color: white;
          border-radius: 3px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          padding: 20px;
        }

        .summary-title {
          font-size: 1.25rem;
          font-weight: bold;
          margin-bottom: 20px;
          color: #333;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          font-size: 0.9rem;
          color: #333;
        }

        .summary-item span:last-child {
          font-weight: 500;
        }

        .summary-item.total {
          font-weight: bold;
          font-size: 1rem;
          border-top: 1px solid #e5e5e5;
          padding-top: 15px;
          margin-top: 15px;
        }

        .checkout-btn {
          width: 100%;
          background-color: #ff6200;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-top: 20px;
        }

        .checkout-btn:hover {
          background-color: #e55b00;
        }

        @media (max-width: 768px) {
          .cart-content-wrapper {
            flex-direction: column;
          }

          .cart-summary {
            width: 100%;
          }

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

          .cart-actions {
            flex-direction: column;
            gap: 15px;
          }

          .coupon-section {
            flex-direction: column;
            width: 100%;
          }

          .coupon-input {
            width: 100%;
          }

          .apply-coupon-btn,
          .update-cart-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AddToCartPage;