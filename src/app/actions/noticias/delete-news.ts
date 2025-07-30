"use server";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export async function deleteNews(id: string): Promise<void> {
  try {
    // Verifica se a notícia existe
    const news = await prisma.news.findUnique({
      where: {
        id: id,
      },
    });

    if (!news) {
      throw new Error("Notícia não encontrada");
    }

    // Deleta a notícia
    await prisma.news.delete({
      where: {
        id: id,
      },
    });

    revalidateTag("public-news");
    revalidateTag("public-news-by-category");
    revalidateTag("public-news-by-title");
    revalidateTag("public-news-by-slug");
    revalidateTag("public-news-by-category-slug");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
    throw new Error("Erro ao deletar notícia");
  }
}
