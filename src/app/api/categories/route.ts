import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Definir explicitamente o runtime como Node.js para garantir que este código seja executado no servidor
export const runtime = "nodejs";

export async function GET() {
  try {
    // Buscar categorias distintas existentes no banco de dados
    const categories = await prisma.news.findMany({
      select: {
        category: true,
      },
      distinct: ["category"],
    });

    // Extrair apenas os nomes das categorias
    const categoryNames = categories.map(item => item.category);

    return NextResponse.json({
      success: true,
      categories: categoryNames,
    });
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno ao buscar categorias",
      },
      { status: 500 }
    );
  }
}
