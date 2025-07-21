import { isAdmin } from "@/lib/isAdmin";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const NewsCategories = [
  "Geral",
  "Política",
  "Esportes",
  "Cultura",
  "Tecnologia",
];

const sampleNews = [
  {
    title: "Mato Grosso registra 10.000 casos de dengue em 2023",
    subtitle: "Número é o maior dos últimos 5 anos",
    category: NewsCategories[0],
    content:
      "O estado de Mato Grosso registrou 10.000 casos de dengue em 2023, o maior número dos últimos cinco anos. As autoridades de saúde estão alertando a população sobre os riscos e medidas de prevenção.",
    tags: ["dengue", "saúde", "Mato Grosso"],
    publisher: "G1 MT",
    publishedAt: new Date().toISOString(),
    image: "https://picsum.photos/800/600?1",
  },
  {
    title: "Eleições municipais terão novas regras em 2024",
    subtitle: "Mudanças impactam candidaturas e financiamento",
    category: NewsCategories[1],
    content:
      "O Tribunal Superior Eleitoral anunciou novas regras para as eleições municipais de 2024, incluindo mudanças no financiamento de campanhas e critérios para candidaturas.",
    tags: ["eleições", "política", "TSE"],
    publisher: "Folha MT",
    publishedAt: new Date().toISOString(),
    image: "https://picsum.photos/800/600?2",
  },
  {
    title: "Cuiabá vence clássico e lidera campeonato estadual",
    subtitle: "Time mantém invencibilidade na temporada",
    category: NewsCategories[2],
    content:
      "O Cuiabá venceu o clássico regional e assumiu a liderança do campeonato estadual, mantendo sua invencibilidade na temporada.",
    tags: ["futebol", "Cuiabá", "esportes"],
    publisher: "Olhar Esportivo",
    publishedAt: new Date().toISOString(),
    image: "https://picsum.photos/800/600?3",
  },
  {
    title: "Festival de cinema exibe produções regionais em MT",
    subtitle: "Evento destaca talentos locais",
    category: NewsCategories[3],
    content:
      "O festival de cinema de Mato Grosso exibiu produções regionais e destacou o talento de cineastas locais, promovendo a cultura do estado.",
    tags: ["cinema", "cultura", "festival"],
    publisher: "Gazeta Cultural",
    publishedAt: new Date().toISOString(),
    image: "https://picsum.photos/800/600?4",
  },
  {
    title: "Startup mato-grossense lança aplicativo de agricultura",
    subtitle: "Tecnologia auxilia produtores rurais",
    category: NewsCategories[4],
    content:
      "Uma startup de Mato Grosso lançou um aplicativo inovador para auxiliar produtores rurais no monitoramento de suas lavouras.",
    tags: ["tecnologia", "agricultura", "startup"],
    publisher: "TechMT",
    publishedAt: new Date().toISOString(),
    image: "https://picsum.photos/800/600?5",
  },
  {
    title: "Vacinação contra gripe é ampliada em Cuiabá",
    subtitle: "Campanha inclui novos grupos prioritários",
    category: NewsCategories[0],
    content:
      "A campanha de vacinação contra a gripe foi ampliada em Cuiabá, incluindo novos grupos prioritários para imunização.",
    tags: ["vacinação", "gripe", "saúde"],
    publisher: "G1 MT",
    publishedAt: new Date().toISOString(),
    image: "https://picsum.photos/800/600?6",
  },
  {
    title: "Assembleia aprova aumento do orçamento para educação",
    subtitle: "Investimento será destinado a escolas públicas",
    category: NewsCategories[1],
    content:
      "A Assembleia Legislativa aprovou o aumento do orçamento destinado à educação, com foco em melhorias nas escolas públicas do estado.",
    tags: ["educação", "política", "orçamento"],
    publisher: "Folha MT",
    publishedAt: new Date().toISOString(),
    image: "https://picsum.photos/800/600?7",
  },
  {
    title: "Atleta de MT conquista medalha em campeonato nacional",
    subtitle: "Destaque no atletismo juvenil",
    category: NewsCategories[2],
    content:
      "Uma atleta de Mato Grosso conquistou medalha de ouro no campeonato nacional de atletismo juvenil, representando o estado com destaque.",
    tags: ["atletismo", "esportes", "MT"],
    publisher: "Olhar Esportivo",
    publishedAt: new Date().toISOString(),
    image: "https://picsum.photos/800/600?8",
  },
  {
    title: "Exposição de arte indígena atrai visitantes em Cuiabá",
    subtitle: "Mostra valoriza cultura ancestral",
    category: NewsCategories[3],
    content:
      "A exposição de arte indígena em Cuiabá atraiu centenas de visitantes e valorizou a cultura ancestral dos povos originários da região.",
    tags: ["arte", "indígena", "cultura"],
    publisher: "Gazeta Cultural",
    publishedAt: new Date().toISOString(),
    image: "https://picsum.photos/800/600?9",
  },
  {
    title: "Universidade desenvolve drone para monitoramento ambiental",
    subtitle: "Projeto recebe prêmio nacional de inovação",
    category: NewsCategories[4],
    content:
      "Pesquisadores de uma universidade de Mato Grosso desenvolveram um drone para monitoramento ambiental, premiado em evento nacional de inovação.",
    tags: ["drone", "tecnologia", "meio ambiente"],
    publisher: "TechMT",
    publishedAt: new Date().toISOString(),
    image: "https://picsum.photos/800/600?10",
  },
  {
    title: "Chuvas intensas causam alagamentos em bairros de Várzea Grande",
    subtitle: "Defesa Civil monitora áreas de risco",
    category: NewsCategories[0],
    content:
      "As chuvas intensas dos últimos dias causaram alagamentos em diversos bairros de Várzea Grande, mobilizando a Defesa Civil para monitorar áreas de risco.",
    tags: ["chuvas", "alagamentos", "Várzea Grande"],
    publisher: "G1 MT",
    publishedAt: new Date().toISOString(),
    image: "https://picsum.photos/800/600?11",
  },
  {
    title: "Projeto de lei propõe incentivo à energia solar em MT",
    subtitle: "Medida busca sustentabilidade energética",
    category: NewsCategories[1],
    content:
      "Um novo projeto de lei propõe incentivos para a adoção de energia solar em Mato Grosso, visando maior sustentabilidade energética no estado.",
    tags: ["energia solar", "política", "sustentabilidade"],
    publisher: "Folha MT",
    publishedAt: new Date().toISOString(),
    image: "https://picsum.photos/800/600?12",
  },
  {
    title: "Equipe de basquete de MT avança para semifinais nacionais",
    subtitle: "Time surpreende favoritos",
    category: NewsCategories[2],
    content:
      "A equipe de basquete de Mato Grosso avançou para as semifinais do campeonato nacional, surpreendendo os favoritos da competição.",
    tags: ["basquete", "esportes", "MT"],
    publisher: "Olhar Esportivo",
    publishedAt: new Date().toISOString(),
    image: "https://picsum.photos/800/600?13",
  },
  {
    title: "Orquestra sinfônica realiza concerto gratuito no parque",
    subtitle: "Evento reúne famílias e amantes da música",
    category: NewsCategories[3],
    content:
      "A orquestra sinfônica de Mato Grosso realizou um concerto gratuito no parque central, reunindo famílias e amantes da música clássica.",
    tags: ["música", "orquestra", "cultura"],
    publisher: "Gazeta Cultural",
    publishedAt: new Date().toISOString(),
    image: "https://picsum.photos/800/600?14",
  },
  {
    title: "Empresa local desenvolve software para gestão agrícola",
    subtitle: "Ferramenta otimiza produção no campo",
    category: NewsCategories[4],
    content:
      "Uma empresa de tecnologia de Mato Grosso desenvolveu um software inovador para gestão agrícola, otimizando a produção no campo.",
    tags: ["software", "agricultura", "tecnologia"],
    publisher: "TechMT",
    publishedAt: new Date().toISOString(),
    image: "https://picsum.photos/800/600?15",
  },
  {
    title: "Campanha arrecada alimentos para famílias carentes",
    subtitle: "Ação solidária mobiliza voluntários",
    category: NewsCategories[0],
    content:
      "Uma campanha solidária arrecadou toneladas de alimentos para famílias carentes em Cuiabá, mobilizando voluntários de toda a cidade.",
    tags: ["solidariedade", "alimentos", "Cuiabá"],
    publisher: "G1 MT",
    publishedAt: new Date().toISOString(),
    image: "https://picsum.photos/800/600?16",
  },
  {
    title: "Deputados debatem reforma tributária em audiência pública",
    subtitle: "População participa do debate",
    category: NewsCategories[1],
    content:
      "Deputados estaduais debateram a reforma tributária em audiência pública, com participação ativa da população e de especialistas.",
    tags: ["reforma tributária", "política", "audiência"],
    publisher: "Folha MT",
    publishedAt: new Date().toISOString(),
    image: "https://picsum.photos/800/600?17",
  },
  {
    title: "Corredores de MT participam de maratona internacional",
    subtitle: "Atletas representam o estado no exterior",
    category: NewsCategories[2],
    content:
      "Corredores de Mato Grosso participaram de uma maratona internacional, representando o estado em uma das maiores provas do mundo.",
    tags: ["maratona", "esportes", "MT"],
    publisher: "Olhar Esportivo",
    publishedAt: new Date().toISOString(),
    image: "https://picsum.photos/800/600?18",
  },
  {
    title: "Peça teatral aborda história do Pantanal mato-grossense",
    subtitle: "Espetáculo emociona plateia",
    category: NewsCategories[3],
    content:
      "Uma peça teatral que aborda a história do Pantanal mato-grossense emocionou a plateia em apresentações no teatro municipal.",
    tags: ["teatro", "Pantanal", "cultura"],
    publisher: "Gazeta Cultural",
    publishedAt: new Date().toISOString(),
    image: "https://picsum.photos/800/600?19",
  },
  {
    title: "Pesquisadores criam aplicativo para monitorar queimadas",
    subtitle: "Ferramenta auxilia órgãos ambientais",
    category: NewsCategories[4],
    content:
      "Pesquisadores de Mato Grosso criaram um aplicativo para monitorar queimadas, auxiliando órgãos ambientais no combate ao fogo.",
    tags: ["queimadas", "tecnologia", "meio ambiente"],
    publisher: "TechMT",
    publishedAt: new Date().toISOString(),
    image: "https://picsum.photos/800/600?20",
  },
];

