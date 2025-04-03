import {  NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ donorId: user.id }, { receiverId: user.id }]
      },
      include: {
        listing: true,
        request: true,
        donor: { select: { id: true, firstname: true, lastname: true, email: true } }, // Include id
        receiver: { select: { id: true, firstname: true, lastname: true, email: true } }, // Include id
        feedback: true,
      },
    });
    

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { 
        message: "Internal Server Error", 
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}