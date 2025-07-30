"use server";
import { prisma } from "@/lib/prisma";
import { uploadToS3 } from "@/services/upload-s3";
import { Ads } from "@/lib/schemas/ads-schema";
import { revalidateTag } from "next/cache";

export async function createAds(data: Ads) {
  try {
    const existingAds = await prisma.advertisement.findFirst({
      where: {
        campaing: data.campaing,
      },
    });

    // Verifica se já existe um anúncio com o mesmo título
    if (existingAds) {
      throw new Error("Já existe um anúncio com este título");
    }

    // Envia a imagem para o S3
    const imageUrl = await uploadToS3(
      data.image,
      process.env.S3_ADS_BUCKET || "ads-images"
    );

    // Verifica se a imagem foi enviada corretamente
    if (!imageUrl) {
      throw new Error("Erro ao enviar imagem para o Banco de Dados");
    }

    // Cria o anúncio no banco de dados
    const ad = await prisma.advertisement.create({
      data: {
        campaing: data.campaing,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        image: imageUrl,
        link: data.link,
        position: data.position,
      },
    });

    revalidateTag("public-ads");

    return ad;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
    throw new Error("Erro ao criar anúncio");
  }
}
