"use server";
import { prisma } from "@/lib/prisma";
import { News, NewsCategories } from "@/lib/schemas/news-schema";
import { revalidateTag } from "next/cache";
import slugify from "slugify";

// Dados de exemplo para popular o banco de dados com notícias (3 notícias por categoria)
const newsData: News[] = [
  // GERAL (3)
  {
    title: "Festival Cultural Reúne Artistas Locais",
    subtitle: "Evento celebra a diversidade cultural da região",
    tags: ["cultura", "arte", "eventos"],
    content:
      "O festival reuniu diversos artistas locais, promovendo a cultura regional e atraindo visitantes de toda a região.",
    image: "https://placehold.co/800x500?text=Festival+Cultural",
    category: NewsCategories[0],
    publishedAt: new Date(),
    publisher: "Cultura News",
  },
  {
    title: "Inovações Tecnológicas Transformam o Cotidiano",
    subtitle: "Como a tecnologia está mudando nossa rotina",
    tags: ["tecnologia", "inovação", "cotidiano"],
    content:
      "Novas tecnologias estão transformando a forma como vivemos, trabalhamos e nos relacionamos.",
    image: "https://placehold.co/800x500?text=Inovações+Tecnológicas",
    category: NewsCategories[0],
    publishedAt: new Date(),
    publisher: "Tech Today",
  },
  {
    title: "Descobertas Científicas Promissoras",
    subtitle: "Avanços que podem mudar o futuro",
    tags: ["ciência", "pesquisa", "descobertas"],
    content:
      "Pesquisadores anunciam descobertas importantes em diversas áreas da ciência.",
    image: "https://placehold.co/800x500?text=Descobertas+Científicas",
    category: NewsCategories[0],
    publishedAt: new Date(),
    publisher: "Science Daily",
  },

  // POLÍTICA (3)
  {
    title: "Desafios Globais na Política Internacional",
    subtitle: "Os desafios das relações globais",
    tags: ["política", "internacional", "diplomacia"],
    content:
      "Líderes mundiais discutem estratégias para enfrentar os desafios globais.",
    image: "https://placehold.co/800x500?text=Política+Internacional",
    category: NewsCategories[1],
    publishedAt: new Date(),
    publisher: "Global Politics",
  },
  {
    title: "Educação e Políticas Públicas",
    subtitle: "O papel do governo na educação",
    tags: ["educação", "política", "governo"],
    content:
      "Especialistas discutem como políticas públicas podem melhorar a educação.",
    image: "https://placehold.co/800x500?text=Educação+e+Políticas",
    category: NewsCategories[1],
    publishedAt: new Date(),
    publisher: "Education Policy",
  },
  {
    title: "Nova Lei Ambiental é Aprovada",
    subtitle: "Mudanças na legislação ambiental",
    tags: ["política", "meio ambiente", "legislação"],
    content:
      "Congresso aprova nova lei que visa proteger áreas de preservação ambiental.",
    image: "https://placehold.co/800x500?text=Lei+Ambiental",
    category: NewsCategories[1],
    publishedAt: new Date(),
    publisher: "Policy News",
  },

  // CIDADES (3)
  {
    title: "Cidades Inteligentes",
    subtitle: "Como a tecnologia está transformando as cidades",
    tags: ["cidades", "tecnologia", "inovação"],
    content:
      "As cidades inteligentes estão se tornando uma realidade com o uso de tecnologia avançada.",
    image: "https://placehold.co/800x500?text=Cidades+Inteligentes",
    category: NewsCategories[2],
    publishedAt: new Date(),
    publisher: "Smart Cities",
  },
  {
    title: "Revitalização do Centro Histórico",
    subtitle: "Projeto de restauração preserva patrimônio cultural",
    tags: ["cidades", "cultura", "história"],
    content:
      "Obras de revitalização do centro histórico resgatam a memória da cidade.",
    image: "https://placehold.co/800x500?text=Centro+Histórico",
    category: NewsCategories[2],
    publishedAt: new Date(),
    publisher: "City News",
  },
  {
    title: "Cidades e Mobilidade Urbana",
    subtitle: "Soluções para o transporte nas cidades",
    tags: ["cidades", "mobilidade", "transporte"],
    content:
      "A mobilidade urbana é um dos principais desafios das cidades modernas.",
    image: "https://placehold.co/800x500?text=Mobilidade+Urbana",
    category: NewsCategories[2],
    publishedAt: new Date(),
    publisher: "Urban Mobility",
  },

  // AGRONEGÓCIO (3)
  {
    title: "Agronegócio Sustentável",
    subtitle: "Práticas que preservam o meio ambiente",
    tags: ["agronegócio", "sustentabilidade", "meio ambiente"],
    content:
      "O agronegócio sustentável está ganhando força com práticas que preservam o meio ambiente.",
    image: "https://placehold.co/800x500?text=Agronegócio+Sustentável",
    category: NewsCategories[3],
    publishedAt: new Date(),
    publisher: "Agro News",
  },
  {
    title: "Tecnologia no Campo",
    subtitle: "Inovações revolucionam a agricultura",
    tags: ["agronegócio", "tecnologia", "agricultura"],
    content:
      "Agricultores adotam novas tecnologias para aumentar a produtividade.",
    image: "https://placehold.co/800x500?text=Tecnologia+Campo",
    category: NewsCategories[3],
    publishedAt: new Date(),
    publisher: "Agro Tech",
  },
  {
    title: "Safra Recorde de Grãos",
    subtitle: "Produção agrícola atinge números históricos",
    tags: ["agronegócio", "safra", "economia"],
    content: "Produção de grãos supera expectativas e estabelece novo recorde.",
    image: "https://placehold.co/800x500?text=Safra+Recorde",
    category: NewsCategories[3],
    publishedAt: new Date(),
    publisher: "Rural News",
  },

  // POLÍCIA (3)
  {
    title: "Segurança Pública e Tecnologia",
    subtitle: "Como a tecnologia está ajudando a polícia",
    tags: ["polícia", "tecnologia", "segurança"],
    content:
      "Novas ferramentas tecnológicas estão sendo usadas para melhorar a segurança pública.",
    image: "https://placehold.co/800x500?text=Segurança+Pública",
    category: NewsCategories[4],
    publishedAt: new Date(),
    publisher: "Security News",
  },
  {
    title: "Polícia Comunitária",
    subtitle: "A importância da proximidade com a comunidade",
    tags: ["polícia", "comunidade", "segurança"],
    content:
      "A polícia comunitária tem mostrado resultados positivos na segurança pública.",
    image: "https://placehold.co/800x500?text=Polícia+Comunitária",
    category: NewsCategories[4],
    publishedAt: new Date(),
    publisher: "Community Security",
  },
  {
    title: "Programa de Prevenção ao Crime",
    subtitle: "Iniciativas reduzem índices de criminalidade",
    tags: ["polícia", "prevenção", "segurança"],
    content:
      "Novo programa de prevenção ao crime apresenta resultados positivos.",
    image: "https://placehold.co/800x500?text=Prevenção+Crime",
    category: NewsCategories[4],
    publishedAt: new Date(),
    publisher: "Police News",
  },

  // SAÚDE (3)
  {
    title: "Avanços na Medicina Genética",
    subtitle: "Novas descobertas prometem tratamentos personalizados",
    tags: ["medicina", "genética", "saúde"],
    content:
      "Pesquisadores estão desenvolvendo terapias genéticas que podem tratar doenças raras de forma mais eficaz.",
    image: "https://placehold.co/800x500?text=Medicina+Genética",
    category: NewsCategories[5],
    publishedAt: new Date(),
    publisher: "Health Daily",
  },
  {
    title: "Saúde Mental em Foco",
    subtitle: "A importância do cuidado psicológico",
    tags: ["saúde", "mental", "bem-estar"],
    content: "Especialistas destacam a importância de cuidar da saúde mental.",
    image: "https://placehold.co/800x500?text=Saúde+Mental",
    category: NewsCategories[5],
    publishedAt: new Date(),
    publisher: "Mental Health News",
  },
  {
    title: "Avanços na Saúde Pública",
    subtitle: "Novas iniciativas para melhorar a saúde",
    tags: ["saúde", "pública", "iniciativas"],
    content:
      "Governos estão investindo em programas para melhorar a saúde pública.",
    image: "https://placehold.co/800x500?text=Saúde+Pública",
    category: NewsCategories[5],
    publishedAt: new Date(),
    publisher: "Health Initiatives",
  },

  // ESPORTES (3)
  {
    title: "Esportes e Inclusão Social",
    subtitle: "O impacto do esporte na sociedade",
    tags: ["esportes", "inclusão", "sociedade"],
    content:
      "O esporte tem sido uma ferramenta poderosa para promover a inclusão social.",
    image: "https://placehold.co/800x500?text=Esportes+e+Inclusão",
    category: NewsCategories[6],
    publishedAt: new Date(),
    publisher: "Sports Weekly",
  },
  {
    title: "Esportes e Saúde",
    subtitle: "A relação entre atividade física e bem-estar",
    tags: ["esportes", "saúde", "bem-estar"],
    content: "Praticar esportes é essencial para manter a saúde e o bem-estar.",
    image: "https://placehold.co/800x500?text=Esportes+e+Saúde",
    category: NewsCategories[6],
    publishedAt: new Date(),
    publisher: "Health Sports",
  },
  {
    title: "Jovens Atletas em Destaque",
    subtitle: "Nova geração promete futuro brilhante",
    tags: ["esportes", "jovens", "atletismo"],
    content: "Jovens atletas mostram talento em competições regionais.",
    image: "https://placehold.co/800x500?text=Jovens+Atletas",
    category: NewsCategories[6],
    publishedAt: new Date(),
    publisher: "Youth Sports",
  },

  // COMÉRCIOS (3)
  {
    title: "Comércios Locais em Alta",
    subtitle: "A valorização do comércio de bairro",
    tags: ["comércios", "local", "economia"],
    content:
      "Os comércios locais estão ganhando destaque com o apoio das comunidades.",
    image: "https://placehold.co/800x500?text=Comércios+Locais",
    category: NewsCategories[7],
    publishedAt: new Date(),
    publisher: "Local Business",
  },
  {
    title: "Comércio Eletrônico em Expansão",
    subtitle: "O crescimento das vendas online",
    tags: ["comércios", "e-commerce", "tecnologia"],
    content:
      "O comércio eletrônico está em alta, com mais pessoas comprando online.",
    image: "https://placehold.co/800x500?text=Comércio+Eletrônico",
    category: NewsCategories[7],
    publishedAt: new Date(),
    publisher: "E-Commerce News",
  },
  {
    title: "Inovação no Varejo",
    subtitle: "Tecnologias que transformam as vendas",
    tags: ["comércios", "varejo", "inovação"],
    content: "Novas tecnologias estão mudando a forma como as lojas operam.",
    image: "https://placehold.co/800x500?text=Inovação+Varejo",
    category: NewsCategories[7],
    publishedAt: new Date(),
    publisher: "Retail News",
  },
];

export async function seedNews() {
  try {
    // Verifica se já existem notícias no banco de dados
    const existingNews = await prisma.news.count();
    if (existingNews > 0) {
      throw new Error("Já existem notícias cadastradas no banco de dados.");
    }

    // Insere as notícias no banco de dados
    for (const news of newsData) {
      await prisma.news.create({
        data: {
          title: news.title,
          slug: slugify(news.title, { lower: true }),
          subtitle: news.subtitle,
          category: news.category,
          slugCategory: slugify(news.category, { lower: true }),
          content: news.content,
          tags: news.tags,
          publisher: news.publisher,
          publishedAt: news.publishedAt,
          image: news.image,
        },
      });
    }

    revalidateTag("public-news");
    revalidateTag("public-news-by-category");
    revalidateTag("public-news-by-title");
    revalidateTag("public-news-by-slug");
    revalidateTag("public-news-by-category-slug");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro ao semear notícias: ${error.message}`);
    }
    throw new Error("Erro desconhecido ao semear notícias");
  }
}
