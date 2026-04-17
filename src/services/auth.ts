import { apiRequest } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/endpoints';

export interface SignupInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    uid: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
  };
}

export interface User {
  uid: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export const authService = {
  async signup(data: SignupInput): Promise<AuthResponse> {
    return apiRequest(API_ENDPOINTS.AUTH.SIGNUP, { method: 'POST', data });
  },

  async login(data: LoginInput): Promise<AuthResponse> {
    return apiRequest(API_ENDPOINTS.AUTH.LOGIN, { method: 'POST', data });
  },

  async logout(): Promise<void> {
    await apiRequest(API_ENDPOINTS.AUTH.LOGOUT, { method: 'POST' });
    // Cookie is cleared on the server side
  },

  async getMe(): Promise<User> {
    const response = await apiRequest<{ user: User }>(API_ENDPOINTS.AUTH.ME);
    return response.user;
  },

  isAuthenticated(): boolean {
    // Authentication is verified by the presence of a valid httpOnly cookie
    // This is just a helper - actual auth check happens on API calls
    return true;
  },
};
