// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import {
  selectUserCartMeta,
  setCurrentUserId,
  setCartId,
} from '../features/userCart/userCartSlice';
import {
  addItemToCart,
  fetchCart,
} from '../api/fakeStoreCart';

const ProductDetail = () => {
  const { id } = useParams();
  const productId = id?.trim();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { cartId, currentUserId, fakeStoreUserId } = useSelector(selectUserCartMeta);
  const effectiveUserId = fakeStoreUserId || currentUserId;

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [adding, setAdding] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Sync Firebase auth into Redux
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setCurrentUserId(user.uid));
      }
    });
    return () => unsub();
  }, [dispatch]);

  // Fetch product data
  const loadProduct = async () => {
    if (!productId) {
      setFetchError('Product ID is missing in URL');
      setLoadingProduct(false);
      return;
    }
    setLoadingProduct(true);
    setFetchError(null);
    try {
      const res = await fetch(`https://fakestoreapi.com/products/${productId}`);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();
      setProduct(data);
    } catch (e) {
      console.error('Failed to load product:', e);
      setFetchError(e.message || 'Failed to load product');
      toast.error('Failed to load product');
    } finally {
      setLoadingProduct(false);
    }
  };

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // Ensure cart exists; if not, create it and store in Redux
  const ensureCartExists = async (userUid) => {
    if (cartId) return cartId;
    try {
      const resp = await fetch('https://fakestoreapi.com/carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userUid,
          date: new Date().toISOString().split('T')[0],
          products: [],
        }),
      });
      if (resp.ok) {
        const cartData = await resp.json();
        dispatch(setCartId(cartData.id));
        return cartData.id;
      } else {
        console.warn('Failed to create cart:', resp.statusText);
      }
    } catch (e) {
      console.warn('Error creating cart:', e);
    }
    return null;
  };

  const handleAddToCart = async () => {
    if (!product) {
      toast.warning('Product not loaded yet.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      navigate('/login', {
        state: {
          from: location.pathname,
          intended: {
            action: 'add-to-cart',
            product: {
              id: product.id,
              title: product.title,
              price: product.price,
              image: product.image,
            },
          },
        },
      });
      toast.info('Please log in to add to cart');
      return;
    }

    // Ensure cart exists
    const actualCartId = await ensureCartExists(user.uid);
    if (!actualCartId) {
      toast.error('Could not initialize cart.');
      return;
    }

    // Ensure userId stored
    if (!currentUserId) {
      dispatch(setCurrentUserId(user.uid));
    }

    if (typeof product.id === 'undefined') {
      console.error('Product has no id:', product);
      toast.error('Invalid product data.');
      return;
    }

    setAdding(true);
    console.log("check if it is coming here");
    
    try {
      await addItemToCart(
        actualCartId,
        effectiveUserId || user.uid,
        {
          productId: product.id,
          quantity: 1,
        }
      );
      toast.success('Product added to cart');
    } catch (err) {
      console.error('Add to cart failed:', err);
      toast.error('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loadingProduct)
    return (
      <>
        <Navbar />
        <div className="container my-5">
          <div>Loading product...</div>
        </div>
      </>
    );

  if (fetchError)
    return (
      <>
        <Navbar />
        <div className="container my-5">
          <div className="alert alert-danger">
            Error loading product: {fetchError}
            <div className="mt-2">
              <button className="btn btn-sm btn-secondary" onClick={loadProduct}>
                Retry
              </button>
            </div>
          </div>
        </div>
      </>
    );

  if (!product)
    return (
      <>
        <Navbar />
        <div className="container my-5">
          <div className="alert alert-warning">Product not found.</div>
        </div>
      </>
    );

  return (
    <>
      <Navbar />
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
            <p className="fw-bold h4">₹ {product.price}</p>
            <p className="lead">{product.description}</p>
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary"
                onClick={handleAddToCart}
                disabled={adding || !product}
              >
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={handleAddToCart}
                disabled={adding || !product}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;