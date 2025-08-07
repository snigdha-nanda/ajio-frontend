import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setCurrentUserId, clearUserCart } from '../features/userCart/userCartSlice';
import { useCartCount } from '../hooks/useCart';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartCount } = useCartCount();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);

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

  const dropdownData = {
    men: {
      title: 'MEN',
      items: [
        { category: 'Clothing', items: ['T-Shirts & Polos', 'Shirts', 'Jeans', 'Trousers'] },
        { category: 'Footwear', items: ['Sneakers', 'Formal Shoes'] }
      ]
    },
    women: {
      title: 'WOMEN',
      items: [
        { category: 'Clothing', items: ['Dresses', 'Tops & Tees', 'Jeans', 'Ethnic Wear'] },
        { category: 'Footwear', items: ['Heels', 'Flats'] }
      ]
    },
    kids: {
      title: 'KIDS',
      items: [
        { category: 'Boys', items: ['T-Shirts', 'Shirts', 'Jeans'] },
        { category: 'Girls', items: ['Dresses', 'Tops'] }
      ]
    },
    accessories: {
      title: 'ACCESSORIES',
      items: [
        { category: 'Bags', items: ['Handbags', 'Backpacks', 'Wallets'] },
        { category: 'Jewelry', items: ['Watches', 'Sunglasses'] }
      ]
    }
  };

  return (
    <nav className="navbar-custom" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      width: '100%'
    }}>
      {/* Left side - Logo and Navigation - All in one line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/" className="navbar-brand">
          AJIO Clone
        </Link>
        
        {/* Navigation with dropdowns */}
        {Object.entries(dropdownData).map(([key, data]) => (
          <div 
            key={key}
            style={{ position: 'relative' }}
            onMouseEnter={() => setShowDropdown(key)}
            onMouseLeave={() => setShowDropdown(null)}
          >
            <span className="nav-link" style={{ cursor: 'pointer' }}>
              {data.title}
            </span>
            {showDropdown === key && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                background: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                padding: '1rem',
                minWidth: '200px',
                zIndex: 1000,
                boxShadow: 'var(--shadow)'
              }}>
                {data.items.map((section, idx) => (
                  <div key={idx} style={{ marginBottom: '0.5rem' }}>
                    <div style={{ 
                      fontWeight: '600', 
                      color: 'var(--color-primary)',
                      marginBottom: '0.25rem'
                    }}>
                      {section.category}
                    </div>
                    {section.items.map((item, itemIdx) => (
                      <div key={itemIdx} style={{
                        padding: '0.25rem 0',
                        color: '#5f4d6a',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}>
                        {item}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right side - Icons and User - All in one line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Wishlist Icon */}
        <Link 
          to="/wishlist" 
          className="nav-link" 
          style={{ 
            display: 'flex', 
            alignItems: 'center',
            position: 'relative'
          }}
          title="Wishlist"
        >
          <FaHeart size={18} />
        </Link>

        {/* Cart Icon */}
        <Link 
          to="/cart" 
          className="nav-link" 
          style={{ 
            display: 'flex', 
            alignItems: 'center',
            position: 'relative'
          }}
          title="Shopping Cart"
        >
          <FaShoppingCart size={18} />
          {cartCount > 0 && (
            <span className="badge-cart">
              {cartCount}
            </span>
          )}
        </Link>

        {/* User Authentication */}
        {user ? (
          <>
            <span style={{ 
              fontWeight: 500, 
              color:'#e8d9ec',
              fontSize: '0.9rem',
              whiteSpace: 'nowrap'
            }}>
              Hi, {user.email ? user.email.split('@')[0] : 'User'}
            </span>
            <button 
              className="btn-outline" 
              onClick={handleLogout}
              style={{ 
                padding: '0.4rem 0.8rem', 
                fontSize: '0.85rem',
                whiteSpace: 'nowrap'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" style={{ whiteSpace: 'nowrap' }}>
              Log In
            </Link>
            <Link 
              to="/signup" 
              className="btn-primary-custom" 
              style={{ 
                padding: '0.4rem 0.8rem',
                fontSize: '0.85rem',
                whiteSpace: 'nowrap'
              }}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
