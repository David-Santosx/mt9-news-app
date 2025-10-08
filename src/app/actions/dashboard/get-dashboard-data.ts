"use server";

import { withCache } from "@/lib/cache";
import { prisma } from "@/lib/prisma";

export type NewsCount = {
  count: number;
  createdAt: string;
};

export type CategoryCount = {
  category: string;
  count: number;
};

export type DashboardData = {
  totalNews: number;
  totalAds: number;
  newsCountByDay: NewsCount[];
  categoryDistribution: CategoryCount[];
  latestNews: {
    id: string;
    title: string;
    subtitle: string | null;
    slug: string;
    image: string | null;
    publishedAt: Date;
    category: string;
  } | null;
};

export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    // Busca o total de notícias
    const totalNews = await prisma.news.count();

    // Busca o total de anúncios
    const totalAds = await prisma.advertisement.count();

    // Busca a contagem de notícias por dia
    const newsCountByDay = await prisma.news.groupBy({
      by: ["publishedAt"],
      _count: {
        id: true,
      },
      orderBy: {
        publishedAt: "asc",
      },
    });

    // Formata os dados de contagem por dia
    const formattedNewsCount: NewsCount[] = newsCountByDay.map((item) => ({
      count: item._count.id,
      createdAt: item.publishedAt.toISOString(),
    }));
    
    // Busca a notícia mais recente
    const latestNews = await prisma.news.findFirst({
      select: {
        id: true,
        title: true,
        subtitle: true,
        slug: true,
        image: true,
        publishedAt: true,
        category: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
    });
    
    // Busca a distribuição de notícias por categoria (limitado às 10 notícias mais recentes)
    const recentNewsByCategory = await prisma.news.groupBy({
      by: ["category"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 10, // Limita a 10 categorias para não sobrecarregar o gráfico
    });

    // Formata os dados de distribuição por categoria
    const categoryDistribution: CategoryCount[] = recentNewsByCategory.map((item) => ({
      category: item.category,
      count: item._count.id,
    }));

    return {
      totalNews,
      totalAds,
      newsCountByDay: formattedNewsCount,
      categoryDistribution,
      latestNews,
    };
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    throw new Error("Falha ao carregar dados do dashboard");
  }
};

export const getDashboardDataCached = withCache(
  getDashboardData,
  ["dashboard-data"],
  { revalidate: 30 } // Dashboard pode ter um cache um pouco maior por ser menos crítico
);
