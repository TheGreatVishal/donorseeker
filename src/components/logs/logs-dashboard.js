"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { LogsTable } from "@/components/logs/logs-table"
import { LogsFilter } from "@/components/logs/logs-filter"
import { LogsStats } from "@/components/logs/logs-stats"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

export default function LogsDashboard() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalLogs, setTotalLogs] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Get current filter values from URL params
  const startDate = searchParams.get("startDate") || ""
  const endDate = searchParams.get("endDate") || ""
  const ipAddress = searchParams.get("ipAddress") || ""
  const userEmail = searchParams.get("userEmail") || ""
  const section = searchParams.get("section") || ""
  const apiEndpoint = searchParams.get("apiEndpoint") || ""
  const requestType = searchParams.get("requestType") || ""
  const statusCode = searchParams.get("statusCode") || ""

  // Fetch logs based on current filters
  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      // Build query string from all filters
      const params = new URLSearchParams(searchParams)
      params.set("page", page.toString())
      params.set("pageSize", pageSize.toString())

      const response = await fetch(`/api/logs?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to fetch logs")

      const data = await response.json()
      // console.log(data);
      
      setLogs(data.logs)
      setTotalLogs(data.total)
    } catch (error) {
      console.error("Error fetching logs:", error)
      toast({
        title: "Error",
        description: "Failed to fetch logs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [searchParams, page, pageSize, toast])

  // Update URL with filter params
  const updateFilters = (filters) => {
    const params = new URLSearchParams(searchParams)

    // Update or remove each filter parameter
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    // Reset to page 1 when filters change
    params.set("page", "1")
    setPage(1)

    router.push(`${pathname}?${params.toString()}`)
  }

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage)
    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  // Export logs as CSV
  const exportLogs = async () => {
    try {
      const params = new URLSearchParams(searchParams)
      params.set("export", "csv")

      const response = await fetch(`/api/logs/export?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to export logs")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `logs-export-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Export successful",
        description: "Logs have been exported as CSV",
      })
    } catch (error) {
      console.error("Error exporting logs:", error)
      toast({
        title: "Export failed",
        description: "Failed to export logs. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Fetch logs when filters or pagination changes
  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  return (
    <div className="space-y-6">
      {/* First row: Filters and Stats Tabs */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <Tabs defaultValue="filters" className="w-full">
          <TabsList>
            <TabsTrigger value="filters">Filters</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          <TabsContent value="filters" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <LogsFilter
                  currentFilters={{
                    startDate,
                    endDate,
                    ipAddress,
                    userEmail,
                    section,
                    apiEndpoint,
                    requestType,
                    statusCode,
                  }}
                  onFilterChange={updateFilters}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="stats" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <LogsStats filters={Object.fromEntries(searchParams.entries())} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Second row: Buttons */}
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={fetchLogs} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button variant="outline" onClick={exportLogs} disabled={loading || logs === undefined|| Number(logs.length) === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Logs Table */}
      <LogsTable
        logs={logs}
        loading={loading}
        page={page}
        pageSize={pageSize}
        totalLogs={totalLogs}
        onPageChange={handlePageChange}
        onPageSizeChange={setPageSize}
      />
    </div>
  )
}

