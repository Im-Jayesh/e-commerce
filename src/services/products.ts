import { apiRequest } from '@/lib/api';

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  createdAt: string;
}

export interface CreateProductInput {
  title: string;
  description: string;
  category: string;
  price: number;
}

export const productsService = {
  async getAll(): Promise<Product[]> {
    return apiRequest('/api/products');
  },

  async create(data: CreateProductInput): Promise<Product> {
    return apiRequest('/api/products', { method: 'POST', data });
  },
};
