// src/pages/CartPage.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from '../features/cart/cartSlice';
import { toast } from 'react-toastify';

const CartPage = () => {
  const items = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  const subtotal = items
    .reduce((sum, i) => sum + i.price * i.quantity, 0)
    .toFixed(2);
  const totalItems = items.reduce((c, i) => c + i.quantity, 0);

  const handleRemove = id => {
    dispatch(removeFromCart({ id }));
    toast.info('Removed from cart');
  };

  const handleQuantityChange = (id, newQty) => {
    if (newQty < 1) return;
    dispatch(updateQuantity({ id, quantity: newQty }));
    toast.success('Quantity updated');
  };

  const handleClear = () => {
    dispatch(clearCart());
    toast.info('Cart cleared');
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.warning('Your cart is empty. Add items before checkout.');
      return;
    }
    toast.success('Checkout flow would start here.');
  };

  return (
    <div className="container my-5">
      <h3 className="mb-4 fw-bold">Your Cart</h3>

      {items.length === 0 ? (
        <div className="alert alert-info">Your cart is empty.</div>
      ) : (
        <div className="row">
          <div className="col-md-8">
            {items.map(item => (
              <div className="card mb-3" key={item.id}>
                <div className="row g-0">
                  <div className="col-3 d-flex align-items-center p-2">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="img-fluid"
                      style={{ maxHeight: 100, objectFit: 'contain' }}
                    />
                  </div>
                  <div className="col-6">
                    <div className="card-body">
                      <h6 className="card-title">{item.title}</h6>
                      <p className="mb-1">${item.price}</p>
                      <div className="d-flex align-items-center gap-2">
                        <label className="form-label mb-0 me-2">Qty:</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={e =>
                            handleQuantityChange(item.id, Number(e.target.value))
                          }
                          style={{ width: 80 }}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-3 d-flex flex-column justify-content-between p-2">
                    <button
                      className="btn btn-sm btn-outline-danger mb-2"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                    <div className="fw-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="d-flex gap-2 mb-3">
              <button className="btn btn-secondary" onClick={handleClear}>
                Clear Cart
              </button>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3 shadow">
              <h5 className="mb-3 fw-bold">Order Summary</h5>
              <p className="mb-1">Items: {totalItems}</p>
              <p className="mb-1">Subtotal: ${subtotal}</p>
              <hr />
              <div className="d-grid">
                <button
                  className="btn btn-primary"
                  onClick={handleCheckout}
                  disabled={items.length === 0}
                >
                  Proceed to Checkout
                </button>
              </div>
              {items.length === 0 && (
                <small className="text-muted">
                  Add items to enable checkout.
                </small>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
