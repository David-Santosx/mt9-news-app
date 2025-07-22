import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lista centralizada de origens permitidas
// Se precisar atualizar as origens permitidas, modifique apenas esta lista
export const allowedOrigins = [
  'https://mt9.com.br',
  'https://www.mt9.com.br',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://admin.mt9.com.br',
];

// Função para adicionar cabeçalhos CORS à resposta
export function corsHeaders(request: NextRequest, response: NextResponse) {
  const origin = request.headers.get('origin');

  // Se não houver origem, retornar resposta sem modificações
  if (!origin) {
    return response;
  }

  // Verificar se a origem está na lista ou é um subdomínio de uma origem permitida
  const isAllowedOrigin = allowedOrigins.some(allowed => 
    origin === allowed || origin.endsWith('.' + allowed.replace(/^https?:\/\//, ''))
  );
  
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  }

  return response;
}
