import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, getDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getUserFromRequest } from '@/lib/auth-utils';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const orderRef = doc(db, 'orders', id);
    const orderSnapshot = await getDoc(orderRef);

    if (!orderSnapshot.exists()) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const orderData = orderSnapshot.data();

    // Authorization check
    if (user.role !== 'admin' && orderData.userId !== user.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await updateDoc(orderRef, { 
      status, 
      updatedAt: serverTimestamp() 
    });

    return NextResponse.json({ id, ...orderData, status });
  } catch (error: any) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request);
    
    // Only admins should delete orders
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const orderRef = doc(db, 'orders', id);
    const orderSnapshot = await getDoc(orderRef);

    if (!orderSnapshot.exists()) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    await deleteDoc(orderRef);

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error: any) {
    console.error('Delete order error:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}