export const config = {
  matcher: [
    // Aplica o middleware a todas as rotas da API
    '/api/:path*',
    // E todas as rotas do admin
    '/admin/:path*'
  ],
}
