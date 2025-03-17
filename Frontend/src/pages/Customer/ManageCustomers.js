import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../components/images/logo.png"; // Import the logo directly
import Header2 from "../../components/Header2"; // Import Header2
import Navbar2 from "../../components/Navbar2"; // Import Navbar2

export default function ManageCustomers() {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
        const filteredCustomers = customers.filter(
            (customer) =>
                customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        doc.text("Customers Report", 14, 92);

        // Add table
        autoTable(doc, {
            startY: 97,
            head: [["First Name", "Last Name", "Email", "Address", "Contact Info", "Birthday"]],
            body: filteredCustomers.map((customer) => [
                customer.firstName,
                customer.lastName,
                customer.email,
                customer.address,
                customer.contactInfo,
                formatDate(customer.birthday),
            ]),
        });

        doc.save("Customers Report.pdf");
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const filteredCustomers = customers.filter(
        (customer) =>
            customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* Add Header2 and Navbar2 */}
            <Header2 />
            <Navbar2 />

            <div className="container mt-5">
                <h1 className="mb-4 text-center">Manage Customers</h1>
                {/* Search and Generate Report */}
                <div className="mb-4">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
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
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Contact Info</th>
                                    <th>Birthday</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.length > 0 ? (
                                    filteredCustomers.map((customer) => (
                                        <tr key={customer._id}>
                                            <td>{customer.firstName}</td>
                                            <td>{customer.lastName}</td>
                                            <td>{customer.email}</td>
                                            <td>{customer.address}</td>
                                            <td>{customer.contactInfo}</td>
                                            <td>{formatDate(customer.birthday)}</td>
                                            <td>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(customer._id)}
                                                >
                                                    <i className="fas fa-trash-alt"></i> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center text-danger">
                                            No matching customers found.
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