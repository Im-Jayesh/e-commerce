"use client";

"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Store, ClipboardList, Zap, ShoppingBag, ArrowRight } from "lucide-react"; 
import { useRouter } from "next/navigation";
import { toast } from 'sonner'
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
      if (loading) return;

      if (!user) {
        toast.error("Please login to access the dashboard");
        router.push('/login');
      } 
    }, [user, router, loading]);

    // Show loading state while checking auth
    if (loading) {
      return null;
    }

    if (!user) {
      return null;
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <Navbar />

            <main className="container mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-12">
                <div className="space-y-16">
                    {/* Hero Section */}
                    <div className="text-center space-y-6">
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Welcome back, {user.username}
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Your command center for shopping and managing orders
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link href="/products" 
                          className="group p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 hover:shadow-lg"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <Store className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                <span className="font-semibold text-slate-900 dark:text-white">Shop</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Browse products</p>
                        </Link>

                        <Link href="/orders" 
                          className="group p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 hover:shadow-lg"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <ClipboardList className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                <span className="font-semibold text-slate-900 dark:text-white">Orders</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Track purchases</p>
                        </Link>

                        <Link href="/cart" 
                          className="group p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 hover:shadow-lg"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <ShoppingBag className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                <span className="font-semibold text-slate-900 dark:text-white">Cart</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">View cart</p>
                        </Link>

                        {user.role === 'admin' && (
                            <Link href="/admin/orders" 
                              className="group p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 hover:shadow-lg"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <Zap className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                    <span className="font-semibold text-slate-900 dark:text-white">Admin</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Manage store</p>
                            </Link>
                        )}
                    </div>

                    {/* Featured Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Shop Section */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Start Shopping</h2>
                            <Link href="/products"
                              className="block group relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 p-8 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                            >
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm">
                                            <Store className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Explore Products</h3>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                                        Discover our curated collection of high-quality products
                                    </p>
                                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                                        Browse Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-linear-to-br from-transparent to-white/10 dark:to-white/5" />
                            </Link>
                        </div>

                        {/* Orders Section */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Orders</h2>
                            <Link href="/orders"
                              className="block group relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 p-8 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                            >
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm">
                                            <ClipboardList className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Order History</h3>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                                        Track your purchases and order status in real-time
                                    </p>
                                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                                        View Orders <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-linear-to-br from-transparent to-white/10 dark:to-white/5" />
                            </Link>
                        </div>
                    </div>

                    {/* Admin Section */}
                    {user.role === 'admin' && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Store Management</h2>
                            <Link href="/admin/orders"
                              className="block group relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900 to-slate-800 dark:from-slate-700 dark:to-slate-600 p-8 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                            >
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm">
                                            <Zap className="w-6 h-6 text-white dark:text-slate-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-white">Admin Dashboard</h3>
                                    </div>
                                    <p className="text-slate-300 mb-4">
                                        Manage orders, add products, and view sales analytics
                                    </p>
                                    <div className="flex items-center gap-2 text-slate-200 font-medium">
                                        Access Admin <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-linear-to-br from-transparent to-black/10" />
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}