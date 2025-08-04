import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { createAndStoreCart } from '../utils/cartUtils';
import { CartService } from '../utils/cartService';
import {
  selectUserCartMeta,
  setCurrentUserId,
} from '../features/userCart/userCartSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const productId = id?.trim();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { cartId, currentUserId, fakeStoreUserId, useLocalCart, localCartItems } = useSelector(selectUserCartMeta);
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

    // For API mode, ensure cart exists
    let actualCartId = cartId;
    if (!useLocalCart && !actualCartId) {
      actualCartId = await createAndStoreCart(user.uid, dispatch, cartId);
      if (!actualCartId) {
        toast.error('Could not initialize cart.');
        return;
      }
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
    
    try {
      // Simple service call
      const cartService = new CartService(
        useLocalCart,
        dispatch,
        actualCartId,
        effectiveUserId || user.uid,
        localCartItems
      );
      
      await cartService.addItem(product.id, 1);
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
