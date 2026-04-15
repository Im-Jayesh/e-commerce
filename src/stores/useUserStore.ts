import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface UserData {
  uid: string | null;
  username: string | null;
  email: string | null;
  role: 'user' | 'admin' ; 
}

interface UserActions {
  setUser: (user: UserData) => void;
  removeUser: () => void;
}

type UserStore = UserData & UserActions;

const initialState: UserData = {
  uid: null,
  username: null,
  email: null,
  role: 'user',
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialState,
      
      setUser: (user) => set(() => ({ ...user })),
      
      removeUser: () => set(initialState),
    }),
    {
      name: 'user-auth-storage', 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
