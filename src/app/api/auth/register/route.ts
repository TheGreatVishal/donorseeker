import { type NextRequest, NextResponse } from "next/server"
import prisma from "../../../../lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { logApiActivity } from "@/utils/logApiActivity"

const signupSchema = z
  .object({
    firstname: z.string().min(2, "First name must be at least 2 characters").max(30),
    lastname: z.string().max(30).optional(),
    email: z.string().email().max(40),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(30, "Password cannot exceed 30 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
    contact: z.string().min(7).max(15),
    isAdmin: z.boolean().default(false),
    adminKey: z.string().optional(),
    otp: z.string().length(6, "OTP must be exactly 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export async function POST(request: NextRequest) {
  const endpoint = "/api/auth/register"
  const section = "Auth"
  const requestType = "POST"

  try {
    const body = await request.json()
    const parsedData = signupSchema.safeParse(body)

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

    const { isAdmin } = parsedData.data
    let { firstname, lastname, email, password, contact, otp, adminKey } = parsedData.data

    lastname = lastname || ""

    const existingEmail = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (existingEmail) {
      await logApiActivity({
        request,
        session: null,
        section,
        endpoint,
        requestType,
        statusCode: 400,
        description: `Email already exists: ${email}`,
      })
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    const otpRecord = await prisma.oTPVerification.findUnique({ where: { email } })

    if (!otpRecord || otpRecord.otp !== otp) {
      await logApiActivity({
        request,
        session: null,
        section,
        endpoint,
        requestType,
        statusCode: 400,
        description: `Invalid or missing OTP for email: ${email}`,
      })
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    if (isAdmin) {
      if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
        await logApiActivity({
          request,
          session: null,
          section,
          endpoint,
          requestType,
          statusCode: 403,
          description: `Invalid Admin Key attempt for email: ${email}`,
        })
        return NextResponse.json({ error: "Invalid Admin Key" }, { status: 403 })
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
        contact,
        isAdmin,
        verified: true,
      },
    })

    await prisma.oTPVerification.delete({ where: { email } }).catch(() => {})

    // Clear sensitive data
    firstname = lastname = email = password = contact = otp = adminKey = ""

    await logApiActivity({
      request,
      session: null,
      section,
      endpoint,
      requestType,
      statusCode: 200,
      description: `User registered successfully with ID: ${user.id}`,
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error) {
    console.error("Error registering user:", error)

    await logApiActivity({
      request,
      session: null,
      section,
      endpoint,
      requestType,
      statusCode: 500,
      description: `Internal error during signup - ${error instanceof Error ? error.message : "unknown error"}`,
    })

    return NextResponse.json({ error: "An error occurred while registering user" }, { status: 500 })
  }
}
