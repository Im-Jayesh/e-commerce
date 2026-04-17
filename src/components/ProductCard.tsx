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
import { ShoppingCart, Tag } from "lucide-react"
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
    <Card className="flex flex-col h-full transition-all hover:shadow-md min-w-sm min-h-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{product.title}</CardTitle>
          <Badge variant="secondary" className="flex gap-1 items-center">
            <Tag className="w-3 h-3" />
            {product.category}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {product.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-2xl font-bold text-primary">
          ${product.price.toFixed(2)}
        </p>
      </CardContent>

      <CardFooter>
        <Button onClick={handleAddToCart} className={isInCart ? "w-full gap-2 bg-green-500 hover:bg-green-600" : "w-full gap-2"} disabled={isInCart}>
          <ShoppingCart className="w-4 h-4" />
          {isInCart ? "In Cart" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  )
}