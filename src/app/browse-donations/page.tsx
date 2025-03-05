"use client"

import type React from "react"

import { useState, useEffect } from "react"
// import { useSession } from "next-auth/react"
import Link from "next/link"
import { PlusCircle, List, Eye, Heart } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCallback } from "react";
import Image from "next/image"

interface Donation {
  id: string
  title: string
  description: string
  category: string
  condition: string
  imageUrls: string[]
  contact: string
  status: string
  user: {
    username: string
    email: string
  }
}

export default function BrowseDonationsPage() {
  // const { data: session } = useSession()
  const [donations, setDonations] = useState<Donation[]>([])
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([])
  const [category, setCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)

  useEffect(() => {
    fetchDonations()
  }, []) // Removed category dependency


  const applyFilters = useCallback(() => {
    let filtered = donations;

    if (category !== "all") {
      filtered = filtered.filter((donation) => donation.category === category);
    }

    filtered = filtered.filter(
      (donation) =>
        donation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredDonations(filtered);
    setCurrentPage(1);
  }, [donations, searchTerm, category]);

  useEffect(() => {
    applyFilters();
  }, [donations, searchTerm, category, applyFilters]); // No more warning

  // useEffect(() => {
  //   applyFilters()
  // }, [donations, searchTerm, category , applyFilters]) // Added category as dependency

  const fetchDonations = async () => {
    try {
      setLoading(true)
      // const url = new URL("/api/donations", window.location.origin)

      // Only set status parameter, no category filtering at API level
      // url.searchParams.append("status", "APPROVED")

      // console.log("Fetching donations from:", url.toString())

      const response = await fetch("/api/donations")

      if (!response.ok) {
        throw new Error("Failed to fetch donations")
      }

      const data = await response.json()
      // console.log("Donations data received:", data)

      setDonations(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching donations:", error)
      setError("Failed to load donations. Please try again later.")
      setLoading(false)
    }
  }

  // const applyFilters = () => {
  //   let filtered = donations

  //   // Apply category filter on the client side
  //   if (category !== "all") {
  //     filtered = filtered.filter((donation) => donation.category === category)
  //   }

  //   // Apply search term filter
  //   filtered = filtered.filter(
  //     (donation) =>
  //       donation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       donation.description.toLowerCase().includes(searchTerm.toLowerCase()),
  //   )

  //   setFilteredDonations(filtered)
  //   setCurrentPage(1) // Reset to first page when filters change
  // }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredDonations.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20 px-4">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-center mb-10 text-gray-900 dark:text-white">
        Browse Donations
      </h1>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4 flex-grow">
            <Input
              placeholder="Search donations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center">
            <List className="mr-2 text-gray-600 dark:text-gray-300" />
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md px-2 py-1"
            >
              <option value={6}>6 per page</option>
              <option value={9}>9 per page</option>
              <option value={12}>12 per page</option>
            </select>
          </div>

          <Link
            href="/donate"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 flex items-center"
          >
            <PlusCircle className="mr-2" /> Donate Item
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-600 dark:text-red-400 text-xl">{error}</p>
        ) : currentItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">No donations found</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((donation) => (
                <Card
                  key={donation.id}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300 dark:hover:border-blue-600 group"
                >
                  <CardHeader className="p-4 pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="line-clamp-1 text-xl font-bold">{donation.title}</CardTitle>
                        <Badge
                          variant="outline"
                          className="mt-1 capitalize bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100"
                        >
                          {donation.category}
                        </Badge>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {donation.condition}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 h-10">
                      {donation.description}
                    </p>
                    {donation.imageUrls && donation.imageUrls.length > 0 ? (
                      <div className="h-48 relative overflow-hidden rounded-md mb-2">
                        <Image
                          src={donation.imageUrls[0] || "/placeholder.svg"}
                          alt={donation.title}
                          width={300}
                          height={200}
                          className="object-contain w-full h-full"
                          onError={() => console.log("Image failed to load")}
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center mb-2">
                        <span className="text-gray-500 dark:text-gray-400">No image available</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between p-4 pt-0 gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Heart className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Link href={`/donations/${donation.id}`} className="flex-1">
                      <Button className="w-full" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                  Previous
                </Button>

                {Array.from({ length: Math.ceil(filteredDonations.length / itemsPerPage) }).map((_, index) => (
                  <Button
                    key={index}
                    variant={currentPage === index + 1 ? "default" : "outline"}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === Math.ceil(filteredDonations.length / itemsPerPage)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

