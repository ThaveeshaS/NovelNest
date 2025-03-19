import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Import Header2 and Navbar2 components
import Header2 from "../../components/Header2"; // Update the path if necessary
import Navbar2 from "../../components/Navbar2"; // Update the path if necessary

export default function AddProducts() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    coverPage: null,
    bookTitle: "",
    price: "",
    bookDescription: "",
    bookQuantity: "",
    category: "",
    authorName: "",
    isbnNumber: "",
    language: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, coverPage: file });
    validateField("coverPage", file);
  };

  const validateField = (name, value) => {
    let fieldErrors = { ...errors };

    switch (name) {
      case "bookTitle":
        fieldErrors.bookTitle = value.trim() ? "" : "Book title is required";
        break;
      case "price":
        fieldErrors.price = /^\d+(\.\d{1,2})?$/.test(value)
          ? ""
          : "Invalid price";
        break;
      case "bookDescription":
        fieldErrors.bookDescription = value.trim()
          ? ""
          : "Book description is required";
        break;
      case "bookQuantity":
        fieldErrors.bookQuantity = /^\d+$/.test(value)
          ? ""
          : "Invalid quantity";
        break;
      case "category":
        fieldErrors.category = value ? "" : "Category is required";
        break;
      case "authorName":
        fieldErrors.authorName = value.trim()
          ? ""
          : "Author's name is required";
        break;
      case "isbnNumber":
        fieldErrors.isbnNumber = /^\d{10,13}$/.test(value)
          ? ""
          : "Invalid ISBN number";
        break;
      case "language":
        fieldErrors.language = value.trim() ? "" : "Language is required";
        break;
      case "coverPage":
        fieldErrors.coverPage = value ? "" : "Cover page is required";
        break;
      default:
        break;
    }

    setErrors(fieldErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.values(errors).some((error) => error !== "")) {
      alert("Please fix the errors in the form before submitting.");
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append("coverPage", formData.coverPage);
    data.append("bookTitle", formData.bookTitle);
    data.append("price", formData.price);
    data.append("bookDescription", formData.bookDescription);
    data.append("bookQuantity", formData.bookQuantity);
    data.append("category", formData.category);
    data.append("authorName", formData.authorName);
    data.append("isbnNumber", formData.isbnNumber);
    data.append("language", formData.language);

    axios
      .post("http://localhost:5000/api/product/add", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Product Added Successfully!");
        navigate("/products");
      })
      .catch((error) => {
        console.error("There was an error adding the product!", error);
        alert(
          "Error: " + error.response?.data?.message || "Something went wrong"
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <>
      {/* Header2 and Navbar2 added here */}
      <Header2 />
      <Navbar2 />

      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{
          backgroundImage: "url('https://wallpaperaccess.com/full/284466.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="card shadow-lg"
          style={{
            width: "800px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <div className="card-body p-4">
            <h2 className="text-center text-primary mb-4">Add Product</h2>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="bookTitle" className="form-label">
                    Book Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="bookTitle"
                    name="bookTitle"
                    value={formData.bookTitle}
                    onChange={handleChange}
                    required
                  />
                  {errors.bookTitle && (
                    <div className="text-danger">{errors.bookTitle}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="price" className="form-label">
                    Price
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                  {errors.price && (
                    <div className="text-danger">{errors.price}</div>
                  )}
                </div>
              </div>

              {/* Book Description */}
              <div className="row">
                <div className="col-md-12 mb-3">
                  <label htmlFor="bookDescription" className="form-label">
                    Book Description
                  </label>
                  <textarea
                    className="form-control"
                    id="bookDescription"
                    name="bookDescription"
                    value={formData.bookDescription}
                    onChange={handleChange}
                    required
                  />
                  {errors.bookDescription && (
                    <div className="text-danger">{errors.bookDescription}</div>
                  )}
                </div>
              </div>

              {/* Quantity and Category */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="bookQuantity" className="form-label">
                    Book Quantity
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="bookQuantity"
                    name="bookQuantity"
                    value={formData.bookQuantity}
                    onChange={handleChange}
                    required
                  />
                  {errors.bookQuantity && (
                    <div className="text-danger">{errors.bookQuantity}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <select
                    className="form-control"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Children’s & Young Adult">
                      Children’s & Young Adult
                    </option>
                  </select>
                  {errors.category && (
                    <div className="text-danger">{errors.category}</div>
                  )}
                </div>
              </div>

              {/* Author Name and ISBN */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="authorName" className="form-label">
                    Author's Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="authorName"
                    name="authorName"
                    value={formData.authorName}
                    onChange={handleChange}
                    required
                  />
                  {errors.authorName && (
                    <div className="text-danger">{errors.authorName}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="isbnNumber" className="form-label">
                    ISBN Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="isbnNumber"
                    name="isbnNumber"
                    value={formData.isbnNumber}
                    onChange={handleChange}
                    required
                  />
                  {errors.isbnNumber && (
                    <div className="text-danger">{errors.isbnNumber}</div>
                  )}
                </div>
              </div>

              {/* Language and Cover Page */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="language" className="form-label">
                    Language
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    required
                  />
                  {errors.language && (
                    <div className="text-danger">{errors.language}</div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="coverPage" className="form-label">
                    Cover Page
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="coverPage"
                    name="coverPage"
                    onChange={handleFileChange}
                    required
                  />
                  {errors.coverPage && (
                    <div className="text-danger">{errors.coverPage}</div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding Product..." : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
