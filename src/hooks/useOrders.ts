'use client';

import { useEffect, useState } from 'react';
import { ordersService, Order, CreateOrderInput } from '@/services/orders';

export interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createOrder: (data: CreateOrderInput) => Promise<Order>;
  updateOrderStatus: (id: string, status: 'pending' | 'processing' | 'completed') => Promise<void>;
}

export function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordersService.getAll();
      console.log("Fetched orders:", data);
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const createOrder = async (data: CreateOrderInput): Promise<Order> => {
    const newOrder = await ordersService.create(data);
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = async (id: string, status: 'pending' | 'processing' | 'completed') => {
    await ordersService.updateStatus(id, status);
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );
  };

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    createOrder,
    updateOrderStatus,
  };
}
