import React, { useState } from 'react';
import Navbar2 from '../../components/Navbar2';
import Header2 from '../../components/Header2';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([
    { id: 1, name: 'Item 1', description: 'Description for Item 1' },
    { id: 2, name: 'Item 2', description: 'Description for Item 2' },
    { id: 3, name: 'Item 3', description: 'Description for Item 3' },
  ]);

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  return (
    <div className="wishlist-page">
      {/* Header at the top */}
      <Header2 />

      {/* Navbar below the header */}
      <Navbar2 />

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
    </div>
  );
};

export default WishlistPage;
