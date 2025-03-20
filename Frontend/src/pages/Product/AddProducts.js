import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Import Header2 and Navbar2 components
import Header2 from "../../components/Header2";
import Navbar2 from "../../components/Navbar2";

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
  const [coverPreview, setCoverPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, coverPage: file });
    validateField("coverPage", file);
    
    // Create preview for the uploaded image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setCoverPreview(null);
    }
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
    <div className="add-products-page">
      <Header2 />
      <Navbar2 />

      <div
        className="py-5"
        style={{
          backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          minHeight: "100vh",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card shadow-lg border-0 rounded-lg">
                <div className="card-header bg-primary text-white text-center py-4">
                  <h2 className="m-0">
                    <i className="fas fa-book me-2"></i>Add New Book
                  </h2>
                </div>
                <div className="card-body p-5">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-8">
                        <div className="row mb-3">
                          <div className="col-lg-6">
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className={`form-control ${
                                  errors.bookTitle ? "is-invalid" : ""
                                }`}
                                id="bookTitle"
                                name="bookTitle"
                                placeholder="Book Title"
                                value={formData.bookTitle}
                                onChange={handleChange}
                                required
                              />
                              <label htmlFor="bookTitle">Book Title</label>
                              {errors.bookTitle && (
                                <div className="invalid-feedback">
                                  {errors.bookTitle}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className={`form-control ${
                                  errors.price ? "is-invalid" : ""
                                }`}
                                id="price"
                                name="price"
                                placeholder="Price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                              />
                              <label htmlFor="price">Price ($)</label>
                              {errors.price && (
                                <div className="invalid-feedback">
                                  {errors.price}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="form-floating mb-3">
                          <textarea
                            className={`form-control ${
                              errors.bookDescription ? "is-invalid" : ""
                            }`}
                            id="bookDescription"
                            name="bookDescription"
                            placeholder="Book Description"
                            value={formData.bookDescription}
                            onChange={handleChange}
                            style={{ height: "120px" }}
                            required
                          />
                          <label htmlFor="bookDescription">
                            Book Description
                          </label>
                          {errors.bookDescription && (
                            <div className="invalid-feedback">
                              {errors.bookDescription}
                            </div>
                          )}
                        </div>

                        <div className="row mb-3">
                          <div className="col-lg-6">
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className={`form-control ${
                                  errors.bookQuantity ? "is-invalid" : ""
                                }`}
                                id="bookQuantity"
                                name="bookQuantity"
                                placeholder="Book Quantity"
                                value={formData.bookQuantity}
                                onChange={handleChange}
                                required
                              />
                              <label htmlFor="bookQuantity">Book Quantity</label>
                              {errors.bookQuantity && (
                                <div className="invalid-feedback">
                                  {errors.bookQuantity}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-floating mb-3">
                              <select
                                className={`form-select ${
                                  errors.category ? "is-invalid" : ""
                                }`}
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                              >
                                <option value="">Select Category</option>
                                <option value="Fiction">Fiction</option>
                                <option value="Non-Fiction">Non-Fiction</option>
                                <option value="Children's & Young Adult">
                                  Children's & Young Adult
                                </option>
                              </select>
                              <label htmlFor="category">Category</label>
                              {errors.category && (
                                <div className="invalid-feedback">
                                  {errors.category}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-lg-6">
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className={`form-control ${
                                  errors.authorName ? "is-invalid" : ""
                                }`}
                                id="authorName"
                                name="authorName"
                                placeholder="Author's Name"
                                value={formData.authorName}
                                onChange={handleChange}
                                required
                              />
                              <label htmlFor="authorName">Author's Name</label>
                              {errors.authorName && (
                                <div className="invalid-feedback">
                                  {errors.authorName}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className={`form-control ${
                                  errors.isbnNumber ? "is-invalid" : ""
                                }`}
                                id="isbnNumber"
                                name="isbnNumber"
                                placeholder="ISBN Number"
                                value={formData.isbnNumber}
                                onChange={handleChange}
                                required
                              />
                              <label htmlFor="isbnNumber">ISBN Number</label>
                              {errors.isbnNumber && (
                                <div className="invalid-feedback">
                                  {errors.isbnNumber}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            className={`form-control ${
                              errors.language ? "is-invalid" : ""
                            }`}
                            id="language"
                            name="language"
                            placeholder="Language"
                            value={formData.language}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="language">Language</label>
                          {errors.language && (
                            <div className="invalid-feedback">
                              {errors.language}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="cover-upload-section text-center">
                          <div
                            className="cover-preview mb-3"
                            style={{
                              border: "1px dashed #ccc",
                              borderRadius: "8px",
                              padding: "10px",
                              height: "300px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#f8f9fa",
                              overflow: "hidden",
                            }}
                          >
                            {coverPreview ? (
                              <img
                                src={coverPreview}
                                alt="Cover Preview"
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "280px",
                                  objectFit: "contain",
                                }}
                              />
                            ) : (
                              <div className="text-muted">
                                <i
                                  className="fas fa-book"
                                  style={{ fontSize: "48px", opacity: 0.5 }}
                                ></i>
                                <p>Book cover preview will appear here</p>
                              </div>
                            )}
                          </div>
                          <div className="mb-3">
                            <label
                              htmlFor="coverPage"
                              className="btn btn-outline-primary w-100"
                            >
                              <i className="fas fa-upload me-2"></i>
                              Upload Cover Image
                            </label>
                            <input
                              type="file"
                              className="d-none"
                              id="coverPage"
                              name="coverPage"
                              onChange={handleFileChange}
                              required
                            />
                            {errors.coverPage && (
                              <div className="text-danger mt-2">
                                {errors.coverPage}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 d-flex justify-content-between">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/admindashboard")}
                      >
                        <i className="fas fa-arrow-left me-2"></i>Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success px-4 py-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Adding...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-plus-circle me-2"></i>Add Book
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}