"use client"
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { ProductCard } from './ProductCard'
import { Loader2 } from "lucide-react"

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  createdAt: string;
}

export default function ProductsListing() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Reference the collection
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));

    // 2. Listen for real-time updates (best for UX)
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items: Product[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h2 className="mb-8 text-3xl font-bold tracking-tight">Available Products</h2>
      
      {products.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No products found. Start by adding some!
        </div>
      ) : (
        <div className="flex flex-wrap -mx-4 flex-row gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}