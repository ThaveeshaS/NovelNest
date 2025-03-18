import React from "react";
import { Link, Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar3 from "../../components/Navbar3";

const ProductHandling = () => {
  return (
    <div>
      {/* Add Navbar3 */}
      <Navbar3 />

      <div className="container mt-5">
        <h1 className="text-center mb-4">Product Handling</h1>
        <div className="d-flex justify-content-center gap-3 mb-4">
          <Link to="/admin/product-handling/add" className="btn btn-primary">
            Add Products
          </Link>
          <Link to="/admin/product-handling/manage" className="btn btn-secondary">
            Manage Products
          </Link>
        </div>
        <Outlet /> {/* This will render the nested routes (AddProducts or ManageProducts) */}
      </div>
    </div>
  );
};

export default ProductHandling;