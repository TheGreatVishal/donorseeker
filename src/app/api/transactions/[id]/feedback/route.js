import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "You must be logged in to provide feedback" }, { status: 401 });
    }

    const transactionId = Number.parseInt(params.id);

    if (isNaN(transactionId)) {
      return NextResponse.json({ error: "Invalid transaction ID" }, { status: 400 });
    }

    const { rating, comment } = await request.json();

    if (rating === undefined || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
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
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Verify that the user is the receiver
    if (transaction.receiverId !== user.id) {
      return NextResponse.json(
        { error: "You are not authorized to provide feedback for this transaction" },
        { status: 403 }
      );
    }

    // Check if feedback already exists
    const existingFeedback = await prisma.feedback.findUnique({
      where: { transactionId },
    });

    if (existingFeedback) {
      return NextResponse.json({ error: "Feedback has already been provided for this transaction" }, { status: 400 });
    }

    // Create feedback record
    const feedback = await prisma.feedback.create({
      data: {
        rating,
        comment,
        transactionId,
        giverId: transaction.receiverId, // Seeker gives feedback
        receiverId: transaction.donorId, // Donor receives feedback
      },
    });

    // Update donor's rating stats
    await prisma.user.update({
      where: { id: transaction.donorId },
      data: {
        totalRating: {
          increment: rating,
        },
        ratingCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}