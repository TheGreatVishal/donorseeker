import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
	  console.log("\n==== MIDDLEWARE EXECUTION ====")
	  console.log("Requesting URL:", request.nextUrl.pathname)
	  console.log("Full URL:", request.url)

	const session = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
		secureCookie: process.env.NODE_ENV === "production",
	})

	const publicPaths = [
		"/",
		"",
		"/loginSystem/login",
		"/loginSystem/signup",
		"../public",
		"/loginSystem/forgot-password",
		"/loginSystem/reset-password",
		"/how-it-works",
		"/browse-donations",
		"/browse-requirements",
		"/leaderboard",
	]
	
	const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

	if (!session && !isPublicPath) {
		console.log("Middleware (!session and !public path).... redirecting to login page.....");
		return NextResponse.redirect(new URL('/loginSystem/login', request.url));
	}

	console.log("Proceeding with request")
	return NextResponse.next()
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public|assets|images|.*\\.(?:jpg|jpeg|png|gif|webp)).*)"],
}