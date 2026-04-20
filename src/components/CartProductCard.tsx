"use client"

import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { useCartStore } from "@/stores/useCartStore"

interface CartProductProps {
  product: {
    id: string;
    title?: string;
    name?: string;
    price: number;
    description?: string;
    quantity?: number;
  };
}

export function CartProductCard({ product }: CartProductProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  
  const handleRemove = async () => {
    await removeFromCart(product.id);
  };
  
  const title = product.title || product.name || 'Product';
  const description = product.description || 'No description available';
  const isLongDescription = description.length > 60;

  return (
    <Card className="mb-4 overflow-hidden border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-gray-900 hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          
          {/* Info Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate">{title}</h3>
              <p className="font-bold text-black dark:text-white whitespace-nowrap">${product.price.toFixed(2)}</p>
            </div>

            {/* Description Logic */}
            <div className="mt-2">
              <p className={`text-xs text-slate-600 dark:text-slate-400 ${!isExpanded && "line-clamp-1"}`}>
                {description}
              </p>
              
              {isLongDescription && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1.5 flex items-center gap-0.5 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
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
          <div className="flex flex-col items-center justify-center">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              onClick={handleRemove}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}