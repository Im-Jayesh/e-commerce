'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Ensure this path matches where you saved the filter component
import { OrderFilters } from '@/components/orders/OrderFilters';

interface Order {
  id: string;
  customerName: string;
  total: number;
  status?: string;
  createdAt?: string;
  items?: any[];
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { orders, loading: ordersLoading, updateOrderStatus } = useOrders();
  
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  
  // 1. Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  // 2. Memoized Filtering Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      
      // Admin context: search by customer name. 
      // User context (if reused): search by item titles.
      const searchTarget = user?.role === 'admin' 
        ? (order.customerName  + order.id || '') 
        : (order.items?.map(i => i.title).join(" ") || '');
        
      const matchesSearch = searchTarget.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery, user?.role]);

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: 'pending' | 'processing' | 'completed'
  ) => {
    setUpdatingId(orderId);
    setError('');
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err: any) {
      setError(err.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
          <p className="mt-2 text-gray-600">View and update all customer orders</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* 3. Render Filters above the Table */}
        <OrderFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          isAdmin={user.role === 'admin'}
        />

        <Card>
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="flex justify-center py-8">
                <p className="text-gray-600">Loading orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No orders matching your filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* 4. Map over filteredOrders instead of orders */}
                    {filteredOrders.map((order: Order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">
                          {order.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell className="font-semibold">
                          ${order.total?.toFixed(2)}
                        </TableCell>
                        <TableCell>{order.items?.length || 0} item(s)</TableCell>
                        <TableCell>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'processing'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {order.status || 'pending'}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : '-'}
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            size="sm"
                            variant={order.status === 'processing' ? 'default' : 'outline'}
                            onClick={() => handleStatusUpdate(order.id, 'processing')}
                            disabled={updatingId === order.id}
                          >
                            Process
                          </Button>
                          <Button
                            size="sm"
                            variant={order.status === 'completed' ? 'default' : 'outline'}
                            onClick={() => handleStatusUpdate(order.id, 'completed')}
                            disabled={updatingId === order.id}
                          >
                            Complete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}