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
    <div className="min-h-screen bg-gray-50">
      {/* Header at the top */}
      <Header2 />
      
      {/* Navbar below the header */}
      <Navbar2 />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">My Wishlist</h1>
        
        {wishlist.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-lg shadow">
            <p className="text-xl text-gray-500">Your wishlist is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">{item.name}</h2>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <button 
                    onClick={() => removeFromWishlist(item.id)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors duration-300"
                  >
                    Remove from Wishlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;