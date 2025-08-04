// src/pages/CartPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectUserCartMeta,
  setCartId,
  setCurrentUserId,
} from '../features/userCart/userCartSlice';
import {
  fetchCart,
  removeItemFromCart,
  setItemQuantity,
} from '../api/fakeStoreCart';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const CartPage = () => {
  const dispatch = useDispatch();
  const { cartId, currentUserId, fakeStoreUserId } = useSelector(selectUserCartMeta);
  const effectiveUserId = fakeStoreUserId || currentUserId;

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productsMeta, setProductsMeta] = useState({});
  const [updating, setUpdating] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Ensure auth/cart linkage on login
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(setCurrentUserId(user.uid));
        if (!cartId) {
          try {
            const resp = await fetch('https://fakestoreapi.com/carts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: user.uid,
                date: new Date().toISOString().split('T')[0],
                products: [],
              }),
            });
            if (resp.ok) {
              const cartData = await resp.json();
              dispatch(setCartId(cartData.id));
            } else {
              console.warn('Failed to create cart on login:', resp.statusText);
            }
          } catch (e) {
            console.warn('Error creating cart on login:', e);
          }
        }
      }
    });
    return () => unsub();
  }, [cartId, dispatch]);

  // Load cart with simple retry
  const loadCart = useCallback(
    async (retryCount = 2) => {
      if (!cartId) {
        setCart(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const fetched = await fetchCart(cartId);
        setCart(fetched);

        // Fetch product metadata
        if (fetched.products && fetched.products.length > 0) {
          const metas = await Promise.all(
            fetched.products.map((p) =>
              fetch(`https://fakestoreapi.com/products/${p.productId}`)
                .then((r) => {
                  if (!r.ok) throw new Error(`Failed product fetch ${p.productId}`);
                  return r.json();
                })
                .catch(() => null)
            )
          );
          const metaMap = {};
          metas.forEach((m) => {
            if (m && m.id) metaMap[m.id] = m;
          });
          setProductsMeta(metaMap);
        } else {
          setProductsMeta({});
        }
      } catch (err) {
        if (retryCount > 0) {
          setTimeout(() => loadCart(retryCount - 1), 300);
        } else {
          console.error('Failed to load cart after retries:', err);
          toast.error('Failed to load cart.');
        }
      } finally {
        setLoading(false);
      }
    },
    [cartId]
  );

  useEffect(() => {
    loadCart();
  }, [cartId, refreshTrigger, loadCart]);

  const refresh = () => setRefreshTrigger((t) => t + 1);

  const handleRemove = async (productId) => {
    if (updating || !cartId || !effectiveUserId) return;
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
    if (updating || !cartId || !effectiveUserId) return;
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

  const items = cart?.products || [];
  const totalItems = items.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const subtotal = items.reduce((sum, p) => {
    const meta = productsMeta[p.productId];
    const price = meta ? meta.price : 0;
    return sum + price * (p.quantity || 0);
  }, 0);

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h3 className="mb-4 fw-bold">Your Cart</h3>

        {loading ? (
          <div className="text-center">Loading cart...</div>
        ) : !items || items.length === 0 ? (
          <div className="alert alert-info">Your cart is empty.</div>
        ) : (
          <div className="row">
            <div className="col-md-8">
              {items.map((item) => {
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
                    // clear sequentially to avoid race
                    (async () => {
                      for (const p of items) {
                        // eslint-disable-next-line no-await-in-loop
                        await handleRemove(p.productId);
                      }
                    })();
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
                    onClick={() => toast.info('Proceeding to checkout...')}
                    disabled={items.length === 0 || updating}
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
    </>
  );
};

export default CartPage;
