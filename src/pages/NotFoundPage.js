import React from 'react';
import { Link } from 'react-router-dom';
import '../css/NotFoundPage.css';

function NotFoundPage() {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <p>Oops! The page you're looking for does not exist.</p>
      <Link to="/" className="home-link">
        Go to Homepage
      </Link>
    </div>
  );
}

export default NotFoundPage;