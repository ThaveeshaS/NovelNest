import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../components/images/logo.jpg"; // Import the logo directly
import Header2 from "../../components/Header2"; // Import Header2
import Navbar2 from "../../components/Navbar2"; // Import Navbar2

export default function ManageProducts() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/product/all");
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
        const filteredProducts = products.filter(
            (product) =>
                product.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const doc = new jsPDF();

        // Add company logo
        if (logo) {
            doc.addImage(logo, "JPEG", 80, 10, 40, 40); // Adjust position and size as needed
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
            head: [["Book Title", "Author", "Category", "Price", "Quantity", "ISBN", "Language"]],
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

    const filteredProducts = products.filter(
        (product) =>
            product.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* Add Header2 and Navbar2 */}
            <Header2 />
            <Navbar2 />

            <div className="container mt-5">
                <h1 className="mb-4 text-center">Manage Products</h1>
                {/* Search and Generate Report */}
                <div className="mb-4">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Search by title, author, or category..."
                            className="form-control"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="btn btn-primary" onClick={generateReport}>
                            <i className="fas fa-file-pdf"></i> Generate Report
                        </button>
                    </div>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped table-hover table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Book Title</th>
                                    <th>Author</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>ISBN</th>
                                    <th>Language</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <tr key={product._id}>
                                            <td>{product.bookTitle}</td>
                                            <td>{product.authorName}</td>
                                            <td>{product.category}</td>
                                            <td>${product.price}</td>
                                            <td>{product.bookQuantity}</td>
                                            <td>{product.isbnNumber}</td>
                                            <td>{product.language}</td>
                                            <td>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(product._id)}
                                                >
                                                    <i className="fas fa-trash-alt"></i> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center text-danger">
                                            No matching products found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}