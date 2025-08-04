// src/utils/cartUtils.js
import { createCart } from '../api/fakeStoreCart';
import { setCartId } from '../features/userCart/userCartSlice';

/**
 * Simple utility to create cart and store in Redux
 * Only creates if cart doesn't already exist for the user session
 * @param {string} userId - Firebase UID
 * @param {function} dispatch - Redux dispatch function
 * @param {string|null} existingCartId - Current cart ID if any
 */
export async function createAndStoreCart(userId, dispatch, existingCartId = null) {
  if (!userId) {
    console.warn('createAndStoreCart: userId is required');
    return null;
  }

  // If cart already exists for this session, return it
  if (existingCartId) {
    console.log('Using existing cart ID:', existingCartId);
    return existingCartId;
  }

  try {
    const cartData = await createCart(userId);
    console.log('Created new cart:', cartData);
    
    // FakeStore API limitation: use a fallback cart ID if the created one doesn't work
    let cartIdToUse = cartData.id;
    
    // For mock API, use existing cart IDs (1-7) as fallback
    if (cartIdToUse > 7) {
      cartIdToUse = Math.floor(Math.random() * 7) + 1; // Random cart ID 1-7
      console.log('Using fallback cart ID:', cartIdToUse);
    }
    
    dispatch(setCartId(cartIdToUse));
    return cartIdToUse;
  } catch (error) {
    console.warn('Failed to create cart, using fallback:', error);
    // Fallback to existing cart ID
    const fallbackCartId = Math.floor(Math.random() * 7) + 1;
    dispatch(setCartId(fallbackCartId));
    return fallbackCartId;
  }
}
