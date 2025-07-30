import { Metadata } from "next";
import NewsHeroSection from "../components/news-hero-section";
import NewsCategoriesSection from "../components/news-categories-section";

// Gerar metadados para a página inicial
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Página Inicial",
    description: "Bem-vindo ao MT9 Notícias - Portal de notícias atualizado",
    openGraph: {
      title: "MT9 Notícias",
      description:
        "Portal de notícias atualizado com as últimas informações do estado do Mato Grosso.",
      images: [
        {
          url: "/images/og-image.jpg",
          width: 500,
          height: 500,
          alt: "MT9 Notícias - Portal de notícias",
        },
      ],
      type: "website",
    },
    keywords: [
      "notícias",
      "Mato Grosso",
      "Brasil",
      "notícias atualizadas",
      "portal de notícias",
      "MT9",
      "notícias do dia",
      "notícias locais",
    ],
  };
}

export default function Page() {
  return (
    <main>
      <NewsHeroSection />
      <NewsCategoriesSection />
    </main>
  );
}
