import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// Suppress ResizeObserver errors (benign Monaco Editor issue)
const errorHandler = (event) => {
  const message = event.message || event.error?.message || '';
  if (message.includes('ResizeObserver')) {
    event.stopImmediatePropagation();
    event.preventDefault();
    return;
  }
};
window.addEventListener('error', errorHandler);

// Create root and render app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
