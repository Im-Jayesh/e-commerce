'use client';

import { useEffect, useState } from 'react';
import { authService, User } from '@/services/auth';
import axios from 'axios';
import { useCartStore } from '@/stores/useCartStore';
import { API_ENDPOINTS } from "@/constants/endpoints"
export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const cartStore = useCartStore();

  // Check if user is already logged in on mount by calling /api/auth/me
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.AUTH.ME);
        if (response.data?.user) {
          setUser(response.data.user);
          await cartStore.setUser(response.data.user.uid);
        }
      } catch (error) {
        // No valid session, clear any stale data
        setUser(null);
        await cartStore.setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      await cartStore.setUser(response.user.uid);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.signup({ username, email, password });
      setUser(response.user);
      await cartStore.setUser(response.user.uid);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      await cartStore.setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    isAuthenticated: user !== null,
    login,
    signup,
    logout,
  };
}
