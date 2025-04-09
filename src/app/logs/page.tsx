"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { Suspense } from "react"
import LogsDashboard from "@/components/logs/logs-dashboard"
import { LogsPageSkeleton } from "@/components/logs/logs-skeleton"

export default function LogsPage() {
	const { data: session, status } = useSession()
	const router = useRouter()

	// Redirect if not admin
	useEffect(() => {
		if (status === "authenticated" && !session?.user?.isAdmin) {
			router.push("/home")
			toast({
				title: "Access Denied",
				description: "You don't have permission to access the admin dashboard.",
				variant: "destructive",
			})
		}
	}, [session, status, router])

	return (
		<>
		<title>Logs Dashboard</title>
		<div className="flex justify-center mt-10 pt-10">
			<div className="w-full max-w-4xl px-4 py-6 space-y-6">
				<div className="flex flex-col gap-2">
					<h1 className="text-3xl font-bold tracking-tight">Logs Dashboard</h1>
					<p className="text-muted-foreground">
						View and filter system logs to troubleshoot issues and monitor activity
					</p>
				</div>
				<Suspense fallback={<LogsPageSkeleton />}>
					<LogsDashboard />
				</Suspense>
			</div>
		</div>
		</>
	)
}
