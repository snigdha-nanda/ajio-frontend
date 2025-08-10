import { createCart, fetchCart, fetchCartItems, updateCartItem, deleteCartItem, fetchProductById } from '../api/backendApi';

let userCartId = null;

export const initializeCart = async () => {
  try {
    const { cartId } = await fetchCart();
    userCartId = cartId;
    return cartId;
  } catch (error) {
    if (error.message.includes('Cart not found')) {
      const { cartId } = await createCart();
      userCartId = cartId;
      return cartId;
    }
    throw error;
  }
};

export const getCartItems = async () => {
  if (!userCartId) await initializeCart();
  
  const items = await fetchCartItems(userCartId);
  
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

export const addToCart = async (productId, quantity = 1) => {
  if (!userCartId) await initializeCart();
  await updateCartItem(userCartId, productId, quantity);
};

export const updateQuantity = async (productId, quantity) => {
  if (!userCartId) await initializeCart();
  await updateCartItem(userCartId, productId, quantity);
};

export const removeFromCart = async (productId) => {
  if (!userCartId) await initializeCart();
  await deleteCartItem(userCartId, productId);
};

export const getCartCount = async () => {
  try {
    const items = await getCartItems();
    return items.reduce((total, item) => total + item.quantity, 0);
  } catch {
    return 0;
  }
};

export const clearCart = async () => {
  try {
    const items = await getCartItems();
    await Promise.all(items.map(item => removeFromCart(item.id)));
  } catch (error) {
    console.error('Failed to clear cart:', error);
    throw error;
  }
};
