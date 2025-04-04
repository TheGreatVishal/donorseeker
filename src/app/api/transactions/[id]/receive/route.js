import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { logApiActivity } from "@/utils/logApiActivity";

const section = "Donation";
const endpoint = "/api/donation/receive";

export async function POST(request, { params }) {
  const requestType = "POST";
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 401,
        description: "Unauthorized access attempt",
      });
      return NextResponse.json({ error: "You must be logged in to perform this action" }, { status: 401 });
    }

    const transactionId = Number.parseInt(params.id);

    if (isNaN(transactionId)) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 400,
        description: "Invalid transaction ID",
      });
      return NextResponse.json({ error: "Invalid transaction ID" }, { status: 400 });
    }

    // Get the user ID from the email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 404,
        description: "User not found",
      });
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
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 404,
        description: "Transaction not found",
      });
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Verify that the user is the receiver
    if (transaction.receiverId !== user.id) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 403,
        description: "Unauthorized donation confirmation attempt",
      });
      return NextResponse.json(
        { error: "You are not authorized to mark this donation as received" },
        { status: 403 }
      );
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

    await logApiActivity({
      request,
      session,
      section,
      endpoint,
      requestType,
      statusCode: 200,
      description: `Donation marked as received for transaction ID: ${transactionId}`,
    });

    return NextResponse.json({
      success: true,
      transaction: updatedTransaction,
    });
  } catch (error) {
    console.error("Error marking donation as received:", error);
    await logApiActivity({
      request,
      session: null,
      section,
      endpoint,
      requestType,
      statusCode: 500,
      description: `Failed to mark donation as received - ${errorMessage}`,
    });
    return NextResponse.json({ error: "Failed to mark donation as received" }, { status: 500 });
  }
}
