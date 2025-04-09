import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { format, subDays } from "date-fns";
import { getServerSession } from "next-auth/next";
import { logApiActivity } from "@/utils/logApiActivity";

const section = "Logs Section";
const endpoint = "/api/admin/logs/stats-summary";
const requestType = "GET";

export async function GET(request: NextRequest) {
	const session = await getServerSession();
	try {
		const { searchParams } = new URL(request.url);
		const where: Prisma.LoggingWhereInput = {};

		const startDate = searchParams.get("startDate");
		const endDate = searchParams.get("endDate");

		if (startDate || endDate) {
			where.timestamp = {};

			if (startDate) {
				where.timestamp.gte = new Date(startDate);
			}
			if (endDate) {
				const endDateTime = new Date(endDate);
				endDateTime.setHours(23, 59, 59, 999);
				where.timestamp.lte = endDateTime;
			}
		}

		const ipAddress = searchParams.get("ipAddress");
		if (ipAddress) {
			where.ipAddress = { contains: ipAddress };
		}

		const userEmail = searchParams.get("userEmail");
		if (userEmail) {
			where.userEmail = { contains: userEmail };
		}

		const sectionFilter = searchParams.get("section");
		if (sectionFilter) {
			where.section = sectionFilter;
		}

		const apiEndpoint = searchParams.get("apiEndpoint");
		if (apiEndpoint) {
			where.apiEndpoint = { contains: apiEndpoint };
		}

		const requestTypeFilter = searchParams.get("requestType");
		if (requestTypeFilter) {
			where.requestType = requestTypeFilter;
		}

		const statusCode = searchParams.get("statusCode");
		if (statusCode) {
			where.statusCode = parseInt(statusCode, 10);
		}

		// Distribution 1: Status Codes
		const statusCodeDistribution = await prisma.logging.groupBy({
			by: ["statusCode"],
			where,
			_count: { _all: true },
			orderBy: { _count: { id: "desc" } },
		});

		// Distribution 2: Section
		const sectionDistribution = await prisma.logging.groupBy({
			by: ["section"],
			where,
			_count: { _all: true },
			orderBy: { _count: { id: "desc" } },
			take: 10,
		});

		// Distribution 3: Request Type
		const requestTypeDistribution = await prisma.logging.groupBy({
			by: ["requestType"],
			where,
			_count: { _all: true },
			orderBy: { _count: { id: "desc" } },
		});

		// Time distribution: last 7 days or custom
		let timeStart = subDays(new Date(), 7);
		if (startDate) timeStart = new Date(startDate);

		let timeEnd = new Date();
		if (endDate) {
			timeEnd = new Date(endDate);
			timeEnd.setHours(23, 59, 59, 999);
		}

		const dayDiff = Math.ceil((timeEnd.getTime() - timeStart.getTime()) / (1000 * 60 * 60 * 24));
		let timeFormat = "yyyy-MM-dd";
		if (dayDiff <= 1) timeFormat = "HH:00";
		else if (dayDiff <= 31) timeFormat = "MM-dd";
		else timeFormat = "yyyy-MM";

		const rawTimeData = await prisma.logging.findMany({
			where: {
				...where,
				timestamp: { gte: timeStart, lte: timeEnd },
			},
			select: {
				timestamp: true,
				id: true,
			},
			orderBy: { timestamp: "asc" },
		});

		const groupedTimeMap = new Map<string, number>();
		for (const entry of rawTimeData) {
			const key = format(entry.timestamp, timeFormat);
			groupedTimeMap.set(key, (groupedTimeMap.get(key) || 0) + 1);
		}
		const formattedTimeDistribution = Array.from(groupedTimeMap.entries()).map(([name, value]) => ({ name, value }));

		await logApiActivity({
			request,
			session,
			section,
			endpoint,
			requestType,
			statusCode: 200,
			description: `Log summary fetched successfully by: ${session?.user.email ?? "Unknown user"}`,
		});

		return NextResponse.json({
			statusCodeDistribution: statusCodeDistribution.map(({ statusCode, _count }) => ({
				name: statusCode,
				value: _count._all,
			})),
			sectionDistribution: sectionDistribution.map(({ section, _count }) => ({
				name: section,
				value: _count._all,
			})),
			requestTypeDistribution: requestTypeDistribution.map(({ requestType, _count }) => ({
				name: requestType,
				value: _count._all,
			})),
			timeDistribution: formattedTimeDistribution,
		});
	} catch (error) {
		await logApiActivity({
			request,
			session,
			section,
			endpoint,
			requestType,
			statusCode: 500,
			description: `Error fetching log stats: ${error instanceof Error ? error.message : String(error)}`,
		});

		return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
	}
}
