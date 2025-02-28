import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { adminKey } = await request.json()

    if (!adminKey) {
      return NextResponse.json({ error: "Admin key is required" }, { status: 400 })
    }

    // to update admin key later
    const validAdminKey = process.env.ADMIN_KEY || "admin123"

    const isValid = adminKey === validAdminKey

    return NextResponse.json({
      valid: isValid,
      message: isValid ? "Admin key verified" : "Invalid admin key",
    })
  } catch (error) {
    console.error("Error verifying admin key:", error)
    return NextResponse.json({ error: "An error occurred while verifying admin key" }, { status: 500 })
  }
}

