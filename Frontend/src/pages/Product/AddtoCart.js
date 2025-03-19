import React, { useState } from 'react';
import Navbar2 from '../../components/Navbar2';
import Header2 from '../../components/Header2';

const AddToCartPage = () => {
  // Sample cart items data
  const [cart, setCart] = useState([
    { id: 1, name: 'Product 1', price: 20 },
    { id: 2, name: 'Product 2', price: 30 },
    { id: 3, name: 'Product 3', price: 40 },
  ]);

  // Function to handle removing an item from the cart
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  return (
    <div className="cart-container">
      {/* Including Header2 and Navbar2 */}
      <Header2 />
      <Navbar2 />

      <header className="cart-header">
        <h1>This is My Add to Cart</h1>
      </header>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul className="cart-items">
            {cart.map(item => (
              <li key={item.id} className="cart-item">
                <h2>{item.name}</h2>
                <p>Price: ${item.price}</p>
                <button onClick={() => removeFromCart(item.id)}>
                  Remove from Cart
                </button>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <h3>Total Price: ${totalPrice}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToCartPage;
