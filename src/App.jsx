import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import CartPage from './pages/CartPage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import Profile from './pages/Profile.jsx';
import Orders from './pages/Orders.jsx';

function App() {
  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{
          backgroundColor: 'var(--color-card)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)',
          fontFamily: 'var(--font-body)'
        }}
      />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/men" element={<CategoryPage />} />
        <Route path="/women" element={<CategoryPage />} />
        <Route path="/kids" element={<CategoryPage />} />
        <Route path="/men/:subcategory" element={<CategoryPage />} />
        <Route path="/women/:subcategory" element={<CategoryPage />} />
        <Route path="/kids/:subcategory" element={<CategoryPage />} />
      </Routes>
    </>
  );
}

export default App;
