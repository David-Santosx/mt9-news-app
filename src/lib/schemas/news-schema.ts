import { z } from "zod";

// Lista de categorias para ser usada tanto no schema quanto no formulário

/*
  * Categorias de notícias disponíveis.
  * Essas categorias são usadas para validar a categoria da notícia
  * e também podem ser utilizadas em formulários ou interfaces de usuário.
  * ["Geral", "Política", "Cidades", "Agronegócio", "Polícia", "Saúde", "Esportes", "Comércios"]
*/
export const NewsCategories = [
  "Geral",
  "Política",
  "Cidades",
  "Agronegócio",
  "Polícia",
  "Saúde",
  "Esportes",
  "Comércios",
];

export const newsSchema = z.object({
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres"),
  subtitle: z.string().default("").nullable(),
  source: z.string().optional(),
  imageSource: z.string().optional(),
  category: z
    .string()
    .refine((value) => NewsCategories.includes(value), {
      message: "Categoria inválida",
    })
    .default("Geral"),
  content: z
    .string()
    .min(20, "O conteúdo deve ter pelo menos 20 caracteres")
    .transform((str) => str.trim()),
  tags: z
    .array(z.string())
    .min(1, "Adicione pelo menos uma palavra-chave (tag)"),
  publisher: z
    .string()
    .min(3, "O nome do editor deve ter pelo menos 3 caracteres")
    .default("Da Redação"),
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
        ];
        return validTypes.includes(file.type);
      },
      {
        message: "A imagem deve ser um arquivo PNG, JPEG ou WEBP.",
      }
    )
    .optional(),
  publishedAt: z
    .date({ message: "Data inválida" })
    .optional()
    .default(() => new Date()),
});

export type News = z.infer<typeof newsSchema>;
