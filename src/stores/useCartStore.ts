import { create } from 'zustand';
import { cartService, CartProduct } from '@/services/cart';

interface CartState {
  products: CartProduct[];
  userId: string | null;
  loading: boolean;
}

interface CartActions {
  addToCart: (product: CartProduct) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => void;
  setUser: (userId: string | null) => Promise<void>;
  loadCart: () => Promise<void>;
  saveCart: () => Promise<void>;
}

type CartStore = CartState & CartActions;

const initialState = {
  products: [],
  userId: null,
  loading: false,
};

export const useCartStore = create<CartStore>((set, get) => ({
  ...initialState,
  
  addToCart: async (product) => {
    const { products, userId } = get();
    if (products.some((p) => p.id === product.id)) {
      return;
    }
    const newProducts = [...products, product];
    set({ products: newProducts });
    if (userId) {
      await cartService.saveCart(newProducts);
    }
  },
  
  removeFromCart: async (productId) => {
    const { products, userId } = get();
    const newProducts = products.filter((p) => p.id !== productId);
    set({ products: newProducts });
    if (userId) {
      await cartService.saveCart(newProducts);
    }
  },
  
  clearCart: () => set(initialState),
  
  setUser: async (userId) => {
    set({ userId });
    if (userId) {
      await get().loadCart();
    } else {
      set({ products: [] });
    }
  },
  
  loadCart: async () => {
    const { userId } = get();
    if (!userId) return;
    
    set({ loading: true });
    try {
      const products = await cartService.getCart();
      set({ products });
    } catch (error) {
      console.error('Failed to load cart:', error);
      set({ products: [] });
    } finally {
      set({ loading: false });
    }
  },
  
  saveCart: async () => {
    const { products, userId } = get();
    if (!userId) return;
    
    try {
      await cartService.saveCart(products);
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  },
}));
