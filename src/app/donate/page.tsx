// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Gift, Upload, X } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { toast } from "@/components/ui/use-toast"

// export default function DonatePage() {
//   const router = useRouter()
//   const [images, setImages] = useState<string[]>([])
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   // Mock function to handle image upload
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       // In a real app, you would upload the file to a server
//       // Here we're just creating object URLs for preview
//       const newImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
//       setImages([...images, ...newImages])
//     }
//   }

//   const removeImage = (index: number) => {
//     const newImages = [...images]
//     newImages.splice(index, 1)
//     setImages(newImages)
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsSubmitting(true)

//     // Simulate API call
//     setTimeout(() => {
//       setIsSubmitting(false)
//       toast({
//         title: "Donation Listed",
//         description: "Your donation has been submitted for approval.",
//       })
//       router.push("/my-requests")
//     }, 1500)
//   }

//   return (
//     <div className="flex flex-col">
//       <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/10 to-background">
//         <div className="container px-4 md:px-6">
//           <div className="flex flex-col items-center justify-center space-y-4 text-center">
//             <div className="space-y-2">
//               <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Donate an Item</h1>
//               <p className="max-w-[900px] text-muted-foreground md:text-xl">
//                 List an item you'd like to donate to someone in need.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="w-full py-12">
//         <div className="container px-4 md:px-6">
//           <Card className="max-w-2xl mx-auto">
//             <CardHeader>
//               <CardTitle>Donation Details</CardTitle>
//               <CardDescription>Provide information about the item you're donating.</CardDescription>
//             </CardHeader>
//             <form onSubmit={handleSubmit}>
//               <CardContent className="space-y-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="title">Title</Label>
//                   <Input id="title" placeholder="e.g., 'Winter Jacket'" required />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="description">Description</Label>
//                   <Textarea
//                     id="description"
//                     placeholder="Describe the item, including any defects or special features"
//                     className="min-h-[120px]"
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="category">Category</Label>
//                     <Select required>
//                       <SelectTrigger id="category">
//                         <SelectValue placeholder="Select category" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="clothing">Clothing</SelectItem>
//                         <SelectItem value="electronics">Electronics</SelectItem>
//                         <SelectItem value="furniture">Furniture</SelectItem>
//                         <SelectItem value="books">Books</SelectItem>
//                         <SelectItem value="household">Household Items</SelectItem>
//                         <SelectItem value="baby">Baby & Kids</SelectItem>
//                         <SelectItem value="other">Other</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="condition">Condition</Label>
//                     <Select required>
//                       <SelectTrigger id="condition">
//                         <SelectValue placeholder="Select condition" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="NEW">New</SelectItem>
//                         <SelectItem value="USED">Used</SelectItem>
//                         <SelectItem value="GOOD">Good</SelectItem>
//                         <SelectItem value="FAIR">Fair</SelectItem>
//                         <SelectItem value="BAD">Bad</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Images</Label>
//                   <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
//                     <Input
//                       type="file"
//                       accept="image/*"
//                       multiple
//                       className="hidden"
//                       id="image-upload"
//                       onChange={handleImageUpload}
//                     />
//                     <Label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
//                       <Upload className="h-10 w-10 text-muted-foreground mb-2" />
//                       <span className="text-muted-foreground">Click to upload images</span>
//                       <span className="text-xs text-muted-foreground mt-1">(Upload up to 5 images)</span>
//                     </Label>
//                   </div>

//                   {images.length > 0 && (
//                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
//                       {images.map((image, index) => (
//                         <div key={index} className="relative group">
//                           <img
//                             src={image || "/placeholder.svg"}
//                             alt={`Upload ${index + 1}`}
//                             className="h-24 w-full object-cover rounded-md"
//                           />
//                           <button
//                             type="button"
//                             onClick={() => removeImage(index)}
//                             className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                           >
//                             <X className="h-4 w-4" />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="contact">Contact Information</Label>
//                   <Input id="contact" placeholder="Phone number or preferred contact method" required />
//                 </div>

//                 <div className="space-y-3">
//                   <Label>Pickup/Delivery Options</Label>
//                   <RadioGroup defaultValue="pickup">
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="pickup" id="pickup" />
//                       <Label htmlFor="pickup">Pickup Only</Label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="delivery" id="delivery" />
//                       <Label htmlFor="delivery">Can Deliver</Label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="both" id="both" />
//                       <Label htmlFor="both">Both Options Available</Label>
//                     </div>
//                   </RadioGroup>
//                 </div>
//               </CardContent>

//               <CardFooter className="flex justify-between">
//                 <Button variant="outline" type="button" onClick={() => router.back()}>
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={isSubmitting}>
//                   {isSubmitting ? (
//                     <span className="flex items-center">
//                       <svg
//                         className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         ></circle>
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         ></path>
//                       </svg>
//                       Submitting...
//                     </span>
//                   ) : (
//                     <span className="flex items-center">
//                       <Gift className="mr-2 h-4 w-4" />
//                       List Donation
//                     </span>
//                   )}
//                 </Button>
//               </CardFooter>
//             </form>
//           </Card>
//         </div>
//       </section>
//     </div>
//   )
// }

