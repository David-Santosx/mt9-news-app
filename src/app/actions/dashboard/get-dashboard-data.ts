"use server";

import { withCache } from "@/lib/cache";
import { prisma } from "@/lib/prisma";

export type NewsCount = {
  count: number;
  createdAt: string;
};

export type DashboardData = {
  totalNews: number;
  totalAds: number;
  newsCountByDay: NewsCount[];
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

    return {
      totalNews,
      totalAds,
      newsCountByDay: formattedNewsCount,
    };
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    throw new Error("Falha ao carregar dados do dashboard");
  }
};

export const getDashboardDataCached = withCache(getDashboardData, [
  "dashboard-data",
]);
