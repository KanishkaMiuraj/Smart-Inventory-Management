import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

// Pages
import ProductList from './pages/ProductList';
import CartPage from './pages/CartPage';
import AdminDashboard from './pages/AdminDashboard';

// Context Providers
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext'; // <-- Professional Notifications

function App() {
  return (
    // 1. Cart Provider: Keeps track of items selected by the user
    <CartProvider>
      {/* 2. Notification Provider: Allows any page to show professional Toasts/Snackbars */}
      <NotificationProvider>
        <Router>
          <Navbar />
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<ProductList />} />
            <Route path="/cart" element={<CartPage />} />
            
            {/* Admin Route */}
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </CartProvider>
  );
}

export default App;