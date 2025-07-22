import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/services/upload-s3";
import { headers } from "next/headers";
import { isAdmin } from "@/lib/isAdmin";
import { deleteFromS3, validateNewsFields } from "./utils";
import { prisma } from "@/lib/prisma";
import { corsHeaders } from "../../cors";

const BUCKET = process.env.S3_NEWS_BUCKET || "news-images";

/**
 * Cria uma notícia (privado: admin)
 */
export async function POST(request: NextRequest) {
  const headersObj = await headers();
  if (!(await isAdmin(headersObj))) {
    return corsHeaders(
      request,
      NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    );
  }
  try {
    const formData = await request.formData();

    // Log dos dados recebidos para debug
    console.log("Dados recebidos:", {
      title: formData.get("title"),
      subtitle: formData.get("subtitle"),
      category: formData.get("category"),
      content: formData.get("content"),
      tags: formData.get("tags"),
      publisher: formData.get("publisher"),
      publicationDate: formData.get("publicationDate"),
    });

    // Processa imagem
    const imageFile = formData.get("image") as File | null;
    let imageUrl: string | null = null;
    if (imageFile) {
      imageUrl = await uploadToS3(imageFile, BUCKET);
    }

    // Valida e processa os campos
    try {
      const validationResult = validateNewsFields(formData);
      if (!validationResult.success) {
        throw new Error(validationResult.error);
      }
      if (!validationResult.data) {
        throw new Error("Dados de validação ausentes.");
      }
      const {
        title,
        subtitle,
        publisher,
        category,
        content,
        tags,
        publicationDate,
      } = validationResult.data;

      // Processa as tags para garantir um array limpo
      let tagsArray: string[];
      try {
        // Se já for um array, usa diretamente
        if (Array.isArray(tags)) {
          tagsArray = tags;
        } else if (typeof tags === "string") {
          // Se for uma string JSON, tenta fazer parse
          try {
            const parsed = JSON.parse(tags);
            tagsArray = Array.isArray(parsed) ? parsed : [tags];
          } catch {
            // Se falhar o parse, assume que é uma string separada por vírgulas
            tagsArray = tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean);
          }
        } else {
          tagsArray = [];
        }
      } catch {
        tagsArray = [];
      }

      // Cria notícia
      const news = await prisma.news.create({
        data: {
          title,
          subtitle,
          publisher,
          category,
          content,
          tags: tagsArray.map((tag) => tag.replace(/["\[\]]/g, "")), // Remove aspas e colchetes extras
          publishedAt: new Date(publicationDate),
          image: imageUrl,
          createdAt: new Date(),
        },
      });
      return corsHeaders(
        request,
        NextResponse.json({ msg: "Notícia criada com sucesso", news })
      );
    } catch (error) {
      console.error("Erro detalhado:", error);
      return corsHeaders(
        request,
        NextResponse.json(
          {
            error:
              error instanceof Error ? error.message : "Erro ao criar notícia",
            details: error,
          },
          { status: 400 }
        )
      );
    }
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return corsHeaders(
      request,
      NextResponse.json(
        { error: "Erro interno ao criar notícia" },
        { status: 500 }
      )
    );
  }
}

/**
 * Lista todas as notícias (GET público)
 */
export async function GET(request: NextRequest) {
  try {
    const news = await prisma.news.findMany({
      orderBy: { publishedAt: "desc" },
    });
    return corsHeaders(request, NextResponse.json({ news }));
  } catch {
    return corsHeaders(
      request,
      NextResponse.json({ error: "Erro ao buscar notícias" }, { status: 500 })
    );
  }
}

/**
 * Deleta uma notícia e sua imagem (privado: admin)
 */
export async function DELETE(request: NextRequest) {
  const headersObj = await headers();
  if (!(await isAdmin(headersObj))) {
    return corsHeaders(
      request,
      NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    );
  }
  try {
    const { id } = await request.json();
    // Busca notícia
    const news = await prisma.news.findUnique({ where: { id } });
    if (!news) {
      return corsHeaders(
        request,
        NextResponse.json({ error: "Notícia não encontrada" }, { status: 404 })
      );
    }
    // Remove imagem do storage se existir
    if (news.image) {
      await deleteFromS3(news.image, BUCKET);
    }
    await prisma.news.delete({ where: { id } });
    return corsHeaders(
      request,
      NextResponse.json({ msg: "Notícia deletada com sucesso" })
    );
  } catch {
    return corsHeaders(
      request,
      NextResponse.json({ error: "Erro ao deletar notícia" }, { status: 400 })
    );
  }
}
