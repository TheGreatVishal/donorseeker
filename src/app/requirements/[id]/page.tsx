"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, ArrowLeft, Clock, Tag, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

type RequirementListing = {
  id: number
  title: string
  description: string
  category: string
  urgency: string
  imageUrls: string[]
  contact: string
  status: string
  isApproved: boolean
  createdAt: string
  updatedAt: string
  userId: number
  user: {
    firstname: string
    lastname: string
  }
}

export default function RequirementDetailPage() {
  const params = useParams()
  const router = useRouter()
  const toast = useToast()
  const [listing, setListing] = useState<RequirementListing | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchRequirementDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/requirements/${params.id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch requirement details")
      }

      const data = await response.json()
      setListing(data)
    } catch {
      toast.toast({
        title: "Error",
        description: "Failed to load requirement details",
      })
    } finally {
      setIsLoading(false)
    }
  }, [params.id, toast])

  useEffect(() => {
    if (params.id) {
      fetchRequirementDetails()
    }
  }, [params.id, fetchRequirementDetails])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "LOW":
        return "bg-blue-100 text-blue-800"
      case "NORMAL":
        return "bg-green-100 text-green-800"
      case "HIGH":
        return "bg-orange-100 text-orange-800"
      case "URGENT":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Requirement not found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{listing.title}</CardTitle>
              <CardDescription className="mt-2 flex items-center gap-2">
                <Clock className="h-4 w-4" /> Posted on {formatDate(listing.createdAt)}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant={listing.isApproved ? "default" : "secondary"}>
                {listing.isApproved ? "Listed" : "Unlisted"}
              </Badge>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(listing.urgency)}`}
              >
                {listing.urgency.toLowerCase()}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="flex items-center">
                <Tag className="h-4 w-4 mr-1" /> {listing.category}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Urgency</p>
              <p className="capitalize">{listing.urgency.toLowerCase()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Contact</p>
              <p>{listing.contact}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="capitalize">{listing.status.toLowerCase()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Posted By</p>
              <p>
                {listing.user.firstname} {listing.user.lastname}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="whitespace-pre-line">{listing.description}</p>
          </div>

          {listing.imageUrls.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium mb-3">Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {listing.imageUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                      <Image
                        src={url || "/placeholder.svg?height=200&width=200"}
                        alt={`${listing.title} image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="bg-muted p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">How to help</p>
              <p className="text-sm text-muted-foreground mt-1">
                If you can help with this requirement, please contact the requester directly using the contact
                information provided above.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

