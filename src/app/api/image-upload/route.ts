import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
}

export async function POST(request: Request) {

    console.log("=================================================");
    console.log("(image-upload/route.ts) Uploading image...");
    
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Convert buffer to base64
    const fileStr = buffer.toString("base64")
    const fileUri = `data:${file.type};base64,${fileStr}`

    // Upload to Cloudinary
    const uploadResult: CloudinaryUploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        fileUri,
        {
          folder: "donations", // Store in a donations folder
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as CloudinaryUploadResult);
        },
      );
    });
    
    console.log("Upload result:", uploadResult);
    console.log();
    
    console.log("=================================================");
    
    // Return the Cloudinary response
    return NextResponse.json({
      publicId: uploadResult.public_id,
      url: uploadResult.secure_url,
    });
    
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}

