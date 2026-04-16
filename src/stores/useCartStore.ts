import { create } from 'zustand';

interface CartState {
  products: Array<{ id: string; title: string; price: number; description: string }>;
}

interface CartActions {
  addToCart: (product: { id: string; title: string; price: number; description: string }) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

type CartStore = CartState & CartActions;

const initialState = {
  products: []
};

export const useCartStore = create<CartStore>((set) => ({
  ...initialState,
  
  addToCart: (product) => set((state) => {
    const isAlreadyInCart = state.products.some((p) => p.id === product.id);
    if (isAlreadyInCart) {
      return state;
    }
    return { ...state, products: [...state.products, product] };
  }),
  
  removeFromCart: (productId) => set((state) => ({
    ...state,
    products: state.products.filter((p) => p.id !== productId)
  })),
  
  clearCart: () => set(initialState),
}));
