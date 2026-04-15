"use client"

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { useUserStore } from '@/stores/useUserStore'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface OrderItem {
  id: string;
  title: string;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed';
  createdAt: any;
}

export default function Orders() {
  const { uid, role } = useUserStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    // 1. Logic: Admin sees all, User sees only theirs
    const ordersRef = collection(db, "orders");
    const q = role === 'admin' 
      ? query(ordersRef, orderBy("createdAt", "desc"))
      : query(ordersRef, where("userId", "==", uid), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid, role]);

  const markAsCompleted = async (orderId: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: 'completed' });
      toast.success("Order marked as completed!");
    } catch (error) {
      toast.error("Failed to update order status.");
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            {role === 'admin' && <TableHead>Customer</TableHead>}
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={role === 'admin' ? 6 : 5} className="text-center py-10 text-muted-foreground">
                No orders found.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                {role === 'admin' && <TableCell>{order.customerName || 'Guest'}</TableCell>}
                <TableCell>
                  <span className="text-xs">
                    {order.items?.map(i => i.title).join(", ")}
                  </span>
                </TableCell>
                <TableCell className="font-medium">${order.total?.toFixed(2)}</TableCell>
                <TableCell>
                  {order.status === 'completed' ? (
                    <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200">
                      <Clock className="w-3 h-3 mr-1" /> Pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {role === 'admin' && order.status === 'pending' ? (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => markAsCompleted(order.id)}
                    >
                      Complete
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
                      {order.status === 'completed' ? 'Processed' : 'Awaiting admin'}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}