import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { PrismaClient } from "@prisma/client"
import { logApiActivity } from "@/utils/logApiActivity";

const prisma = new PrismaClient()
const section = "Requests"
const endpoint = "/api/requests/user"
const requestType = "GET"

export async function GET(request: Request) {
  const session = await getServerSession()
  try {

    if (!session || !session.user) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 401,
        description: "Unauthorized",
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user ID from the session
    const userEmail = session.user.email

    if (!userEmail) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 400,
        description: "User email not found in session",
      })
      return NextResponse.json({ error: "User email not found in session" }, { status: 400 })
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    })

    if (!user) {
      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 404,
        description: "User not found",
      })
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get all requests made by the user
    const requests = await prisma.donationRequest.findMany({
      where: {
        seekerId: user.id,
      },
      include: {
        listing: {
          include: {
            user: {
              select: {
                firstname: true,
                lastname: true,
                email: true,
                contact: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    await logApiActivity({
      request,
      session,
      section,
      endpoint,
      requestType,
      statusCode: 200,
      description: "Fetched user donation requests successfully",
    })

    return NextResponse.json(requests)
  } catch (error) {
    console.error("Error fetching user requests:", error)
    await logApiActivity({
      request,
      session,
      section,
      endpoint,
      requestType,
      statusCode: 500,
      description: `Failed to fetch user requests - ${error}`,
    })
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

