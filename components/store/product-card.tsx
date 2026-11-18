import { Product } from "@/lib/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wallet } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <Card className="flex flex-col justify-between border-zinc-800 bg-zinc-900/40 transition-colors hover:border-zinc-700">
      <CardHeader>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            {product.category}
          </span>
          {product.badge && (
            <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
              {product.badge}
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl text-zinc-100">{product.title}</CardTitle>
        <CardDescription className="pt-1.5 text-sm leading-relaxed text-zinc-400">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardFooter className="flex items-center justify-between border-t border-zinc-800/60 pt-4">
        <div>
          <span className="text-lg font-semibold text-zinc-100">
            {product.priceUsdt} USDT
          </span>
          <span className="ml-1.5 text-xs text-zinc-500">TRC20</span>
        </div>
        <Button
          onClick={() => onSelect(product)}
          className="bg-emerald-500 font-medium text-zinc-950 hover:bg-emerald-400"
        >
          <Wallet className="mr-2 h-4 w-4" />
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
}
