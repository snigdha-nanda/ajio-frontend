
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setCurrentUserId, clearUserCart } from '../features/userCart/userCartSlice';
import { useCartCount } from '../hooks/useCart';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartCount } = useCartCount();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        dispatch(setCurrentUserId(u.uid));
      } else {
        // Clear cart when user logs out
        dispatch(clearUserCart());
      }
    });
    return () => unsub();
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUserCart());
      toast.success('Logged out');
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error('Logout failed');
    }
  };

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
          {cartCount > 0 && (
            <span
              className="badge-cart"
              style={{
                position: 'absolute',
                top: -5,
                right: -10,
                background: 'red',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: 12,
              }}
            >
              {cartCount}
            </span>
          )}
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
