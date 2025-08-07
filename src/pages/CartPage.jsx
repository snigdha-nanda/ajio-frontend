
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectUserCartMeta,
} from '../features/userCart/userCartSlice';
import {
  fetchCart,
  removeItemFromCart,
  setItemQuantity,
} from '../api/fakeStoreCart';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

const CartPage = () => {
  const dispatch = useDispatch();
  const { cartId, currentUserId, fakeStoreUserId } = useSelector(selectUserCartMeta);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productsMeta, setProductsMeta] = useState({}); 
  const [updating, setUpdating] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const effectiveUserId = fakeStoreUserId || currentUserId;

  const loadCart = useCallback(async () => {
    if (!cartId) {
      setCart(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const fetched = await fetchCart(cartId);
      setCart(fetched);

      
      const productFetches = fetched.products.map((p) =>
        fetch(`https://fakestoreapi.com/products/${p.productId}`).then((r) => {
          if (!r.ok) throw new Error('Failed to fetch product ' + p.productId);
          return r.json();
        })
      );
      const metas = await Promise.all(productFetches);
      const metaMap = {};
      metas.forEach((m) => {
        metaMap[m.id] = m;
      });
      setProductsMeta(metaMap);
    } catch (err) {
      console.error('Failed to load cart:', err);
      toast.error('Failed to load cart.');
    } finally {
      setLoading(false);
    }
  }, [cartId]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleRemove = async (productId) => {
    if (!cartId || !effectiveUserId) return;
    setUpdating(true);
    try {
      await removeItemFromCart(cartId, effectiveUserId, productId);
      toast.info('Item removed');
      await loadCart();
    } catch (err) {
      console.error('Remove failed:', err);
      toast.error('Failed to remove item.');
    } finally {
      setUpdating(false);
    }
  };

  const handleQuantityChange = async (productId, newQty) => {
    if (!cartId || !effectiveUserId) return;
    if (newQty < 1) return;
    setUpdating(true);
    try {
      await setItemQuantity(cartId, effectiveUserId, productId, newQty);
      toast.success('Quantity updated');
      await loadCart();
    } catch (err) {
      console.error('Quantity update failed:', err);
      toast.error('Failed to update quantity.');
    } finally {
      setUpdating(false);
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();
    toast.success('Payment processed successfully! (Demo)');
    setShowPaymentModal(false);
  };

  const totalItems = cart
    ? cart.products.reduce((sum, p) => sum + (p.quantity || 0), 0)
    : 0;

  const subtotal = cart
    ? cart.products.reduce((sum, p) => {
        const meta = productsMeta[p.productId];
        const price = meta ? meta.price : 0;
        return sum + price * (p.quantity || 0);
      }, 0)
    : 0;

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h3 className="mb-4 fw-bold">Your Cart</h3>

        {loading ? (
          <div className="text-center">Loading cart...</div>
        ) : !cart || cart.products.length === 0 ? (
          <div className="alert alert-info">Your cart is empty.</div>
        ) : (
          <div className="row">
            <div className="col-md-8">
              {cart.products.map((item) => {
                const meta = productsMeta[item.productId] || {};
                return (
                  <div className="card mb-3" key={item.productId}>
                    <div className="row g-0">
                      <div className="col-3 d-flex align-items-center p-2">
                        <img
                          src={meta.image}
                          alt={meta.title}
                          className="img-fluid"
                          style={{ maxHeight: 100, objectFit: 'contain' }}
                        />
                      </div>
                      <div className="col-6">
                        <div className="card-body">
                          <h6 className="card-title">{meta.title || 'Loading...'}</h6>
                          <p className="mb-1">₹{meta.price?.toFixed(2) || '—'}</p>
                          <div className="d-flex align-items-center gap-2">
                            <label className="form-label mb-0 me-2">Qty:</label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(item.productId, Number(e.target.value))
                              }
                              style={{ width: 80 }}
                              className="form-control"
                              disabled={updating}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-3 d-flex flex-column justify-content-between p-2">
                        <button
                          className="btn btn-sm btn-outline-danger mb-2"
                          onClick={() => handleRemove(item.productId)}
                          disabled={updating}
                        >
                          Remove
                        </button>
                        <div className="fw-bold">
                          ₹
                          {meta.price
                            ? (meta.price * item.quantity).toFixed(2)
                            : '—'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="d-flex gap-2 mb-3">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    
                    cart.products.forEach((p) =>
                      handleRemove(p.productId)
                    );
                  }}
                  disabled={updating}
                >
                  Clear Cart
                </button>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card p-3 shadow">
                <h5 className="mb-3 fw-bold">Order Summary</h5>
                <p className="mb-1">Items: {totalItems}</p>
                <p className="mb-1">Subtotal: ₹{subtotal.toFixed(2)}</p>
                <hr />
                <div className="d-grid">
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowPaymentModal(true)}
                    disabled={cart.products.length === 0 || updating}
                  >
                    Proceed to Checkout
                  </button>
                </div>
                {cart.products.length === 0 && (
                  <small className="text-muted">
                    Add items to enable checkout.
                  </small>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Payment Details</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowPaymentModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handlePayment}>
                    <div className="row">
                      <div className="col-md-6">
                        <h6 className="mb-3">Billing Information</h6>
                        <div className="mb-3">
                          <label className="form-label">Full Name</label>
                          <input type="text" className="form-control" placeholder="John Doe" required />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <input type="email" className="form-control" placeholder="john@example.com" required />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Phone</label>
                          <input type="tel" className="form-control" placeholder="+91 9876543210" required />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Address</label>
                          <textarea className="form-control" rows="3" placeholder="Enter your address" required></textarea>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h6 className="mb-3">Payment Information</h6>
                        <div className="mb-3">
                          <label className="form-label">Card Number</label>
                          <input type="text" className="form-control" placeholder="1234 5678 9012 3456" required />
                        </div>
                        <div className="row">
                          <div className="col-6">
                            <div className="mb-3">
                              <label className="form-label">Expiry Date</label>
                              <input type="text" className="form-control" placeholder="MM/YY" required />
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="mb-3">
                              <label className="form-label">CVV</label>
                              <input type="text" className="form-control" placeholder="123" required />
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Cardholder Name</label>
                          <input type="text" className="form-control" placeholder="John Doe" required />
                        </div>
                        
                        <div className="bg-light p-3 rounded mt-4">
                          <h6>Order Summary</h6>
                          <div className="d-flex justify-content-between">
                            <span>Items ({totalItems}):</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Shipping:</span>
                            <span>₹50.00</span>
                          </div>
                          <hr />
                          <div className="d-flex justify-content-between fw-bold">
                            <span>Total:</span>
                            <span>₹{(subtotal + 50).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-success"
                    onClick={handlePayment}
                  >
                    Pay ₹{(subtotal + 50).toFixed(2)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
