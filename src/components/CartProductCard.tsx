"use client"

import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { useCartStore } from "@/stores/useCartStore"

interface CartProductProps {
  product: {
    id: string;
    title: string;
    price: number;
    description: string;
  };
}

export function CartProductCard({ product }: CartProductProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  
  const isLongDescription = product.description.length > 60;

  return (
    <Card className="mb-3 overflow-hidden border-muted shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          
          {/* Info Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg truncate">{product.title}</h3>
              <p className="font-bold text-primary">${product.price.toFixed(2)}</p>
            </div>

            {/* Description Logic */}
            <div className="mt-1">
              <p className={`text-sm text-muted-foreground ${!isExpanded && "line-clamp-1"}`}>
                {product.description}
              </p>
              
              {isLongDescription && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs text-primary font-medium mt-1 flex items-center gap-0.5 hover:underline"
                >
                  {isExpanded ? (
                    <>Show less <ChevronUp className="w-3 h-3" /></>
                  ) : (
                    <>Read more <ChevronDown className="w-3 h-3" /></>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex flex-col items-center justify-center border-l pl-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => removeFromCart(product.id)}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}