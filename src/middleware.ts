import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {

	const session = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
		secureCookie: process.env.NODE_ENV === 'production',
		raw: true, // Try retrieving the raw token
		cookieName: "token", // Explicitly specify the token name
	  });
	// console.log("Middleware (request): ", request);
	

    // console.log("Middleware (session): ", session);
    

	const publicPaths = ['/', '/loginSystem/login', '/loginSystem/signup', '../public'];

	const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

	if (!session && !isPublicPath) {
		console.log("Middleware (!session and !public path).... redirecting to login page.....");
		return NextResponse.redirect(new URL('/loginSystem/login', request.url));
	}

	if (session) {
		console.log("Middleware (session exists): ", session);
		// You can add additional checks here if needed
	}

	return NextResponse.next();
}


export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico|public|assets|images|.*\\.(?:jpg|jpeg|png|gif|webp)).*)',
	],
};