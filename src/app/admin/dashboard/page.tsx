"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Eye, AlertTriangle, Gift, FileQuestion, Clock, Search, Loader2, CheckCircle, XCircle, Filter, LayoutGrid, LayoutList } from 'lucide-react'
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Listing = {
  id: number
  title: string
  description: string
  category: string
  imageUrls?: string[]
  createdAt: string
  listingType: "donation" | "requirement"
  isApproved: boolean
  user: {
    username: string
    email: string
  }
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [approvalFilter, setApprovalFilter] = useState<"all" | "approved" | "pending">("pending")

  // Redirect if not admin
  useEffect(() => {
    if (status === "authenticated" && !session?.user?.isAdmin) {
      router.push("/home")
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        // variant: "destructive",
      })
    }
  }, [session, status, router])

  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("/api/admin/listings")
        if (!response.ok) {
          throw new Error("Failed to fetch listings")
        }

        const data = await response.json()
        setListings(data.listings)
        setFilteredListings(data.listings)
      } catch (error) {
        console.error("Error fetching listings:", error)
        toast({
          title: "Error",
          description: "Failed to fetch listings",
          // variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (status === "authenticated" && session?.user?.isAdmin) {
      fetchListings()
    }
  }, [session, status])

  // Filter listings based on search, tab, and approval status
  useEffect(() => {
    let filtered = listings

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.id.toString().includes(searchQuery.trim()),
      )
    }

    // Filter by tab (listing type)
    if (activeTab !== "all") {
      filtered = filtered.filter((listing) => listing.listingType === activeTab)
    }

    // Filter by approval status
    if (approvalFilter !== "all") {
      filtered = filtered.filter((listing) => 
        approvalFilter === "approved" ? listing.isApproved : !listing.isApproved
      )
    }

    setFilteredListings(filtered)
  }, [searchQuery, activeTab, approvalFilter, listings])

  // View listing details
  const viewListing = (id: number, type: string) => {
    console.log(`Viewing listing ${id} of type ${type}`)
    router.push(`/admin/listings/${id}?type=${type}`)
  }

  // Handle approval toggle directly from the dashboard
  const handleApprovalToggle = async (id: number, type: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/listings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingType: type,
          action: currentStatus ? "reject" : "approve",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update listing status")
      }

      const data = await response.json()
      
      // Update the listings state
      setListings(prevListings => 
        prevListings.map(listing => 
          listing.id === id && listing.listingType === type 
            ? { ...listing, isApproved: !currentStatus } 
            : listing
        )
      )

      toast({
        title: "Success",
        description: data.message,
      })
    } catch (error) {
      console.error("Error updating listing status:", error)
      toast({
        title: "Error",
        description: "Failed to update listing status",
        // variant: "destructive",
      })
    }
  }

  if (status === "loading" || (status === "authenticated" && !session?.user?.isAdmin)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="container mx-auto p-4 md:p-10 mt-4 md:mt-10">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage donation and requirement listings</p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by title, category, username or ID..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>{approvalFilter === "all" ? "All Status" : approvalFilter === "approved" ? "Approved" : "Pending"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setApprovalFilter("all")}>
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setApprovalFilter("approved")}>
                Approved
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setApprovalFilter("pending")}>
                Pending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center rounded-md border bg-muted p-1">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode("list")}
              title="List view"
            >
              <LayoutList className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setViewMode("grid")}
              title="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>

          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Pending: {listings.filter(l => !l.isApproved).length}</span>
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Listings</TabsTrigger>
          <TabsTrigger value="donation">Donations</TabsTrigger>
          <TabsTrigger value="requirement">Requirements</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {viewMode === "list" ? (
            <ListingsTable 
              listings={filteredListings} 
              isLoading={isLoading} 
              onView={viewListing} 
              onApprovalToggle={handleApprovalToggle}
            />
          ) : (
            <ListingsGrid 
              listings={filteredListings} 
              isLoading={isLoading} 
              onView={viewListing} 
              onApprovalToggle={handleApprovalToggle}
              getInitials={getInitials}
            />
          )}
        </TabsContent>

        <TabsContent value="donation" className="mt-0">
          {viewMode === "list" ? (
            <ListingsTable 
              listings={filteredListings} 
              isLoading={isLoading} 
              onView={viewListing} 
              onApprovalToggle={handleApprovalToggle}
            />
          ) : (
            <ListingsGrid 
              listings={filteredListings} 
              isLoading={isLoading} 
              onView={viewListing} 
              onApprovalToggle={handleApprovalToggle}
              getInitials={getInitials}
            />
          )}
        </TabsContent>

        <TabsContent value="requirement" className="mt-0">
          {viewMode === "list" ? (
            <ListingsTable 
              listings={filteredListings} 
              isLoading={isLoading} 
              onView={viewListing} 
              onApprovalToggle={handleApprovalToggle}
            />
          ) : (
            <ListingsGrid 
              listings={filteredListings} 
              isLoading={isLoading} 
              onView={viewListing} 
              onApprovalToggle={handleApprovalToggle}
              getInitials={getInitials}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ListingsTable({
  listings,
  isLoading,
  onView,
  onApprovalToggle,
}: {
  listings: Listing[]
  isLoading: boolean
  onView: (id: number, type: string) => void
  onApprovalToggle: (id: number, type: string, currentStatus: boolean) => void
}) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <AlertTriangle className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No listings found</h3>
        <p className="text-sm text-muted-foreground">There are no listings matching your current filters.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="hidden md:grid md:grid-cols-12 gap-4 border-b bg-muted/40 p-4 font-medium">
        <div className="col-span-5">Title</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      <div className="divide-y">
        {listings.map((listing) => (
          <div key={`${listing.listingType}-${listing.id}`} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4">
            <div className="col-span-1 md:col-span-5">
              <div className="font-medium">{listing.title}</div>
              <div className="text-sm text-muted-foreground">By: {listing.user.username}</div>
              <div className="md:hidden flex flex-wrap gap-2 mt-2">
                <Badge variant="outline">{listing.category}</Badge>
                {listing.listingType === "donation" ? (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-200">
                    <Gift className="mr-1 h-3 w-3" />
                    Donation
                  </Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-200">
                    <FileQuestion className="mr-1 h-3 w-3" />
                    Request
                  </Badge>
                )}
                <div className="text-xs text-muted-foreground">
                  {format(new Date(listing.createdAt), "MMM d, yyyy")}
                </div>
              </div>
            </div>
            <div className="hidden md:flex md:col-span-2 items-center">
              <Badge variant="outline">{listing.category}</Badge>
            </div>
            <div className="hidden md:flex md:col-span-2 items-center">
              {listing.listingType === "donation" ? (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-200">
                  <Gift className="mr-1 h-3 w-3" />
                  Donation
                </Badge>
              ) : (
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-200">
                  <FileQuestion className="mr-1 h-3 w-3" />
                  Request
                </Badge>
              )}
            </div>
            <div className="hidden md:flex md:col-span-2 items-center text-sm text-muted-foreground">
              {format(new Date(listing.createdAt), "MMM d, yyyy")}
            </div>
            <div className="col-span-1 md:col-span-1 flex items-center justify-end gap-1">
              <Button
                variant={listing.isApproved ? "destructive" : "default"}
                size="sm"
                onClick={() => onApprovalToggle(listing.id, listing.listingType, listing.isApproved)}
                title={listing.isApproved ? "Unapprove" : "Approve"}
                className="h-8"
              >
                {listing.isApproved ? (
                  <>
                    <XCircle className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Unapprove</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Approve</span>
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onView(listing.id, listing.listingType)}
                title="View details"
                className="h-8 w-8"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ListingsGrid({
  listings,
  isLoading,
  onView,
  onApprovalToggle,
  getInitials,
}: {
  listings: Listing[]
  isLoading: boolean
  onView: (id: number, type: string) => void
  onApprovalToggle: (id: number, type: string, currentStatus: boolean) => void
  getInitials: (name: string) => string
}) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <AlertTriangle className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No listings found</h3>
        <p className="text-sm text-muted-foreground">There are no listings matching your current filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {listings.map((listing) => (
        <Card key={`${listing.listingType}-${listing.id}`} className="overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getInitials(listing.user.username)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{listing.title}</CardTitle>
                  <CardDescription className="text-xs">By {listing.user.username}</CardDescription>
                </div>
              </div>
              {listing.listingType === "donation" ? (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-200">
                  <Gift className="mr-1 h-3 w-3" />
                  Donation
                </Badge>
              ) : (
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-200">
                  <FileQuestion className="mr-1 h-3 w-3" />
                  Request
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline">{listing.category}</Badge>
              <span className="text-xs text-muted-foreground">
                {format(new Date(listing.createdAt), "MMM d, yyyy")}
              </span>
            </div>
            <p className="text-sm line-clamp-2 mb-4">
              {listing.description || "No description provided."}
            </p>
            <Separator className="my-2" />
            <div className="flex justify-between items-center pt-2">
              <Button
                variant={listing.isApproved ? "destructive" : "default"}
                size="sm"
                onClick={() => onApprovalToggle(listing.id, listing.listingType, listing.isApproved)}
              >
                {listing.isApproved ? (
                  <>
                    <XCircle className="h-4 w-4 mr-1" />
                    Unapprove
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(listing.id, listing.listingType)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
