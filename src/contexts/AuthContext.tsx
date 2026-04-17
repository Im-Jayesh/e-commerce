'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { authService, User } from '@/services/auth';
import axios from 'axios';
import { useCartStore } from '@/stores/useCartStore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const cartStoreRef = useRef(useCartStore.getState());

  // Get the store once and keep reference stable
  useEffect(() => {
    cartStoreRef.current = useCartStore.getState();
  }, []);

  // Single auth check on app mount only - empty dependency array
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/me', {
        withCredentials: true, // THIS IS MANDATORY FOR PRODUCTION COOKIES
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }
    });
        
        if (isMounted && response.data?.user) {
          setUser(response.data.user);
          // Load cart separately after user is set
          try {
            await cartStoreRef.current.setUser(response.data.user.uid);
          } catch (cartError) {
            console.error('Error loading cart:', cartError);
            // Don't fail auth if cart fails to load
          }
        }
      } catch (error) {
        if (isMounted) {
          setUser(null);
          try {
            await cartStoreRef.current.setUser(null);
          } catch (cartError) {
            console.error('Error clearing cart:', cartError);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - run once on mount

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      try {
        await cartStoreRef.current.setUser(response.user.uid);
      } catch (error) {
        console.error('Error loading cart after login:', error);
      }
    } catch (error) {
      throw error;
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      const response = await authService.signup({ username, email, password });
      setUser(response.user);
      try {
        await cartStoreRef.current.setUser(response.user.uid);
      } catch (error) {
        console.error('Error loading cart after signup:', error);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      try {
        await cartStoreRef.current.setUser(null);
      } catch (error) {
        console.error('Error clearing cart on logout:', error);
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: user !== null,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
