"use client"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Tag, Check, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/stores/useCartStore"

interface ProductProps {
  product: {
    id: string;
    title: string;
    description: string;
    category: string;
    price: number;
  }
}

export function ProductCard({ product }: ProductProps) {
    const addToCart = useCartStore((state) => state.addToCart);
  const handleAddToCart = async () => {
    await addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      description: product.description
    });
  };

  const productsInCart = useCartStore((state) => state.products);
  const isInCart = productsInCart.some((p) => p.id === product.id);

  return (
    <Card className="group relative flex flex-col h-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-xl">
      {/* Image Area */}
      <div className="relative h-48 bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-lg">
            <ShoppingCart className="w-10 h-10 text-slate-400 dark:text-slate-500" />
          </div>
        </div>
      </div>

      {/* Badge */}
      <div className="absolute top-3 right-3">
        <Badge className="flex gap-1 items-center whitespace-nowrap bg-black dark:bg-white text-white dark:text-black shadow-lg">
          <Tag className="w-3 h-3" />
          <span className="text-xs font-semibold">{product.category}</span>
        </Badge>
      </div>

      {/* Content */}
      <CardHeader className="space-y-2 pb-2 flex-1">
        <CardTitle className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-slate-700 dark:group-hover:text-slate-100 transition-colors">
          {product.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
          {product.description}
        </CardDescription>
      </CardHeader>
      
      {/* Price */}
      <CardContent className="pb-3">
        <div className="space-y-1">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">✓ Free shipping on orders $50+</p>
        </div>
      </CardContent>

      {/* Button */}
      <CardFooter className="pt-0">
        <Button 
          onClick={handleAddToCart}
          className={`w-full h-10 font-semibold transition-all duration-300 flex items-center justify-center gap-2 rounded-lg ${
            isInCart 
              ? "bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-black dark:hover:bg-slate-100" 
              : "bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-slate-100"
          }`}
          disabled={isInCart}
        >
          {isInCart ? (
            <>
              <Check className="w-4 h-4" />
              <span>In Cart</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}