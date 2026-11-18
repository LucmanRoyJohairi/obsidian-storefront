import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { StorefrontClient } from "@/components/store/storefront-client";

async function ProductLoader() {
  const dbProducts = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const products = dbProducts.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    price: item.priceUsdt,
    fileUrl: item.fileUrl,
  }));

  return <StorefrontClient products={products as any} />;
}

export default function StorefrontPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
      <ProductLoader />
    </Suspense>
  );
}
