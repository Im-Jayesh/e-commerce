"use client";

import { useUserStore } from "@/stores/useUserStore";
import LogoutBtn from "@/components/LogoutBtn";
import ProductForm from "@/components/ProductForm";
import ProductsListing from "@/components/Products";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus, PackageSearch, Store, ClipboardList } from "lucide-react"; 
import Cart from "@/components/Cart";
import Orders from "@/components/Orders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();
    const uid = useUserStore((state) => state.uid);
    const username = useUserStore((state) => state.username);
    const role = useUserStore((state) => state.role);
    const [showForm, setShowForm] = useState(false);

    if (!uid) {
        router.push('/login');
        return null;
    }


    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between mx-auto px-4 max-w-7xl">
                    <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
                        <PackageSearch className="w-8 h-8 text-primary" />
                        <span>Shop.</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <span className="text-sm font-medium text-muted-foreground hidden md:inline-block">
                            Logged in as <span className="text-foreground font-semibold">{username}</span>
                        </span>
                        
                        {role === 'admin' && (
                            <Button 
                                variant={showForm ? "destructive" : "default"} 
                                size="sm"
                                className="shadow-sm"
                                onClick={() => setShowForm(!showForm)}
                            >
                                {showForm ? "Close Form" : <><Plus className="w-4 h-4 mr-2" /> List Product</>}
                            </Button>
                        )}
                        
                        <LogoutBtn />
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 md:p-8 max-w-7xl">
                {showForm && role === 'admin' && (
                    <div className="flex justify-center mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="w-full max-w-2xl">
                            <ProductForm />
                        </div>
                    </div>
                )}

                <Tabs defaultValue="shop" className="w-full space-y-8">
                    <div className="flex items-center justify-between">
                        <TabsList className="grid w-[400px] grid-cols-2 shadow-sm border">
                            <TabsTrigger value="shop" className="gap-2">
                                <Store className="w-4 h-4" /> Shop
                            </TabsTrigger>
                            <TabsTrigger value="orders" className="gap-2">
                                <ClipboardList className="w-4 h-4" /> Orders
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="shop" className="space-y-8 animate-in fade-in duration-300">
                        <div className="flex flex-col lg:flex-row gap-10">
                            <div className="flex-1 order-2 lg:order-1">
                                <ProductsListing />
                            </div>
                            
                            <aside className="w-full lg:w-[380px] order-1 lg:order-2">
                                <div className="sticky top-24">
                                    <Cart />
                                </div>
                            </aside>
                        </div>
                    </TabsContent>

                    <TabsContent value="orders" className="animate-in fade-in duration-300">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight">Purchase History</h2>
                            <Orders />
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}