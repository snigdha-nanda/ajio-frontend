// Cart Service - Handles all cart operations with backend
import { createCart, fetchCart, fetchCartItems, updateCartItem, deleteCartItem, fetchProductById } from '../api/backendApi';

let userCartId = null; // Store current user's cart ID

// Initialize cart for logged-in user
export const initializeCart = async () => {
  try {
    // Try to get existing cart
    const { cartId } = await fetchCart();
    userCartId = cartId;
    return cartId;
  } catch (error) {
    // If no cart exists, create a new one
    if (error.message.includes('Cart not found')) {
      const { cartId } = await createCart();
      userCartId = cartId;
      return cartId;
    }
    throw error;
  }
};

// Get all items in user's cart
export const getCartItems = async () => {
  if (!userCartId) await initializeCart();
  
  // Get cart items from backend
  const items = await fetchCartItems(userCartId);
  
  // Get product details for each cart item
  const cartItems = await Promise.all(
    items.map(async (item) => {
      const product = await fetchProductById(item.product_id);
      return {
        id: item.product_id,
        title: product.title,
        price: product.discounted_price,
        image: product.image_path,
        quantity: item.quantity
      };
    })
  );
  
  return cartItems;
};

// Add product to cart
export const addToCart = async (productId, quantity = 1) => {
  if (!userCartId) await initializeCart();
  await updateCartItem(userCartId, productId, quantity);
};

// Update quantity of existing cart item
export const updateQuantity = async (productId, quantity) => {
  if (!userCartId) await initializeCart();
  await updateCartItem(userCartId, productId, quantity);
};

// Remove item completely from cart
export const removeFromCart = async (productId) => {
  if (!userCartId) await initializeCart();
  await deleteCartItem(userCartId, productId);
};

// Get total number of items in cart
export const getCartCount = async () => {
  try {
    const items = await getCartItems();
    return items.reduce((total, item) => total + item.quantity, 0);
  } catch {
    return 0;
  }
};
