"use server";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export async function deleteAds(id: string): Promise<void> {
  try {
    // Verifica se o anúncio existe
    const ad = await prisma.advertisement.findUnique({
      where: {
        id: id,
      },
    });

    if (!ad) {
      throw new Error("Anúncio não encontrado");
    }

    // Deleta o anúncio
    await prisma.advertisement.delete({
      where: {
        id: id,
      },
    });

    // Revalida as tags de cache relacionadas a anúncios
    revalidateTag("public-ads");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
    throw new Error("Erro ao deletar anúncio");
  }
}
