// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"

// interface Requirement {
//   id: string
//   title: string
//   description: string
//   category: string
//   urgency: string
//   imageUrls: string[]
//   contact: string
//   user: {
//     username: string
//     email: string
//   }
// }

// export default function BrowseRequirementsPage() {
//   const [requirements, setRequirements] = useState<Requirement[]>([])
//   const [category, setCategory] = useState("all")
//   const [urgency, setUrgency] = useState("all")
//   const [searchTerm, setSearchTerm] = useState("")

//   useEffect(() => {
//     fetchRequirements()
//   }, [category, urgency])

//   const fetchRequirements = async () => {
//     try {
//       const url = new URL("/api/requirements", window.location.origin)
//       if (category !== "all") {
//         url.searchParams.append("category", category)
//       }
//       if (urgency !== "all") {
//         url.searchParams.append("urgency", urgency)
//       }
//       const response = await fetch(url.toString())
//       if (!response.ok) {
//         throw new Error("Failed to fetch requirements")
//       }
//       const data = await response.json()
//       setRequirements(data)
//     } catch (error) {
//       console.error("Error fetching requirements:", error)
//     }
//   }

//   const filteredRequirements = requirements.filter(
//     (requirement) =>
//       requirement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       requirement.description.toLowerCase().includes(searchTerm.toLowerCase()),
//   )

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8">Browse Requirements</h1>
//       <div className="flex gap-4 mb-8">
//         <Input
//           placeholder="Search requirements..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="max-w-sm"
//         />
//         <Select value={category} onValueChange={setCategory}>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Category" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Categories</SelectItem>
//             <SelectItem value="clothing">Clothing</SelectItem>
//             <SelectItem value="electronics">Electronics</SelectItem>
//             <SelectItem value="furniture">Furniture</SelectItem>
//             <SelectItem value="books">Books</SelectItem>
//             <SelectItem value="other">Other</SelectItem>
//           </SelectContent>
//         </Select>
//         <Select value={urgency} onValueChange={setUrgency}>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Urgency" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Urgencies</SelectItem>
//             <SelectItem value="LOW">Low</SelectItem>
//             <SelectItem value="NORMAL">Normal</SelectItem>
//             <SelectItem value="HIGH">High</SelectItem>
//             <SelectItem value="URGENT">Urgent</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredRequirements.map((requirement) => (
//           <Card key={requirement.id}>
//             <CardHeader>
//               <CardTitle>{requirement.title}</CardTitle>
//               <CardDescription>{requirement.category}</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <p className="text-sm text-gray-600 dark:text-gray-400">{requirement.description}</p>
//               {requirement.imageUrls.length > 0 && (
//                 <img
//                   src={requirement.imageUrls[0] || "/placeholder.svg"}
//                   alt={requirement.title}
//                   className="mt-4 rounded-md"
//                 />
//               )}
//             </CardContent>
//             <CardFooter className="flex justify-between">
//               <span className="text-sm text-gray-500">Urgency: {requirement.urgency}</span>
//               <Button>Offer Help</Button>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }

