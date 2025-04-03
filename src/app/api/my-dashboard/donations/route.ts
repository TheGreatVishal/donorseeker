import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"

// Fetch all the donations listings
export async function GET() {
  try {
    const session = await getServerSession();
    console.log("api/my-dashboard/donations/route.ts session: ", session);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    console.log("User Email: ", userEmail);

    const donations = await prisma.donationListing.findMany({
      where: {
        user: {
          email: userEmail ?? "",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
    })

    return NextResponse.json(donations)
  } catch (error) {
    console.error("Error fetching donations:", error)
    return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 })
  }
}

