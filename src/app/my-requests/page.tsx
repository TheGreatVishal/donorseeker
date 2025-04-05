"use client"

import type React from "react"
import Image from "next/image"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Clock, CheckCircle, XCircle, Loader2, AlertCircle, RefreshCw, Filter, ChevronDown, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"

// Types based on your Prisma schema
type RequestStatus = "PENDING" | "ACCEPTED" | "REJECTED"
type ListingStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "DONATED"
type Condition = "NEW" | "USED" | "GOOD" | "FAIR" | "BAD"

interface DonationRequest {
  id: number
  message: string
  status: RequestStatus
  createdAt: string
  updatedAt: string
  seekerId: number
  listingId: number
  listing: {
    id: number
    title: string
    description: string
    category: string
    condition: Condition
    imageUrls: string[]
    contact: string
    status: ListingStatus
    isApproved: boolean
    createdAt: string
    updatedAt: string
    userId: number
    user: {
      firstname: string
      lastname: string
      email: string
      contact: string
    }
  }
}

export default function RequestsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<DonationRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<DonationRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<DonationRequest | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [isCancelling, setIsCancelling] = useState(false)

  // Fetch user's requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/requests/user")

        if (!response.ok) {
          throw new Error("Failed to fetch requests")
        }

        const data = await response.json()
        setRequests(data)
        setFilteredRequests(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        toast({
          title: "Error",
          description: "Failed to load your requests. Please try again.",
        //   variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequests()
  }, [])

  // Filter requests based on active tab and search query
  useEffect(() => {
    let filtered = [...requests]

    // Filter by status
    if (activeTab !== "all") {
      filtered = filtered.filter((request) => request.status.toLowerCase() === activeTab)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (request) =>
          request.listing.title.toLowerCase().includes(query) ||
          request.listing.category.toLowerCase().includes(query) ||
          request.message.toLowerCase().includes(query),
      )
    }

    setFilteredRequests(filtered)
  }, [activeTab, searchQuery, requests])

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Handle request cancellation
  const handleCancelRequest = async () => {
    if (!selectedRequest) return

    try {
      setIsCancelling(true)

      const response = await fetch(`/api/requests/${selectedRequest.id}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: cancelReason }),
      })

      if (!response.ok) {
        throw new Error("Failed to cancel request")
      }

      // Update local state
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === selectedRequest.id ? { ...req, status: "REJECTED" as RequestStatus } : req,
        ),
      )

      toast({
        title: "Request Cancelled",
        description: "Your donation request has been cancelled successfully.",
      })

      // Close dialog and reset form
      setIsDialogOpen(false)
      setCancelReason("")
      setSelectedRequest(null)
    } catch {

      toast({
        title: "Error",
        description: "Failed to cancel your request. Please try again.",
        // variant: "destructive",
      })
    } finally {
      setIsCancelling(false)
    }
  }

  // Handle refresh
  const handleRefresh = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/requests/user")

      if (!response.ok) {
        throw new Error("Failed to fetch requests")
      }

      const data = await response.json()
      setRequests(data)
      setFilteredRequests(data)

      toast({
        title: "Refreshed",
        description: "Your requests have been updated.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to refresh your requests. Please try again.",
        // variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Get status badge
  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Pending
          </Badge>
        )
      case "ACCEPTED":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            Accepted
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Get status icon
  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "ACCEPTED":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "REJECTED":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  // Render loading state
  if (isLoading && requests.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6 ">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Donation Requests</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-5 w-1/4" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">My Donation Requests</h1>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search requests..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setActiveTab("all")}>All Requests</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("pending")}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("accepted")}>Accepted</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab("rejected")}>Rejected</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium mb-1">No requests found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : activeTab === "all"
                    ? "You haven't made any donation requests yet"
                    : `You don't have any ${activeTab} requests`}
              </p>
              {activeTab !== "all" && (
                <Button variant="outline" onClick={() => setActiveTab("all")}>
                  View all requests
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="line-clamp-1">{request.listing.title}</CardTitle>
                        <CardDescription>
                          Requested on {new Date(request.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video relative mb-4 rounded-md overflow-hidden bg-muted">
                      {request.listing.imageUrls && request.listing.imageUrls.length > 0 ? (
                       <Image
                       src={request.listing.imageUrls[0] || "/placeholder.svg"}
                       alt={request.listing.title}
                       width={500} // or any appropriate width
                       height={300} // or any appropriate height
                       className="object-cover w-full h-full"
                     />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          No image available
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="font-medium">Category:</div>
                        <div>{request.listing.category}</div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="font-medium">Condition:</div>
                        <div>{request.listing.condition}</div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="font-medium">Status:</div>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(request.status)}
                          <span>{request.status}</span>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium mb-1">Your message:</div>
                        <div className="text-sm text-muted-foreground line-clamp-3">{request.message}</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => router.push(`/browse-donations/${request.listingId}`)}>
                      View Donation
                    </Button>
                    {request.status === "PENDING" && (
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setSelectedRequest(request)
                          setIsDialogOpen(true)
                        }}
                      >
                        Cancel Request
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel Request Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Donation Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your request for -{selectedRequest?.listing.title}-? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">
                Reason for cancellation (optional)
              </label>
              <Textarea
                id="reason"
                placeholder="Please provide a reason for cancellation"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Keep Request
            </Button>
            <Button variant="destructive" onClick={handleCancelRequest} disabled={isCancelling}>
              {isCancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cancel Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

