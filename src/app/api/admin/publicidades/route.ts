import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/services/upload-s3";
import { headers } from "next/headers";
import { isAdmin } from "@/lib/isAdmin";
import { deleteFromS3, validateAdsFields } from "./utils";
import { prisma } from "@/lib/prisma";

const BUCKET = process.env.S3_ADS_BUCKET || "ads-images";

/**
 * Cria uma publicidade (privado: admin)
 */
export async function POST(request: NextRequest) {
  const headersObj = await headers();
  if (!(await isAdmin(headersObj))) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }
  try {
    const formData = await request.formData();

    // Log dos dados recebidos para debug
    console.log("Dados recebidos:", {
      campaing: formData.get("campaing"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      link: formData.get("link"),
    });

    // Processa imagem
    const imageFile = formData.get("image") as File | null;
    let imageUrl: string | null = null;
    if (imageFile) {
      imageUrl = await uploadToS3(imageFile, BUCKET);
    }

    // Valida e processa os campos
    try {
      const validationResult = validateAdsFields(formData);
      if (!validationResult.success) {
        throw new Error(validationResult.error);
      }
      if (!validationResult.data) {
        throw new Error("Dados de validação ausentes.");
      }
      const { campaing, startDate, endDate, link, position } =
        validationResult.data;

      // Cria a publicidade no banco de dados
      const ads = await prisma.advertisement.create({
        data: {
          campaing,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          link,
          position,
          image: imageUrl,
        },
      });
      return NextResponse.json({ msg: "Publicidade criada com sucesso", ads });
    } catch (error) {
      console.error("Erro detalhado:", error);
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Erro ao criar publicidade",
          details: error,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar publicidade" },
      { status: 500 }
    );
  }
}

/**
 * Lista todas as publicidades (GET público)
 */
export async function GET() {
  try {
    const ads = await prisma.advertisement.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ ads });
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar publicidades" },
      { status: 500 }
    );
  }
}

/**
 * Deleta uma publicidade e sua imagem (privado: admin)
 */
export async function DELETE(request: NextRequest) {
  const headersObj = await headers();
  if (!(await isAdmin(headersObj))) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }
  try {
    const { id } = await request.json();
    // Busca publicidade
    const ads = await prisma.advertisement.findUnique({ where: { id } });
    if (!ads) {
      return NextResponse.json(
        { error: "Publicidade não encontrada" },
        { status: 404 }
      );
    }
    // Remove imagem do storage se existir
    if (ads.image) {
      await deleteFromS3(ads.image, BUCKET);
    }
    await prisma.advertisement.delete({ where: { id } });
    return NextResponse.json({ msg: "Publicidade deletada com sucesso" });
  } catch {
    return NextResponse.json(
      { error: "Erro ao deletar publicidade" },
      { status: 400 }
    );
  }
}
