import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import { logApiActivity } from "@/utils/logApiActivity";

const prisma = new PrismaClient();
const section = "Requests";
const requestType = "PUT";

// Cancel our own sent donation requests
export async function PUT(request, context) {
  const session = await getServerSession();
  const { id: idString } = context.params;
  const requestId = Number.parseInt(idString);
  const endpoint = `/api/requests/${requestId}/cancel`;

  try {
    if (isNaN(requestId)) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 400,
        description: "Invalid request ID",
      });
      return NextResponse.json({ error: "Invalid request ID" }, { status: 400 });
    }

    if (!session || !session.user) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 401,
        description: "Unauthorized",
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    if (!userEmail) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 400,
        description: "User email not found in session",
      });
      return NextResponse.json({ error: "User email not found in session" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
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

    const donationRequest = await prisma.donationRequest.findUnique({
      where: { id: requestId },
    });

    if (!donationRequest) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 404,
        description: "Donation request not found",
      });
      return NextResponse.json({ error: "Donation request not found" }, { status: 404 });
    }

    if (donationRequest.seekerId !== user.id) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 403,
        description: "User not authorized to cancel this request",
      });
      return NextResponse.json({ error: "You are not authorized to cancel this request" }, { status: 403 });
    }

    if (donationRequest.status !== "PENDING") {
      const statusText = donationRequest.status.toLowerCase();
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 400,
        description: `Cannot cancel a request that is already ${statusText}`,
      });
      return NextResponse.json(
        { error: `Cannot cancel a request that is already ${statusText}` },
        { status: 400 }
      );
    }

    const updatedRequest = await prisma.donationRequest.update({
      where: { id: requestId },
      data: {
        status: "REJECTED",
      },
    });

    await logApiActivity({
      request,
      session,
      section,
      endpoint,
      requestType,
      statusCode: 200,
      description: "Donation request cancelled successfully",
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Error cancelling donation request:", error);
    await logApiActivity({
      request,
      session,
      section,
      endpoint,
      requestType,
      statusCode: 500,
      description: `Failed to cancel donation request - ${error}`,
    });
    return NextResponse.json({ error: "Failed to cancel donation request" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
