import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
    try {
        console.log("-----------------------------------------------------");
        console.log("Fetching transaction details...");

        const session = await getServerSession();

        if (!session || !session.user) {
            return NextResponse.json({ error: "You must be logged in to view transaction details" }, { status: 401 });
        }
        console.log("Session running..");

        const transactionId = Number.parseInt(params.id);
        console.log("Transaction ID:", transactionId);

        if (isNaN(transactionId)) {
            return NextResponse.json({ error: "Invalid transaction ID" }, { status: 400 });
        }

        // Get the user ID from the email
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        console.log("User ID:", user?.id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        console.log("Fetching transaction details from db..");

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

        console.log("Transaction details:", transaction);

        if (!transaction) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        // Verify that the user is either the donor or the receiver
        if (transaction.donorId !== user.id && transaction.receiverId !== user.id) {
            return NextResponse.json({ error: "You are not authorized to view this transaction" }, { status: 403 });
        }

        return NextResponse.json({ transaction });
    } catch (error) {
        console.error("Error fetching transaction:", error);
        return NextResponse.json({ error: "Failed to fetch transaction details" }, { status: 500 });
    }
}
