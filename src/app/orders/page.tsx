"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Orders from "@/components/Orders";
import { Navbar } from "@/components/Navbar";

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      toast.error("Please login to view orders");
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

      <main className="container mx-auto p-4 md:p-8 max-w-7xl">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Purchase History</h1>
          <Orders />
        </div>
      </main>
    </div>
  );
}
