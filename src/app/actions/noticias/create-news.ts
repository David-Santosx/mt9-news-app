"use server";
import { News } from "@/app/(dashboard)/(admin)/dashboard/noticias/components/news-form";
import { prisma } from "@/lib/prisma";
import { uploadToS3 } from "@/services/upload-s3";

export async function createNews(data: News) {
  try {
    const existingNews = await prisma.news.findFirst({
      where: {
        title: data.title,
      },
    });

    // Verifica se já existe uma notícia com o mesmo título
    if (existingNews) {
      throw new Error("Já existe uma notícia com este título");
    }

    // Envia a imagem para o S3
    const imageUrl = await uploadToS3(
      data.image,
      process.env.S3_NEWS_BUCKET || "news-images"
    );

    // Verifica se a imagem foi enviada corretamente
    if (!imageUrl) {
      throw new Error("Erro ao enviar imagem para o Banco de Dados");
    }

    // Cria a notícia no banco de dados
    const news = await prisma.news.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        category: data.category,
        content: data.content,
        tags: data.tags,
        publisher: data.publisher,
        publishedAt: new Date(data.publishedAt),
        image: imageUrl,
      },
    });

    return news;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
  }
}
