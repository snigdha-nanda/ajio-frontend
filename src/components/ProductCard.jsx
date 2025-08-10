import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div className="card h-100" style={{ 
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden'
    }}>
      <div
        className="product-img-wrapper"
        onClick={() => navigate(`/product/${product.id}`)}
        style={{ 
          cursor: 'pointer',
          height: '200px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-bg)'
        }}
      >
        <img 
          src={product.image} 
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>

      <div className="card-body d-flex flex-column" style={{ padding: '1rem' }}>
        <div 
          className="product-title mb-2" 
          style={{ 
            color: 'var(--color-primary)',
            fontWeight: '600',
            fontSize: '0.9rem',
            lineHeight: '1.3',
            height: '2.6rem',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {product.name}
        </div>
        
        <div className="d-flex align-items-center gap-2 mb-3">
          <span className="fw-bold" style={{ color: 'var(--color-accent)' }}>₹{product.price}</span>
          {product.actualPrice && product.actualPrice > product.price && (
            <span className="text-decoration-line-through text-muted small">₹{product.actualPrice}</span>
          )}
        </div>
        
        <button
          className="btn-primary-custom w-100 mt-auto"
          onClick={() => navigate(`/product/${product.id}`)}
          style={{ padding: '0.5rem' }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
