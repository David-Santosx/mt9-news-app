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
import { News } from "@prisma/client"
import { notifications } from "@mantine/notifications";
import { FacebookIcon, InstagramIcon } from "lucide-react";
import WeatherSection from "./weather-section";
import slugify from "slugify";

export default function NewsCategoriesSection() {
  const [newsByCategory, setNewsByCategory] = useState<Record<string, News[]>>(
    {}
  );
  const [featuredNews, setFeaturedNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAnyCategoryWithNews, setHasAnyCategoryWithNews] = useState(false);

  // Função para embaralhar array (algoritmo Fisher-Yates)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Esta função não é mais necessária pois o carregamento está sendo feito diretamente no useEffect

  // Função para buscar notícias em destaque aleatórias
  const fetchFeaturedNews = useCallback(async () => {
    try {
      // Busca algumas notícias de qualquer categoria
      const allNews = await getPublicNewsByCategory(NewsCategories[0], 10);
      
      if (allNews && allNews.length > 0) {
        // Embaralha e pega apenas 3
        const randomNews = shuffleArray(allNews).slice(0, 3);
        setFeaturedNews(randomNews);
      } else {
        setFeaturedNews([]);
      }
    } catch (error) {
      setFeaturedNews([]);
      if (error instanceof Error) {
        notifications.show({
          title: "Erro ao buscar notícias em destaque",
          message: error.message,
          color: "red",
        });
      } else {
        notifications.show({
          title: "Erro",
          message: "Não foi possível carregar as notícias em destaque.",
          color: "red",
        });
      }
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    let categoriesWithNews = false;
    
    const fetchAllCategories = async () => {
      const promises = NewsCategories.map(async (category) => {
        console.log(`Buscando notícias para a categoria: ${category}`);
        try {
          const news = await getPublicNewsByCategorySlug(slugify(category, { lower: true }), 3);
          if (news.length > 0) {
            categoriesWithNews = true;
            setNewsByCategory((prev) => ({
              ...prev,
              [category]: news,
            }));
          }
          return { category, hasNews: news.length > 0 };
        } catch (error) {
          console.error(`Erro ao buscar categoria ${category}:`, error);
          return { category, hasNews: false };
        }
      });
      
      await Promise.all(promises);
      setHasAnyCategoryWithNews(categoriesWithNews);
      setLoading(false);
    };
    
    fetchAllCategories();
    fetchFeaturedNews();
  }, [fetchFeaturedNews]);

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
            {loading ? (
              // Mostra skeletons enquanto carrega
              NewsCategories.slice(0, 2).map((category, idx) => (
                <Box key={`loading-${idx}`} mb="xl">
                  <Box mb="lg">
                    <Title order={2} size="h3" fw={700}>
                      Carregando...
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
                    {Array.from({ length: 3 }).map((_, index) => (
                      <GridCol key={index} span={{ base: 12, sm: 6, md: 4 }}>
                        {renderSkeleton()}
                      </GridCol>
                    ))}
                  </Grid>
                </Box>
              ))
            ) : !hasAnyCategoryWithNews ? (
              // Feedback quando não há notícias em nenhuma categoria
              <Paper p="xl" withBorder ta="center">
                <Box py="xl">
                  <Title order={2} mb="md">Nenhuma notícia disponível</Title>
                  <Text c="dimmed">
                    No momento não temos notícias disponíveis para exibir. Por favor, volte mais tarde.
                  </Text>
                </Box>
              </Paper>
            ) : (
              // Exibe apenas categorias que possuem notícias
              Object.entries(newsByCategory).map(([category, news]) => 
                news && news.length > 0 ? (
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
                      {news.map((item) => (
                        <GridCol
                          key={item.id}
                          span={{ base: 12, sm: 6, md: 4 }}
                        >
                          {renderNewsCard(item)}
                        </GridCol>
                      ))}
                    </Grid>
                  </Box>
                ) : null
              )
            )}
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
                {loading ? (
                  // Mostra skeletons durante o carregamento
                  Array.from({ length: 3 }).map((_, index) => (
                    <Box key={index}>{renderSkeleton()}</Box>
                  ))
                ) : featuredNews.length > 0 ? (
                  // Exibe as notícias em destaque se existirem
                  featuredNews.map((news) => (
                    <Box key={news.id}>{renderNewsCard(news)}</Box>
                  ))
                ) : (
                  // Feedback quando não há notícias em destaque
                  <Box ta="center" py="md">
                    <Text c="dimmed">
                      Não há notícias em destaque no momento.
                    </Text>
                  </Box>
                )}
              </Stack>
            </Paper>
            <Divider my="xl" />
            <Paper p="xl" radius="md" withBorder>
              <Stack align="center" gap="md">
                <Title order={3} ta="center" fw={600}>
                  Siga-nos nas Redes Sociais
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
                    marginBottom: "10px",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  Seguir no Instagram
                </Button>
                <Button
                  size="lg"
                  fullWidth
                  leftSection={<FacebookIcon size={20} />}
                  style={{
                    backgroundColor: "#1877F2",
                    color: "white",
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                  component={Link}
                  target="_blank"
                  href="https://www.facebook.com/profile.php?id=61578324400179"
                >
                  Seguir no Facebook
                </Button>
              </Stack>
            </Paper>
          </GridCol>
        </Grid>
      </Container>
    </Box>
  );
}
