import { type NextRequest, NextResponse } from "next/server"
import prisma from '../../../../lib/prisma';
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, contact, isAdmin } = await request.json()

    // Validate required fields
    if (!username || !email || !password || !contact) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    })

    if (existingUsername) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 })
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (existingEmail) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    // Validate contact number length
    if (contact.length < 7 || contact.length > 15) {
      return NextResponse.json({ error: "Contact number must be between 7 and 15 characters" }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create the user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        contact,
        isAdmin: !!isAdmin,
        verified: true, // Since we've verified via OTP
      },
    })

    // Delete the OTP verification record
    await prisma.oTPVerification
      .delete({
        where: { email },
      })
      .catch(() => {
        // Ignore error if record doesn't exist
      })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json({ error: "An error occurred while registering user" }, { status: 500 })
  }
}

