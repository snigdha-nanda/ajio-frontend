// src/hooks/useCart.js
import { useSelector, useDispatch } from 'react-redux';
import { selectUserCartMeta } from '../features/userCart/userCartSlice';
import { CartService } from '../utils/cartService';
import { useState, useEffect } from 'react';

/**
 * Simple hook to get cart count for navbar
 */
export function useCartCount() {
  const dispatch = useDispatch();
  const { cartId, currentUserId, fakeStoreUserId, useLocalCart, localCartItems } = useSelector(selectUserCartMeta);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCount = async () => {
      setLoading(true);
      try {
        const cartService = new CartService(
          useLocalCart,
          dispatch,
          cartId,
          fakeStoreUserId || currentUserId,
          localCartItems
        );
        const count = await cartService.getCartCount();
        setCartCount(count);
      } catch (err) {
        console.warn('Failed to fetch cart count:', err);
        setCartCount(0);
      } finally {
        setLoading(false);
      }
    };

    // Only load if we have local items or a cart ID for API mode
    if (useLocalCart || cartId) {
      loadCount();
    } else {
      setCartCount(0);
    }
  }, [cartId, useLocalCart, localCartItems, dispatch, currentUserId, fakeStoreUserId]);

  return { cartCount, loading };
}
