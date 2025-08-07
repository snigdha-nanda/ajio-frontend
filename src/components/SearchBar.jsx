/**
 * SearchBar Component
 * 
 * Provides real-time product search functionality with dropdown results.
 * Features:
 * - Shows all products by default when focused
 * - Filters products as user types
 * - Click on any result to navigate to product detail page
 * - Clear search functionality
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://fakestoreapi.com/products');
        const data = await res.json();
        setAllProducts(data);
        setSearchResults(data); 
      } catch (err) {
        console.error('Failed to fetch products for search:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      
      setSearchResults(allProducts);
      return;
    }

    const filtered = allProducts.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setSearchResults(filtered);
  }, [searchTerm, allProducts]);

  const handleProductClick = (productId) => {
    setShowDropdown(false);
    setSearchTerm('');
    navigate(`/product/${productId}`);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults(allProducts);
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleInputBlur = () => {
    
    setTimeout(() => setShowDropdown(false), 200);
  };

  return (
    <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          style={{ flex: 1 }}
        />
        {searchTerm && (
          <button
            className="btn-outline"
            type="button"
            onClick={handleClearSearch}
            style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem' }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showDropdown && (
        <div 
          style={{ 
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow)',
            zIndex: 1000,
            maxHeight: '400px',
            overflowY: 'auto'
          }}
        >
          {loading ? (
            <div style={{ padding: '1rem', textAlign: 'center', color: '#5f4d6a' }}>Loading products...</div>
          ) : searchResults.length > 0 ? (
            <>
              {searchResults.slice(0, 8).map(product => (
                <div
                  key={product.id}
                  style={{ 
                    padding: '0.75rem',
                    borderBottom: '1px solid var(--color-border)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onClick={() => handleProductClick(product.id)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-bg)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      objectFit: 'contain',
                      marginRight: '0.75rem'
                    }}
                  />
                  <div>
                    <div style={{ 
                      fontWeight: '600', 
                      fontSize: '14px',
                      color: 'var(--color-primary)'
                    }}>
                      {product.title.length > 50 ? product.title.substring(0, 50) + '...' : product.title}
                    </div>
                    <div style={{ 
                      color: '#5f4d6a', 
                      fontSize: '12px'
                    }}>
                      ${product.price} • {product.category}
                    </div>
                  </div>
                </div>
              ))}
              {searchResults.length > 8 && (
                <div style={{ 
                  padding: '0.5rem', 
                  textAlign: 'center', 
                  color: '#5f4d6a',
                  fontSize: '12px'
                }}>
                  {searchResults.length - 8} more results...
                </div>
              )}
            </>
          ) : (
            <div style={{ 
              padding: '1rem', 
              textAlign: 'center', 
              color: '#5f4d6a'
            }}>
              No products found for "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
