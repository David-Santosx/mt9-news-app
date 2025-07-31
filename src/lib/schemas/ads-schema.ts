import { AdPosition } from "@/../prisma/generated";
import { z } from "zod";

// Lista de categorias para ser usada tanto no schema quanto no formulário
export const AdPositionList = [AdPosition.HEADER, AdPosition.HIGHLIGHT];

export const adsSchema = z.object({
  campaing: z.string().min(5, "A campanha deve ter pelo menos 5 caracteres"),
  startDate: z
    .date()
    .optional()
    .default(() => new Date()),
  endDate: z
    .date()
    .optional()
    .default(() => {
      const date = new Date();
      date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000); // Padrão para 30 dias após a data atual
      return date;
    }),
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
