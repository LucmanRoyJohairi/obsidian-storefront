import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
    }

    const { productId, txHash } = await req.json();

    if (!productId || !txHash) {
      return NextResponse.json(
        { error: "Product ID and transaction hash are required." },
        { status: 400 }
      );
    }

    // Create the order in Neon (set to COMPLETED for instant demo, or PENDING if verifying on-chain)
    const order = await prisma.order.create({
      data: {
        clerkUserId: userId,
        productId,
        txHash: txHash.trim(),
        status: "COMPLETED",
      },
      include: { product: true },
    });

    return NextResponse.json(order);
  } catch (error: any) {
    // Handle duplicate txHash submissions cleanly
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "This transaction hash has already been submitted." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to create order." }, { status: 500 });
  }
}
