// to check if the username already exist or not, on signup page

import { type NextRequest, NextResponse } from "next/server"
import prisma from '../../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    })

    return NextResponse.json({
      available: !existingUser,
    })
  } catch (error) {
    console.error("Error checking username:", error)
    return NextResponse.json({ error: "An error occurred while checking username" }, { status: 500 })
  }
}

