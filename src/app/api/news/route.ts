import { NextResponse, NextRequest } from "next/server";
import { getPaginatedNews } from "@/services/news-service";
import { corsHeaders } from "../cors";

// Definir explicitamente o runtime como Node.js para garantir que este código seja executado no servidor
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 9; // Default é 9 notícias
    const skipParam = searchParams.get("skip");
    const skip = skipParam ? parseInt(skipParam, 10) : 0;

    // Usar a função unificada para buscar notícias com ou sem categoria
    const result = await getPaginatedNews(category || undefined, limit, skip);

    return corsHeaders(
      request,
      NextResponse.json({
        success: true,
        news: result.news,
        hasMore: result.hasMore,
      })
    );
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
    return corsHeaders(
      request,
      NextResponse.json(
        {
          success: false,
          error: "Erro interno ao buscar notícias",
        },
        { status: 500 }
      )
    );
  }
}
