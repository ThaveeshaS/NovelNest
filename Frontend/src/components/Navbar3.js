import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import AddProducts from '../pages/Product/AddProducts';
import ManageProducts from '../pages/Product/ManageProducts';

const Navbar3 = () => {
  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: 'rgb(0, 78, 156)' }}>
      <div className="container-fluid d-flex justify-content-center">
        <Link to="/add-products" className="nav-link text-white mx-3">{<AddProducts />}</Link>
        <Link to="/manage-products" className="nav-link text-white mx-3">{<ManageProducts />}</Link>
      </div>
    </nav>
  );
};

export default Navbar3;