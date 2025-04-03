import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"

export async function POST(request: Request) {

  try {
        const session = await getServerSession()
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { title, description, category, condition, imageUrls, contact } = body

        if (!title || !description || !category || !condition || !contact) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const donation = await prisma.donationListing.create({
            data: {
                title,
                description,
                category,
                condition,
                imageUrls,
                contact,
                userId: user.id,
            },
        })

        return NextResponse.json(donation, { status: 201 })
    } catch (error) {
        console.error("Error creating donation:", error)
        return NextResponse.json({ error: "Failed to create donation" }, { status: 500 })
    }
}

export async function GET() {
  try {    
    const donations = await prisma.donationListing.findMany({
      where: {
        isApproved: true,
        status: {
          not: "COMPLETED",
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
            email: true,
          },
        },
      },
    });

    return NextResponse.json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 });
  }
}

  
  