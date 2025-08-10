
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { fetchProducts } from '../api/backendApi';

const CategoryPage = () => {
  const location = useLocation();
  const pathParts = location.pathname.slice(1).split('/'); // Remove leading slash and split
  const category = pathParts[0]; // men, women, kids
  const subcategory = pathParts[1]; // clothing, shoes, accessories (optional)
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [category, subcategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts(category, subcategory);
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPageTitle = () => {
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    if (subcategory) {
      const subcategoryName = subcategory.charAt(0).toUpperCase() + subcategory.slice(1);
      return `${categoryName}'s ${subcategoryName}`;
    }
    return `${categoryName}'s Collection`;
  };

  const getPageDescription = () => {
    if (subcategory) {
      return `Explore our latest ${subcategory} collection for ${category}`;
    }
    return `Discover the latest trends in ${category}'s fashion`;
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb" style={{ backgroundColor: 'transparent', padding: 0 }}>
            <li className="breadcrumb-item">
              <Link to="/" style={{ color: 'var(--color-text)', textDecoration: 'none' }}>Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/${category}`} style={{ color: 'var(--color-text)', textDecoration: 'none' }}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Link>
            </li>
            {subcategory && (
              <li className="breadcrumb-item active" style={{ color: 'var(--color-primary)' }}>
                {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
              </li>
            )}
          </ol>
        </nav>

        <div className="text-center mb-4">
          <h1 style={{ 
            color: 'var(--color-primary)', 
            fontFamily: 'var(--font-heading)',
            marginBottom: '0.5rem'
          }}>
            {getPageTitle()}
          </h1>
          <p style={{ color: 'var(--color-text)' }}>
            {getPageDescription()}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading products...</p>
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <div className="text-center py-5">
                <h4 style={{ color: 'var(--color-primary)' }}>No products found</h4>
                <p style={{ color: 'var(--color-text)' }}>
                  We're working on adding more products to this category soon!
                </p>
              </div>
            ) : (
              <div className="row">
                {products.map((product) => (
                  <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;
