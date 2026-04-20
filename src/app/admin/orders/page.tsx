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
import { Card } from '@/components/ui/card';
import { OrderFilters } from '@/components/orders/OrderFilters';
import { ProductFormModal } from '@/components/ProductFormModal';
import { Plus } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

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
  const [showProductForm, setShowProductForm] = useState(false);
  
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

  // Calculate total sales
  const totalSales = useMemo(() => {
    return orders.reduce((sum, order) => sum + (order.total || 0), 0);
  }, [orders]);

  // Calculate real sales data by date from orders
  const salesData = useMemo(() => {
    if (!orders || orders.length === 0) {
      return [
        { date: 'Today', amount: 0 },
        { date: 'Yesterday', amount: 0 },
        { date: '3 days ago', amount: 0 },
        { date: '1 week ago', amount: 0 },
      ];
    }

    const now = new Date();
    const dateRanges = [
      { 
        label: 'Today', 
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      },
      {
        label: 'Yesterday',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate())
      },
      {
        label: '3 days ago',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2)
      },
      {
        label: '1 week ago',
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
      }
    ];

    return dateRanges.map(range => {
      const amount = orders
        .filter(order => {
          if (!order.createdAt) return false;
          const orderDate = new Date(order.createdAt);
          return orderDate >= range.start && orderDate < range.end;
        })
        .reduce((sum, order) => sum + (order.total || 0), 0);
      
      return { date: range.label, amount };
    });
  }, [orders]);

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
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
        <p className="text-lg text-slate-600 dark:text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />

      <main className="container mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-12">
        <div className="space-y-8">
          {/* Header with Add Product Button */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
                Manage orders, products, and view sales analytics
              </p>
            </div>
            <Button 
              size="lg"
              className="gap-2 shadow-md hover:shadow-lg transition-shadow bg-slate-900 hover:bg-black dark:bg-white dark:text-black dark:hover:bg-slate-100"
              onClick={() => setShowProductForm(true)}
            >
              <Plus className="w-5 h-5" />
              Add Product
            </Button>
          </div>

          {/* Product Form Modal */}
          <ProductFormModal 
            isOpen={showProductForm} 
            onClose={() => setShowProductForm(false)} 
          />

          
          

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 text-sm font-medium backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* Filters */}
          <div className="rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900 p-6 backdrop-blur-sm">
            <OrderFilters 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              isAdmin={user.role === 'admin'}
            />
          </div>

          {/* Orders Table Card */}
          <Card className="overflow-hidden border-0 shadow-lg bg-white dark:bg-slate-900">
            {ordersLoading ? (
              <div className="flex justify-center py-12">
                <p className="text-slate-600 dark:text-slate-400">Loading orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-16 px-6">
                <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">No orders matching your filters</p>
                <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300 py-4">Order ID</TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300 py-4">Customer</TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300 py-4">Total</TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300 py-4">Items</TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300 py-4">Status</TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300 py-4">Date</TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300 py-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order: Order) => (
                      <TableRow key={order.id} className="border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <TableCell className="font-mono text-sm text-slate-600 dark:text-slate-400 py-4">
                          {order.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell className="text-sm text-slate-900 dark:text-white font-medium">{order.customerName}</TableCell>
                        <TableCell className="font-bold text-slate-900 dark:text-white py-4">
                          ${order.total?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600 dark:text-slate-400">{order.items?.length || 0}</TableCell>
                        <TableCell className="py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                              order.status === 'completed'
                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                                : order.status === 'processing'
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                            }`}
                          >
                            {order.status || 'pending'}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600 dark:text-slate-400 py-4">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })
                            : '-'}
                        </TableCell>
                        <TableCell className="flex gap-2 py-4">
                          <Button
                            size="sm"
                            variant={order.status === 'processing' ? 'default' : 'outline'}
                            onClick={() => handleStatusUpdate(order.id, 'processing')}
                            disabled={updatingId === order.id}
                            className="text-xs"
                          >
                            Process
                          </Button>
                          <Button
                            size="sm"
                            variant={order.status === 'completed' ? 'default' : 'outline'}
                            onClick={() => handleStatusUpdate(order.id, 'completed')}
                            disabled={updatingId === order.id}
                            className="text-xs"
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
          </Card>
        </div>
      </main>
    </div>
  );
}