import { type NextRequest, NextResponse } from "next/server"
import { logApiActivity } from "@/utils/logApiActivity"

export async function POST(request: NextRequest) {
  const endpoint = "/api/auth/verify-admin-key"
  const section = "Auth"
  const requestType = "POST"

  try {
    const { adminKey } = await request.json()

    if (!adminKey) {
      await logApiActivity({
        request,
        session: null,
        section,
        endpoint,
        requestType,
        statusCode: 400,
        description: "Admin key is missing in request body",
      })
      return NextResponse.json({ error: "Admin key is required" }, { status: 400 })
    }

    // Fallback key for testing if env is not set
    const validAdminKey = process.env.ADMIN_KEY || "admin123"
    const isValid = adminKey === validAdminKey

    await logApiActivity({
      request,
      session: null,
      section,
      endpoint,
      requestType,
      statusCode: 200,
      description: isValid ? "Admin key verified successfully" : "Admin key verification failed",
    })

    return NextResponse.json({
      valid: isValid,
      message: isValid ? "Admin key verified" : "Invalid admin key",
    })
  } catch (error) {
    console.error("Error verifying admin key:", error)

    await logApiActivity({
      request,
      session: null,
      section,
      endpoint,
      requestType,
      statusCode: 500,
      description: `Internal error verifying admin key - ${error instanceof Error ? error.message : "unknown error"}`,
    })

    return NextResponse.json({ error: "An error occurred while verifying admin key" }, { status: 500 })
  }
}
