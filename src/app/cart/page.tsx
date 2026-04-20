"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Cart from "@/components/Cart";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      toast.error("Please login to view cart");
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />

      <main className="container mx-auto max-w-5xl px-4 md:px-6 py-8 md:py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-slate-900 dark:text-white" />
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                Shopping Cart
              </h1>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Review your items and proceed to checkout
            </p>
          </div>

          {/* Cart Component */}
          <div className="relative">
            <Cart />
          </div>

          {/* Back Button */}
          <div className="pt-4">
            <Button 
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
