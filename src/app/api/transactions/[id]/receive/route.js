import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "You must be logged in to perform this action" }, { status: 401 });
    }

    const transactionId = Number.parseInt(params.id);

    if (isNaN(transactionId)) {
      return NextResponse.json({ error: "Invalid transaction ID" }, { status: 400 });
    }

    // Get the user ID from the email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        listing: true,
      },
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Verify that the user is the receiver
    if (transaction.receiverId !== user.id) {
      return NextResponse.json({ error: "You are not authorized to mark this donation as received" }, { status: 403 });
    }

    // Update the transaction
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { isReceived: true },
    });

    // Update the listing status to COMPLETED
    await prisma.donationListing.update({
      where: { id: transaction.listingId },
      data: { status: "COMPLETED" },
    });

    // Update donor's donation count
    await prisma.user.update({
      where: { id: transaction.donorId },
      data: {
        donationCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      transaction: updatedTransaction,
    });
  } catch (error) {
    console.error("Error marking donation as received:", error);
    return NextResponse.json({ error: "Failed to mark donation as received" }, { status: 500 });
  }
}
