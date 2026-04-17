import { apiRequest } from '@/lib/api';

export interface CartProduct {
  id: string;
  title: string;
  price: number;
  description: string;
}

export const cartService = {
  async getCart(): Promise<CartProduct[]> {
    return apiRequest('/api/cart');
  },

  async saveCart(products: CartProduct[]): Promise<void> {
    await apiRequest('/api/cart', { method: 'POST', data: { products } });
  },

  async removeFromCart(productId: string): Promise<void> {
    await apiRequest(`/api/cart/${productId}`, { method: 'DELETE' });
  },
};