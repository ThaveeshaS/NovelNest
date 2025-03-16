import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Tips = () => {
  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <h1 className="display-4 text-primary text-center">💡 Tips</h1>
        <p className="lead text-muted">
          Discover helpful tips to enhance your reading experience, care for your books, and make the most of NavelNest Book Store!
        </p>
      </div>

      {/* Reading Tips Section */}
      <section className="mb-5">
        <h3 className="text-primary mb-3">📖 Reading Tips</h3>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <strong>Set Reading Goals:</strong> Decide how many books you'd like to read this month or year. Track your progress with a reading journal!
          </li>
          <li className="list-group-item">
            <strong>Find Your Cozy Spot:</strong> Create a relaxing reading space with good lighting and minimal distractions.
          </li>
          <li className="list-group-item">
            <strong>Take Notes:</strong> Jot down favorite quotes or reflections as you read to enhance your engagement with the book.
          </li>
          <li className="list-group-item">
            <strong>Try Different Genres:</strong> Explore genres outside your usual picks to discover new favorites!
          </li>
          <li className="list-group-item">
            <strong>Join a Book Club:</strong> Share your reading experience and gain new insights by discussing books with others.
          </li>
        </ul>
      </section>

      {/* Book Care Tips Section */}
      <section className="mb-5">
        <h3 className="text-primary mb-3">📚 Book Care Tips</h3>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <strong>Avoid Direct Sunlight:</strong> Prolonged sun exposure can fade book covers and pages. Store books in a cool, dry place.
          </li>
          <li className="list-group-item">
            <strong>Keep Hands Clean:</strong> Always handle books with clean hands to avoid stains and smudges.
          </li>
          <li className="list-group-item">
            <strong>Use Bookmarks:</strong> Don’t dog-ear pages. Use a bookmark to keep your place.
          </li>
          <li className="list-group-item">
            <strong>Store Books Upright:</strong> Store books vertically on a shelf and avoid leaning them to prevent spine damage.
          </li>
          <li className="list-group-item">
            <strong>Protect from Moisture:</strong> Humidity can cause pages to warp. Use silica gel packets on your bookshelf to keep them dry.
          </li>
        </ul>
      </section>

      {/* Shopping Tips Section */}
      <section className="mb-5">
        <h3 className="text-primary mb-3">🛒 Shopping Tips at NavelNest</h3>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <strong>Sign Up for an Account:</strong> Get early access to exclusive deals and personalized recommendations.
          </li>
          <li className="list-group-item">
            <strong>Subscribe to Our Newsletter:</strong> Stay updated on new arrivals and special discounts.
          </li>
          <li className="list-group-item">
            <strong>Check Reviews:</strong> Read customer reviews to find books that fit your taste and needs.
          </li>
          <li className="list-group-item">
            <strong>Watch for Sales:</strong> We frequently offer seasonal promotions—don't miss out!
          </li>
          <li className="list-group-item">
            <strong>Follow Us on Social Media:</strong> Join our online community for giveaways, events, and reading inspiration.
          </li>
        </ul>
      </section>

      {/* Call to Action */}
      <section className="text-center mb-5">
        <h4 className="text-primary mb-3">Have Your Own Tips?</h4>
        <p className="text-muted">
          Share your best reading tips or book care advice with us! Send your suggestions to{" "}
          <a href="mailto:support@navelnestbookstore.com" className="text-decoration-none text-primary">
            support@navelnestbookstore.com
          </a>{" "}
          and we might feature them here!
        </p>
        <a href="/customer-service" className="btn btn-primary px-4 py-2">
          Contact Us
        </a>
      </section>
    </div>
  );
};

export default Tips;
