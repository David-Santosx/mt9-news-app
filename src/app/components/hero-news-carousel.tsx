"use client";

import { useEffect, useState } from "react";
import { 
  Container, 
  Grid, 
  Stack, 
  Title, 
  Text, 
  Skeleton,
  Box,
  Card,
  Badge,
  Group,
  Image,
  Center,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";

interface News {
  id: string;
  title: string;
  subtitle: string | null;
  category: string;
  publishedAt: Date;
  image: string | null;
}

// Componente de Card de Notícia
function NewsCard({ news, variant = "main" }: { news: News, variant?: "main" | "secondary" }) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (variant === "secondary") {
    return (
      <Card 
        shadow="sm" 
        padding={0} 
        radius="md" 
        withBorder
        component={Link}
        href={`/noticias/${news.id}`}
        h={120}
        style={{ transition: "transform 0.2s ease, box-shadow 0.2s ease" }}
        styles={(theme) => ({
          root: {
            '&:hover': {
              transform: 'translateX(2px)',
              boxShadow: theme.shadows.sm,
            },
          },
        })}
      >
        <Group gap={0} wrap="nowrap" h="100%">
          <Box w={100} h="100%" style={{ overflow: 'hidden' }}>
            {news.image ? (
              <Image
                src={news.image}
                alt={news.title}
                fit="cover"
                w={100}
                h="100%"
              />
            ) : (
              <Center h="100%" bg="gray.2">
                <Text size="xs" c="dimmed">Sem imagem</Text>
              </Center>
            )}
          </Box>
          
          <Box p="md" style={{ flex: 1 }}>
            <Badge size="xs" variant="light" color="blue" mb={4}>
              {news.category}
            </Badge>
            
            <Text 
              size="sm" 
              fw={600} 
              lineClamp={2}
              mb={4}
            >
              {news.title}
            </Text>
            
            <Text size="xs" c="dimmed">
              {formatDate(news.publishedAt)}
            </Text>
          </Box>
        </Group>
      </Card>
    );
  }

  return (
    <Card 
      shadow="sm" 
      padding={0} 
      radius="md" 
      withBorder
      component={Link}
      href={`/noticias/${news.id}`}
      h="100%"
      mih={400}
      style={{ 
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "pointer" 
      }}
      styles={(theme) => ({
        root: {
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows.md,
          },
        },
      })}
    >
      <Box pos="relative" h="100%">
        {news.image ? (
          <Image
            src={news.image}
            alt={news.title}
            fit="cover"
            h="100%"
            w="100%"
          />
        ) : (
          <Center h="100%" bg="gray.2">
            <Text c="dimmed">Sem imagem</Text>
          </Center>
        )}
        
        <Box
          pos="absolute"
          bottom={0}
          left={0}
          right={0}
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 80%, transparent 100%)',
            padding: '1.5rem',
          }}
        >
          <Badge size="sm" variant="filled" color="blue" mb="xs">
            {news.category}
          </Badge>
          
          <Text 
            size="lg" 
            fw={700} 
            c="white"
            lineClamp={3}
            style={{
              textShadow: '0 1px 3px rgba(0,0,0,0.5)',
              lineHeight: 1.3,
            }}
            mb="xs"
          >
            {news.title}
          </Text>
          
          {news.subtitle && (
            <Text 
              size="sm" 
              c="white" 
              opacity={0.9}
              lineClamp={2}
              mb="sm"
            >
              {news.subtitle}
            </Text>
          )}
          
          <Text size="sm" c="white" opacity={0.8}>
            {formatDate(news.publishedAt)}
          </Text>
        </Box>
      </Box>
    </Card>
  );
}

