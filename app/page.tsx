import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { StorefrontClient } from "@/components/store/storefront-client";

async function ProductLoader() {
  const { userId } = await auth();

  // Fetch all products and the logged-in user's completed orders in parallel
  const [dbProducts, userOrders] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    }),
    userId
      ? prisma.order.findMany({
          where: {
            clerkUserId: userId,
            status: "COMPLETED",
          },
          select: { productId: true },
        })
      : Promise.resolve([]),
  ]);

  const products = dbProducts.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    price: item.priceUsdt,
    fileUrl: item.fileUrl,
  }));

  const ownedProductIds = userOrders.map((order) => order.productId);

  return (
    <StorefrontClient
      products={products as any}
      ownedProductIds={ownedProductIds}
    />
  );
}

export default function StorefrontPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
      <ProductLoader />
    </Suspense>
  );
}
