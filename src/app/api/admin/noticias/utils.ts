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

/**
 * Valida os campos obrigatórios do formulário
 */
export function validateNewsFields(formData: FormData) {
  const title = formData.get("title");
  const subtitle = formData.get("subtitle");
  const category = formData.get("category");
  const content = formData.get("content");
  const tagsStr = formData.get("tags");
  const publisher = formData.get("publisher");
  const publicationDate = formData.get("publicationDate");

  if (!title || !subtitle || !category || !content || !tagsStr || !publisher || !publicationDate) {
    return {
      success: false,
      error: "Todos os campos são obrigatórios"
    };
  }

  // Valida data
  const parsedDate = new Date(publicationDate as string);
  if (isNaN(parsedDate.getTime())) {
    return {
      success: false,
      error: "Data de publicação inválida"
    };
  }

  // Valida tags
  let parsedTags;
  try {
    parsedTags = JSON.parse(tagsStr as string);
    if (!Array.isArray(parsedTags)) {
      return {
        success: false,
        error: "Tags deve ser um array"
      };
    }
  } catch {
    return {
      success: false,
      error: "Formato de tags inválido"
    };
  }

  return {
    success: true,
    data: {
      title: title as string,
      subtitle: subtitle as string,
      category: category as string,
      content: content as string,
      tags: tagsStr as string,
      publisher: publisher as string,
      publicationDate: publicationDate as string
    }
  };
}
