import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { corsHeaders } from "./app/api/cors";

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Verificar se estamos acessando uma rota que requer autenticação
  const requiresAuth =
    path.startsWith("/dashboard") || path.startsWith("/api/admin");

  // Obter o cookie de sessão apenas se a autenticação for necessária
  const sessionCookie = requiresAuth ? getSessionCookie(request) : null;

  // Handle preflight requests (OPTIONS)
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Max-Age": "86400", // 24 hours
      },
    });

    // Aplicar cabeçalhos CORS usando a função centralizada
    return corsHeaders(request, response);
  }

  // Verificar autenticação apenas para rotas que requerem autenticação
  if (requiresAuth && !sessionCookie) {
    const redirectResponse = NextResponse.redirect(
      new URL("/admin/auth", request.url)
    );
    return corsHeaders(request, redirectResponse);
  }

  // Add security headers for SEO and security
  const response = NextResponse.next();

  // Aplicar cabeçalhos CORS usando a função centralizada
  corsHeaders(request, response);

  // Security headers that also help with SEO
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
  matcher: [
    "/dashboard/:path*",
    "/api/:path*", // Incluir todas as rotas da API
  ],
};