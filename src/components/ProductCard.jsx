// src/components/ProductCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div className="card">
      <div
        className="product-img-wrapper"
        onClick={() => navigate(`/product/${product.id}`)}
        style={{ cursor: 'pointer' }}
      >
        <img src={product.image} alt={product.title} />
      </div>

      <div className="card-body">
        <div className="product-title">{product.title}</div>
        <div className="product-price">${product.price.toFixed(2)}</div>
        <button
          className="btn-primary-custom"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
