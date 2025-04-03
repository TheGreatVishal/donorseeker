"use server"

import { revalidatePath } from "next/cache"
import prisma from "./prisma"
import { sendEmail } from "./email"

export async function updateRequestStatus(listingId: number, requestId: number, status: "ACCEPTED" | "REJECTED") {
  try {
    // Update the request status
    await prisma.donationRequest.update({
      where: { id: requestId },
      data: { status },
    })

    // If accepting the request, reject all other pending requests
    if (status === "ACCEPTED") {
      await prisma.donationRequest.updateMany({
        where: {
          listingId,
          id: { not: requestId },
          status: "PENDING",
        },
        data: { status: "REJECTED" },
      })

      // Update the listing status to DONATED
      await prisma.donationListing.update({
        where: { id: listingId },
        data: { status: "DONATED" },
      })

      // Create a transaction record
      const request = await prisma.donationRequest.findUnique({
        where: { id: requestId },
        include: {
          seeker: true,
          listing: { include: { user: true } },
        },
      })

      if (request) {
        const transaction = await prisma.transaction.create({
          data: {
            listingId,
            requestId,
            donorId: request.listing.userId,
            receiverId: request.seekerId,
          },
        })

        // Send email notification to the seeker
        await sendEmail({
          to: request.seeker.email,
          subject: `Your request for "${request.listing.title}" has been accepted!`,
          html: `
            <h1>Good news! Your donation request has been accepted</h1>
            <p>Dear ${request.seeker.firstname},</p>
            <p>Your request for <strong>${request.listing.title}</strong> has been accepted by the donor.</p>
            <h2>Donor Contact Information:</h2>
            <ul>
              <li>Name: ${request.listing.user.firstname} ${request.listing.user.lastname}</li>
              <li>Email: ${request.listing.user.email}</li>
              <li>Phone: ${request.listing.user.contact}</li>
            </ul>
            <p>Please contact the donor to arrange pickup or delivery of the item.</p>
            <p>Once you receive the item, please mark it as received and provide feedback on your experience.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/transactions/${transaction.id}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">View Transaction</a>
            <p>Thank you for using our platform!</p>
          `,
        })
      }
    }

    revalidatePath(`/dashboard/donations/${listingId}`)
    return { success: true }
  } catch (error) {
    console.error("Error updating request status:", error)
    throw new Error("Failed to update request status")
  }
}

export async function markDonationReceived(transactionId: number) {
  try {
    // Get the transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        listing: true,
      },
    })

    if (!transaction) {
      throw new Error("Transaction not found")
    }

    // Update the transaction
    await prisma.transaction.update({
      where: { id: transactionId },
      data: { isReceived: true },
    })

    // Update the listing status to COMPLETED
    await prisma.donationListing.update({
      where: { id: transaction.listingId },
      data: { status: "COMPLETED" },
    })

    // Update donor's donation count
    await prisma.user.update({
      where: { id: transaction.donorId },
      data: {
        donationCount: {
          increment: 1,
        },
      },
    })

    revalidatePath(`/transactions/${transactionId}`)
    return { success: true }
  } catch (error) {
    console.error("Error marking donation as received:", error)
    throw new Error("Failed to mark donation as received")
  }
}

export async function submitFeedback(transactionId: number, feedback: { rating: number; comment?: string }) {
  try {
    const { rating, comment } = feedback

    // Get the transaction to get donor and receiver IDs
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    })

    if (!transaction) {
      throw new Error("Transaction not found")
    }

    // Create feedback record
    await prisma.feedback.create({
      data: {
        rating,
        comment,
        transactionId,
        giverId: transaction.receiverId, // Seeker gives feedback
        receiverId: transaction.donorId, // Donor receives feedback
      },
    })

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
    })

    revalidatePath(`/transactions/${transactionId}`)
    return { success: true }
  } catch (error) {
    console.error("Error submitting feedback:", error)
    throw new Error("Failed to submit feedback")
  }
}