export async function GET() {
  const headersObj = await headers();
  if (!(await isAdmin(headersObj))) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Rota disponível apenas em desenvolvimento" },
      { status: 403 }
    );
  }

  try {
    // Verfica se alguma das notícias já existe no banco de dados
    const existingNews = await prisma.news.findMany({
      where: {
        title: {
          in: sampleNews.map((news) => news.title),
        },
      },
    });
    if (existingNews.length > 0) {
      return NextResponse.json(
        { message: "Algumas notícias já existem no banco de dados." },
        { status: 200 }
      );
    }
    try {
      const createdItem = await prisma.news.createMany({
        data: sampleNews.map((news) => ({
          title: news.title,
          subtitle: news.subtitle,
          category: news.category,
          content: news.content,
          tags: news.tags,
          publisher: news.publisher,
          publishedAt: new Date(news.publishedAt),
          image: news.image,
        })),
      });
      return NextResponse.json(
        { message: "Notícias de exemplo criadas com sucesso", createdItem },
        { status: 201 }
      );
    } catch (error) {
        console.error("Erro ao criar notícias de exemplo:", error);
      return NextResponse.json(
        { error: "Erro ao criar notícias de exemplo" },
        { status: 500 }
      );
    }
    // Cria as notícias de exemplo
  } catch (error) {
    console.error("Erro ao verificar notícias existentes:", error);
    return NextResponse.json(
      { error: "Erro ao verificar notícias existentes" },
      { status: 500 }
    );
  }
}
