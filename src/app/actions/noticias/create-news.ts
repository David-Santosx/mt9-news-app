"use server";
import { News } from "@/lib/schemas/news-schema";
import { prisma } from "@/lib/prisma";
import { uploadToS3 } from "@/services/upload-s3";
import slugify from "slugify";
import { revalidateTag } from "next/cache";

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
        slug: slugify(data.title, {
          lower: true,
        }),
        subtitle: data.subtitle,
        category: data.category,
        slugCategory: slugify(data.category, {
          lower: true,
        }),
        content: data.content,
        tags: data.tags,
        publisher: data.publisher,
        publishedAt: new Date(data.publishedAt),
        image: imageUrl,
        source: data.source || null,
        imageSource: data.imageSource || null,
      },
    });

    revalidateTag("public-news");
    revalidateTag("public-news-by-category");
    revalidateTag("public-news-by-title");
    revalidateTag("public-news-by-slug");
    revalidateTag("public-news-by-category-slug");

    return news;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    }
  }
}
