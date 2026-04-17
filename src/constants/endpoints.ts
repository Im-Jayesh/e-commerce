export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    SIGNUP: '/api/auth/signup',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
  },
  // Products
  PRODUCTS: {
    GET_ALL: '/api/products',
    CREATE: '/api/products',
    UPDATE: (id: string) => `/api/products/${id}`,
    DELETE: (id: string) => `/api/products/${id}`,
  },
  // Orders
  ORDERS: {
    GET_ALL: '/api/orders',
    CREATE: '/api/orders',
    UPDATE: (id: string) => `/api/orders/${id}`,
  },
} as const;

export const AUTH_HEADER_KEY = 'Authorization';
export const TOKEN_STORAGE_KEY = 'auth_token';
