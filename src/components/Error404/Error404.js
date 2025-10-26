
import React from 'react';
import './Error404.css';
import { Link } from 'react-router-dom';

const Error404 = () => {
  return (
    <div className="error-container">
      <div className="glitch" data-text="404">404</div>
      <p className="error-message">Página no encontrada</p>
      <Link to="/" className="home-link">Volver al inicio</Link>
    </div>
  );
};

export default Error404;
