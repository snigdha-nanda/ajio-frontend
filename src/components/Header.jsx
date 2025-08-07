// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 30px',
        backgroundColor: '#f0f0f0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <div>
        <Link
          to="/"
          style={{
            marginRight: '20px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '18px',
            color: '#333',
          }}
        >
          🛍️ AJIO Store
        </Link>
        <Link
          to="/cart"
          style={{
            textDecoration: 'none',
            fontSize: '16px',
            color: '#333',
          }}
        >
          🛒 Cart
        </Link>
      </div>
    </header>
  );
};

export default Header;
