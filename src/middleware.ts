import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
 
export default async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
 
	if (!sessionCookie) {
		return NextResponse.redirect(new URL("/admin/auth", request.url));
	}
 
	return NextResponse.next();
}
 
export const config = {
  matcher: ["/dashboard"],
};