// Componente Principal
export default function HeroNewsCarousel() {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/news');
        
        if (!response.ok) {
          throw new Error('Erro ao buscar notícias');
        }
        
        const data = await response.json();
        if (data.success) {
          setNews(data.news);
        } else {
          throw new Error(data.error || 'Erro desconhecido');
        }
      } catch (error) {
        console.error("Erro ao carregar notícias:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadNews();
  }, []);

  if (isLoading) {
    return (
      <Box bg="gray.0" py="xl" my="xl" style={{ borderRadius: '1rem' }}>
        <Container size="xl">
          <Stack gap="md" mb="xl" align="center">
            <Title 
              order={2} 
              style={{
                backgroundImage: 'linear-gradient(45deg, #00adef, #0066cc)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
                fontSize: '2.25rem',
              }}
            >
              Notícias em Destaque
            </Title>
            <Text c="dimmed" size="lg">
              Fique por dentro das últimas notícias
            </Text>
          </Stack>
          
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Skeleton height={400} radius="md" />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Grid gutter="sm">
                <Grid.Col span={6}>
                  <Stack gap="sm">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} height={120} radius="md" />
                    ))}
                  </Stack>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Stack gap="sm">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} height={120} radius="md" />
                    ))}
                  </Stack>
                </Grid.Col>
              </Grid>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (news.length === 0) {
    return (
      <Box bg="gray.0" py="xl" my="xl" style={{ borderRadius: '1rem' }}>
        <Container size="xl">
          <Stack gap="md" mb="xl" align="center">
            <Title 
              order={2} 
              style={{
                backgroundImage: 'linear-gradient(45deg, #00adef, #0066cc)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
                fontSize: '2.25rem',
              }}
            >
              Notícias em Destaque
            </Title>
            <Text c="dimmed" size="lg">
              Fique por dentro das últimas notícias
            </Text>
          </Stack>
          
          <Box 
            bg="white" 
            p="xl" 
            ta="center" 
            style={{ 
              borderRadius: 'var(--mantine-radius-md)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}
          >
            <Text size="lg" c="dimmed">
              Nenhuma notícia disponível no momento.
            </Text>
          </Box>
        </Container>
      </Box>
    );
  }

  // Separar as notícias: 3 para o carousel principal, 6 para as colunas laterais
  const carouselNews = news.slice(0, 3);
  const sideNews = news.slice(3, 9);
  const leftColumnNews = sideNews.slice(0, 3);
  const rightColumnNews = sideNews.slice(3, 6);

  return (
    <Box bg="gray.0" py="xl" my="xl" style={{ borderRadius: "1rem" }}>
      <Container size="xl">
        <Stack gap="md" mb="xl" align="center">
          <Title
            order={2}
            style={{
              backgroundImage: "linear-gradient(45deg, #00adef, #0066cc)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700,
              fontSize: "2.25rem",
            }}
          >
            Notícias em Destaque
          </Title>
          <Text c="dimmed" size="lg">
            Fique por dentro das últimas notícias
          </Text>
        </Stack>

        <Grid gutter="md">
          {/* Carousel Principal */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Box
              h={400}
              style={{
                borderRadius: "var(--mantine-radius-md)",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <Carousel
                withIndicators
                withControls
                plugins={[Autoplay({ delay: 4000 })]}
                styles={() => ({
                  root: { height: "100%" },
                  slide: { height: "100%" },
                  indicator: {
                    backgroundColor: "rgba(255,255,255,0.5)",
                    borderWidth: 2,
                    borderStyle: "solid",
                    borderColor: "transparent",
                    transition: "all 0.2s ease",
                    "&[data-active]": {
                      backgroundColor: "white",
                      borderColor: "#00adef",
                    },
                  },
                  control: {
                    backgroundColor: "rgba(255,255,255,0.9)",
                    border: "none",
                    color: "#00adef",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "white",
                      transform: "scale(1.05)",
                    },
                  },
                })}
                emblaOptions={{
                  loop: true,
                  align: "start",
                  skipSnaps: false,
                }}
              >
                {carouselNews.map((newsItem) => (
                  <Carousel.Slide key={newsItem.id}>
                    <NewsCard news={newsItem} variant="main" />
                  </Carousel.Slide>
                ))}
              </Carousel>
            </Box>
          </Grid.Col>

          {/* Colunas Laterais */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Grid gutter="sm">
              {/* Primeira Coluna */}
              <Grid.Col span={{ base: 12, sm: 6, md: 12 }}>
                <Stack gap="sm">
                  {leftColumnNews.map((newsItem) => (
                    <NewsCard
                      key={newsItem.id}
                      news={newsItem}
                      variant="secondary"
                    />
                  ))}
                </Stack>
              </Grid.Col>

              {/* Segunda Coluna */}
              <Grid.Col span={{ base: 12, sm: 6, md: 12 }}>
                <Stack gap="sm">
                  {rightColumnNews.map((newsItem) => (
                    <NewsCard
                      key={newsItem.id}
                      news={newsItem}
                      variant="secondary"
                    />
                  ))}
                </Stack>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
