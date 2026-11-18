"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Check, Copy, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Uses NEXT_PUBLIC_STORE_TRON_WALLET from .env.local so it matches your backend
const STORE_WALLET_ADDRESS =
  process.env.NEXT_PUBLIC_STORE_TRON_WALLET

export function CheckoutDialog({
  product,
  onClose,
}: {
  product: any | null;
  onClose: () => void;
}) {
  const [txHash, setTxHash] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const router = useRouter();

  if (!product) return null;

  // Supports either `price` or `priceUsdt` cleanly
  const amount = Number(product.price ?? product.priceUsdt ?? 0);

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(STORE_WALLET_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isSignedIn) {
      openSignIn();
      return;
    }

    if (!txHash.trim()) {
      setError("Please paste your 64-character TRON transaction hash.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          txHash: txHash.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Payment verification failed.");
        return;
      }

      setTxHash("");
      onClose();
      router.push("/orders");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-zinc-800 bg-zinc-950 text-zinc-50 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Lock className="h-4 w-4 text-emerald-400" />
            Checkout &mdash; {product.title}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Send the exact USDT amount over the{" "}
            <strong className="text-zinc-200">TRON (TRC20)</strong> network to
            unlock your digital download immediately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleVerifyPayment} className="mt-2 space-y-4">
          {/* Amount Due Box */}
          <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/70 px-4 py-3">
            <span className="text-xs font-medium text-zinc-400">Amount Due</span>
            <span className="font-mono text-lg font-bold text-emerald-400">
              {amount.toFixed(2)} USDT
            </span>
          </div>

          {/* Deposit Wallet Address with Copy Button */}
          <div>
            <label className="block text-xs font-medium text-zinc-400">
              Deposit Wallet Address (TRC20 Network Only)
            </label>
            <div className="mt-1.5 flex items-center gap-2">
              <input
                readOnly
                value={STORE_WALLET_ADDRESS}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-xs text-zinc-200 select-all focus:outline-none"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopyWallet}
                className="shrink-0 border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Transaction Hash Input */}
          <div>
            <label
              htmlFor="txHash"
              className="block text-xs font-medium text-zinc-300"
            >
              Transaction Hash (TXID)
            </label>
            <input
              id="txHash"
              type="text"
              placeholder="Paste your 64-character TronLink TXID..."
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-xs text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-red-400">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-500 font-semibold text-zinc-950 hover:bg-emerald-400"
          >
            {isSubmitting
              ? "Verifying on TRON..."
              : isSignedIn
              ? "Verify & Unlock Download"
              : "Sign In to Buy"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
