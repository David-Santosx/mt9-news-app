"use server";
import { withCache } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import { News as PrismaNews } from "@prisma/client";
import slugify from "slugify";

/**
 * Busca as últimas notícias.
 * @param limit - Número de notícias a retornar (padrão é 10).
 * @param skip - Número de notícias a pular (para paginação).
 * @returns Array de notícias ordenadas por data de publicação.
 * @throws Erro ao buscar notícias.
 */
export async function getNews(
  limit: number | undefined = 10,
  skip: number | undefined = 0
): Promise<PrismaNews[]> {
  try {
    const news = await prisma.news.findMany({
      orderBy: {
        publishedAt: "desc",
      },
      take: limit,
      skip: skip,
    });

    return news;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
    throw new Error("Erro ao buscar notícias");
  }
}

/**
 * Busca notícias por categoria.
 * @param category - Categoria das notícias a serem buscadas.
 * @param limit - Número de notícias a retornar (padrão é 10).
 * @param skip - Número de notícias a pular (para paginação).
 * @returns Array de notícias da categoria especificada.
 * @throws Erro ao buscar notícias por categoria.
 */
export async function getNewsByCategory(
  category: string,
  limit: number | undefined = 10,
  skip: number = 0
): Promise<PrismaNews[]> {
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
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
    throw new Error("Erro ao buscar notícias por categoria");
  }
}

/**
 * Busca notícias por categoria usando slug.
 * @param category - Slug da categoria das notícias a serem buscadas.
 * @param limit - Número de notícias a retornar (padrão é 10).
 * @param skip - Número de notícias a pular (para paginação).
 * @returns Array de notícias da categoria especificada.
 * @throws Erro ao buscar notícias por categoria.
 */
export async function getNewsByCategorySlug(
  category: string,
  limit: number | undefined = 10,
  skip: number = 0
): Promise<PrismaNews[]> {
  try {
    const news = await prisma.news.findMany({
      where: {
        slugCategory: slugify(category, {
          lower: true,
        }),
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: limit,
      skip: skip,
    });
    return news;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
    throw new Error("Erro ao buscar notícias por categoria");
  }
}

/**
 * Busca uma notícia pelo título.
 * @param title - Título da notícia a ser buscada.
 * @returns A notícia encontrada ou null se não houver correspondência.
 * @throws Erro ao buscar notícia por título.
 */
export async function getNewsByTitle(
  title: string
): Promise<PrismaNews | null> {
  try {
    // Normaliza o título da busca para corresponder ao formato slugified
    const searchTitle = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });

    const news = await prisma.news.findFirst({
      where: {
        slug: {
          contains: searchTitle,
          mode: "insensitive",
        },
      },
    });
    return news;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
    throw new Error("Erro ao buscar notícia por título");
  }
}

/**
 * Busca uma notícia pelo slug.
 * @param slug - Slug da notícia a ser buscada.
 * @returns A notícia encontrada ou null se não houver correspondência.
 * @throws Erro ao buscar notícia por slug.
 */
export async function getNewsBySlug(slug: string): Promise<PrismaNews | null> {
  try {
    const news = await prisma.news.findUnique({
      where: {
        slug: slug,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        subtitle: true,
        source: true,
        imageSource: true,
        publisher: true,
        tags: true,
        category: true,
        slugCategory: true,
        content: true,
        publishedAt: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return news;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
    throw new Error("Erro ao buscar notícia por slug");
  }
}

export const getPublicNews = withCache(
  getNews,
  ["public-news"],
  { revalidate: 15 } // Revalidar a cada 15 segundos
);

export const getPublicNewsByCategory = withCache(
  getNewsByCategory,
  ["public-news-by-category"],
  { revalidate: 15 }
);

export const getPublicNewsByTitle = withCache(
  getNewsByTitle,
  ["public-news-by-title"],
  { revalidate: 15 }
);

export const getPublicNewsBySlug = withCache(
  getNewsBySlug,
  ["public-news-by-slug"],
  { revalidate: 15 }
);

export const getPublicNewsByCategorySlug = withCache(
  getNewsByCategorySlug,
  ["public-news-by-category-slug"],
  { revalidate: 15 }
);

/**
 * Busca notícias por termo de pesquisa.
 * @param searchTerm - Termo de pesquisa para buscar nas notícias.
 * @param limit - Número de notícias a retornar (padrão é 10).
 * @returns Array de notícias que correspondem ao termo de pesquisa.
 * @throws Erro ao buscar notícias por termo.
 */
export async function searchNews(
  searchTerm: string,
  limit: number = 10
): Promise<PrismaNews[]> {
  try {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return [];
    }

    const news = await prisma.news.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            subtitle: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            tags: {
              has: searchTerm,
            },
          },
        ],
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: limit,
    });

    return news;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
    throw new Error("Erro ao buscar notícias por termo");
  }
}

export const getPublicSearchNews = withCache(
  searchNews,
  ["public-search-news"],
  { revalidate: 30 }
);