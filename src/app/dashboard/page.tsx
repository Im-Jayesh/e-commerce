"use client";

import { useAuth } from "@/contexts/AuthContext";
import LogoutBtn from "@/components/LogoutBtn";
import ProductForm from "@/components/ProductForm";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Plus, PackageSearch, Store, ClipboardList } from "lucide-react"; 
import { useRouter } from "next/navigation";
import { toast } from 'sonner'
import Link from "next/link";

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    useEffect(() => {
      if (!mounted || loading) return;

      if (!user) {
        toast.error("Please login to access the dashboard");
        router.push('/login');
      } 
    }, [user, router, mounted, loading]);

    if (!mounted) {
      return null;
    }

    if (!user) {
      return null;
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="container flex h-16 items-center justify-between mx-auto px-4 max-w-7xl">
                    <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
                        <PackageSearch className="w-8 h-8 text-primary" />
                        <span>Shop.</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <span className="text-sm font-medium text-muted-foreground hidden md:inline-block">
                            Logged in as <span className="text-foreground font-semibold">{user.username}</span>
                        </span>
                        
                        {user.role === 'admin' && (
                            <Button 
                                variant={showForm ? "destructive" : "default"} 
                                size="sm"
                                className="shadow-sm"
                                onClick={() => setShowForm(!showForm)}
                            >
                                {showForm ? "Close Form" : <><Plus className="w-4 h-4 mr-2" /> Add Product</>}
                            </Button>
                        )}
                        
                        <LogoutBtn />
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 md:p-8 max-w-7xl">
                {showForm && user.role === 'admin' && (
                    <div className="flex justify-center mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="w-full max-w-2xl">
                            <ProductForm />
                        </div>
                    </div>
                )}

                <div className="space-y-8">
                  <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link href="/products"
                      className="border rounded-lg p-6 bg-card hover:shadow-lg transition-all hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Store className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-semibold">Shop</h2>
                      </div>
                      <p className="text-muted-foreground">Browse and purchase products</p>
                    </Link>

                    <Link href="/orders"
                      className="border rounded-lg p-6 bg-card hover:shadow-lg transition-all hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <ClipboardList className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-semibold">Orders</h2>
                      </div>
                      <p className="text-muted-foreground">View your purchase history</p>
                    </Link>
                  </div>
                </div>
            </main>
        </div>
    );
}