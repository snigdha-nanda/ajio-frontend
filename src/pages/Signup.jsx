
/**
 * Signup Page Component
 * 
 * Handles user registration with Firebase Auth.
 * Features:
 * - Email/password registration
 * - Cart mode toggle (local vs API)
 * - Post-signup cart initialization
 * - Redirect to intended page after signup
 */

import React, { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
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
import './Signup.css';

const Signup = () => {
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
          toast.success('Account created! You can now add items to cart.');
          navigate(`/product/${intended.product.id}`);
        } else {
          navigate(location.state?.from || '/');
        }
      }
    });
    return unsub;
  }, [dispatch, navigate, location.state, existingCartId, useLocalCart]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    
    setLoading(true);
    
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      toast.success('Signup successful');
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
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'Signup failed.');
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
          <h1 className="fw-bold">Sign Up</h1>
          <p className="text-muted">Create an account to continue shopping</p>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSignup} noValidate>
              <div className="mb-3">
                <label htmlFor="signupEmail" className="form-label">
                  Email
                </label>
                <input
                  id="signupEmail"
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
                <label htmlFor="signupPassword" className="form-label">
                  Password
                </label>
                <input
                  id="signupPassword"
                  type="password"
                  className="form-control"
                  placeholder="Enter a strong password"
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
                aria-label="Sign Up"
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>

            <div className="text-center mt-3">
              Already have an account?{' '}
              <Link
                to="/login"
                state={{
                  from: location.state?.from || '/',
                  intended: location.state?.intended,
                }}
                className="text-decoration-none"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
