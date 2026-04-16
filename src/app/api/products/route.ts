import { NextRequest, NextResponse } from 'next/server';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getUserFromRequest } from '@/lib/auth-utils';

export async function GET() {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - admin access required' },
        { status: 403 }
      );
    }

    const { title, description, category, price } = await request.json();

    if (!title || !description || !category || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, category, price' },
        { status: 400 }
      );
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json(
        { error: 'Price must be a valid number greater than 0' },
        { status: 400 }
      );
    }

    const newProduct = {
      title,
      description,
      category,
      price: parsedPrice,
      createdAt: new Date().toISOString(),
      createdBy: user.uid,
    };

    const docRef = await addDoc(collection(db, 'products'), newProduct);

    return NextResponse.json({
      id: docRef.id,
      ...newProduct,
    });
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
