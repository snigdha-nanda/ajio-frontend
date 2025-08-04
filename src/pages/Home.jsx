// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products - always show ALL products on home page
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://fakestoreapi.com/products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />
      <div className="hero">
        <h1>Welcome to AJIO Clone</h1>
        <div className="subtitle">Shop the best styles here!</div>
      </div>

      {/* Search Bar Section */}
      <div className="container my-4">
        <SearchBar />
      </div>

      <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading products...</p>
          </div>
        ) : (
          <>
            {/* Always show all products count */}
            <div className="mb-3">
              <p className="text-muted">
                Showing all {products.length} products
              </p>
            </div>
            
            <div className="product-grid">
              {products.length > 0 ? (
                products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))
              ) : (
                <div className="text-center py-5">
                  <h4>No products available</h4>
                  <p className="text-muted">Please try again later</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
