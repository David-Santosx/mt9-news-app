import { s3 } from "@/services/upload-s3";

/**
 * Remove arquivo do S3/MinIO
 * @param imageUrl URL completa da imagem
 * @param bucket Nome do bucket
 */
export async function deleteFromS3(imageUrl: string, bucket: string) {
  const urlParts = imageUrl.split("/");
  const filename = urlParts[urlParts.length - 1];
  const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
  await s3.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: filename,
    })
  );
}

type AdPosition = "HEADER" | "HIGHLIGHT";

/**
 * Valida os campos obrigatórios do formulário
 */
export function validateAdsFields(formData: FormData) {
  const campaing = formData.get("campaing");
  const startDate = formData.get("startDate");
  const endDate = formData.get("endDate");
  const link = formData.get("link");
  const position = formData.get("position");

  if (!campaing || !startDate || !endDate || !link || !position) {
    return {
      success: false,
      error: "Todos os campos são obrigatórios",
    };
  }

  // Valida posição
  if (!["HEADER", "HIGHLIGHT"].includes(position as string)) {
    return {
      success: false,
      error: "Posição inválida",
    };
  }

  // Valida data
  const parsedStartDate = new Date(startDate as string);
  if (isNaN(parsedStartDate.getTime())) {
    return {
      success: false,
      error: "Data de início inválida",
    };
  }

  const parsedEndDate = new Date(endDate as string);
  if (isNaN(parsedEndDate.getTime())) {
    return {
      success: false,
      error: "Data de término inválida",
    };
  }

  if (parsedEndDate <= parsedStartDate) {
    return {
      success: false,
      error: "Data de término deve ser maior que a data de início",
    };
  }

    // Valida link
  if (link && !/^https?:\/\//.test(link as string)) {
    return {
      success: false,
      error: "Link deve começar com http:// ou https://",
    };
  }

  return {
    success: true,
    data: {
      campaing: campaing as string,
      startDate: startDate as string,
      endDate: endDate as string,
      link: link as string,
      position: position as AdPosition,
    },
  };
}
