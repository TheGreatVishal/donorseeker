import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import type { Prisma } from "@prisma/client"
import { getServerSession } from "next-auth/next"

export async function GET(request: NextRequest) {
  try {

    const session = await getServerSession()

    const user = await prisma.user.findUnique({
      where: { email: session?.user.email || "" },
      select: { isAdmin: true },
    })
   
    if (!session || !user?.isAdmin) {
      console.log("Not Authorized user tried to access the logs...");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("User Trying to access logs: ", session?.user.email);
    
    const { searchParams } = new URL(request.url)

    // Parse pagination parameters
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")
    const skip = (page - 1) * pageSize

    // Build filter conditions
    const where: Prisma.LoggingWhereInput = {}

    // Date range filter
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    if (startDate || endDate) {
      where.timestamp = {}

      if (startDate) {
        where.timestamp.gte = new Date(startDate)
      }

      if (endDate) {
        const endDateTime = new Date(endDate)
        endDateTime.setHours(23, 59, 59, 999)
        where.timestamp.lte = endDateTime
      }
    }

    // IP address filter
    const ipAddress = searchParams.get("ipAddress")
    if (ipAddress) {
      where.ipAddress = {
        contains: ipAddress,
      }
    }

    // User email filter
    const userEmail = searchParams.get("userEmail")
    if (userEmail) {
      where.userEmail = {
        contains: userEmail,
      }
    }

    // Section filter
    const section = searchParams.get("section")
    if (section) {
      where.section = section
    }

    // API endpoint filter
    const apiEndpoint = searchParams.get("apiEndpoint")
    if (apiEndpoint) {
      where.apiEndpoint = {
        contains: apiEndpoint,
      }
    }

    // Request type filter
    const requestType = searchParams.get("requestType")
    if (requestType) {
      where.requestType = requestType
    }

    // Status code filter
    const statusCode = searchParams.get("statusCode")
    if (statusCode) {
      where.statusCode = Number.parseInt(statusCode)
    }

    // Fetch logs with pagination
    const [logs, total] = await Promise.all([
      prisma.logging.findMany({
        where,
        orderBy: {
          timestamp: "desc",
        },
        skip,
        take: pageSize,
      }),
      prisma.logging.count({ where }),
    ])


    // console.log(logs);

    return NextResponse.json({
      logs,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    })
  } catch (error) {
    console.error("Error fetching logs:", error)
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 })
  }
}

