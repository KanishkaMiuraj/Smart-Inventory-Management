import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; 
import App from './App';

// Import Material UI Theme Providers
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; // <-- This imports the professional theme we just made

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrap the entire App with the ThemeProvider */}
    <ThemeProvider theme={theme}>
      {/* CssBaseline kicks start an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline /> 
      <App />
    </ThemeProvider>
  </React.StrictMode>
);