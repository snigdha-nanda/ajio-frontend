// src/pages/Signup.jsx
import React, { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { handlePostAuthIntent } from '../utils/handlePostAuthIntent';

const Signup = () => {
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

  const handleSignup = async e => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Signup successful');
      handlePostAuthIntent({
        intended: location.state?.intended,
        dispatch,
        navigate,
        from: location.state?.from,
      });
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
                onChange={e => setEmail(e.target.value)}
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
                onChange={e => setPassword(e.target.value)}
                required
                aria-label="Password"
              />
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
  );
};

export default Signup;
