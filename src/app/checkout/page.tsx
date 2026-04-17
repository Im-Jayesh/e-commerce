

"use client"

import React, { useEffect, useState } from 'react'
import { useCartStore } from '@/stores/useCartStore'
import { useAuth } from '@/contexts/AuthContext'
import { CartProductCard } from '@/components/CartProductCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { CreditCard, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
  const { products, removeFromCart } = useCartStore();
  const { user, loading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || loading) return;

    if (!user) {
      toast.error("Please login to checkout");
      router.push('/login');
    } else if (products.length === 0) {
      toast.error("Your cart is empty");
      router.push('/dashboard');
    }
  }, [user, mounted, loading, products.length, router]);

  if (!mounted) {
    return null;
  }

  if (!user || products.length === 0) {
    return null;
  }
      
  // Calculations
  const subtotal = products.reduce((acc, curr) => acc + curr.price, 0);
  const discountPercent = 0; // Hardcoded as requested
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = subtotal - discountAmount;

  const handleCheckout = async () => {
    if (products.length === 0) return toast.error("Your cart is empty");
    
    setIsProcessing(true);
    try {
      // Create order document
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        customerName: user.username,
        items: products,
        subtotal: subtotal,
        total: total,
        createdAt: serverTimestamp(),
        status: 'pending'
      });

      toast.success("Order placed successfully!");
      clearCart();
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error("Checkout failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* 1. List of Products */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Your Items</h2>
          {products.length === 0 ? (
            <div className="p-10 border rounded-xl text-center bg-muted/20">
              <p>Your cart is empty.</p>
            </div>
          ) : (
            products.map((product) => (
              <CartProductCard 
                key={product.id} 
                product={product} 
              />
            ))
          )}
        </div>

        {/* 2. Billing Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-xl p-6 bg-card shadow-sm sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Discount ({discountPercent}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              className="w-full mt-6 gap-2" 
              size="lg" 
              disabled={isProcessing || products.length === 0}
              onClick={handleCheckout}
            >
              <CreditCard className="w-4 h-4" />
              {isProcessing ? "Processing..." : "Complete Purchase"}
            </Button>
            
            <p className="text-[10px] text-center text-muted-foreground mt-4">
              By clicking complete purchase, you agree to our terms of service.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}