import { apiRequest } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/endpoints';

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
    return apiRequest(API_ENDPOINTS.ORDERS.GET_ALL);
  },

  async create(data: CreateOrderInput): Promise<Order> {
    return apiRequest(API_ENDPOINTS.ORDERS.CREATE, { method: 'POST', data });
  },

  async updateStatus(id: string, status: 'pending' | 'processing' | 'completed'): Promise<Order> {
    return apiRequest(API_ENDPOINTS.ORDERS.UPDATE(id), { method: 'PATCH', data: { status } });
  },
};
