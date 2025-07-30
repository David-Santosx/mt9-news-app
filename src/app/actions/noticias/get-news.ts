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
    return console.log(`Buscando notícias para a categoria: ${category}`), news;
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
    });
    return news;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
    throw new Error("Erro ao buscar notícia por slug");
  }
}

export const getPublicNews = withCache(getNews, ["public-news"]);
export const getPublicNewsByCategory = withCache(getNewsByCategory, [
  "public-news-by-category",
]);
export const getPublicNewsByTitle = withCache(getNewsByTitle, [
  "public-news-by-title",
]);
export const getPublicNewsBySlug = withCache(getNewsBySlug, [
  "public-news-by-slug",
]);
export const getPublicNewsByCategorySlug = withCache(getNewsByCategorySlug, [
  "public-news-by-category-slug",
]);
