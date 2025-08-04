// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../features/cart/cartSlice';
import { useDispatch } from 'react-redux';
import { auth } from '../firebase';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch detail');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setError('');
      })
      .catch(err => {
        setError(err.message || 'Error loading product');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    if (!product) return;

    if (!auth.currentUser) {
      toast.warning('Please log in to add to cart');
      navigate('/login', {
        state: {
          from: location.pathname,
          intended: {
            action: 'add-to-cart',
            product,
          },
        },
      });
      return;
    }

    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    );
    toast.success('Added to cart');
  };

  if (loading)
    return (
      <div className="container my-5">
        <div className="text-center">Loading product...</div>
      </div>
    );

  if (error)
    return (
      <div className="container my-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );

  if (!product)
    return (
      <div className="container my-5">
        <div className="alert alert-warning">Product not found.</div>
      </div>
    );

  return (
    <div className="container my-5">
      <div className="row g-4">
        <div className="col-md-6 text-center">
          <img
            src={product.image}
            alt={product.title}
            className="img-fluid"
            style={{ maxHeight: 400, objectFit: 'contain' }}
          />
        </div>
        <div className="col-md-6">
          <h2 className="fw-bold">{product.title}</h2>
          <p className="fw-bold h4">${product.price}</p>
          <p className="lead">{product.description}</p>
          <div className="d-flex gap-2">
            <button className="btn btn-primary" onClick={handleAdd}>
              Add to Cart
            </button>
            <button className="btn btn-outline-secondary" onClick={handleAdd}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
