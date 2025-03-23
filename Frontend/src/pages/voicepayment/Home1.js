import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/books');
        setBooks(response.data);
        console.log('Books loaded:', response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
        alert('Failed to load books. Check backend.');
      }
    };
    fetchBooks();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.interimResults = false;
      recognitionInstance.maxAlternatives = 1;

      recognitionInstance.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        console.log('Voice command:', command);
        if (command.includes('i want book')) {
          const bookName = command.replace('i want book', '').trim();
          const book = books.find(b => b.name.toLowerCase().includes(bookName));
          if (book) {
            navigate('/payment', { state: { book } });
            console.log('Redirecting to payment with book:', book);
          } else {
            alert('Book not found. Try "I want book [book name]".');
          }
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech error:', event.error);
        alert('Voice recognition failed. Check microphone.');
      };

      setRecognition(recognitionInstance);
    } else {
      alert('Speech recognition not supported. Use Chrome.');
    }
  }, [navigate, books]);

  const startListening = () => {
    if (recognition && !recognition.isActive) {
      recognition.start();
      console.log('Listening for voice...');
    }
  };

  return (
    <div className="container mt-5 text-center">
      <h1>Voice-Enabled Book Store</h1>
      <p>Say "I want book [book name]" to buy.</p>
      <button className="btn btn-primary mb-3" onClick={startListening}>
        Start Voice Input
      </button>
      <div className="row">
        {books.length > 0 ? (
          books.map(book => (
            <div key={book._id} className="col-md-4 mb-3">
              <div className="card">
                <img src={book.coverImage} alt={book.name} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{book.name}</h5>
                  <p className="card-text">Price: ${book.price}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No books available. Add some via the admin panel.</p>
        )}
      </div>
      <div className="mt-3">
        <button className="btn btn-secondary" onClick={() => navigate('/adminbookspanel')}>
          Manage Books
        </button>
        <button className="btn btn-secondary ms-2" onClick={() => navigate('/admin/transactions')}>
          View Transactions
        </button>
      </div>
    </div>
  );
};

export default Home;