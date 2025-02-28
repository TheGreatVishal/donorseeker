// /api/auth/logout

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJwtAccessToken } from '../../../../lib/jwt';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    // Parse the request body to get the email
    let email: string | undefined;
    try {
      const body = await request.json();
      email = body.email;
    } catch (error) {
      console.error("Error parsing request body:", error);
    }


    if (!token && !email) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    let userEmail = email;

    if (token) {
      const payload = verifyJwtAccessToken(token);

      if (payload && typeof payload !== 'string' && payload.email) {
        userEmail = payload.email;
      }
    }

    if (!userEmail) {
      return NextResponse.json({ message: "User email not found" }, { status: 400 });
    }

    const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 });

    // Clear the token cookie
    response.cookies.set('token', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ message: "An error occurred during logout" }, { status: 500 });
  }
}
