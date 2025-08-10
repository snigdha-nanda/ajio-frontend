import { auth } from '../firebase';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'https://ajio-backend.netlify.app/.netlify/functions';

const getAuthHeaders = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(true);
      return { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    }
    throw new Error('User not authenticated');
  } catch (error) {
    console.error('Auth error:', error);
    throw new Error('Authentication failed');
  }
};

export const fetchProducts = async (category = null, subcategory = null) => {
  let url = `${API_BASE}/products`;
  const params = new URLSearchParams();
  
  if (category) params.append('category', category);
  if (subcategory) params.append('subcategory', subcategory);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const fetchProductById = async (id) => {
  const response = await fetch(`${API_BASE}/products?id=${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return response.json();
};

export const createCart = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/cart`, {
    method: 'POST',
    headers
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create cart: ${error}`);
  }
  return response.json();
};

export const fetchCart = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/cart`, { headers });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch cart: ${error}`);
  }
  return response.json();
};

export const fetchCartItems = async (cartId) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/cart?id=${cartId}`, { headers });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch cart items: ${error}`);
  }
  return response.json();
};

export const updateCartItem = async (cartId, productId, quantity) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/cart?id=${cartId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ productId, quantity })
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update cart: ${error}`);
  }
  return response.json();
};

export const deleteCartItem = async (cartId, productId) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/cart?id=${cartId}&productId=${productId}`, {
    method: 'DELETE',
    headers
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to delete cart item: ${error}`);
  }
  return response.json();
};

export const fetchConfig = async (key) => {
  const response = await fetch(`${API_BASE}/config?key=${key}`);
  if (!response.ok) throw new Error('Failed to fetch config');
  return response.json();
};

export const fetchProfile = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/profile`, { headers });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch profile: ${error}`);
  }
  return response.json();
};

export const fetchOrders = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/orders`, { headers });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch orders: ${error}`);
  }
  return response.json();
};

export const createOrder = async (items, totalAmount) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ items, total_amount: totalAmount })
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create order: ${error}`);
  }
  return response.json();
};
