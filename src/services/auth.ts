import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api';

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
    const response = await apiClient.post(API_ENDPOINTS.AUTH.SIGNUP, data);
    return response.data;
  },

  async login(data: LoginInput): Promise<AuthResponse> {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    // Cookie is cleared on the server side
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
    return response.data.user;
  },

  isAuthenticated(): boolean {
    // Authentication is verified by the presence of a valid httpOnly cookie
    // This is just a helper - actual auth check happens on API calls
    return true;
  },
};
