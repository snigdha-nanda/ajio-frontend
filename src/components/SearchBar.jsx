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

  // Fetch all products on component mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://fakestoreapi.com/products');
        const data = await res.json();
        setAllProducts(data);
        setSearchResults(data); // Initially show all products in dropdown
      } catch (err) {
        console.error('Failed to fetch products for search:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      // Show all products when search is empty
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
    // Delay hiding dropdown to allow clicks on items
    setTimeout(() => setShowDropdown(false), 200);
  };

  return (
    <div className="search-container position-relative" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        <div className="input-group-append">
          {searchTerm && (
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={handleClearSearch}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showDropdown && (
        <div 
          className="search-dropdown position-absolute w-100 bg-white border rounded shadow-lg"
          style={{ top: '100%', zIndex: 1000, maxHeight: '400px', overflowY: 'auto' }}
        >
          {loading ? (
            <div className="p-3 text-center text-muted">Loading products...</div>
          ) : searchResults.length > 0 ? (
            <>
              {searchResults.slice(0, 8).map(product => (
                <div
                  key={product.id}
                  className="search-result-item p-2 border-bottom cursor-pointer"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleProductClick(product.id)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={product.image}
                      alt={product.title}
                      style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                      className="me-3"
                    />
                    <div>
                      <div className="fw-bold" style={{ fontSize: '14px' }}>
                        {product.title.length > 50 ? product.title.substring(0, 50) + '...' : product.title}
                      </div>
                      <div className="text-muted" style={{ fontSize: '12px' }}>
                        ₹{product.price} • {product.category}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {searchResults.length > 8 && (
                <div className="p-2 text-center text-muted" style={{ fontSize: '12px' }}>
                  {searchResults.length - 8} more results...
                </div>
              )}
            </>
          ) : (
            <div className="p-3 text-center text-muted">
              No products found for "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
