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
        <img src={product.image} alt={product.name} />
      </div>

      <div className="card-body">
        <div className="product-title">{product.name}</div>
        {product.shortDescription && (
          <div className="text-muted small mb-2">{product.shortDescription}</div>
        )}
        <div className="d-flex align-items-center gap-2 mb-2">
          <span className="fw-bold">₹{product.price}</span>
          {product.actualPrice && product.actualPrice > product.price && (
            <span className="text-decoration-line-through text-muted">₹{product.actualPrice}</span>
          )}
        </div>
        <button
          className="btn-primary-custom w-100"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
