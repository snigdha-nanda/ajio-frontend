import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';
import { FaHeart, FaShoppingCart, FaUser } from 'react-icons/fa';
import { initializeCart, getCartCount } from '../utils/cartService';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          await initializeCart();
          updateCartCount();
        } catch (error) {
          console.error('Cart initialization failed:', error);
        }
      } else {
        setCartCount(0);
      }
    });

    return () => unsub();
  }, []);

  const updateCartCount = async () => {
    try {
      const count = await getCartCount();
      setCartCount(count);
    } catch (error) {
      console.error('Failed to get cart count:', error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        setShowDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      updateCartCount();
      const interval = setInterval(updateCartCount, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setCartCount(0);
      setShowDropdown(null);
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const toggleDropdown = (dropdown) => {
    setShowDropdown(showDropdown === dropdown ? null : dropdown);
  };

  return (
    <>
      {/* Golden Sale Banner */}
      <div 
        className="text-center py-2"
        style={{ 
          background: 'linear-gradient(135deg, var(--color-accent) 0%, #f0c832 100%)',
          color: 'var(--color-primary)',
          fontWeight: '600',
          fontSize: '0.9rem'
        }}
      >
        🔥 MEGA SALE: Up to 70% OFF on Fashion & Lifestyle! Limited Time Only! 🔥
      </div>

      <nav className="navbar navbar-expand-lg navbar-custom">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            AJIO
          </Link>

          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            style={{ 
              background: 'none', 
              border: '1px solid #e8d9ec', 
              color: '#e8d9ec',
              padding: '4px 8px'
            }}
          >
            ☰
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              
              <li className="nav-item dropdown position-relative">
                <a 
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown('men');
                  }}
                >
                  Men
                </a>
                <ul 
                  className={`dropdown-menu ${showDropdown === 'men' ? 'show' : ''}`}
                  style={{ 
                    display: showDropdown === 'men' ? 'block' : 'none',
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    zIndex: 1000
                  }}
                >
                  <li><Link className="dropdown-item" to="/men/clothing" onClick={() => setShowDropdown(null)}>Clothing</Link></li>
                  <li><Link className="dropdown-item" to="/men/shoes" onClick={() => setShowDropdown(null)}>Shoes</Link></li>
                  <li><Link className="dropdown-item" to="/men/accessories" onClick={() => setShowDropdown(null)}>Accessories</Link></li>
                </ul>
              </li>
              
              <li className="nav-item dropdown position-relative">
                <a 
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown('women');
                  }}
                >
                  Women
                </a>
                <ul 
                  className={`dropdown-menu ${showDropdown === 'women' ? 'show' : ''}`}
                  style={{ 
                    display: showDropdown === 'women' ? 'block' : 'none',
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    zIndex: 1000
                  }}
                >
                  <li><Link className="dropdown-item" to="/women/clothing" onClick={() => setShowDropdown(null)}>Clothing</Link></li>
                  <li><Link className="dropdown-item" to="/women/shoes" onClick={() => setShowDropdown(null)}>Shoes</Link></li>
                  <li><Link className="dropdown-item" to="/women/accessories" onClick={() => setShowDropdown(null)}>Accessories</Link></li>
                </ul>
              </li>
              
              <li className="nav-item dropdown position-relative">
                <a 
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleDropdown('kids');
                  }}
                >
                  Kids
                </a>
                <ul 
                  className={`dropdown-menu ${showDropdown === 'kids' ? 'show' : ''}`}
                  style={{ 
                    display: showDropdown === 'kids' ? 'block' : 'none',
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    zIndex: 1000
                  }}
                >
                  <li><Link className="dropdown-item" to="/kids/clothing" onClick={() => setShowDropdown(null)}>Clothing</Link></li>
                  <li><Link className="dropdown-item" to="/kids/shoes" onClick={() => setShowDropdown(null)}>Shoes</Link></li>
                  <li><Link className="dropdown-item" to="/kids/accessories" onClick={() => setShowDropdown(null)}>Accessories</Link></li>
                </ul>
              </li>
            </ul>

            <ul className="navbar-nav">
              {/* Wishlist disabled for now */}
              {/* <li className="nav-item">
                <Link className="nav-link position-relative" to="/wishlist">
                  <FaHeart />
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    0
                  </span>
                </Link>
              </li> */}
              
              <li className="nav-item">
                <Link className="nav-link position-relative" to="/cart">
                  <FaShoppingCart />
                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" 
                          style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-primary)' }}>
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>

              {user ? (
                <li className="nav-item dropdown position-relative">
                  <a 
                    className="nav-link dropdown-toggle d-flex align-items-center"
                    href="#"
                    role="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleDropdown('user');
                    }}
                  >
                    <FaUser className="me-1" />
                    {user.email?.split('@')[0]}
                  </a>
                  <ul 
                    className={`dropdown-menu dropdown-menu-end ${showDropdown === 'user' ? 'show' : ''}`}
                    style={{ 
                      display: showDropdown === 'user' ? 'block' : 'none',
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      zIndex: 1000
                    }}
                  >
                    <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                    <li><Link className="dropdown-item" to="/orders">Orders</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/signup">Signup</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
