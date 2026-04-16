import { NextRequest, NextResponse } from 'next/server';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getUserFromRequest } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ordersRef = collection(db, 'orders');
    let q;

    // NOTE: You must create a composite index in the Firebase Console for:
    // Collection: orders | Fields: userId (Asc), createdAt (Desc)
    if (user.role === 'admin') {
      q = query(ordersRef, orderBy('createdAt', 'desc'));
    } else {
      q = query(
        ordersRef,
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
    }

    const snapshot = await getDocs(q);
    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Format timestamps for the frontend
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
    }));

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Get orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items, subtotal, total } = await request.json();

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const newOrder = {
      userId: user.uid,
      customerName: user.username || 'Anonymous',
      items,
      subtotal: Number(subtotal) || 0,
      total: Number(total) || 0,
      status: 'pending',
      createdAt: serverTimestamp(), // Use server time for accuracy
    };

    const docRef = await addDoc(collection(db, 'orders'), newOrder);

    return NextResponse.json({
      id: docRef.id,
      ...newOrder,
      createdAt: new Date().toISOString(), // Fallback for immediate UI update
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}