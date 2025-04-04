import { type NextRequest, NextResponse } from "next/server"
import prisma from "../../../../lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { logApiActivity } from "@/utils/logApiActivity"

const resetPasswordSchema = z.object({
  email: z.string().email().max(40, "Email cannot exceed 40 characters"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .max(30, "Password cannot exceed 30 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
})

export async function POST(request: NextRequest) {
  const endpoint = "/api/auth/reset-password"
  const section = "Auth"
  const requestType = "POST"

  try {
    const body = await request.json()
    const parsedData = resetPasswordSchema.safeParse(body)

    if (!parsedData.success) {
      await logApiActivity({
        request,
        session: null,
        section,
        endpoint,
        requestType,
        statusCode: 400,
        description: `Validation failed: ${parsedData.error.errors[0].message}`,
      })
      return NextResponse.json({ error: parsedData.error.errors[0].message }, { status: 400 })
    }

    let { email, otp, password } = parsedData.data

    const otpVerification = await prisma.oTPVerification.findUnique({ where: { email } })

    if (!otpVerification) {
      await logApiActivity({
        request,
        session: null,
        section,
        endpoint,
        requestType,
        statusCode: 400,
        description: `No OTP found for email: ${email}`,
      })
      return NextResponse.json({ error: "No OTP found for this email" }, { status: 400 })
    }

    if (new Date() > otpVerification.expiresAt) {
      await logApiActivity({
        request,
        session: null,
        section,
        endpoint,
        requestType,
        statusCode: 400,
        description: `Expired OTP for email: ${email}`,
      })
      return NextResponse.json({ error: "OTP has expired. Please request a new one" }, { status: 400 })
    }

    if (otpVerification.otp !== otp) {
      await logApiActivity({
        request,
        session: null,
        section,
        endpoint,
        requestType,
        statusCode: 400,
        description: `Invalid OTP for email: ${email}`,
      })
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    })

    await prisma.oTPVerification.delete({ where: { email } })

    // Clear sensitive variables
    email = otp = password = ""

    await logApiActivity({
      request,
      session: null,
      section,
      endpoint,
      requestType,
      statusCode: 200,
      description: `Password reset successfully for user`,
    })

    return NextResponse.json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    console.error("Error resetting password:", error)

    await logApiActivity({
      request,
      session: null,
      section,
      endpoint,
      requestType,
      statusCode: 500,
      description: `Internal error during password reset - ${error instanceof Error ? error.message : "unknown error"}`,
    })

    return NextResponse.json({ error: "An error occurred while resetting password" }, { status: 500 })
  }
}
