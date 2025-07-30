"use server";
import { withCache } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import { AdPosition, Advertisement as PrismaAds } from "@prisma/client";

/**
 * Busca todos os anúncios.
 * @returns Array de anúncios ordenados por data de criação.
 * @throws Erro ao buscar anúncios.
 */
export async function getAds(): Promise<PrismaAds[]> {
  try {
    const ads = await prisma.advertisement.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return ads;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
    throw new Error("Erro ao buscar anúncios");
  }
}

/**
 * Busca anúncios por posição.
 * @param category - Categoria dos anúncios a serem buscados.
 * @param limit - Número de anúncios a retornar (padrão é 10).
 * @param skip - Número de anúncios a pular (para paginação).
 * @returns Array de anúncios da categoria especificada.
 * @throws Erro ao buscar anúncios por categoria.
 */
export async function getAdsByPosition(
  position: AdPosition | undefined
): Promise<PrismaAds[]> {
  try {
    const ads = await prisma.advertisement.findMany({
      where: {
        position: position,
      },
    });
    return ads;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
    throw new Error("Erro ao buscar anúncios por posição");
  }
}


/**
 * Busca um anúncio por campanha.
 * @param campaing - Nome da campanha do anúncio a ser buscado.
 * @returns Anúncio correspondente ou null se não encontrado.
 * @throws Erro ao buscar anúncio por campanha.
 */
export async function getAdsByCampaing(campaing: string): Promise<PrismaAds | null> {
  try {
    const ad = await prisma.advertisement.findUnique({
      where: {
        campaing: campaing,
      },
    });
    return ad;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
    throw new Error("Erro ao buscar anúncio por campanha");
  }
}

export const getPublicAds = withCache(getAds, ["public-ads"]);
