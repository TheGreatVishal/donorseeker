import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import type { Prisma } from "@prisma/client"
import { format } from "date-fns"
import { getServerSession } from "next-auth/next"
import { logApiActivity } from "@/utils/logApiActivity"

export async function GET(request: NextRequest) {
	const section = "Logs Section"
	const endpoint = "/api/admin/logs/export"
	const requestType = "GET"
	const session = await getServerSession()

	try {
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
				description: `Unauthorized access to export logs by: ${session?.user.email ?? "Unknown user"}`,
			})

			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const { searchParams } = new URL(request.url)

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

		const logs = await prisma.logging.findMany({
			where,
			orderBy: {
				timestamp: "desc",
			},
		})

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

		const escapeCsv = (value: string) => {
			if (value.includes(",") || value.includes('"') || value.includes("\n")) {
				return `"${value.replace(/"/g, '""')}"`
			}
			return value
		}

		const csv = [headers.join(","), ...rows.map((row) => row.map(escapeCsv).join(","))].join("\n")

		await logApiActivity({
			request,
			session,
			section,
			endpoint,
			requestType,
			statusCode: 200,
			description: `Logs exported successfully by: ${session?.user.email}`,
		})

		return new NextResponse(csv, {
			headers: {
				"Content-Type": "text/csv",
				"Content-Disposition": `attachment; filename="logs-export-${format(new Date(), "yyyy-MM-dd")}.csv"`,
			},
		})
	} catch (error) {
		console.error("Error exporting logs:", error)

		const session = await getServerSession()

		await logApiActivity({
			request,
			session,
			section,
			endpoint,
			requestType,
			statusCode: 500,
			description: `Error exporting logs: ${error instanceof Error ? error.message : "Unknown error"}`,
		})

		return NextResponse.json({ error: "Failed to export logs" }, { status: 500 })
	}
}
