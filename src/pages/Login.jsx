// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { handlePostAuthIntent } from '../utils/handlePostAuthIntent';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, process intent
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      if (user) {
        handlePostAuthIntent({
          intended: location.state?.intended,
          dispatch,
          navigate,
          from: location.state?.from,
        });
      }
    });
    return unsub;
  }, [navigate, location.state, dispatch]);

  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful');
      handlePostAuthIntent({
        intended: location.state?.intended,
        dispatch,
        navigate,
        from: location.state?.from,
      });
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
        setError(err.message || 'Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
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
                onChange={e => setEmail(e.target.value)}
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
                onChange={e => setPassword(e.target.value)}
                required
                aria-label="Password"
              />
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
  );
};

export default Login;
