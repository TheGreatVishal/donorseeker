import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { logApiActivity } from "@/utils/logApiActivity";

const section = "Transaction";
const endpoint = "/api/transaction/list";

export async function GET(request: Request) {
  const requestType = "GET";

  try {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 401,
        description: "Unauthorized access attempt",
      });
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    const user = await prisma.user.findUnique({ where: { email: userEmail } });

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
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ donorId: user.id }, { receiverId: user.id }],
      },
      include: {
        listing: true,
        request: true,
        donor: { select: { id: true, firstname: true, lastname: true, email: true } },
        receiver: { select: { id: true, firstname: true, lastname: true, email: true } },
        feedback: true,
      },
    });

    await logApiActivity({
      request,
      session,
      section,
      endpoint,
      requestType,
      statusCode: 200,
      description: `Fetched ${transactions.length} transactions for user: ${user.id}`,
    });

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Error fetching transactions:", errorMessage);

    await logApiActivity({
      request,
      session: null,
      section,
      endpoint,
      requestType,
      statusCode: 500,
      description: `Failed to fetch transactions - ${errorMessage}`,
    });

    return NextResponse.json(
      { message: "Internal Server Error", error: errorMessage },
      { status: 500 }
    );
  }
}
