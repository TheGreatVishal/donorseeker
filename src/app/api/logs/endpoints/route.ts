// Fetches all distinct API endpoints
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { logApiActivity } from "@/utils/logApiActivity";

const section = "Logs Section"
const endpoint = "/api/logging/endpoints"
const requestType = "GET"

export async function GET(request: Request) {
  try {
    const session = await getServerSession()

    const user = await prisma.user.findUnique({
      where: { email: session?.user.email || "" },
      select: { isAdmin: true },
    })

    if (!session || !user?.isAdmin) {
      console.log("Not Authorized user tried to access the logs...")

      await logApiActivity({
        request,
        session,
        section,
        endpoint,
        requestType,
        statusCode: 401,
        description: `Unauthorized access to fetch endpoints by: ${session?.user.email}`,
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get distinct API endpoints
    const endpoints = await prisma.logging.findMany({
      select: {
        apiEndpoint: true,
      },
      distinct: ["apiEndpoint"],
      orderBy: {
        apiEndpoint: "asc",
      },
    })

    // Extract endpoint names from result
    const endpointNames = endpoints.map((item) => item.apiEndpoint)

    await logApiActivity({
      request,
      session,
      section,
      endpoint,
      requestType,
      statusCode: 200,
      description: "Fetched distinct API endpoints successfully",
    })

    return NextResponse.json(endpointNames)
  } catch (error) {
    console.error("Error fetching endpoints:", error)

    const session = await getServerSession()

    await logApiActivity({
      request,
      session,
      section,
      endpoint,
      requestType,
      statusCode: 500,
      description: "Error while fetching distinct endpoints",
    })

    return NextResponse.json({ error: "Failed to fetch endpoints" }, { status: 500 })
  }
}
