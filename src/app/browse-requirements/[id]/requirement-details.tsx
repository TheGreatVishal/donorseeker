"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, ArrowLeft, Calendar, Mail, Phone, User } from "lucide-react"

type RequirementDetails = {
  id: number
  title: string
  description: string
  category: string
  urgency: "LOW" | "NORMAL" | "HIGH" | "URGENT"
  imageUrls: string[]
  contact: string
  createdAt: string
  user: {
    firstname: string
    lastname: string
    email: string
    contact: string
  }
}

export default function RequirementDetails({ id }: { id: string }) {
  const [requirement, setRequirement] = useState<RequirementDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRequirement = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/requirements/${id}`)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Requirement not found")
          }
          throw new Error("Failed to fetch requirement details")
        }

        const data = await response.json()
        setRequirement(data)
      } catch (err: Error | unknown) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load requirement details"
        setError(errorMessage)
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRequirement()
  }, [id])

  // Get urgency badge color
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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !requirement) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Error Loading Requirement</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <div className="flex gap-4">
          <Button onClick={() => window.location.reload()}>Try Again</Button>
          <Link href="/browse-requirements">
            <Button variant="outline">Back to Requirements</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/browse-requirements">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Requirements
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <CardTitle className="text-2xl">{requirement.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-2">
                    <Calendar className="h-4 w-4" />
                    Posted on {formatDate(requirement.createdAt)}
                  </CardDescription>
                </div>
                <Badge className={getUrgencyColor(requirement.urgency)}>{requirement.urgency} URGENCY</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Category */}
              <div>
                <h3 className="text-sm font-medium mb-2">Category</h3>
                <Badge variant="outline" className="text-sm">
                  {requirement.category}
                </Badge>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-medium mb-2">Description</h3>
                <p className="text-sm whitespace-pre-line">{requirement.description}</p>
              </div>

              {/* Images */}
              {requirement.imageUrls && requirement.imageUrls.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Images</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {requirement.imageUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                        <Image
                          src={url || "/placeholder.svg"}
                          alt={`${requirement.title} image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {requirement.user.firstname} {requirement.user.lastname}
                  </p>
                  <p className="text-xs text-muted-foreground">Requester</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{requirement.contact}</p>
                  <p className="text-xs text-muted-foreground">Phone</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{requirement.user.email}</p>
                  <p className="text-xs text-muted-foreground">Email</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Contact Requester</Button>
            </CardFooter>
          </Card>

          {/* Help Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How to Help</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                If you can fulfill this requirement, please contact the requester directly using the provided contact
                information. You can discuss the details and arrange for the donation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

