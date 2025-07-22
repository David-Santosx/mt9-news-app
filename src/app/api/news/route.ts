import { NextResponse, NextRequest } from "next/server";
import { getRecentNews, getNewsByCategory } from "@/services/news-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 9; // Default é 9 notícias

    let news;

    if (category) {
      // Buscar notícias por categoria
      news = await getNewsByCategory(category, limit);
    } else {
      // Buscar notícias recentes (sem filtro de categoria)
      news = await getRecentNews(limit);
    }

    return NextResponse.json({
      success: true,
      news,
      total: news.length,
    });
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno ao buscar notícias",
      },
      { status: 500 }
    );
  }
}
