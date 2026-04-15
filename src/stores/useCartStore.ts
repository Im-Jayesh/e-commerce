import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartState {
  products: Array<{ id: string; title: string; price: number , description: string}>;
}

interface CartActions {
  addToCart: (product: { id: string; title: string; price: number , description: string}) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

type CartStore = CartState & CartActions;

const initialState = {
  products : []
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      ...initialState,
      
      addToCart: (product) => set((state) => {
        const isAlreadyInCart = state.products.some((p) => p.id === product.id);
        if (isAlreadyInCart) {
          return state; // No duplicates allowed, return current state
        }
        return { ...state, products: [...state.products, product] };
    }),
      
      removeFromCart: (productId) => set((state) => ({ ...state, products: state.products.filter((p) => p.id !== productId) })),
      clearCart: () => set((state) => ({ ...state, products: [] })),
    }),

    {
      name: 'cart-storage', 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
