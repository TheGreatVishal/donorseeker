"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Trash2, Loader2 } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"

type DonationListing = {
  id: number
  title: string
  description: string
  category: string
  condition: string
  isApproved: boolean
  createdAt: string
}

type RequirementListing = {
  id: number
  title: string
  description: string
  category: string
  urgency: string
  isApproved: boolean
  createdAt: string
}

export default function DashboardPage() {
  const [donationListings, setDonationListings] = useState<DonationListing[]>([])
  const [requirementListings, setRequirementListings] = useState<RequirementListing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  // const [isToggling, setIsToggling] = useState<number | null>(null)
  const { toast } = useToast()

  const toastRef = useRef(toast);

  const fetchListings = useCallback(async () => {
    try {
      const [donationsRes, requirementsRes] = await Promise.all([
        fetch('/api/my-dashboard/donations'),
        fetch('/api/my-dashboard/requirements')
      ]);

      if (!donationsRes.ok || !requirementsRes.ok) {
        throw new Error('Failed to fetch listings');
      }

      const donationsData = await donationsRes.json();
      const requirementsData = await requirementsRes.json();

      setDonationListings(donationsData);
      setRequirementListings(requirementsData);
    } catch {
      toastRef.current({
        title: "Error",
        description: "Failed to load your listings"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleDelete = async (type: 'donations' | 'requirements', id: number) => {
    if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      return
    }

    setIsDeleting(id)
    try {
      const response = await fetch(`/api/my-dashboard/${type}/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete listing')
      }

      if (type === 'donations') {
        setDonationListings(prev => prev.filter(listing => listing.id !== id))
      } else {
        setRequirementListings(prev => prev.filter(listing => listing.id !== id))
      }

      toast({
        title: "Success",
        description: "Listing deleted successfully"
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete listing"
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 mt-10 m-5 p-5 pt-10">
      <h1 className="text-3xl font-bold mb-6 mt-5">My Dashboard</h1>

      <Tabs defaultValue="donations" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="donations">My Donations</TabsTrigger>
          <TabsTrigger value="requirements">My Requirements</TabsTrigger>
        </TabsList>

        <TabsContent value="donations">
          <div className="grid gap-6">
            {donationListings.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">You haven&apos;t created any donation listings yet.</p>
                  <div className="flex justify-center mt-4">
                    <Link href="/donate">
                      <Button>Create Donation Listing</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              donationListings.map(listing => (
                <Card key={listing.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{listing.title}</CardTitle>
                        <CardDescription>
                          {listing.category} • {listing.condition} • Created on {formatDate(listing.createdAt)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link href={`/my-dashboard/donations/${listing.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                        </Link>
                        {/* <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleApproval('donations', listing.id, listing.isApproved)}
                          disabled={isToggling === listing.id}
                        >
                          {isToggling === listing.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : listing.isApproved ? (
                            <>
                              <ToggleRight className="h-4 w-4 mr-1" /> Delist
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="h-4 w-4 mr-1" /> List
                            </>
                          )}
                        </Button> */}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete('donations', listing.id)}
                          disabled={isDeleting === listing.id}
                        >
                          {isDeleting === listing.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2">{listing.description}</p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${listing.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {listing.isApproved ? 'Listed' : 'Unlisted'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="requirements">
          <div className="grid gap-6">
            {requirementListings.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">You haven&apos;t created any requirement listings yet.</p>
                  <div className="flex justify-center mt-4">
                    <Link href="/requirements">
                      <Button>Create Requirement Listing</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              requirementListings.map(listing => (
                <Card key={listing.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{listing.title}</CardTitle>
                        <CardDescription>
                          {listing.category} • Urgency: {listing.urgency} • Created on {formatDate(listing.createdAt)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link href={`/my-dashboard/requirements/${listing.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete('requirements', listing.id)}
                          disabled={isDeleting === listing.id}
                        >
                          {isDeleting === listing.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2">{listing.description}</p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${listing.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {listing.isApproved ? 'Listed' : 'Unlisted'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
