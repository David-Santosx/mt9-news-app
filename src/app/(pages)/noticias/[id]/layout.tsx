import { Metadata } from "next";
import { getNewsById } from "@/services/news-service";

// Gerar metadados dinâmicos para cada notícia
export async function generateMetadata(
  props: {
    params: Promise<{ id: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  try {
    const id = params.id;
    const news = await getNewsById(id);

    if (!news) {
      return {
        title: "Notícia não encontrada | MT9 Notícias",
        description: "A notícia solicitada não foi encontrada",
      };
    }

    return {
      title: `${news.title} | MT9 Notícias`,
      description: news.subtitle || `Leia mais sobre ${news.title}`,
      openGraph: {
        title: news.title,
        description: news.subtitle || `Leia mais sobre ${news.title}`,
        images: news.image ? [news.image] : [],
        type: "article",
        publishedTime: new Date(news.publishedAt).toISOString(),
        authors: [news.publisher],
        tags: news.tags,
      },
    };
  } catch (error) {
    console.error("Erro ao gerar metadados:", error);
    return {
      title: "MT9 Notícias",
      description: "Portal de notícias MT9",
    };
  }
}

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
