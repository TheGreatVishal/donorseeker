"use client"

import { useState } from "react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious
} from "@/components/ui/pagination"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { Info } from "lucide-react"

export function LogsTable({ logs, loading, page, pageSize, totalLogs, onPageChange, onPageSizeChange }) {
  const [selectedLog, setSelectedLog] = useState(null)

  const totalPages = Math.ceil(totalLogs / pageSize)

  const getPaginationItems = () => {
    const items = []
    // const maxVisiblePages = 5

    items.push(
      <PaginationItem key="first">
        <PaginationLink onClick={() => onPageChange(1)} isActive={page === 1}>
          1
        </PaginationLink>
      </PaginationItem>
    )

    if (page > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      )
    }

    const startPage = Math.max(2, page - 1)
    const endPage = Math.min(totalPages - 1, page + 1)

    for (let i = startPage; i <= endPage; i++) {
      if (i <= 1 || i >= totalPages) continue

      items.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => onPageChange(i)} isActive={page === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    if (page < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      )
    }

    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => onPageChange(totalPages)} isActive={page === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return items
  }

  const getStatusBadge = ({ statusCode }) => {
    if (statusCode >= 200 && statusCode < 300) {
      return <Badge variant="default">{statusCode}</Badge>
    } else if (statusCode >= 300 && statusCode < 400) {
      return <Badge variant="secondary">{statusCode}</Badge>
    } else if (statusCode >= 400 && statusCode < 500) {
      return <Badge variant="destructive">{statusCode}</Badge>
    } else {
      return <Badge variant="destructive">{statusCode}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Endpoint</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5).fill(0).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell><Skeleton className="h-4 w-8" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (!loading && logs.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">No logs found matching your filters.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Endpoint</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-xs">
                  {format(new Date(log.timestamp) - new Date(5.5 * 60 * 60 * 1000), "dd-MM-yyyy | HH:mm:ss")}
                </TableCell>
                <TableCell className="font-mono text-xs">{log.ipAddress}</TableCell>
                <TableCell className="max-w-[150px] truncate">{log.userEmail || "-"}</TableCell>
                <TableCell>{log.section}</TableCell>
                <TableCell className="max-w-[200px] truncate font-mono text-xs">{log.apiEndpoint}</TableCell>
                <TableCell>
                  <Badge variant="outline">{log.requestType}</Badge>
                </TableCell>
                <TableCell>{getStatusBadge({ statusCode: log.statusCode })}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                        onClick={() => setSelectedLog(log)}
                      >
                        <Info className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle>Log Details</DialogTitle>
                      </DialogHeader>
                      {selectedLog && (
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <div className="font-medium">ID</div>
                            <div className="col-span-3 font-mono">{selectedLog.id}</div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <div className="font-medium">Timestamp</div>
                            <div className="col-span-3 font-mono">
                              {format(new Date(selectedLog.timestamp) - new Date(5.5 * 60 * 60 * 1000), "dd-MM-yyyy | HH:mm:ss.SSS")}
                            </div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <div className="font-medium">IP Address</div>
                            <div className="col-span-3 font-mono">{selectedLog.ipAddress}</div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <div className="font-medium">User</div>
                            <div className="col-span-3">{selectedLog.userEmail || "-"}</div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <div className="font-medium">Section</div>
                            <div className="col-span-3">{selectedLog.section}</div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <div className="font-medium">Endpoint</div>
                            <div className="col-span-3 font-mono break-all">{selectedLog.apiEndpoint}</div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <div className="font-medium">Method</div>
                            <div className="col-span-3">{selectedLog.requestType}</div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <div className="font-medium">Status</div>
                            <div className="col-span-3">{selectedLog.statusCode}</div>
                          </div>
                          <div className="grid grid-cols-4 items-start gap-4">
                            <div className="font-medium">Description</div>
                            <div className="col-span-3 whitespace-pre-wrap">{selectedLog.description || "-"}</div>
                          </div>

                          <div className="grid grid-cols-4 items-center gap-4">
                            <div className="font-medium">Browser</div>
                            <div className="col-span-3">{selectedLog.browser || "-"}</div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <div className="font-medium">Operating System</div>
                            <div className="col-span-3">{selectedLog.operatingSystem || "-"}</div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <div className="font-medium">Geo Location</div>
                            <div className="col-span-3">{selectedLog.geoLocation || "-"}</div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div>
            Showing {Math.min((page - 1) * pageSize + 1, totalLogs)} to {Math.min(page * pageSize, totalLogs)} of{" "}
            {totalLogs} logs
          </div>
          <div className="flex items-center gap-2">
            <span>Show</span>
            <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span>per page</span>
          </div>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {page > 1 && <PaginationPrevious onClick={() => onPageChange(page - 1)} />}
            </PaginationItem>
            {getPaginationItems()}
            <PaginationItem>
              {page < totalPages && <PaginationNext onClick={() => onPageChange(page + 1)} />}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}