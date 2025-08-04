/**
 * Cart Service - Unified cart management
 * 
 * This service provides a unified interface for cart operations
 * that works with both local cart (Redux) and API cart modes.
 * 
 * Features:
 * - Add items to cart
 * - Remove items from cart
 * - Update item quantities
 * - Get cart items and count
 * - Supports both local and API modes
 */

import { addItemToCart, fetchCart, removeItemFromCart, setItemQuantity } from '../api/fakeStoreCart';
import { addToLocalCart, removeFromLocalCart, updateLocalCartQuantity } from '../features/userCart/userCartSlice';

export class CartService {
  constructor(useLocalCart, dispatch, cartId, userId, localCartItems) {
    this.useLocalCart = useLocalCart;
    this.dispatch = dispatch;
    this.cartId = cartId;
    this.userId = userId;
    this.localCartItems = localCartItems || [];
  }

  // Add item to cart
  async addItem(productId, quantity = 1) {
    if (this.useLocalCart) {
      // Local cart: store in Redux
      this.dispatch(addToLocalCart({ productId, quantity }));
      return Promise.resolve();
    } else {
      // API cart: call FakeStore API
      return addItemToCart(this.cartId, this.userId, { productId, quantity });
    }
  }

  // Remove item from cart
  async removeItem(productId) {
    if (this.useLocalCart) {
      // Local cart: remove from Redux
      this.dispatch(removeFromLocalCart(productId));
      return Promise.resolve();
    } else {
      // API cart: call FakeStore API
      return removeItemFromCart(this.cartId, this.userId, productId);
    }
  }

  // Update item quantity
  async updateQuantity(productId, quantity) {
    if (this.useLocalCart) {
      // Local cart: update in Redux
      this.dispatch(updateLocalCartQuantity({ productId, quantity }));
      return Promise.resolve();
    } else {
      // API cart: call FakeStore API
      return setItemQuantity(this.cartId, this.userId, productId, quantity);
    }
  }

  // Get cart items
  async getCartItems() {
    if (this.useLocalCart) {
      // Local cart: return from Redux state
      return Promise.resolve(this.localCartItems || []);
    } else {
      // API cart: fetch from FakeStore API
      const cart = await fetchCart(this.cartId);
      return cart.products;
    }
  }

  // Get cart count (total items)
  async getCartCount() {
    const items = await this.getCartItems();
    return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }
}
