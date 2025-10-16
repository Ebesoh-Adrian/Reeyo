// src/main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- New Import
import App from './App.jsx';
import './index.css';

// 1. IMPORT THE THEME PROVIDER
// Assuming your ThemeContext file is at src/ThemeContext.jsx
// Adjust the path if you saved it elsewhere (e.g., './context/ThemeContext')
import ThemeProvider from './context/ThemeContext.jsx'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. WRAP THE APP WITH BOTH NECESSARY PROVIDERS */}
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);

