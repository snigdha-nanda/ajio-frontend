// src/components/Navbar.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

// Selector: adjust path if your slice file is elsewhere
import { selectCartItems } from '../features/cart/cartSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out');
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error('Logout failed');
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <nav className="navbar-custom d-flex align-items-center justify-content-between">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/" className="navbar-brand">
          AJIO Clone
        </Link>
        <Link to="/" className="nav-link">
          Home
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/cart" className="nav-link" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          🛒
          {cartCount > 0 && <span className="badge-cart">{cartCount}</span>}
        </Link>
        {user ? (
          <>
            <span style={{ marginRight: 8, fontWeight: 500 }}>
              Hi, {user.email ? user.email.split('@')[0] : 'User'}
            </span>
            <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Log In
            </Link>
            <Link to="/signup" className="btn btn-primary-custom" style={{ padding: '0.45rem 0.9rem' }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
