"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Clock, AlertCircle, Search } from "lucide-react"

type Requirement = {
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

type PaginationData = {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function RequirementsList() {
  const [requirements, setRequirements] = useState<Requirement[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedUrgency, setSelectedUrgency] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Fetch requirements - using useCallback to memoize the function
  const fetchRequirements = useCallback(async () => {
    try {
      setLoading(true)

      let url = `/api/requirements?page=${pagination.page}&limit=${pagination.limit}`

      if (selectedCategory) {
        url += `&category=${selectedCategory}`
      }

      if (selectedUrgency) {
        url += `&urgency=${selectedUrgency}`
      }

      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Failed to fetch requirements")
      }

      const data = await response.json()
      setRequirements(data.requirements)
      setPagination(data.pagination)
    } catch (err) {
      setError("Failed to load requirements. Please try again later.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, selectedCategory, selectedUrgency, searchQuery])

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/requirements/categories")

      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }

      const data = await response.json()
      setCategories(data)
    } catch (err) {
      console.error("Error fetching categories:", err)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchCategories()
    fetchRequirements()
  }, [fetchRequirements])

  // Fetch when filters or pagination changes
  useEffect(() => {
    fetchRequirements()
  }, [fetchRequirements])

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchRequirements()
  }

  // Reset filters
  const resetFilters = () => {
    setSelectedCategory("")
    setSelectedUrgency("")
    setSearchQuery("")
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

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
      month: "short",
      day: "numeric",
    })
  }

  if (loading && requirements.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error && requirements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Error Loading Requirements</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchRequirements}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-muted p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Filter Requirements</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Urgency</label>
            <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
              <SelectTrigger>
                <SelectValue placeholder="Any Urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Urgency</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="NORMAL">Normal</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Search</label>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Search by title or description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Requirements List */}
      {requirements.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">No Requirements Found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or check back later for new requirements.
          </p>
          <Button onClick={resetFilters}>Reset Filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requirements.map((requirement) => (
            <Card key={requirement.id} className="h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{requirement.title}</CardTitle>
                  <Badge className={getUrgencyColor(requirement.urgency)}>{requirement.urgency}</Badge>
                </div>
                <CardDescription className="flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  {formatDate(requirement.createdAt)}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-grow">
                <p className="text-sm line-clamp-3 mb-3">{requirement.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">{requirement.category}</Badge>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between border-t pt-4">
                <div className="text-xs text-muted-foreground">
                  Posted by: {requirement.user.firstname} {requirement.user.lastname}
                </div>
                <Link href={`/browse-requirements/${requirement.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (pagination.page > 1) {
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                }}
                className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((page) => {
                // Show current page, first, last, and pages around current
                return page === 1 || page === pagination.totalPages || Math.abs(page - pagination.page) <= 1
              })
              .map((page, index, array) => {
                // Add ellipsis
                const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1
                const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1

                return (
                  <div key={page} className="flex items-center">
                    {showEllipsisBefore && (
                      <PaginationItem>
                        <span className="px-2">...</span>
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setPagination((prev) => ({ ...prev, page }))
                        }}
                        isActive={page === pagination.page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>

                    {showEllipsisAfter && (
                      <PaginationItem>
                        <span className="px-2">...</span>
                      </PaginationItem>
                    )}
                  </div>
                )
              })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (pagination.page < pagination.totalPages) {
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                }}
                className={pagination.page >= pagination.totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

