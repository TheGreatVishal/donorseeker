"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { ChevronDown, ChevronUp, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { updateRequestStatus } from "@/lib/action"
import { toast } from "@/hooks/use-toast"

interface Request {
  id: number
  message: string
  status: string
  createdAt: string
  updatedAt: string
  seeker: {
    id: number
    firstname: string
    lastname: string
    email: string
    contact: string
  }
}

export default function RequestsList({
  requests,
  listingId,
}: {
  requests: Request[]
  listingId: number
}) {
  const [expandedRequestId, setExpandedRequestId] = useState<number | null>(null)
  const [isUpdating, setIsUpdating] = useState<number | null>(null)

  const toggleExpand = (requestId: number) => {
    setExpandedRequestId(expandedRequestId === requestId ? null : requestId)
  }

  const handleUpdateStatus = async (requestId: number, status: "ACCEPTED" | "REJECTED") => {
    try {
      setIsUpdating(requestId)
      await updateRequestStatus(listingId, requestId, status)
      toast({
        title: `Request ${status.toLowerCase()}`,
        description:
          status === "ACCEPTED" ? "You've accepted this donation request" : "You've rejected this donation request",
      })
    } catch {
      // console.log(error);
      
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(null)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "default"
      case "REJECTED":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className="overflow-hidden">
          <div
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50"
            onClick={() => toggleExpand(request.id)}
          >
            <div className="flex flex-col">
              <div className="font-medium">
                {request.seeker.firstname} {request.seeker.lastname}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusBadgeVariant(request.status)}>{request.status}</Badge>
              {expandedRequestId === request.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>

          {expandedRequestId === request.id && (
            <CardContent className="pt-0 pb-4 border-t">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Message</h4>
                  <p className="text-sm">{request.message}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{request.seeker.email}</span>
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{request.seeker.contact}</span>
                  </div>
                </div>

                {request.status === "PENDING" && (
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUpdateStatus(request.id, "REJECTED")
                      }}
                      disabled={isUpdating !== null}
                    >
                      <X className="mr-1 h-4 w-4" /> Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUpdateStatus(request.id, "ACCEPTED")
                      }}
                      disabled={isUpdating !== null}
                    >
                      <Check className="mr-1 h-4 w-4" /> Accept
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}

