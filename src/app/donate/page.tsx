"use client"

import type React from "react"

import { useState, useRef, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Gift, Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

// Define types based on the schema
type Condition = "NEW" | "USED" | "GOOD" | "FAIR" | "BAD"
// type ListingStatus = "PENDING" | "APPROVED" | "REJECTED"

interface DonationFormData {
  title: string
  description: string
  category: string
  condition: Condition
  imageUrls: string[]
  contact: string
}

export default function DonatePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [formData, setFormData] = useState<DonationFormData>({
    title: "",
    description: "",
    category: "",
    condition: "GOOD",
    imageUrls: [],
    contact: "",
  })

  // UI state
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  // Handle form field changes
  const handleChange = (field: keyof DonationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)

      // Create preview URLs
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file))

      setImageFiles((prev) => [...prev, ...newFiles])
      setImagePreviews((prev) => [...prev, ...newPreviews])
    }
  }

  // Remove an image
  const removeImage = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[index])

    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // Upload images to Cloudinary
  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return []

    setIsUploading(true)
    const uploadedUrls: string[] = []

    try {
      // Create an array of upload promises
      console.log("Uploading images...");

      const uploadPromises = imageFiles.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/image-upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Failed to upload image")
        }

        const data = await response.json()

        if (!data.publicId) {
          throw new Error("No public ID returned for image")
        }

        // Construct the Cloudinary URL
        return `https://res.cloudinary.com/dbkd7odv8/image/upload/${data.publicId}`
      })

      // Wait for all uploads to complete
      const results = await Promise.all(uploadPromises)
      uploadedUrls.push(...results)
      console.log(uploadedUrls);

      return uploadedUrls
    } catch (error) {
      console.error("Error uploading images:", error)
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your images. Please try again.",
      })
      return []
    } finally {
      setIsUploading(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    console.log("Submitting donation...");

    // Validate form
    if (!formData.title || !formData.description || !formData.category || !formData.condition || !formData.contact) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        // variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Upload images first
      const uploadedImageUrls = await uploadImages()

      // Prepare the final data with uploaded image URLs
      const finalData = {
        ...formData,
        imageUrls: uploadedImageUrls,
      }

      console.log(finalData);
      console.log("Submitting donation in db...");

      // Submit the donation listing
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      })

      if (!response.ok) {
        throw new Error("Failed to create donation listing")
      }

      toast({
        title: "Donation Listed",
        description: "Your donation has been submitted for approval.",
      })

      // Redirect to the donations page or a success page
      router.push("/donate/success")
    } catch (error) {
      console.error("Error submitting donation:", error)
      toast({
        title: "Submission Failed",
        description: "There was a problem submitting your donation. Please try again.",
        // variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
      <div className="container px-4 md:px-6 max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center">List Your Donation</h2>
        <Card className="w-full bg-white dark:bg-gray-800">
          <form onSubmit={handleSubmit}>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">Donation Details</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Provide information about the item you are donating.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2 ">
                <Label htmlFor="title" className="text-gray-700 dark:text-gray-200 font-semibold">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter a title for your donation"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700 dark:text-gray-200 font-semibold">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your donation in detail"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-700 dark:text-gray-200 font-semibold">
                  Category
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="household">Household Items</SelectItem>
                    <SelectItem value="baby">Baby & Kids</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Condition */}
              <div className="space-y-2">
                <Label htmlFor="condition" className="text-gray-700 dark:text-gray-200 font-semibold">
                  Condition
                </Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => handleChange("condition", value as Condition)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="USED">Used</SelectItem>
                    <SelectItem value="GOOD">Good</SelectItem>
                    <SelectItem value="FAIR">Fair</SelectItem>
                    <SelectItem value="BAD">Bad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Contact Information */}
              <div className="space-y-2">
                <Label htmlFor="contact" className="text-gray-700 dark:text-gray-200 font-semibold">
                  Contact Information
                </Label>
                <Input
                  id="contact"
                  placeholder="Phone number or email"
                  value={formData.contact}
                  onChange={(e) => handleChange("contact", e.target.value)}
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-200 font-semibold">Images</Label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center bg-gray-50 dark:bg-gray-900">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />

                  {/* Image previews */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                          <Image
                            src={preview || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            width={500} // Adjust width as needed
                            height={500} // Adjust height as needed
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white"
                            aria-label="Remove image"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Images
                  </Button>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Upload up to 5 images of your donation
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
                className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
              >
                {isSubmitting || isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isUploading ? "Uploading..." : "Submitting..."}
                  </>
                ) : (
                  <>
                    <Gift className="mr-2 h-4 w-4" />
                    List Donation
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

