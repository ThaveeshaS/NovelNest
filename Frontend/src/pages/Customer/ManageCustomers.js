import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../components/images/logo.jpg";
import Header2 from "../../components/Header2";
import Navbar2 from "../../components/Navbar2";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function ManageCustomers() {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: 'firstName', direction: 'asc' });
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/customer/all");
                setCustomers(response.data);
            } catch (error) {
                console.error("Error fetching customers:", error);
                setError("Failed to fetch customers. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            try {
                await axios.delete(`http://localhost:5000/api/customer/delete/${id}`);
                setCustomers(customers.filter((customer) => customer._id !== id));
            } catch (error) {
                console.error("Error deleting customer:", error);
                setError("Failed to delete customer. Please try again later.");
            }
        }
    };

    const generateReport = () => {
        const filteredCustomers = getSortedData();

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 15;

        // Set background color
        doc.setFillColor(255, 252, 255); // Set RGB color
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        
        // Add borders to the entire page
        doc.setDrawColor(0, 71, 171); // Company blue color
        doc.setLineWidth(1);
        doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
        
        // Add decorative header bar
        doc.setFillColor(0, 71, 171);
        doc.rect(margin, margin, pageWidth - 2 * margin, 12, 'F');
        
        // Add company logo
        if (logo) {
            doc.addImage(logo, "JPEG", pageWidth / 2 - 20, margin + 18, 40, 40);
        }
        
        // Add Company Name
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 71, 171);
        doc.text("NOVEL NEST BOOK STORE", pageWidth / 2, margin + 70, { align: "center" });
        
        // Add company details
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text("123 Book Street, Colombo, Sri Lanka", pageWidth / 2, margin + 80, { align: "center" });
        doc.text("Phone: +94 123 456 789 | Email: info@bookstore.com", pageWidth / 2, margin + 88, { align: "center" });
        doc.text("www.novelnest.com", pageWidth / 2, margin + 96, { align: "center" });
        
        // Add horizontal separator
        doc.setDrawColor(0, 71, 171);
        doc.setLineWidth(0.5);
        doc.line(margin + 10, margin + 105, pageWidth - margin - 10, margin + 105);
        
        // Add report title and date
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("CUSTOMERS REPORT", pageWidth / 2, margin + 120, { align: "center" });
        
        const today = new Date();
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Report Generated: ${today.toLocaleDateString()} at ${today.toLocaleTimeString()}`, pageWidth / 2, margin + 130, { align: "center" });
        
        // Add table with styling
        autoTable(doc, {
            startY: margin + 140,
            head: [["First Name", "Last Name", "Email", "Address", "Contact Info", "Birthday"]],
            body: filteredCustomers.map((customer) => [
                customer.firstName,
                customer.lastName,
                customer.email,
                customer.address,
                customer.contactInfo,
                formatDate(customer.birthday),
            ]),
            headStyles: {
                fillColor: [0, 71, 171],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240],
            },
            margin: { top: margin, right: margin + 5, bottom: margin + 40, left: margin + 5 },
            styles: {
                cellPadding: 3,
                fontSize: 9,
                overflow: 'linebreak',
                lineWidth: 0.1,
            },
            columnStyles: {
                2: { cellWidth: 'auto' }, // Give email column more space
            },
        });
        
        // Add summary section
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Summary:", margin + 5, finalY);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`• Total Customers: ${customers.length}`, margin + 10, finalY + 8);
        doc.text(`• Filtered Customers: ${filteredCustomers.length}`, margin + 10, finalY + 13);
        
        // Add signature section with dotted lines
        const signY = pageHeight - margin - 22; // Position the signature section near the bottom
        doc.setDrawColor(0); // Set line color to black
        doc.setLineWidth(0.5); // Set line thickness

        // Draw dotted lines for signatures
        doc.setLineDash([1, 1]); // Set dotted line pattern (1 units on, 1 units off)
        doc.line(margin + 10, signY, margin + 60, signY); // Left dotted line
        doc.line(pageWidth - margin - 60, signY, pageWidth - margin - 10, signY); // Right dotted line

        // Reset line dash to solid for other elements (if needed)
        doc.setLineDash([]); // Reset to solid line

        // Add labels for the signature section
        doc.setFontSize(9);
        doc.text("Prepared By", margin + 10, signY + 5); // Left label
        doc.text("Customer Manager Signature", pageWidth - margin - 60, signY + 5); // Right label
        
        // Add footer
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`© ${today.getFullYear()} Novel Nest Book Store. All Rights Reserved.`, pageWidth / 2, pageHeight - margin - 5, { align: "center" });
        
        // Add page number
        doc.text(`Page ${doc.getCurrentPageInfo().pageNumber} of ${doc.getNumberOfPages()}`, pageWidth - margin - 5, pageHeight - margin - 5, { align: "right" });
        
        // Save the document
        doc.save("Novel Nest Customers Report.pdf");
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Sort function
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Get sorted data
    const getSortedData = () => {
        const sortableItems = [...customers];
        
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const valueA = a[sortConfig.key]?.toLowerCase?.() || '';
                const valueB = b[sortConfig.key]?.toLowerCase?.() || '';
                
                if (valueA < valueB) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (valueA > valueB) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        
        return sortableItems.filter(
            (customer) =>
                customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // Get sort indicator
    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    };

    const filteredCustomers = getSortedData();

    return (
        <div className="bg-light min-vh-100">
            {/* Add Header2 and Navbar2 */}
            <Header2 />
            <Navbar2 />

            <div className="container py-5">
                <div className="card shadow">
                    <div className="card-header bg-primary text-white py-3">
                        <h2 className="mb-0 text-center">Manage Customers</h2>
                    </div>
                    <div className="card-body">
                        {/* Search and Generate Report */}
                        <div className="row mb-4">
                            <div className="col-md-8 mb-3 mb-md-0">
                                <div className="input-group">
                                    <span className="input-group-text bg-white">
                                        <i className="fas fa-search text-primary"></i>
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        className="form-control"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 d-flex justify-content-md-end">
                                <button 
                                    className="btn btn-primary w-100 w-md-auto" 
                                    onClick={generateReport}
                                    disabled={filteredCustomers.length === 0}
                                >
                                    <i className="fas fa-file-pdf me-2"></i> Generate Report
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="alert alert-danger d-flex align-items-center" role="alert">
                                <i className="fas fa-exclamation-circle me-2"></i>
                                <div>{error}</div>
                            </div>
                        )}

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="text-muted">Loading customer data...</p>
                            </div>
                        ) : (
                            <>
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="cursor-pointer" onClick={() => requestSort('firstName')}>
                                                    First Name {getSortIndicator('firstName')}
                                                </th>
                                                <th className="cursor-pointer" onClick={() => requestSort('lastName')}>
                                                    Last Name {getSortIndicator('lastName')}
                                                </th>
                                                <th className="cursor-pointer" onClick={() => requestSort('email')}>
                                                    Email {getSortIndicator('email')}
                                                </th>
                                                <th>Address</th>
                                                <th>Contact Info</th>
                                                <th className="cursor-pointer" onClick={() => requestSort('birthday')}>
                                                    Birthday {getSortIndicator('birthday')}
                                                </th>
                                                <th className="text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredCustomers.length > 0 ? (
                                                filteredCustomers.map((customer) => (
                                                    <tr key={customer._id}>
                                                        <td className="fw-medium">{customer.firstName}</td>
                                                        <td>{customer.lastName}</td>
                                                        <td>
                                                            <a href={`mailto:${customer.email}`} className="text-decoration-none">
                                                                {customer.email}
                                                            </a>
                                                        </td>
                                                        <td>
                                                            <div className="text-cell" title={customer.address}>
                                                                {customer.address}
                                                            </div>
                                                        </td>
                                                        <td>{customer.contactInfo}</td>
                                                        <td>{formatDate(customer.birthday)}</td>
                                                        <td className="text-center">
                                                            <button
                                                                className="btn btn-outline-danger btn-sm"
                                                                onClick={() => handleDelete(customer._id)}
                                                                title="Delete customer"
                                                            >
                                                                <i className="fas fa-trash-alt"></i> Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="text-center py-5">
                                                        <div className="text-muted">
                                                            <i className="fas fa-user-slash fs-1 d-block mb-3"></i>
                                                            <p className="mb-1">No matching customers found.</p>
                                                            {searchTerm && (
                                                                <small>Try adjusting your search criteria.</small>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <small className="text-muted">
                                        Showing {filteredCustomers.length} of {customers.length} customers
                                    </small>
                                    {/* Add Back to Dashboard Button */}
                                    <button 
                                        className="btn btn-outline-secondary" 
                                        onClick={() => navigate("/admindashboard")}
                                    >
                                        <i className="fas fa-arrow-left me-2"></i> Back to Dashboard
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .cursor-pointer {
                    cursor: pointer;
                }
                .text-cell {
                    max-width: 200px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                @media (max-width: 768px) {
                    .w-md-auto {
                        width: 100% !important;
                    }
                }
            `}</style>
        </div>
    );
}