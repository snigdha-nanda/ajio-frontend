// src/api/fakeStoreCart.js
const BASE = 'https://fakestoreapi.com';

/**
 * Fetch the full cart object from FakeStore.
 * @param {string|number} cartId
 */
export async function fetchCart(cartId) {
  if (!cartId) throw new Error('fetchCart: cartId is required');
  const res = await fetch(`${BASE}/carts/${cartId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch cart: ${res.status} ${res.statusText}`);
  }
  return res.json(); // { id, userId, date, products: [...] }
}

/**
 * Update the entire cart (overwrites products array).
 * @param {string|number} cartId
 * @param {Array} products - array of { productId, quantity }
 * @param {number|string} userId - FakeStore userId (string fallback ok)
 */
export async function updateCart(cartId, products, userId) {
  if (!cartId) throw new Error('updateCart: cartId is required');
  if (!userId) throw new Error('updateCart: userId is required');
  const body = {
    userId,
    date: new Date().toISOString().split('T')[0],
    products,
  };
  console.log("check if it is coming here-22", body);
  const res = await fetch(`${BASE}/carts/${cartId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  console.log("check if it is coming here-33");
  if (!res.ok) {
    throw new Error(`Failed to update cart: ${res.status} ${res.statusText}`);
  }
  console.log("check if it is coming here-10");
  return res.json();
}

/**
 * Add or increment a product in the cart.
 * @param {string|number} cartId
 * @param {number|string} userId
 * @param {{ productId: number, quantity: number }} productToAdd
 */
export async function addItemToCart(cartId, userId, productToAdd) {
  if (!cartId) throw new Error('addItemToCart: cartId is required');
  if (!userId) throw new Error('addItemToCart: userId is required');
  if (!productToAdd || typeof productToAdd.productId === 'undefined') {
    throw new Error('addItemToCart: productToAdd.productId is required');
  }

  const cart = await fetchCart(cartId);
  console.log("check if it is coming here-2");

  const existing = cart.products.find((p) => p.productId === productToAdd.productId);

  console.log("check if it is coming here-3");

  let updatedProducts;
  if (existing) {
    updatedProducts = cart.products.map((p) =>
      p.productId === productToAdd.productId
        ? { ...p, quantity: p.quantity + productToAdd.quantity }
        : p
    );
  } else {
    updatedProducts = [...cart.products, productToAdd];
  }
  console.log("check if it is coming here-4");
  return updateCart(cartId, updatedProducts, userId);
}

/**
 * Remove a product from the cart.
 * @param {string|number} cartId
 * @param {number|string} userId
 * @param {number} productId
 */
export async function removeItemFromCart(cartId, userId, productId) {
  if (!cartId) throw new Error('removeItemFromCart: cartId is required');
  if (!userId) throw new Error('removeItemFromCart: userId is required');

  const cart = await fetchCart(cartId);
  const updatedProducts = cart.products.filter((p) => p.productId !== productId);
  return updateCart(cartId, updatedProducts, userId);
}

/**
 * Set a product quantity explicitly.
 * @param {string|number} cartId
 * @param {number|string} userId
 * @param {number} productId
 * @param {number} quantity
 */
export async function setItemQuantity(cartId, userId, productId, quantity) {
  if (!cartId) throw new Error('setItemQuantity: cartId is required');
  if (!userId) throw new Error('setItemQuantity: userId is required');

  const cart = await fetchCart(cartId);
  const updatedProducts = cart.products.map((p) =>
    p.productId === productId ? { ...p, quantity } : p
  );
  return updateCart(cartId, updatedProducts, userId);
}
