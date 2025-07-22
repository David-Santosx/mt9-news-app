import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Lista de origens permitidas
const allowedOrigins = [
  'https://www.mt9.com.br',
  'https://mt9.com.br',
  // Adicione aqui outras origens que você quer permitir
  // Por exemplo, para desenvolvimento local:
  'http://localhost:3000'
];

// Função para configurar os headers CORS
function setCorsHeaders(response: NextResponse, request?: NextRequest) {
  // Se tivermos o request, pegamos a origem dele
  const requestOrigin = request?.headers.get('origin');
  
  // Se a origem do request estiver na lista de permitidas, usamos ela
  // Caso contrário, usamos a primeira origem permitida como padrão
  const origin = requestOrigin && allowedOrigins.includes(requestOrigin)
    ? requestOrigin
    : allowedOrigins[0];

  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 horas
  
  return response;
}
 
export default async function middleware(request: NextRequest) {
  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });
    setCorsHeaders(response, request);
    return response;
  }

  // Admin route authentication
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const sessionCookie = getSessionCookie(request);
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin/auth", request.url));
    }
  }

  // Add security headers for SEO and security
  const response = NextResponse.next();
  setCorsHeaders(response, request);

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // Add cache control for dashboard pages (should not be cached)
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};