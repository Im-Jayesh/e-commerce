"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Orders from "@/components/Orders";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || loading) return;
    
    if (!user) {
      toast.error("Please login to view orders");
      router.push("/login");
    }
  }, [user, mounted, loading, router]);

  if (!mounted) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-16 items-center mx-auto px-4 max-w-7xl">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 max-w-7xl">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Purchase History</h1>
          <Orders />
        </div>
      </main>
    </div>
  );
}
