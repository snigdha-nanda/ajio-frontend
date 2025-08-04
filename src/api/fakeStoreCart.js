const BASE = 'https://fakestoreapi.com';

/**
 * Create a new cart for a user
 * @param {string} userId - Firebase UID
 */
export async function createCart(userId) {
  if (!userId) throw new Error('createCart: userId is required');
  
  const body = {
    userId,
    date: new Date().toISOString().split('T')[0],
    products: [],
  };
  
  const res = await fetch(`${BASE}/carts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to create cart: ${res.status} ${res.statusText}`);
  }
  
  return res.json(); // { id, userId, date, products: [] }
}

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
  
  const data = await res.json();
  
  // Handle mock API limitation - if cart doesn't exist, return empty cart
  if (!data || data === null) {
    return {
      id: cartId,
      userId: null,
      date: new Date().toISOString().split('T')[0],
      products: []
    };
  }
  
  // Ensure products array exists
  if (!data.products) {
    data.products = [];
  }
  
  return data;
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
  
  const res = await fetch(`${BASE}/carts/${cartId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to update cart: ${res.status} ${res.statusText}`);
  }
  
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

  console.log('Adding item to cart:', { cartId, userId, productToAdd });

  const cart = await fetchCart(cartId);
  console.log('Current cart:', cart);

  const existing = cart.products.find((p) => p.productId === productToAdd.productId);
  console.log('Existing product:', existing);

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
  
  console.log('Updated products:', updatedProducts);
  
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
