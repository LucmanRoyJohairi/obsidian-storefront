import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TronWeb } from "tronweb";

// Make sure the fallback below includes "nile." before trongrid.io
const TRON_API_URL = process.env.TRON_API_URL || "https://nile.trongrid.io";
const USDT_TRC20_CONTRACT =
  process.env.USDT_CONTRACT_ADDRESS || "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in first." },
        { status: 401 }
      );
    }

    const { productId, txHash } = await req.json();
    const cleanTxHash = txHash?.trim();

    if (!productId || !cleanTxHash) {
      return NextResponse.json(
        { error: "Product ID and transaction hash are required." },
        { status: 400 }
      );
    }

    // 1. Validate TXID format (64-character hex string)
    if (!/^[a-fA-F0-9]{64}$/.test(cleanTxHash)) {
      return NextResponse.json(
        { error: "Invalid TRON transaction hash format." },
        { status: 400 }
      );
    }

    // 2. Fetch the product from Neon to verify the required USDT price
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    const storeWallet = process.env.STORE_TRON_WALLET?.replace(/['"]/g, "").trim();
    console.log("store wallet", storeWallet)
    if (!storeWallet) {
      return NextResponse.json(
        { error: "Store wallet is not configured on the server." },
        { status: 500 }
      );
    }

    // 3. Query TronGrid (Nile or Mainnet) for transaction events
    const tronRes = await fetch(
      `${TRON_API_URL}/v1/transactions/${cleanTxHash}/events`,
      {
        headers: {
          "TRON-PRO-API-KEY": process.env.TRONGRID_API_KEY || "",
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!tronRes.ok) {
      return NextResponse.json(
        { error: "Unable to reach TRON network. Please try again in a moment." },
        { status: 502 }
      );
    }

    const tronData = await tronRes.json();
    const events = tronData?.data || [];

    if (events.length === 0) {
      return NextResponse.json(
        {
          error:
            "Transaction not found or still confirming on-chain. Wait 15–30 seconds and try again.",
        },
        { status: 400 }
      );
    }

    // Helper to convert TronGrid's hex recipient ("0x...") to Base58 ("T...")
    const toBase58 = (rawTo: string) =>
      rawTo.startsWith("0x")
        ? TronWeb.address.fromHex(rawTo.replace(/^0x/, "41"))
        : rawTo;

    // 4. Find a valid USDT Transfer event matching your wallet & product price
    const validTransfer = events.find((event: any) => {
      const isUsdtContract =
        event.contract_address?.toLowerCase() ===
        USDT_TRC20_CONTRACT.toLowerCase();
      const isTransferEvent = event.event_name === "Transfer";
      const recipientBase58 = toBase58(event.result?.to || "");
      const amountUsdt = Number(event.result?.value || 0) / 1_000_000;

      return (
        isUsdtContract &&
        isTransferEvent &&
        recipientBase58 === storeWallet &&
        amountUsdt >= product.priceUsdt
      );
    });

    if (!validTransfer) {
      const firstEvent = events[0] || {};
      const actualRecipientBase58 = toBase58(firstEvent.result?.to || "");
      const actualAmount = Number(firstEvent.result?.value || 0) / 1_000_000;

      return NextResponse.json(
        {
          error: `Verification failed: Contract(${firstEvent.contract_address} vs ${USDT_TRC20_CONTRACT}) | To(${actualRecipientBase58} vs ${storeWallet}) | Amt(${actualAmount} vs ${product.priceUsdt})`,
        },
        { status: 400 }
      );
    }

    // 5. Save the verified order in Neon (txHash is @unique in Prisma to prevent replay attacks)
    const order = await prisma.order.create({
      data: {
        clerkUserId: userId,
        productId: product.id,
        txHash: cleanTxHash,
        status: "COMPLETED",
      },
      include: { product: true },
    });

    return NextResponse.json(order);
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "This transaction hash has already been claimed." },
        { status: 409 }
      );
    }
    console.error("Order verification error:", error);
    return NextResponse.json(
      { error: `DB Error: ${error.message || "Failed to verify transaction."}` },
      { status: 500 }
    );
  }
}
