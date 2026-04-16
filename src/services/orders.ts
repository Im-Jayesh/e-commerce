import { apiClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api';

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  description: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed';
  createdAt: string;
}

export interface CreateOrderInput {
  items: OrderItem[];
  subtotal: number;
  total: number;
}

export const ordersService = {
  async getAll(): Promise<Order[]> {
    const response = await apiClient.get(API_ENDPOINTS.ORDERS.GET_ALL);
    return response.data;
  },

  async create(data: CreateOrderInput): Promise<Order> {
    const response = await apiClient.post(API_ENDPOINTS.ORDERS.CREATE, data);
    return response.data;
  },

  async updateStatus(id: string, status: 'pending' | 'processing' | 'completed'): Promise<Order> {
    const response = await apiClient.patch(API_ENDPOINTS.ORDERS.UPDATE(id), { status });
    return response.data;
  },
};
