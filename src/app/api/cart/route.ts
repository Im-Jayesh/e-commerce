import { NextRequest, NextResponse } from 'next/server';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getUserFromRequest } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cartRef = collection(db, 'carts');
    const q = query(cartRef, where('userId', '==', user.uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json([]);
    }

    const cartDoc = snapshot.docs[0];
    const cartData = cartDoc.data();

    return NextResponse.json(cartData.products || []);
  } catch (error: any) {
    console.error('Get cart error:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { products } = await request.json();

    if (!Array.isArray(products)) {
      return NextResponse.json({ error: 'Invalid products data' }, { status: 400 });
    }

    const cartRef = collection(db, 'carts');
    const q = query(cartRef, where('userId', '==', user.uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Create new cart
      await addDoc(cartRef, {
        userId: user.uid,
        products,
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Update existing cart
      const cartDoc = snapshot.docs[0];
      await setDoc(cartDoc.ref, {
        userId: user.uid,
        products,
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Save cart error:', error);
    return NextResponse.json({ error: 'Failed to save cart' }, { status: 500 });
  }
}