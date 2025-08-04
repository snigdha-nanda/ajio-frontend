// src/components/MiniCartDropdown.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../features/cart/cartSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const MiniCartDropdown = () => {
  const items = useSelector(s => s.cart.items || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = items
    .reduce((sum, i) => sum + i.price * i.quantity, 0)
    .toFixed(2);
  const totalItems = items.reduce((c, i) => c + i.quantity, 0);

  const handleRemove = id => {
    dispatch(removeFromCart({ id }));
    toast.info('Removed from cart');
  };

  const goToCart = () => {
    navigate('/cart');
  };

  return (
    <div
      className="dropdown-menu dropdown-menu-end p-3"
      style={{ minWidth: 300 }}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="fw-bold">Cart ({totalItems})</div>
        {items.length > 0 && (
          <small className="text-muted">Subtotal: ${subtotal}</small>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-4">
          <div className="mb-2">Your cart is empty.</div>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => navigate('/')}
          >
            Shop Now
          </button>
        </div>
      ) : (
        <>
          <div style={{ maxHeight: 250, overflowY: 'auto' }}>
            {items.map(item => (
              <div
                className="d-flex align-items-center gap-2 mb-3"
                key={item.id}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: 50,
                    height: 50,
                    objectFit: 'contain',
                    borderRadius: 6,
                  }}
                />
                <div className="flex-grow-1">
                  <div className="small mb-1 text-truncate">{item.title}</div>
                  <div className="d-flex align-items-center gap-2">
                    <div className="fw-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <div>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e =>
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              quantity: Math.max(1, Number(e.target.value)),
                            })
                          )
                        }
                        style={{ width: 55 }}
                        className="form-control form-control-sm"
                      />
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleRemove(item.id)}
                  aria-label="Remove item"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="border-top pt-2">
            <div className="d-flex justify-content-between mb-2">
              <div className="fw-semibold">Total:</div>
              <div className="fw-bold">${subtotal}</div>
            </div>
            <div className="d-grid gap-2">
              <button className="btn btn-primary btn-sm" onClick={goToCart}>
                View Cart
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MiniCartDropdown;
