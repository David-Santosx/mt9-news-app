// Verificar ambiente para evitar erros de bundling do Prisma no cliente
import { prisma } from "@/lib/prisma";

// Verificar se estamos no ambiente do navegador
const isServer = typeof window === "undefined";

export interface News {
  id: string;
  title: string;
  subtitle: string | null;
  publisher: string;
  tags: string[];
  category: string;
  content: string;
  publishedAt: Date;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedNewsResult {
  news: News[];
  hasMore: boolean;
}

/**
 * Busca notícias recentes para a página principal
 * @param limit - Número de notícias a retornar
 * @returns Array de notícias ordenadas por data de publicação
 */
export async function getRecentNews(limit: number = 10): Promise<News[]> {
  // Verificar se o código está sendo executado no servidor
  if (!isServer) {
    throw new Error("Esta função só pode ser chamada no servidor");
  }

  try {
    const news = await prisma.news.findMany({
      orderBy: {
        publishedAt: "desc",
      },
      take: limit,
    });

    return news;
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
    throw new Error("Erro ao carregar notícias");
  }
}

/**
 * Busca notícias por categoria
 * @param category - Categoria das notícias
 * @param limit - Número de notícias a retornar
 * @returns Array de notícias da categoria especificada
 */
export async function getNewsByCategory(
  category: string,
  limit: number = 10,
  skip: number = 0
): Promise<News[]> {
  // Verificar se o código está sendo executado no servidor
  if (!isServer) {
    throw new Error("Esta função só pode ser chamada no servidor");
  }

  try {
    const news = await prisma.news.findMany({
      where: {
        category: category,
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: limit,
      skip: skip,
    });

    return news;
  } catch (error) {
    console.error("Erro ao buscar notícias por categoria:", error);
    throw new Error("Erro ao carregar notícias da categoria");
  }
}

/**
 * Busca uma notícia por ID
 * @param id - ID da notícia
 * @returns Notícia encontrada ou null
 */
export async function getNewsById(id: string): Promise<News | null> {
  // Verificar se o código está sendo executado no servidor
  if (!isServer) {
    throw new Error("Esta função só pode ser chamada no servidor");
  }

  try {
    const news = await prisma.news.findUnique({
      where: { id },
    });

    return news;
  } catch (error) {
    console.error("Erro ao buscar notícia por ID:", error);
    throw new Error("Erro ao carregar notícia");
  }
}

/**
 * Busca notícias paginadas por categoria
 * @param category - Categoria das notícias (opcional)
 * @param limit - Quantidade de notícias por página
 * @param skip - Quantidade de notícias a pular (para paginação)
 * @returns Objeto com array de notícias e indicador se há mais resultados
 */
export async function getPaginatedNews(
  category?: string,
  limit: number = 10,
  skip: number = 0
): Promise<PaginatedNewsResult> {
  // Verificar se o código está sendo executado no servidor
  if (!isServer) {
    throw new Error("Esta função só pode ser chamada no servidor");
  }

  try {
    // Configurar filtro condicional baseado na categoria
    // Adicionar log para diagnóstico
    console.log("Buscando notícias com categoria:", category);

    // Usar contains para uma correspondência mais flexível, ignorando case
    const where = category
      ? {
          category: {
            mode: "insensitive" as const,
            contains: category,
          },
        }
      : {};

    // Buscar notícias com os filtros aplicados
    const news = await prisma.news.findMany({
      where,
      orderBy: {
        publishedAt: "desc",
      },
      take: limit + 1, // Pegamos um a mais para checar se há mais resultados
      skip,
    });

    // Verificar se há mais resultados
    const hasMore = news.length > limit;

    // Se houver mais resultados, remover o item extra
    const limitedResults = hasMore ? news.slice(0, limit) : news;

    return {
      news: limitedResults,
      hasMore,
    };
  } catch (error) {
    console.error("Erro ao buscar notícias paginadas:", error);
    throw new Error("Erro ao carregar notícias");
  }
}
