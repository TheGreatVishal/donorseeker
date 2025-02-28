import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { signJwtAccessToken } from '../../../../lib/jwt';

export async function POST(request: Request) {
	
	try {
		const body = await request.json();
		const { email, password } = body;
	
		const user = await prisma.user.findUnique({
			where: { email: email },
		});
		
		if (!user) {
			return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		
		if (!isPasswordValid) {
			return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
		}
		
		const { password: _, ...userWithoutPassword } = user;
		const accessToken = signJwtAccessToken(userWithoutPassword);

		const response = NextResponse.redirect(new URL('/home', request.url)); // Use a relative path
		
		response.cookies.set({
			name: 'token',
			value: accessToken,
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60, // 30 days
			path: '/', // Ensure the path is root to access across the application
		});
		
		return response; // Return the redirect response
	} catch (error) {
		console.error('Login error:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}