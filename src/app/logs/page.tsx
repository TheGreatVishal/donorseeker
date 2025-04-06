import { Suspense } from "react"
import LogsDashboard from "@/components/logs/logs-dashboard"
import { LogsPageSkeleton } from "@/components/logs/logs-skeleton"

export const metadata = {
  title: "Logs Dashboard",
  description: "View and filter system logs",
}

export default function LogsPage() {
  return (
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
  )
}
