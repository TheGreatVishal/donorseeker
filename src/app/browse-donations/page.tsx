"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { PlusCircle, Eye } from "lucide-react"
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
		firstname: string
		lastname: string
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
		if (!Array.isArray(donations)) {
			console.error("Donations data is not an array:", donations);
			return;
		}
	
		let filtered = donations;
	
		// Filter by category (if not "all")
		if (category !== "all") {
			filtered = filtered.filter((donation) => 
				donation && typeof donation.category === "string" && donation.category.toLowerCase() === category.toLowerCase()
			);
		}
	
		const lowerCaseSearchTerm = searchTerm ? searchTerm.toLowerCase() : "";
	
		// Filter by id, title, description, or username
		filtered = filtered.filter((donation) =>
			donation &&
			(typeof donation.id === "string" && donation.id === searchTerm) ||
			(typeof donation.title === "string" && donation.title.toLowerCase().includes(lowerCaseSearchTerm)) ||
			(typeof donation.description === "string" && donation.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
			(donation.user && typeof donation.user.firstname === "string" && donation.user.firstname.toLowerCase().includes(lowerCaseSearchTerm))
		);
	
		setFilteredDonations(filtered);
		setCurrentPage(1);
	}, [donations, searchTerm, category]);
	


	useEffect(() => {
		applyFilters();
	}, [donations, searchTerm, category, applyFilters]);


	const fetchDonations = async () => {
		try {
			setLoading(true)
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
		<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pt-10 px-4">

			<div className="text-center space-y-4 mb-10 mt-10 pt-10">
				<h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4 animate-fade-in">
					<span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text drop-shadow-lg">
						Browse Donations
					</span>
				</h1>

				<p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
					Find donated items and give them a second life. Every contribution makes a difference!
				</p>
			</div>

			<div className="max-w-7xl mx-auto">
				<div className="mb-8 flex flex-wrap justify-between items-center gap-4">
					<div className="flex items-center gap-4 flex-grow">
						<Input
							placeholder="Search donations by id, title, description, or donor name"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="max-w-sm"
						/>
						<Select value={category} onValueChange={setCategory}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Category" />
							</SelectTrigger>
							<SelectContent className="color-white dark:bg-gray-800">
								<SelectItem value="all">All Categories</SelectItem>
								<SelectItem value="clothing">Clothing</SelectItem>
								<SelectItem value="electronics">Electronics</SelectItem>
								<SelectItem value="furniture">Furniture</SelectItem>
								<SelectItem value="books">Books</SelectItem>
								<SelectItem value="other">Other</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center ">
						{/* <List className="mr-2 text-gray-600 dark:text-gray-300 " /> */}
						<select
							value={itemsPerPage}
							onChange={handleItemsPerPageChange}
							className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md px-2 py-1 "
						>
							<option value={6} className="">6 per page</option>
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
										{/* <Button variant="outline" size="sm" className="flex-1">
											<Heart className="w-4 h-4 mr-2" />
											Save
										</Button> */}
										<Link href={`/browse-donations/${donation.id}`} className="flex-1">
											<Button className="w-full border hover:border-blue-500" size="sm">
												<Eye className="w-4 h-4 mr-2" />
												View Details
											</Button>
										</Link>
									</CardFooter>
								</Card>
							))}
						</div>

						{/* Pagination */}
						<div className="mt-8 pb-8 flex justify-center">
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

