import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { isAdmin } from "@/lib/isAdmin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const headersObj = await headers();
  if (!(await isAdmin(headersObj))) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  try {
    // Notícias e publicidades totais
    const [totalNews, totalAds] = await Promise.all([
      prisma.news.count(),
      prisma.advertisement.count(),
    ]);

    // Contagem de notícias por mês
    const newsCountByMonth = await prisma.$queryRaw`
      SELECT 
        COUNT(*)::integer as count,
        DATE_TRUNC('month', "createdAt" AT TIME ZONE 'UTC')::date as "createdAt"
      FROM "News"
      GROUP BY DATE_TRUNC('month', "createdAt" AT TIME ZONE 'UTC')
      ORDER BY "createdAt" ASC
    `;

    return NextResponse.json({
      totalNews,
      totalAds,
      newsCountByMonth,
    });
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erro ao buscar dados do dashboard";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
