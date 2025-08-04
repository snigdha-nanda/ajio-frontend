// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products
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

      <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading products...</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
