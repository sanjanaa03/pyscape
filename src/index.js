import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// Suppress ResizeObserver errors (benign Monaco Editor issue)
const errorHandler = (event) => {
  const message = event.message || event.error?.message || event.reason?.message || '';
  
  // Check if it's a ResizeObserver error
  if (message.includes('ResizeObserver loop') || 
      message.includes('ResizeObserver')) {
    event.stopImmediatePropagation();
    event.preventDefault();
    return true;
  }
};

// Handle both error and unhandledrejection events
window.addEventListener('error', errorHandler);
window.addEventListener('unhandledrejection', errorHandler);

// Create root and render app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
