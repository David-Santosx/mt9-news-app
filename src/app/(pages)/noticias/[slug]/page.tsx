import {
  getNewsBySlug,
  getNewsByCategory,
} from "@/app/actions/noticias/get-news";
import { notFound } from "next/navigation";
import {
  Container,
  Title,
  Text,
  Badge,
  Stack,
  Group,
  Image,
  Paper,
  Box,
  Divider,
  Button,
  Grid,
  Skeleton,
  GridCol,
  Center,
} from "@mantine/core";
import { News as PrismaNews } from "@/../prisma/generated";
import { Suspense } from "react";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import AdDisplay from "@/app/components/ad-display";
import ShareButtons from "@/app/components/share-buttons";
import { Metadata } from "next";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    return {
      title: "Notícia não encontrada",
      description: "A notícia que você está procurando não foi encontrada.",
    };
  }

  return {
    title: news.title,
    openGraph: {
      title: news.title,
      description: news.subtitle || "Leia mais sobre esta notícia",
      images: [news.image as string],
    },
    keywords: [news.category, ...news.tags],
    description: news.subtitle || "Leia mais sobre esta notícia",
    category: [
      news.category,
      ...news.tags,
      "notícias",
      "portal MT9 Notícias",
    ].join(", "),
  };
}

// Componente para as notícias relacionadas
async function RelatedNews({
  category,
  currentSlug,
}: {
  category: string;
  currentSlug: string;
}) {
  // Buscar 4 notícias da mesma categoria (uma a mais para caso uma seja a atual)
  const relatedNews = await getNewsByCategory(category, 4);

  // Filtrar para não incluir a notícia atual e limitar a 3
  const filteredNews = relatedNews
    .filter((news: PrismaNews) => news.slug !== currentSlug)
    .slice(0, 3);

  if (filteredNews.length === 0) {
    return null;
  }

  return (
    <>
      {filteredNews.map((news: PrismaNews) => (
        <GridCol key={news.id} span={{ base: 12, md: 4 }}>
          <Link
            href={`/noticias/${news.slug}`}
            style={{ textDecoration: "none" }}
          >
            <Paper
              p="md"
              withBorder
              radius="md"
              className="bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              style={{ height: "100%" }}
            >
              <Box className="overflow-hidden rounded-md mb-4">
                <Image
                  src={
                    news.image || "https://placehold.co/800x500?text=Sem+imagem"
                  }
                  alt={news.title}
                  height={200}
                  fit="cover"
                  className="hover:scale-105 transition-transform duration-700"
                />
              </Box>
              <Badge color="blue" mb="sm" variant="dot" size="lg" radius="md">
                {news.category}
              </Badge>
              <Text
                fw={600}
                size="lg"
                lineClamp={2}
                mb="xs"
                style={{
                  background: "linear-gradient(90deg, #1a75ff, #005580)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {news.title}
              </Text>
              <Group gap="xs" c="dimmed">
                <Clock size={14} />
                <Text size="sm">
                  {new Date(news.publishedAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </Group>
            </Paper>
          </Link>
        </GridCol>
      ))}
    </>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    return notFound();
  }

  return (
    <Box bg="gray.0" py="xl">
      <Container size="xl">
        <Stack gap="xl"></Stack>
        {/* Navegação e Data */}
        <Group justify="space-between" align="center">
          <Button
            component={Link}
            href="/"
            variant="subtle"
            leftSection={<ArrowLeft size={18} />}
            className="hover:-translate-x-1 transition-transform duration-200"
            color="gray"
            size="sm"
          >
            Voltar ao início
          </Button>
          <Group gap="xs" c="dimmed">
            <Clock size={16} />
            <Text size="sm" fw={500}>
              {new Date(news.publishedAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </Group>
        </Group>

        {/* Cabeçalho */}
        <Paper
          p="xl"
          radius="lg"
          className="bg-gradient-to-br from-blue-50 to-white"
        >
          <Stack gap="md">
            <Badge
              color="blue"
              size="lg"
              radius="md"
              variant="dot"
              className="w-fit"
            >
              {news.category.toUpperCase()}
            </Badge>

            <Title
              order={1}
              className="text-3xl sm:text-4xl md:text-5xl font-bold"
              style={{
                lineHeight: 1.2,
                background: "linear-gradient(90deg, #1a75ff, #005580)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {news.title}
            </Title>
            {news.subtitle && (
              <Text
                size="xl"
                c="dimmed"
                className="text-lg sm:text-xl"
                maw={800}
              >
                {news.subtitle}
              </Text>
            )}
          </Stack>
        </Paper>

        {/* Imagem Principal */}
        <Paper shadow="md" radius="lg" className="overflow-hidden" withBorder>
          <Image
            src={news.image as string}
            alt={news.title}
            fallbackSrc="https://placehold.co/800x500?text=Carregando+imagem..."
            height={600}
            className="w-full object-cover hover:scale-105 transition-transform duration-700"
          />
          <Stack
            gap={0}
            px="md"
            py="xs"
            style={{ borderTop: "1px solid #eee" }}
          >
            {news.source && (
              <Text size="sm" c="dimmed" className="italic text-right">
                Fonte: {news.source}
              </Text>
            )}
            {news.imageSource && (
              <Text size="sm" c="dimmed" className="italic text-right">
                Créditos da imagem: {news.imageSource}
              </Text>
            )}
          </Stack>
        </Paper>

        {/* Conteúdo */}
        <Paper
          p="xl"
          radius="lg"
          className="prose prose-lg max-w-none bg-white"
        >
          {news.content
            .split("\\n")
            .filter((paragraph) => paragraph.trim().length > 0)
            .map((paragraph, index) => (
              <Text
                key={index}
                className="mb-8 leading-relaxed"
                size="lg"
                style={{
                  textIndent: "2rem",
                  marginBottom: index === 0 ? "2rem" : "1.5rem",
                }}
              >
                {paragraph.trim()}
              </Text>
            ))}
        </Paper>

        {/* Tags e Metadados */}
        <Paper
          mt={"sm"}
          p="lg"
          radius="lg"
          withBorder
          className="bg-gradient-to-br from-gray-50 to-white"
        >
          <Stack gap="xl">
            {/* Tags */}
            <Stack gap="md">
              <Text size="sm" fw={600} c="dimmed">
                TAGS RELACIONADAS
              </Text>
              <Group gap="xs">
                {news.tags
                  ?.filter((tag) => tag.trim().length > 0)
                  .map((tag) => (
                    <Badge
                      key={tag}
                      variant="light"
                      size="lg"
                      radius="md"
                      className="hover:scale-105 transition-transform duration-200"
                    >
                      {tag.trim()}
                    </Badge>
                  ))}
              </Group>
            </Stack>

            {/* Compartilhamento */}
            <ShareButtons title={news.title} />
          </Stack>
        </Paper>

        <Divider my="lg" />
        {/* Publicidade */}
        <Paper p="lg" mb={"sm"} radius="lg" withBorder className="bg-white">
          <Center>
            <AdDisplay width={728} height={90} position={["HEADER"]} />
          </Center>
        </Paper>

        {/* Notícias Relacionadas */}
        <Paper
          p="xl"
          radius="lg"
          withBorder
          className="bg-gradient-to-br from-blue-50 to-white"
        >
          <Stack gap="xl">
            <Group align="center">
              <Box
                w={3}
                h={24}
                style={{
                  background: "linear-gradient(180deg, #1a75ff, #005580)",
                  borderRadius: 2,
                }}
              />
              <Title
                order={2}
                size="h3"
                style={{
                  background: "linear-gradient(90deg, #1a75ff, #005580)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Notícias Relacionadas
              </Title>
            </Group>

            <Grid>
              <Suspense
                fallback={
                  <Grid>
                    {[1, 2, 3].map((i) => (
                      <GridCol key={i} span={{ base: 12, md: 4 }}>
                        <Paper
                          p="md"
                          radius="md"
                          withBorder
                          className="bg-white"
                        >
                          <Skeleton
                            height={200}
                            radius="md"
                            mb="md"
                            animate={false}
                          />
                          <Skeleton
                            height={24}
                            width="90%"
                            radius="xl"
                            mb="sm"
                            animate={false}
                          />
                          <Skeleton
                            height={16}
                            width="70%"
                            radius="xl"
                            mb="sm"
                            animate={false}
                          />
                          <Skeleton
                            height={16}
                            width="40%"
                            radius="xl"
                            animate={false}
                          />
                        </Paper>
                      </GridCol>
                    ))}
                  </Grid>
                }
              >
                <RelatedNews category={news.category} currentSlug={news.slug} />
              </Suspense>
            </Grid>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
