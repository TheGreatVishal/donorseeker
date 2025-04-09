// this  file Export logs to CSV

import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import type { Prisma } from "@prisma/client"
import { format } from "date-fns"
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


    const { searchParams } = new URL(request.url)

    // Build filter conditions (same as in the logs route)
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
        // Set the end date to the end of the day
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

    // Fetch all logs matching the filters
    const logs = await prisma.logging.findMany({
      where,
      orderBy: {
        timestamp: "desc",
      },
      // No pagination for export
    })

    // Convert logs to CSV
    const headers = [
      "ID",
      "Timestamp",
      "IP Address",
      "User Email",
      "Section",
      "API Endpoint",
      "Request Type",
      "Status Code",
      "Description",
    ]

    const rows = logs.map((log) => [
      log.id.toString(),
      format(log.timestamp, "yyyy-MM-dd HH:mm:ss"),
      log.ipAddress,
      log.userEmail || "",
      log.section,
      log.apiEndpoint,
      log.requestType,
      log.statusCode.toString(),
      log.description || "",
    ])

    // Escape CSV values
    const escapeCsv = (value: string) => {
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    }

    // Join rows and headers
    const csv = [headers.join(","), ...rows.map((row) => row.map(escapeCsv).join(","))].join("\n")

    // Return CSV as a downloadable file
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="logs-export-${format(new Date(), "yyyy-MM-dd")}.csv"`,
      },
    })
  } catch (error) {
    console.error("Error exporting logs:", error)
    return NextResponse.json({ error: "Failed to export logs" }, { status: 500 })
  }
}

