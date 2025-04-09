import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import type { Prisma } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { logApiActivity } from "@/utils/logApiActivity"

const section = "Logs Section"
const endpoint = "/api/admin/logs/stats"
const requestType = "GET"

export async function GET(request: NextRequest) {
	const session = await getServerSession()
	try {
		const user = await prisma.user.findUnique({
			where: { email: session?.user.email || "" },
			select: { isAdmin: true },
		})

		if (!session || !user?.isAdmin) {
			await logApiActivity({
				request,
				session,
				section,
				endpoint,
				requestType,
				statusCode: 401,
				description: `Unauthorized access to logs stats by: ${session?.user.email ?? "Unknown user"}`,
			})
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const { searchParams } = new URL(request.url)

		const page = Number.parseInt(searchParams.get("page") || "1")
		const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")
		const skip = (page - 1) * pageSize

		const where: Prisma.LoggingWhereInput = {}

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

		const ipAddress = searchParams.get("ipAddress")
		if (ipAddress) {
			where.ipAddress = {
				contains: ipAddress,
			}
		}

		const userEmail = searchParams.get("userEmail")
		if (userEmail) {
			where.userEmail = {
				contains: userEmail,
			}
		}

		const sectionFilter = searchParams.get("section")
		if (sectionFilter) {
			where.section = sectionFilter
		}

		const apiEndpoint = searchParams.get("apiEndpoint")
		if (apiEndpoint) {
			where.apiEndpoint = {
				contains: apiEndpoint,
			}
		}

		const requestTypeFilter = searchParams.get("requestType")
		if (requestTypeFilter) {
			where.requestType = requestTypeFilter
		}

		const statusCode = searchParams.get("statusCode")
		if (statusCode) {
			where.statusCode = Number.parseInt(statusCode)
		}

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

		await logApiActivity({
			request,
			session,
			section,
			endpoint,
			requestType,
			statusCode: 200,
			description: `Admin ${session?.user.email} fetched logs successfully`,
		})

		return NextResponse.json({
			logs,
			total,
			page,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		})
	} catch (error) {
		// const section = "Logs "
		// const endpoint = "/api/admin/logs/stats"
		// const requestType = "GET"

		await logApiActivity({
			request,
			session,
			section,
			endpoint,
			requestType,
			statusCode: 500,
			description: `Error fetching logs: ${error instanceof Error ? error.message : String(error)}`,
		})

		return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 })
	}
}
