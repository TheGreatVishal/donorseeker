"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { ChevronDown, ChevronUp, Check, X, AlertCircle, Mail, Phone } from "lucide-react"
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
  needinessScore?: number
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

  // Function to get color based on neediness score
  const getNeedinessColor = (score: number) => {
    if (score >= 8) return "text-red-600 bg-red-50 border-red-100"
    if (score >= 6) return "text-orange-600 bg-orange-50 border-orange-100"
    if (score >= 4) return "text-yellow-600 bg-yellow-50 border-yellow-100"
    return "text-blue-600 bg-blue-50 border-blue-100"
  }

  // Function to get a visual representation of the neediness score
  const getNeedinessLabel = (score: number) => {
    if (score >= 8) return "Critical Need"
    if (score >= 6) return "High Need"
    if (score >= 4) return "Moderate Need"
    return "Standard Need"
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className="overflow-hidden border hover:border-gray-300 transition-colors">
          <div
            className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between cursor-pointer hover:bg-gray-50 transition-colors gap-2"
            onClick={() => toggleExpand(request.id)}
          >
            <div className="flex flex-col">
              <div className="font-medium text-gray-900">
                {request.seeker.firstname} {request.seeker.lastname}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-between sm:justify-end">
              {request.needinessScore !== undefined && (
                <div
                  className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border ${getNeedinessColor(
                    request.needinessScore,
                  )}`}
                >
                  <AlertCircle size={14} />
                  <span className="font-semibold">{request.needinessScore.toFixed(1)}/10</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Badge variant={getStatusBadgeVariant(request.status)} className="px-2.5 py-0.5 text-xs">
                  {request.status}
                </Badge>
                {expandedRequestId === request.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>
          </div>

          {expandedRequestId === request.id && (
            <CardContent className="pt-0 pb-4 border-t bg-gray-50">
              <div className="space-y-4 pt-4">
                <div>
                  <h4 className="text-sm font-medium mb-2 text-gray-700">Message</h4>
                  <p className="text-sm bg-white p-3 rounded-lg border">{request.message}</p>
                </div>

                {request.needinessScore !== undefined && (
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="text-sm font-medium mb-3 text-gray-700 flex items-center gap-1.5">
                      <AlertCircle size={16} className="text-gray-500" />
                      AI Need Assessment
                    </h4>

                    <div className="mb-3">
                      <div
                        className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium border ${getNeedinessColor(
                          request.needinessScore,
                        )}`}
                      >
                        {getNeedinessLabel(request.needinessScore)}: {request.needinessScore.toFixed(1)}/10
                      </div>
                    </div>

                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full ${
                          request.needinessScore >= 8
                            ? "bg-red-500"
                            : request.needinessScore >= 6
                              ? "bg-orange-500"
                              : request.needinessScore >= 4
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                        }`}
                        style={{ width: `${request.needinessScore * 10}%` }}
                      ></div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      This score is generated by AI to help prioritize requests based on need. Higher scores indicate
                      greater need.
                    </p>
                  </div>
                )}

                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="text-sm font-medium mb-3 text-gray-700">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{request.seeker.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{request.seeker.contact}</span>
                    </div>
                  </div>
                </div>

                {request.status === "PENDING" && (
                  <div className="flex gap-2 justify-end pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUpdateStatus(request.id, "REJECTED")
                      }}
                      disabled={isUpdating !== null}
                      className="bg-white hover:bg-gray-100"
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
                      className="bg-green-600 hover:bg-green-700 text-white"
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

