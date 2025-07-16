/**
 * Verifica se o usuário autenticado é admin
 * @param headersObj Cabeçalhos da requisição
 * @returns boolean
 */
import { auth } from "@/lib/auth";

export async function isAdmin(headersObj: Headers): Promise<boolean> {
  const session = await auth.api.getSession({ headers: headersObj });
  if (!session) return false;
  // Busca usuário no banco
  return session.user.role === "admin";
}
