const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    coverPage: {
      type: String, // Store the file path or URL of the uploaded image
      required: [true, "Cover page is required"],
    },
    bookTitle: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    bookDescription: {
      type: String,
      required: [true, "Book description is required"],
      trim: true,
    },
    bookQuantity: {
      type: Number,
      required: [true, "Book quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Fiction", "Non-Fiction", "Children's & Young Adult"],
    },
    authorName: {
      type: String,
      required: [true, "Author's name is required"],
      trim: true,
    },
    isbnNumber: {
      type: String,
      required: [true, "ISBN number is required"],
      unique: true,
      validate: {
        validator: function (v) {
          return /^\d{10,13}$/.test(v); // Validate ISBN format (10-13 digits)
        },
        message: (props) => `${props.value} is not a valid ISBN number!`,
      },
    },
    language: {
      type: String,
      required: [true, "Language is required"],
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create a model from the schema
const Product = mongoose.model("Product", productSchema);

module.exports = Product;