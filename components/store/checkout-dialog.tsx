"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/products";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Copy, Download, Lock, ShieldCheck } from "lucide-react";

const DEMO_TRC20_ADDRESS = "TX8k9vP2mQ7nL4wR9jB5cH3xY6zF1aE8dK";

interface CheckoutDialogProps {
  product: Product | null;
  onClose: () => void;
}

export function CheckoutDialog({ product, onClose }: CheckoutDialogProps) {
  const [paymentStatus, setPaymentStatus] = useState<"awaiting" | "confirmed">("awaiting");
  const [copied, setCopied] = useState(false);

  // Reset modal state whenever a new product is opened
  useEffect(() => {
    if (product) {
      setPaymentStatus("awaiting");
      setCopied(false);
    }
  }, [product]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(DEMO_TRC20_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100 sm:max-w-md">
        {product && paymentStatus === "awaiting" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <Lock className="h-4 w-4 text-emerald-400" />
                Checkout — {product.title}
              </DialogTitle>
              <DialogDescription className="text-zinc-400">
                Send the exact USDT amount over the TRON (TRC20) network to unlock your
                digital download immediately.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/80 p-3.5">
                <span className="text-sm text-zinc-400">Amount Due</span>
                <span className="text-lg font-bold text-emerald-400">
                  {product.priceUsdt}.00 USDT
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">
                  Deposit Wallet Address (TRC20 Network Only)
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 truncate rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200">
                    {DEMO_TRC20_ADDRESS}
                  </code>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleCopyAddress}
                    className="shrink-0 border-zinc-700 bg-zinc-900 hover:bg-zinc-800"
                  >
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4 text-zinc-300" />
                    )}
                  </Button>
                </div>
              </div>

              <Separator className="bg-zinc-800" />

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => setPaymentStatus("confirmed")}
                  className="w-full bg-emerald-500 font-medium text-zinc-950 hover:bg-emerald-400"
                >
                  Simulate Payment Confirmed
                </Button>
                <p className="flex items-center justify-center gap-1.5 text-center text-xs text-zinc-500">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Demo mode: Click above to preview instant delivery
                </p>
              </div>
            </div>
          </>
        )}

        {product && paymentStatus === "confirmed" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
                Payment Verified — Unlocked
              </DialogTitle>
              <DialogDescription className="text-zinc-400">
                Your digital asset and client setup instructions are ready below.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5">
                <div className="truncate pr-2">
                  <p className="text-xs text-emerald-300/80">Digital File Ready</p>
                  <p className="truncate text-sm font-medium text-zinc-100">
                    {product.deliveryPreview}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="shrink-0 bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Download
                </Button>
              </div>

              <div className="space-y-2 rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Setup &amp; Module Instructions
                </h4>
                <ol className="list-decimal space-y-2 pl-4 text-sm text-zinc-400">
                  {product.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
