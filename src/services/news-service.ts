import { prisma } from "@/lib/prisma";

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

/**
 * Busca notícias recentes para a página principal
 * @param limit - Número de notícias a retornar
 * @returns Array de notícias ordenadas por data de publicação
 */
export async function getRecentNews(limit: number = 10): Promise<News[]> {
  try {
    const news = await prisma.news.findMany({
      orderBy: {
        publishedAt: 'desc'
      },
      take: limit,
    });
    
    return news;
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    throw new Error('Erro ao carregar notícias');
  }
}

/**
 * Busca notícias por categoria
 * @param category - Categoria das notícias
 * @param limit - Número de notícias a retornar
 * @returns Array de notícias da categoria especificada
 */
export async function getNewsByCategory(category: string, limit: number = 10): Promise<News[]> {
  try {
    const news = await prisma.news.findMany({
      where: {
        category: category
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: limit,
    });
    
    return news;
  } catch (error) {
    console.error('Erro ao buscar notícias por categoria:', error);
    throw new Error('Erro ao carregar notícias da categoria');
  }
}

/**
 * Busca uma notícia por ID
 * @param id - ID da notícia
 * @returns Notícia encontrada ou null
 */
export async function getNewsById(id: string): Promise<News | null> {
  try {
    const news = await prisma.news.findUnique({
      where: { id }
    });
    
    return news;
  } catch (error) {
    console.error('Erro ao buscar notícia por ID:', error);
    throw new Error('Erro ao carregar notícia');
  }
}
