import { AdPosition } from "@prisma/client";
import { z } from "zod";

// Lista de categorias para ser usada tanto no schema quanto no formulário
export const AdPositionList = [AdPosition.HEADER, AdPosition.HIGHLIGHT];

export const adsSchema = z.object({
  campaing: z.string().min(5, "A campanha deve ter pelo menos 5 caracteres"),
  startDate: z
    .union([z.date(), z.string().datetime()])
    .transform((val) => new Date(val))
    .optional()
    .default(() => new Date()),
  endDate: z
    .union([z.date(), z.string().datetime()])
    .transform((val) => new Date(val))
    .optional()
    .default(() => new Date(new Date().setDate(new Date().getDate() + 30))),
  image: z
    .any()
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "O tamanho máximo é 10MB.",
    })
    .refine((file) => file instanceof File || file === null, {
      message: "A imagem deve ser um arquivo.",
    })
    .refine(
      (file) => {
        if (!file) return true;
        const validTypes = [
          "image/png",
          "image/jpeg",
          "image/webp",
          "image/jpg",
          "image/gif",
        ];
        return validTypes.includes(file.type);
      },
      {
        message: "A imagem deve ser um arquivo PNG, JPEG ou WEBP.",
      }
    )
    .optional(),
  link: z.string().url("Deve ser uma URL válida").optional().nullable(),
  position: z
    .enum([AdPosition.HEADER, AdPosition.HIGHLIGHT])
    .default(AdPosition.HEADER),
});

export type Ads = z.infer<typeof adsSchema>;
