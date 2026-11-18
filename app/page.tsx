"use client";

import { useState } from "react";
import { PRODUCTS, Product } from "@/lib/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/store/navbar";
import { ProductCard } from "@/components/store/product-card";
import { CheckoutDialog } from "@/components/store/checkout-dialog";

const CATEGORIES = ["All", "Wallpapers", "Presets", "Audio", "UI Kits"];

export default function StorefrontPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const filteredProducts =
    selectedCategory === "All"
      ? PRODUCTS
      : PRODUCTS.filter((item) => item.category === selectedCategory);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
        <section className="mb-12 max-w-2xl">
          <Badge
            variant="outline"
            className="mb-4 border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          >
            Instant USDT (TRC20) Delivery
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Curated dark-mode assets &amp; studio tools.
          </h1>
          <p className="mt-3 text-base text-zinc-400">
            Pay seamlessly with crypto and get immediate access to your digital files,
            license details, and step-by-step setup modules.
          </p>
        </section>

        <section aria-label="Product Categories" className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              size="sm"
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
                  : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              }
            >
              {category}
            </Button>
          ))}
        </section>

        <section aria-label="Digital Products" className="grid gap-6 sm:grid-cols-2">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setActiveProduct}
            />
          ))}
        </section>
      </main>

      <CheckoutDialog
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
      />

      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-500">
        Obsidian Studio &bull; Built with Next.js, Tailwind CSS &amp; shadcn/ui
      </footer>
    </div>
  );
}
