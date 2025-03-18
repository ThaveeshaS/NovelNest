import React, { useState } from 'react';

const WishlistPage = () => {
  // Sample wishlist items data
  const [wishlist, setWishlist] = useState([
    { id: 1, name: 'Item 1', description: 'Description for Item 1' },
    { id: 2, name: 'Item 2', description: 'Description for Item 2' },
    { id: 3, name: 'Item 3', description: 'Description for Item 3' },
  ]);

  // Function to handle removing an item from the wishlist
  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  return (
    <div className="wishlist-container">
      <header className="wishlist-header">
        <h1>This is My Wishlist</h1>
      </header>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <ul className="wishlist-items">
          {wishlist.map(item => (
            <li key={item.id} className="wishlist-item">
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <button onClick={() => removeFromWishlist(item.id)}>
                Remove from Wishlist
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WishlistPage;
