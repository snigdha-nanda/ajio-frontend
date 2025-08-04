/**
 * User Cart Redux Slice
 * 
 * Manages cart state for both local and API modes:
 * - User authentication state
 * - Cart ID for API mode
 * - Local cart items for local mode
 * - Cart mode toggle (local vs API)
 * 
 * Features:
 * - Memoized selectors for performance
 * - Persistent state across browser sessions
 * - Support for both cart modes
 */

import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  currentUserId: null,        // Firebase user ID
  fakeStoreUserId: null,      // FakeStore API user ID
  cartId: null,               // Cart ID for API mode
  useLocalCart: true,         // Toggle between local/API mode
  localCartItems: [],         // Cart items for local mode
};

const userCartSlice = createSlice({
  name: 'userCart',
  initialState,
  reducers: {
    // Set current Firebase user ID
    setCurrentUserId: (state, action) => {
      state.currentUserId = action.payload;
    },
    
    // Set FakeStore API user ID
    setFakeStoreUserId: (state, action) => {
      state.fakeStoreUserId = action.payload;
    },
    
    // Set cart ID for API mode
    setCartId: (state, action) => {
      state.cartId = action.payload;
    },
    
    // Toggle between local and API cart modes
    setUseLocalCart: (state, action) => {
      state.useLocalCart = action.payload;
    },
    
    // Add item to local cart
    addToLocalCart: (state, action) => {
      const { productId, quantity } = action.payload;
      const existing = state.localCartItems.find(item => item.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        const newItem = { productId, quantity };
        state.localCartItems.push(newItem);
      }
    },
    
    // Remove item from local cart
    removeFromLocalCart: (state, action) => {
      const productId = action.payload;
      state.localCartItems = state.localCartItems.filter(item => item.productId !== productId);
    },
    
    // Update item quantity in local cart
    updateLocalCartQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const existing = state.localCartItems.find(item => item.productId === productId);
      if (existing) {
        existing.quantity = quantity;
      }
    },
    
    // Clear all user cart data (on logout)
    clearUserCart: (state) => {
      state.currentUserId = null;
      state.fakeStoreUserId = null;
      state.cartId = null; // Clear cart ID on logout
      state.localCartItems = [];
    },
    
    // Clear only local cart but keep API cart
    clearLocalCart: (state) => {
      state.localCartItems = [];
    },
  },
});

// Individual selectors for better performance
export const selectCartId = (state) => state.userCart.cartId;
export const selectFakeStoreUserId = (state) => state.userCart.fakeStoreUserId;
export const selectCurrentUserId = (state) => state.userCart.currentUserId;
export const selectUseLocalCart = (state) => state.userCart.useLocalCart;
export const selectLocalCartItems = (state) => state.userCart.localCartItems;

// Memoized combined selector to prevent unnecessary rerenders
export const selectUserCartMeta = createSelector(
  [selectCurrentUserId, selectFakeStoreUserId, selectCartId, selectUseLocalCart, selectLocalCartItems],
  (currentUserId, fakeStoreUserId, cartId, useLocalCart, localCartItems) => ({
    currentUserId,
    fakeStoreUserId,
    cartId,
    useLocalCart,
    localCartItems,
  })
);

export const {
  setCurrentUserId,
  setFakeStoreUserId,
  setCartId,
  setUseLocalCart,
  addToLocalCart,
  removeFromLocalCart,
  updateLocalCartQuantity,
  clearUserCart,
  clearLocalCart,
} = userCartSlice.actions;

export default userCartSlice.reducer;
