import { NextResponse, NextRequest } from "next/server";
import { getNewsById } from "@/services/news-service";

// Definir explicitamente o runtime como Node.js para garantir que este código seja executado no servidor
export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "ID da notícia não fornecido",
        },
        { status: 400 }
      );
    }

    const news = await getNewsById(id);

    if (!news) {
      return NextResponse.json(
        {
          success: false,
          error: "Notícia não encontrada",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      news,
    });
  } catch (error) {
    console.error("Erro ao buscar notícia por ID:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno ao buscar notícia",
      },
      { status: 500 }
    );
  }
}
