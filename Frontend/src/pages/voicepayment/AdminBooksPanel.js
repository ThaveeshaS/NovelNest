import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminBooksPanel = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', coverImage: '' });
  const [editBookId, setEditBookId] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      alert('Failed to load books.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editBookId) {
        await axios.put(`http://localhost:5000/api/books/${editBookId}`, {
          name: formData.name,
          price: parseFloat(formData.price),
          coverImage: formData.coverImage || 'https://via.placeholder.com/150',
        });
        alert('Book updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/books', {
          name: formData.name,
          price: parseFloat(formData.price),
          coverImage: formData.coverImage || 'https://via.placeholder.com/150',
        });
        alert('Book added successfully!');
      }
      setFormData({ name: '', price: '', coverImage: '' });
      setEditBookId(null);
      fetchBooks();
    } catch (error) {
      console.error('Error saving book:', error);
      alert('Failed to save book.');
    }
  };

  const handleEdit = (book) => {
    setFormData({ name: book.name, price: book.price, coverImage: book.coverImage });
    setEditBookId(book._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`http://localhost:5000/api/books/${id}`);
        fetchBooks();
        alert('Book deleted successfully!');
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Failed to delete book.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1>Admin - Manage Books</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-group mb-3">
          <label>Book Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Price ($)</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Cover Image URL</label>
          <input
            type="text"
            className="form-control"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            placeholder="e.g., https://via.placeholder.com/150"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {editBookId ? 'Update Book' : 'Add Book'}
        </button>
        {editBookId && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setFormData({ name: '', price: '', coverImage: '' });
              setEditBookId(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>
      <h2>Book List</h2>
      <div className="row">
        {books.map(book => (
          <div key={book._id} className="col-md-4 mb-3">
            <div className="card">
              <img src={book.coverImage} alt={book.name} className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">{book.name}</h5>
                <p className="card-text">Price: ${book.price}</p>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(book)}>
                  Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(book._id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default AdminBooksPanel;