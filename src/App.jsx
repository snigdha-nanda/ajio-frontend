/**
 * Main App Component
 * 
 * This is the root component that sets up routing for the entire application.
 * It includes routes for Home, Login, Signup, Product Details, and Cart pages.
 * 
 * Features:
 * - React Router for navigation
 * - Toast notifications for user feedback
 * - Clean route structure
 */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx'; // adjust extension/path if .jsx or .js
import Signup from './pages/Signup.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import CartPage from './pages/CartPage.jsx'; // or Cart.js depending on your filename
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        {/* add additional protected or fallback routes as needed */}
      </Routes>
    </>
  );
}

export default App;
