import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import the main App component
import './index.css'; // Import your main CSS file for Tailwind

// This is the entry point of your React application.
// It renders the main App component into the 'root' div in your Laravel Blade file.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
