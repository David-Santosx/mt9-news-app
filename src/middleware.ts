import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export default function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  // Se não houver cookie de sessão, redireciona para a página de autenticação
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/admin/auth", request.url));
  }

  // Se houver cookie de sessão, continua a requisição
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};