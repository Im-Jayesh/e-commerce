import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface UserData {
  uid: string | null;
  username: string | null;
  email: string | null;
  role: 'user' | 'admin';
  isAuthLoading: boolean; // Add this
}

interface UserActions {
  setUser: (user: Omit<UserData, 'isAuthLoading'>) => void;
  removeUser: () => void;
  setAuthLoading: (loading: boolean) => void;
}

type UserStore = UserData & UserActions;

const initialState: Omit<UserData, 'isAuthLoading'> = {
  uid: null,
  username: null,
  email: null,
  role: 'user',
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialState,
      isAuthLoading: true, // Start as true

      setUser: (user) => set({ ...user, isAuthLoading: false }),
      
      removeUser: () => set({ ...initialState, isAuthLoading: false }),

      setAuthLoading: (loading) => set({ isAuthLoading: loading }),
    }),
    {
      name: 'user-auth-storage',
      storage: createJSONStorage(() => localStorage),
      // It sets isAuthLoading to false ONLY AFTER storage is loaded
      onRehydrateStorage: () => (state) => {
        state?.setAuthLoading(false);
      },
    }
  )
);