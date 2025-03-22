import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header2 from "../../components/Header2";
import Navbar2 from "../../components/Navbar2";

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    coverPage: null,
    bookTitle: "",
    price: "",
    bookDescription: "",
    bookQuantity: 1,
    category: "",
    authorName: "",
    isbnNumber: "",
    language: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverPreview, setCoverPreview] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/product/${id}`);
        setFormData(response.data);
        setCoverPreview(response.data.coverPage);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, coverPage: file });
    validateField("coverPage", file);

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
        fieldErrors.price = /^\d+(\.\d{1,2})?$/.test(value) ? "" : "Invalid price";
        break;
      case "bookDescription":
        fieldErrors.bookDescription = value.trim() ? "" : "Book description is required";
        break;
      case "bookQuantity":
        fieldErrors.bookQuantity = /^\d+$/.test(value) ? "" : "Invalid quantity";
        break;
      case "category":
        fieldErrors.category = value ? "" : "Category is required";
        break;
      case "authorName":
        fieldErrors.authorName = value.trim() ? "" : "Author's name is required";
        break;
      case "isbnNumber":
        fieldErrors.isbnNumber = /^\d{10,13}$/.test(value) ? "" : "Invalid ISBN number";
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

  const handleQuantityChange = (operation) => {
    let newQuantity = formData.bookQuantity;
    if (operation === "increment") {
      newQuantity += 1;
    } else if (operation === "decrement" && newQuantity > 1) {
      newQuantity -= 1;
    }
    setFormData({ ...formData, bookQuantity: newQuantity });
    validateField("bookQuantity", newQuantity);
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
      .put(`http://localhost:5000/api/product/update/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Product Updated Successfully!");
        navigate("/products");
      })
      .catch((error) => {
        console.error("There was an error updating the product!", error);
        alert(
          "Error: " + error.response?.data?.message || "Something went wrong"
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="edit-products-page">
      <Header2 />
      <Navbar2 />

      <div
        className="py-5"
        style={{
          background: "linear-gradient(120deg, #e0f7fa 0%, #80deea 100%)",
          minHeight: "100vh",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card shadow-lg border-0 rounded-lg">
                <div
                  className="card-header text-white text-center py-4"
                  style={{
                    background: "linear-gradient(to right, #0277bd, #00838f)",
                    borderTopLeftRadius: "0.5rem",
                    borderTopRightRadius: "0.5rem",
                  }}
                >
                  <h2 className="m-0 fw-bold">
                    <i className="fas fa-book me-2"></i>Edit Book
                  </h2>
                </div>
                <div className="card-body p-5">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-8">
                        <div className="row mb-4">
                          <div className="col-lg-6">
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className={`form-control form-control-lg ${
                                  errors.bookTitle ? "is-invalid" : ""
                                }`}
                                id="bookTitle"
                                name="bookTitle"
                                placeholder="Book Title"
                                value={formData.bookTitle}
                                onChange={handleChange}
                                required
                                style={{
                                  borderRadius: "0.5rem",
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                }}
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
                                className={`form-control form-control-lg ${
                                  errors.price ? "is-invalid" : ""
                                }`}
                                id="price"
                                name="price"
                                placeholder="Price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                style={{
                                  borderRadius: "0.5rem",
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                }}
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

                        <div className="form-floating mb-4">
                          <textarea
                            className={`form-control ${
                              errors.bookDescription ? "is-invalid" : ""
                            }`}
                            id="bookDescription"
                            name="bookDescription"
                            placeholder="Book Description"
                            value={formData.bookDescription}
                            onChange={handleChange}
                            style={{
                              height: "120px",
                              borderRadius: "0.5rem",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            }}
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

                        <div className="row mb-4">
                          <div className="col-lg-6">
                            <label
                              htmlFor="bookQuantity"
                              className="form-label ps-1 mb-2"
                            >
                              Book Quantity
                            </label>
                            <div
                              className="input-group"
                              style={{
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                borderRadius: "0.5rem",
                                overflow: "hidden",
                              }}
                            >
                              <button
                                type="button"
                                className="btn btn-outline-primary btn-lg fw-bold"
                                onClick={() => handleQuantityChange("decrement")}
                                style={{ width: "50px", fontSize: "1.2rem" }}
                              >
                                -
                              </button>
                              <input
                                type="text"
                                className={`form-control form-control-lg text-center ${
                                  errors.bookQuantity ? "is-invalid" : ""
                                }`}
                                id="bookQuantity"
                                name="bookQuantity"
                                value={formData.bookQuantity}
                                readOnly
                                style={{
                                  border: "none",
                                  borderLeft: "1px solid #dee2e6",
                                  borderRight: "1px solid #dee2e6",
                                }}
                              />
                              <button
                                type="button"
                                className="btn btn-outline-primary btn-lg fw-bold"
                                onClick={() => handleQuantityChange("increment")}
                                style={{ width: "50px", fontSize: "1.2rem" }}
                              >
                                +
                              </button>
                            </div>
                            {errors.bookQuantity && (
                              <div className="invalid-feedback d-block">
                                {errors.bookQuantity}
                              </div>
                            )}
                          </div>
                          <div className="col-lg-6">
                            <label
                              htmlFor="category"
                              className="form-label ps-1 mb-2"
                            >
                              Category
                            </label>
                            <div
                              className="dropdown"
                              style={{
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                borderRadius: "0.5rem",
                              }}
                            >
                              <select
                                className={`form-select form-select-lg ${
                                  errors.category ? "is-invalid" : ""
                                }`}
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                style={{
                                  borderRadius: "0.5rem",
                                  padding: "0.75rem 1rem",
                                  height: "calc(3.5rem + 2px)",
                                  border: "1px solid #ced4da",
                                  backgroundColor: "#fff",
                                  backgroundImage:
                                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3E%3C/svg%3E\")",
                                  backgroundRepeat: "no-repeat",
                                  backgroundPosition: "right 1rem center",
                                  backgroundSize: "16px 12px",
                                  appearance: "none",
                                }}
                              >
                                <option value="" disabled>
                                  Select Category
                                </option>
                                <option value="Fiction">Fiction</option>
                                <option value="Non-Fiction">Non-Fiction</option>
                                <option value="Children's & Young Adult">
                                  Children's & Young Adult
                                </option>
                              </select>
                              {errors.category && (
                                <div className="invalid-feedback d-block mt-1">
                                  {errors.category}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="row mb-4">
                          <div className="col-lg-6">
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className={`form-control form-control-lg ${
                                  errors.authorName ? "is-invalid" : ""
                                }`}
                                id="authorName"
                                name="authorName"
                                placeholder="Author's Name"
                                value={formData.authorName}
                                onChange={handleChange}
                                required
                                style={{
                                  borderRadius: "0.5rem",
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                }}
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
                                className={`form-control form-control-lg ${
                                  errors.isbnNumber ? "is-invalid" : ""
                                }`}
                                id="isbnNumber"
                                name="isbnNumber"
                                placeholder="ISBN Number"
                                value={formData.isbnNumber}
                                onChange={handleChange}
                                required
                                style={{
                                  borderRadius: "0.5rem",
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                }}
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

                        <div className="mb-4">
                          <label
                            htmlFor="language"
                            className="form-label ps-1 mb-2"
                          >
                            Language
                          </label>
                          <div
                            className="language-selector"
                            style={{
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                              borderRadius: "0.5rem",
                            }}
                          >
                            <select
                              className={`form-select form-select-lg ${
                                errors.language ? "is-invalid" : ""
                              }`}
                              id="language"
                              name="language"
                              value={formData.language}
                              onChange={handleChange}
                              required
                              style={{
                                borderRadius: "0.5rem",
                                padding: "0.75rem 1rem",
                                height: "calc(3.5rem + 2px)",
                                border: "1px solid #ced4da",
                                backgroundColor: "#fff",
                                backgroundImage:
                                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3E%3C/svg%3E\")",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "right 1rem center",
                                backgroundSize: "16px 12px",
                                appearance: "none",
                              }}
                            >
                              <option value="" disabled>
                                Select Language
                              </option>
                              <option value="Sinhala">Sinhala</option>
                              <option value="English">English</option>
                            </select>
                            {errors.language && (
                              <div className="invalid-feedback d-block mt-1">
                                {errors.language}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="cover-upload-section text-center">
                          <div
                            className="cover-preview mb-3"
                            style={{
                              border: "2px dashed #0277bd",
                              borderRadius: "0.75rem",
                              padding: "10px",
                              height: "340px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#f8f9fa",
                              overflow: "hidden",
                              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                              transition: "all 0.3s ease",
                            }}
                          >
                            {coverPreview ? (
                              <img
                                src={coverPreview}
                                alt="Cover Preview"
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "320px",
                                  objectFit: "contain",
                                  borderRadius: "0.5rem",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                }}
                              />
                            ) : (
                              <div className="text-muted text-center">
                                <i
                                  className="fas fa-book-open"
                                  style={{
                                    fontSize: "64px",
                                    opacity: 0.6,
                                    color: "#0277bd",
                                  }}
                                ></i>
                                <p className="mt-3 mb-0 fs-5">
                                  Book cover preview
                                </p>
                                <p className="small text-secondary">
                                  Upload an image to see preview
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="mb-3">
                            <label
                              htmlFor="coverPage"
                              className="btn btn-primary w-100 py-3"
                              style={{
                                borderRadius: "0.5rem",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                                background:
                                  "linear-gradient(to right, #0277bd, #00838f)",
                                fontSize: "1.1rem",
                              }}
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
                        className="btn btn-outline-secondary btn-lg px-4"
                        onClick={() => navigate("/admindashboard")}
                        style={{
                          borderRadius: "0.5rem",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      >
                        <i className="fas fa-arrow-left me-2"></i>Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success btn-lg px-5 py-2"
                        disabled={isSubmitting}
                        style={{
                          borderRadius: "0.5rem",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                          background:
                            "linear-gradient(to right, #2e7d32, #43a047)",
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>Update Book
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