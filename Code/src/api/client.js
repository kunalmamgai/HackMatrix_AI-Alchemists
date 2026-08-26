/**
 * Centralized API client for ReCircuit backend.
 * Handles auth tokens, error normalization, and request/response interceptors.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function getToken() {
  return localStorage.getItem('authToken');
}

function setToken(token) {
  localStorage.setItem('authToken', token);
}

function clearToken() {
  localStorage.removeItem('authToken');
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // Don't set Content-Type for FormData
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const res = await fetch(url, { ...options, headers });

    if (!res.ok) {
      let body;
      try {
        body = await res.json();
      } catch {
        body = { error: res.statusText };
      }
      throw new ApiError(body.error || 'Request failed', res.status, body.details);
    }

    // Handle empty responses
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError('Network error — please check your connection', 0);
  }
}

// ─── Auth ──────────────────────────────────────────────────────
export const auth = {
  loginWithGoogle: async (credential) => {
    const data = await request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });
    setToken(data.token);
    return data;
  },

  getProfile: () => request('/auth/me'),

  updateProfile: (updates) => request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(updates),
  }),

  logout: () => clearToken(),
};

// ─── Products ──────────────────────────────────────────────────
export const products = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/products?${qs}`);
  },

  get: (slug) => request(`/products/${slug}`),

  create: (data) => request('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// ─── Orders ────────────────────────────────────────────────────
export const orders = {
  list: () => request('/orders'),

  get: (id) => request(`/orders/${id}`),

  create: (data) => request('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  cancel: (id) => request(`/orders/${id}/cancel`, { method: 'PATCH' }),
};

// ─── Centers ───────────────────────────────────────────────────
export const centers = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/centers?${qs}`);
  },

  get: (slug) => request(`/centers/${slug}`),

  create: (data) => request('/centers', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// ─── Pickups ───────────────────────────────────────────────────
export const pickups = {
  list: () => request('/pickups'),

  create: (data) => request('/pickups', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  cancel: (id) => request(`/pickups/${id}/cancel`, { method: 'PATCH' }),
};

// ─── Payments ──────────────────────────────────────────────────
export const payments = {
  createCheckout: (orderId) => request('/payments/checkout', {
    method: 'POST',
    body: JSON.stringify({ orderId }),
  }),

  createIntent: (orderId) => request('/payments/create-intent', {
    method: 'POST',
    body: JSON.stringify({ orderId }),
  }),
};

// ─── Reviews ───────────────────────────────────────────────────
export const reviews = {
  listForProduct: (productId) => request(`/reviews/product/${productId}`),
  listForCenter: (centerId) => request(`/reviews/center/${centerId}`),
  create: (data) => request('/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

export { ApiError, getToken, setToken, clearToken };
