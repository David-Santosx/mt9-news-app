import { NextResponse } from "next/server";
import { getRecentNews } from "@/services/news-service";

export async function GET() {
  try {
    const news = await getRecentNews(9); // 9 notícias para o hero
    
    return NextResponse.json({ 
      success: true,
      news,
      total: news.length
    });
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Erro interno ao buscar notícias" 
      }, 
      { status: 500 }
    );
  }
}
