// pages/Product/CartContext.js
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item._id === product._id);
      if (existingItem) {
        if (existingItem.quantity + 1 <= product.bookQuantity) {
          return prevItems.map(item =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return prevItems; // No change if quantity exceeds stock
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item._id !== productId));
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item._id === productId);
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      // Fetch the latest product data from the backend
      const response = await axios.get(`http://localhost:5000/api/product/${productId}`);
      const product = response.data;

      setCartItems((prevItems) => {
        const item = prevItems.find(i => i._id === productId);
        if (!item) return prevItems;

        // Ensure newQuantity doesn't exceed available stock
        const adjustedQuantity = Math.min(Math.max(1, newQuantity), product.bookQuantity);

        return prevItems.map(item =>
          item._id === productId
            ? { ...item, quantity: adjustedQuantity }
            : item
        );
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, isInCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);