import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { headers } from "next/headers";
import { isAdmin } from "@/lib/isAdmin";
import { uploadToS3 } from "@/services/upload-s3";
import { deleteFromS3, validateAdsFields } from "../utils";

const prisma = new PrismaClient();
const BUCKET = "ads-images";

/**
 * Busca uma publicidade específica
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ads = await prisma.advertisement.findUnique({
      where: { id: params.id },
    });

    if (!ads) {
      return NextResponse.json(
        { error: "Publicidade não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ads });
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar publicidade" },
      { status: 500 }
    );
  }
}

/**
 * Atualiza uma publicidade (privado: admin)
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
    const ads = await prisma.advertisement.findUnique({
      where: { id: params.id },
    });

    if (!ads) {
      return NextResponse.json(
        { error: "Publicidade não encontrada" },
        { status: 404 }
      );
    }

    // Valida campos do formulário
    const validationResult = validateAdsFields(formData);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }

    // Processa nova imagem se enviada
    const imageFile = formData.get("image") as File | null;
    let imageUrl = ads.image;

    if (imageFile) {
      // Remove imagem antiga se existir
      if (ads.image) {
        await deleteFromS3(ads.image, BUCKET);
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
    const { campaing, startDate, endDate, link } = validationResult.data;
      
    const updatedAds = await prisma.advertisement.update({
      where: { id: params.id },
      data: {
        campaing,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        link,
        image: imageUrl,
      },
    });

    return NextResponse.json({
      msg: "Publicidade atualizada com sucesso",
      ads: updatedAds,
    });
  } catch (error) {
    console.error("Erro ao atualizar publicidade:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar publicidade" },
      { status: 400 }
    );
  }
}

/**
 * Remove uma publicidade (privado: admin)
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
    const ads = await prisma.advertisement.findUnique({
      where: { id: params.id },
    });

    if (!ads) {
      return NextResponse.json(
        { error: "Publicidade não encontrada" },
        { status: 404 }
      );
    }

    // Remove a imagem se existir
    if (ads.image) {
      await deleteFromS3(ads.image, BUCKET);
    }

    await prisma.advertisement.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ msg: "Publicidade removida com sucesso" });
  } catch (error) {
    console.error("Erro ao remover publicidade:", error);
    return NextResponse.json(
      { error: "Erro ao remover publicidade" },
      { status: 500 }
    );
  }
}
