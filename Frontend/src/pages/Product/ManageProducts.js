import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../components/images/logo.jpg";
import Header2 from "../../components/Header2";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

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
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;

    // Set background color
    doc.setFillColor(255, 252, 255);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Add borders to the entire page
    doc.setDrawColor(0, 71, 171);
    doc.setLineWidth(1);
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

    // Add decorative header bar
    doc.setFillColor(0, 71, 171);
    doc.rect(margin, margin, pageWidth - 2 * margin, 12, "F");

    // Add company logo
    if (logo) {
      doc.addImage(logo, "JPEG", pageWidth / 2 - 20, margin + 18, 40, 40);
    }

    // Add Company Name
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 71, 171);
    doc.text("NOVEL NEST BOOK STORE", pageWidth / 2, margin + 70, {
      align: "center",
    });

    // Add company details
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text("123 Book Street, Colombo, Sri Lanka", pageWidth / 2, margin + 80, {
      align: "center",
    });
    doc.text(
      "Phone: +94 123 456 789 | Email: info@bookstore.com",
      pageWidth / 2,
      margin + 88,
      { align: "center" }
    );
    doc.text("www.novelnest.com", pageWidth / 2, margin + 96, {
      align: "center",
    });

    // Add horizontal separator
    doc.setDrawColor(0, 71, 171);
    doc.setLineWidth(0.5);
    doc.line(margin + 10, margin + 105, pageWidth - margin - 10, margin + 105);

    // Add report title and date
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("PRODUCTS REPORT", pageWidth / 2, margin + 120, {
      align: "center",
    });

    const today = new Date();
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Report Generated: ${today.toLocaleDateString()} at ${today.toLocaleTimeString()}`,
      pageWidth / 2,
      margin + 130,
      { align: "center" }
    );

    // Add table with styling
    autoTable(doc, {
      startY: margin + 140,
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
        `RS ${Number(product.price).toFixed(2)}`,
        product.bookQuantity,
        product.isbnNumber,
        product.language,
      ]),
      headStyles: {
        fillColor: [0, 71, 171],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      margin: {
        top: margin,
        right: margin + 5,
        bottom: margin + 40,
        left: margin + 5,
      },
      styles: {
        cellPadding: 3,
        fontSize: 9,
        overflow: "linebreak",
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { cellWidth: "auto" },
      },
    });

    // Add summary section
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Summary:", margin + 5, finalY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`• Total Products: ${products.length}`, margin + 10, finalY + 8);
    doc.text(
      `• Filtered Products: ${filteredProducts.length}`,
      margin + 10,
      finalY + 13
    );

    // Add signature section with dotted lines
    const signY = pageHeight - margin - 22;
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);

    // Draw dotted lines for signatures
    doc.setLineDash([1, 1]);
    doc.line(margin + 10, signY, margin + 60, signY);
    doc.line(pageWidth - margin - 60, signY, pageWidth - margin - 10, signY);
    doc.setLineDash([]);

    // Add labels for the signature section
    doc.setFontSize(9);
    doc.text("Prepared By", margin + 10, signY + 5);
    doc.text(
      "Inventory Manager Signature",
      pageWidth - margin - 60,
      signY + 5
    );

    // Add footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `© ${today.getFullYear()} Novel Nest Book Store. All Rights Reserved.`,
      pageWidth / 2,
      pageHeight - margin - 5,
      { align: "center" }
    );

    // Add page number
    doc.text(
      `Page ${doc.getCurrentPageInfo().pageNumber} of ${doc.getNumberOfPages()}`,
      pageWidth - margin - 5,
      pageHeight - margin - 5,
      { align: "right" }
    );

    // Save the document
    doc.save("Novel Nest Products Report.pdf");
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
                              RS. {Number(product.price).toFixed(2)}
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