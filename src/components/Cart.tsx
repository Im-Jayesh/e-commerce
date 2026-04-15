"use client";

import { useCartStore } from "@/stores/useCartStore";
import { CartProductCard } from "./CartProductCard";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { ShoppingBag, CreditCard } from "lucide-react";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

export default function Cart() {
    const products = useCartStore((state) => state.products);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const router = useRouter();

    const subtotal = products.reduce((acc, product) => acc + product.price, 0);

    return (
        <Card className="flex flex-col h-[calc(100vh-12rem)] sticky top-24 border-muted-foreground/20 shadow-lg">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    Your Cart
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden p-0">
                {products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">Your cart is empty</p>
                    </div>
                ) : (
                    <ScrollArea className="h-full px-6">
                        <div className="space-y-4 py-2">
                            {products.map((product) => (
                                <CartProductCard 
                                    key={product.id} 
                                    product={product} 
                                />
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>

            {products.length > 0 && (
                <CardFooter className="flex flex-col gap-4 p-6 border-t bg-muted/30">
                    <div className="w-full space-y-1.5">
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span>Total</span>
                            <span className="text-primary">${subtotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <Button 
                        className="w-full h-11 text-base font-semibold shadow-sm transition-all hover:translate-y-[-1px]" 
                        onClick={() => router.push("/checkout")}
                    >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Checkout
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}