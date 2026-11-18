import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/store/navbar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

async function OrdersList() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const orders = await prisma.order.findMany({
    where: { clerkUserId: userId },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800/80 bg-zinc-900/40 px-4 py-12 text-center sm:px-6">
        <Badge
          variant="outline"
          className="mb-4 border-zinc-800 bg-zinc-900 text-zinc-400"
        >
          No Purchases Yet
        </Badge>
        <h2 className="text-xl font-semibold text-zinc-100">
          Your digital library is empty
        </h2>
        <p className="mt-3 max-w-md text-sm text-zinc-400">
          Once you purchase a wallpaper pack, preset, or sound kit with USDT, your instant download links will appear here.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className={cn(
              buttonVariants({ size: "default" }),
              "bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
            )}
          >
            Browse Storefront
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex flex-col justify-between gap-4 rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-6 transition hover:border-zinc-700 sm:flex-row sm:items-center"
        >
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              >
                {order.status}
              </Badge>
              <span className="text-xs font-medium text-zinc-400">
                {order.product.category} &bull; {order.product.priceUsdt} USDT
              </span>
              <span className="text-xs text-zinc-500">
                &bull; {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h2 className="text-lg font-semibold text-zinc-100">
              {order.product.title}
            </h2>

            {order.txHash && (
              <p className="font-mono text-xs text-zinc-500">
                TXID: <span className="text-zinc-400">{order.txHash}</span>
              </p>
            )}
          </div>

          <a
            href={order.product.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "default" }),
              "shrink-0 bg-emerald-500 font-semibold text-zinc-950 hover:bg-emerald-400"
            )}
          >
            Download Assets
          </a>
        </div>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-zinc-900 pb-6 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-50">
              My Orders
            </h1>
            <p className="mt-1.5 text-sm text-zinc-400">
              Access your purchased dark-mode assets, receipts, and download links.
            </p>
          </div>

          <Link
            href="/"
            className="text-xs font-medium text-zinc-400 transition hover:text-zinc-100"
          >
            &larr; Back to Storefront
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-4 py-12 text-center text-sm text-zinc-500">
              Loading your orders...
            </div>
          }
        >
          <OrdersList />
        </Suspense>
      </main>

      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-500">
        Obsidian Studio &bull; Built with Next.js, Tailwind CSS &amp; shadcn/ui
      </footer>
    </div>
  );
}
