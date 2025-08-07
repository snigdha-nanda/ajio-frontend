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
  currentUserId: null,        
  fakeStoreUserId: null,      
  cartId: null,               
  useLocalCart: true,         
  localCartItems: [],         
};

const userCartSlice = createSlice({
  name: 'userCart',
  initialState,
  reducers: {
    
    setCurrentUserId: (state, action) => {
      state.currentUserId = action.payload;
    },
    
    
    setFakeStoreUserId: (state, action) => {
      state.fakeStoreUserId = action.payload;
    },
    
    
    setCartId: (state, action) => {
      state.cartId = action.payload;
    },
    
    
    setUseLocalCart: (state, action) => {
      state.useLocalCart = action.payload;
    },
    
    
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
    
    
    removeFromLocalCart: (state, action) => {
      const productId = action.payload;
      state.localCartItems = state.localCartItems.filter(item => item.productId !== productId);
    },
    
    
    updateLocalCartQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const existing = state.localCartItems.find(item => item.productId === productId);
      if (existing) {
        existing.quantity = quantity;
      }
    },
    
    
    clearUserCart: (state) => {
      state.currentUserId = null;
      state.fakeStoreUserId = null;
      state.cartId = null; 
      state.localCartItems = [];
    },
    
    
    clearLocalCart: (state) => {
      state.localCartItems = [];
    },
  },
});


export const selectCartId = (state) => state.userCart.cartId;
export const selectFakeStoreUserId = (state) => state.userCart.fakeStoreUserId;
export const selectCurrentUserId = (state) => state.userCart.currentUserId;
export const selectUseLocalCart = (state) => state.userCart.useLocalCart;
export const selectLocalCartItems = (state) => state.userCart.localCartItems;


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
