"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Cart from "@/components/Cart";
import { Navbar } from "@/components/Navbar";
import { db } from '@/lib/firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { ProductCard } from '@/components/ProductCard'
import { Loader2 } from "lucide-react"

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  createdAt: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      toast.error("Please login to view products");
      router.push("/login");
    }
  }, [user, authLoading, router]);

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

  if (authLoading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />

      <main className="container mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Products Section */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Shop Our Collection
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Discover premium products carefully curated for you
                </p>
              </div>

              {loading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : products.length === 0 ? (
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
          </div>

          {/* Cart Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <Cart />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
