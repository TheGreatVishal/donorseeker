import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { logApiActivity } from "@/utils/logApiActivity";

const section = "Transaction";
const endpoint = "/api/transaction/details";

export async function GET(request, { params }) {
    const requestType = "GET";

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
        return NextResponse.json({ error: "You must be logged in to view transaction details" }, { status: 401 });
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
  
      // Get the transaction with related data
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
        include: {
          listing: true,
          donor: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
              contact: true,
              donationCount: true,
              totalRating: true,
              ratingCount: true,
            },
          },
          receiver: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
              contact: true,
            },
          },
          request: true,
          feedback: true,
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
  
      // Verify that the user is either the donor or the receiver
      if (transaction.donorId !== user.id && transaction.receiverId !== user.id) {
        await logApiActivity({
          request,
          session,
          section,
          endpoint,
          requestType,
          statusCode: 403,
          description: "Unauthorized transaction details access attempt",
        });
        return NextResponse.json({ error: "You are not authorized to view this transaction" }, { status: 403 });
      }
  
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 200,
        description: `Transaction details retrieved for transaction ID: ${transactionId}`,
      });
  
      return NextResponse.json({ transaction });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
  
      console.error("Error fetching transaction:", errorMessage);
  
      await logApiActivity({
        request,
        session: null,
        section,
        endpoint,
        requestType,
        statusCode: 500,
        description: `Failed to fetch transaction details - ${errorMessage}`,
      });
  
      return NextResponse.json({ error: "Failed to fetch transaction details" }, { status: 500 });
    }
  }