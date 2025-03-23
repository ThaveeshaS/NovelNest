import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../components/images/logo.jpg";
import Header2 from "../../components/Header2";
import Navbar2 from "../../components/Navbar2";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/product/all"
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/product/delete/${id}`);
        setProducts(products.filter((product) => product._id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
        setError("Failed to delete product. Please try again later.");
      }
    }
  };

  const generateReport = () => {
    const filteredProducts = getFilteredProducts();

    const doc = new jsPDF();

    // Add company logo
    if (logo) {
      doc.addImage(logo, "JPEG", 80, 10, 40, 40);
    }

    // Add company details
    doc.setFontSize(10);
    doc.text("Call us : +94 123 456 789", 15, 60);
    doc.text("Mail us : info@bookstore.com", 15, 68);
    doc.text("Find us : 123 Book Street, Colombo, Sri Lanka", 15, 76);

    // Add a title
    doc.setFontSize(16);
    doc.text("Products Report", 14, 92);

    // Add table
    autoTable(doc, {
      startY: 97,
      head: [
        [
          "Book Title",
          "Author",
          "Category",
          "Price",
          "Quantity",
          "ISBN",
          "Language",
        ],
      ],
      body: filteredProducts.map((product) => [
        product.bookTitle,
        product.authorName,
        product.category,
        `$${product.price}`,
        product.bookQuantity,
        product.isbnNumber,
        product.language,
      ]),
    });

    doc.save("Products Report.pdf");
  };

  // Get unique categories
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  const getFilteredProducts = () => {
    return products.filter((product) => {
      const matchesSearch =
        product.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="manage-products-page">
      <Header2 />
      <Navbar2 />

      <div
        className="py-4"
        style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
      >
        <div className="container">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white p-4">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="m-0">
                  <i className="fas fa-book-open me-2"></i> Manage Products
                </h2>
                <div>
                  <span className="badge bg-light text-primary fs-6">
                    {filteredProducts.length} Books
                  </span>
                </div>
              </div>
            </div>

            <div className="card-body p-4">
              {/* Search and filters */}
              <div className="row mb-4 g-3">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <i className="fas fa-search text-primary"></i>
                    </span>
                    <input
                      type="text"
                      placeholder="Search by title, author..."
                      className="form-control border-start-0"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <button
                    className="btn btn-success w-100"
                    onClick={generateReport}
                  >
                    <i className="fas fa-file-pdf me-2"></i> Generate Report
                  </button>
                </div>
              </div>

              {error && (
                <div
                  className="alert alert-danger d-flex align-items-center"
                  role="alert"
                >
                  <i className="fas fa-exclamation-circle me-2"></i>
                  <div>{error}</div>
                </div>
              )}

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading products...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th scope="col" className="text-nowrap">
                          Book Title
                        </th>
                        <th scope="col" className="text-nowrap">
                          Author
                        </th>
                        <th scope="col" className="text-nowrap">
                          Category
                        </th>
                        <th scope="col" className="text-nowrap">
                          Price
                        </th>
                        <th scope="col" className="text-nowrap">
                          Quantity
                        </th>
                        <th scope="col" className="text-nowrap">
                          ISBN
                        </th>
                        <th scope="col" className="text-nowrap">
                          Language
                        </th>
                        <th scope="col" className="text-nowrap">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <tr key={product._id}>
                            <td className="fw-bold">{product.bookTitle}</td>
                            <td>{product.authorName}</td>
                            <td>
                              <span className="badge bg-info text-dark">
                                {product.category}
                              </span>
                            </td>
                            <td className="text-primary fw-bold">
                              RS.{product.price}
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  product.bookQuantity > 10
                                    ? "bg-success"
                                    : "bg-warning text-dark"
                                }`}
                              >
                                {product.bookQuantity} in stock
                              </span>
                            </td>
                            <td className="text-muted">{product.isbnNumber}</td>
                            <td>{product.language}</td>
                            <td>
                              <div className="btn-group">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  title="Edit"
                                  onClick={() =>
                                    navigate(`/edit-product/${product._id}`)
                                  }
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  title="Delete"
                                  onClick={() => handleDelete(product._id)}
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="8"
                            className="text-center py-5 text-muted"
                          >
                            <i className="fas fa-search fa-2x mb-3"></i>
                            <p className="mb-0">No matching products found.</p>
                            <p className="small">
                              Try adjusting your search or filter criteria.
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="card-footer bg-white p-3">
              <div className="d-flex justify-content-between align-items-center">
                <p className="text-muted mb-0">
                  <small>Total products: {products.length}</small>
                </p>
                <a href="/admindashboard" className="btn btn-primary">
                  <i className="fas fa-arrow-left me-2"></i> Go Back
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}