
/**
 * Login Page Component
 * 
 * Handles user authentication with Firebase Auth.
 * Features:
 * - Email/password login
 * - Cart mode toggle (local vs API)
 * - Post-login cart initialization
 * - Redirect to intended page after login
 */

import React, { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { createAndStoreCart } from '../utils/cartUtils';
import Navbar from '../components/Navbar';
import {
  setCurrentUserId,
  selectCartId,
  setUseLocalCart,
  selectUseLocalCart,
} from '../features/userCart/userCartSlice';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const existingCartId = useSelector(selectCartId);
  const useLocalCart = useSelector(selectUseLocalCart);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(setCurrentUserId(user.uid));

        // Only create API cart if not using local cart and no existing cart
        if (!useLocalCart && !existingCartId) {
          await createAndStoreCart(user.uid, dispatch, existingCartId);
        }

        // Handle post-auth redirect
        const intended = location.state?.intended;
        if (intended?.action === 'add-to-cart') {
          toast.success('Logged in! You can now add items to cart.');
          navigate(`/product/${intended.product.id}`);
        } else {
          navigate(location.state?.from || '/');
        }
      }
    });
    return unsub;
  }, [dispatch, navigate, location.state, existingCartId, useLocalCart]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    
    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      toast.success('Login successful');
      dispatch(setCurrentUserId(user.uid));

      // Only create API cart if not using local cart and no existing cart
      if (!useLocalCart && !existingCartId) {
        await createAndStoreCart(user.uid, dispatch, existingCartId);
      }

      // Handle post-auth redirect
      const intended = location.state?.intended;
      if (intended?.action === 'add-to-cart') {
        toast.success('You can now add items to cart.');
        navigate(`/product/${intended.product.id}`);
      } else {
        navigate(location.state?.from || '/');
      }
    } catch (err) {
      console.error(err);
      if (
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/user-not-found'
      ) {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError('Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-5" style={{ maxWidth: 480 }}>
        <div className="text-center mb-4">
          <h1 className="fw-bold">Log In</h1>
          <p className="text-muted">Access your account</p>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleLogin} noValidate>
              <div className="mb-3">
                <label htmlFor="loginEmail" className="form-label">
                  Email
                </label>
                <input
                  id="loginEmail"
                  type="email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="loginPassword" className="form-label">
                  Password
                </label>
                <input
                  id="loginPassword"
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-label="Password"
                />
              </div>

              <div className="mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="useLocalCart"
                    checked={useLocalCart}
                    onChange={(e) => dispatch(setUseLocalCart(e.target.checked))}
                  />
                  <label className="form-check-label" htmlFor="useLocalCart">
                    Use Local Cart (recommended)
                  </label>
                  <small className="form-text text-muted d-block">
                    Local cart works perfectly. Uncheck to use API mode.
                  </small>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
                aria-label="Log In"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <div className="text-center mt-3">
              Don’t have an account?{' '}
              <Link
                to="/signup"
                state={{
                  from: location.state?.from || '/',
                  intended: location.state?.intended,
                }}
                className="text-decoration-none"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
