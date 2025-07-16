import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { headers } from "next/headers";
import { isAdmin } from "@/lib/isAdmin";
import { uploadToS3 } from "@/services/upload-s3";
import { deleteFromS3, validateNewsFields } from "../utils";

const prisma = new PrismaClient();
const BUCKET = "news-images";

/**
 * Busca uma notícia específica
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const news = await prisma.news.findUnique({
      where: { id: params.id },
    });

    if (!news) {
      return NextResponse.json(
        { error: "Notícia não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ news });
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar notícia" },
      { status: 500 }
    );
  }
}

/**
 * Atualiza uma notícia (privado: admin)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const headersObj = await headers();
  if (!(await isAdmin(headersObj))) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const news = await prisma.news.findUnique({
      where: { id: params.id },
    });

    if (!news) {
      return NextResponse.json(
        { error: "Notícia não encontrada" },
        { status: 404 }
      );
    }

    // Valida campos do formulário
    const validationResult = validateNewsFields(formData);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }

    // Processa nova imagem se enviada
    const imageFile = formData.get("image") as File | null;
    let imageUrl = news.image;

    if (imageFile) {
      // Remove imagem antiga se existir
      if (news.image) {
        await deleteFromS3(news.image, BUCKET);
      }
      // Upload da nova imagem
      imageUrl = await uploadToS3(imageFile, BUCKET);
    }

    if (!validationResult.data) {
      return NextResponse.json(
        { error: "Dados de validação ausentes" },
        { status: 400 }
      );
    }
    const {
      title,
      subtitle,
      category,
      content,
      tags,
      publisher,
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

    const updatedNews = await prisma.news.update({
      where: { id: params.id },
      data: {
        title,
        subtitle,
        category,
        content,
        tags: tagsArray.map((tag) => tag.replace(/["\[\]]/g, "")),
        publisher,
        publishedAt: new Date(publicationDate),
        image: imageUrl,
      },
    });

    return NextResponse.json({
      msg: "Notícia atualizada com sucesso",
      news: updatedNews,
    });
  } catch (error) {
    console.error("Erro ao atualizar notícia:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar notícia" },
      { status: 400 }
    );
  }
}

/**
 * Remove uma notícia (privado: admin)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const headersObj = await headers();
  if (!(await isAdmin(headersObj))) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  try {
    const news = await prisma.news.findUnique({
      where: { id: params.id },
    });

    if (!news) {
      return NextResponse.json(
        { error: "Notícia não encontrada" },
        { status: 404 }
      );
    }

    // Remove a imagem se existir
    if (news.image) {
      await deleteFromS3(news.image, BUCKET);
    }

    await prisma.news.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ msg: "Notícia removida com sucesso" });
  } catch (error) {
    console.error("Erro ao remover notícia:", error);
    return NextResponse.json(
      { error: "Erro ao remover notícia" },
      { status: 500 }
    );
  }
}
