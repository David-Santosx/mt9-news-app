"use client";
import {
  Container,
  Grid,
  Text,
  Title,
  Box,
  Stack,
  GridCol,
  Paper,
  Button,
  Divider,
} from "@mantine/core";
import Link from "next/link";
import { NewsCategories } from "@/lib/schemas/news-schema";
import { getPublicNewsByCategory, getPublicNewsByCategorySlug } from "../actions/noticias/get-news";
import { useEffect, useState, useCallback } from "react";
import { News } from "@/app/generated/prisma";
import { notifications } from "@mantine/notifications";
import { InstagramIcon } from "lucide-react";
import WeatherSection from "./weather-section";
import slugify from "slugify";

export default function NewsCategoriesSection() {
  const [newsByCategory, setNewsByCategory] = useState<Record<string, News[]>>(
    {}
  );
  const [featuredNews, setFeaturedNews] = useState<News[]>([]);

  // Função para embaralhar array (algoritmo Fisher-Yates)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchNewsByCategory = useCallback(async (category: string, limit: number) => {
    try {
      // Usa slugify apenas para a busca, mas mantém a categoria original como chave
      const news = await getPublicNewsByCategorySlug(slugify(category, { lower: true }), limit);
      setNewsByCategory((prev) => ({
        ...prev,
        [category]: news, // Usa a categoria original como chave
      }));
    } catch (error) {
      if (error instanceof Error) {
        notifications.show({
          title: "Erro ao buscar notícias",
          message: error.message,
          color: "red",
        });
      }
      notifications.show({
        title: "Erro",
        message: "Não foi possível carregar as notícias desta categoria.",
        color: "red",
      });
    }
  }, []);

  // Função para buscar notícias em destaque aleatórias
  const fetchFeaturedNews = useCallback(async () => {
    try {
      // Busca algumas notícias de qualquer categoria
      const allNews = await getPublicNewsByCategory(NewsCategories[0], 10);
      // Embaralha e pega apenas 3
      const randomNews = shuffleArray(allNews).slice(0, 3);
      setFeaturedNews(randomNews);
    } catch (error) {
      if (error instanceof Error) {
        notifications.show({
          title: "Erro ao buscar notícias em destaque",
          message: error.message,
          color: "red",
        });
      }
      notifications.show({
        title: "Erro",
        message: "Não foi possível carregar as notícias em destaque.",
        color: "red",
      });
    }
  }, []);

  useEffect(() => {
    NewsCategories.forEach((category) => {
      fetchNewsByCategory(category, 3);
      console.log(`Buscando notícias para a categoria: ${category}`);
    });
    fetchFeaturedNews();
  }, [fetchNewsByCategory, fetchFeaturedNews]);

  const renderNewsCard = (news: News) => (
    <Link href={`/noticias/${news.slug}`} style={{ textDecoration: "none" }}>
      <Box
        p="md"
        style={{
          height: "100%",
          border: "1px solid var(--mantine-color-gray-3)",
          borderRadius: "var(--mantine-radius-md)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        className="hover:shadow-md hover:-translate-y-1"
      >
        <Box
          h={200}
          mb="md"
          style={{
            backgroundImage: `url(${
              news.image || "https://placehold.co/800x500?text=Sem+imagem"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "var(--mantine-radius-sm)",
          }}
        />
        <Text size="sm" c="dimmed" mb="xs">
          {new Date(news.publishedAt).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </Text>
        <Text fw={700} c={"blue"} size="lg" lineClamp={2} mb="xs">
          {news.title}
        </Text>
        {news.subtitle && (
          <Text size="sm" c="dimmed" lineClamp={2}>
            {news.subtitle}
          </Text>
        )}
      </Box>
    </Link>
  );

  const renderSkeleton = () => (
    <Box
      p="md"
      style={{
        height: "100%",
        border: "1px solid var(--mantine-color-gray-3)",
        borderRadius: "var(--mantine-radius-md)",
      }}
    >
      <Box
        h={200}
        mb="md"
        style={{
          backgroundColor: "var(--mantine-color-gray-2)",
          borderRadius: "var(--mantine-radius-sm)",
        }}
      />
      <Box
        mb="xs"
        style={{
          width: "30%",
          height: 8,
          backgroundColor: "var(--mantine-color-gray-3)",
          borderRadius: "var(--mantine-radius-xl)",
        }}
      />
      <Box
        mb="xs"
        style={{
          width: "90%",
          height: 16,
          backgroundColor: "var(--mantine-color-gray-3)",
          borderRadius: "var(--mantine-radius-xl)",
        }}
      />
      <Box
        style={{
          width: "70%",
          height: 12,
          backgroundColor: "var(--mantine-color-gray-3)",
          borderRadius: "var(--mantine-radius-xl)",
        }}
      />
    </Box>
  );

  return (
    <Box py="xl">
      <Container size="xl">
        <Grid gutter="xl">
          {/* Coluna principal com as categorias */}
          <GridCol span={{ base: 12, lg: 8 }}>
            {NewsCategories.map((category) => (
              <Box key={category} mb="xl">
                <Box mb="lg">
                  <Title order={2} size="h3" fw={700}>
                    Notícias {category}
                  </Title>
                  <Box
                    mt="xs"
                    style={{
                      height: 4,
                      width: 60,
                      backgroundColor: "var(--mantine-color-blue-filled)",
                      borderRadius: "var(--mantine-radius-xl)",
                    }}
                  />
                </Box>

                <Grid>
                  {newsByCategory[category]?.length > 0
                    ? newsByCategory[category].map((news) => (
                        <GridCol
                          key={news.id}
                          span={{ base: 12, sm: 6, md: 4 }}
                        >
                          {renderNewsCard(news)}
                        </GridCol>
                      ))
                    : Array.from({ length: 3 }).map((_, index) => (
                        <GridCol key={index} span={{ base: 12, sm: 6, md: 4 }}>
                          {renderSkeleton()}
                        </GridCol>
                      ))}
                </Grid>
              </Box>
            ))}
          </GridCol>

          {/* Coluna lateral com notícias em destaque */}
          <GridCol span={{ base: 12, lg: 4 }}>
            <Paper>
              <WeatherSection />
            </Paper>
            <Divider my="xl" />
            <Paper p="xl" radius="md" withBorder>
              <Title order={2} size="h3" fw={700} mb="lg">
                Notícias em Destaque
              </Title>

              <Stack gap="md">
                {featuredNews.length > 0
                  ? featuredNews.map((news) => (
                      <Box key={news.id}>{renderNewsCard(news)}</Box>
                    ))
                  : Array.from({ length: 3 }).map((_, index) => (
                      <Box key={index}>{renderSkeleton()}</Box>
                    ))}
              </Stack>
            </Paper>
            <Divider my="xl" />
            <Paper p="xl" radius="md" withBorder>
              <Stack align="center" gap="md">
                <InstagramIcon size={48} color="#E1306C" />
                <Title order={3} ta="center" fw={600}>
                  Siga-nos no Instagram
                </Title>
                <Text size="sm" c="dimmed" ta="center" maw={300}>
                  Fique por dentro das últimas notícias, conteúdo exclusivo e
                  atualizações em tempo real
                </Text>
                <Button
                  size="lg"
                  fullWidth
                  leftSection={<InstagramIcon size={20} />}
                  variant="gradient"
                  gradient={{ from: "#E1306C", to: "#F77737", deg: 45 }}
                  component={Link}
                  target="_blank"
                  href="https://www.instagram.com/mt9.com.br"
                  style={{
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  Seguir @mt9.com.br
                </Button>
              </Stack>
            </Paper>
          </GridCol>
        </Grid>
      </Container>
    </Box>
  );
}
