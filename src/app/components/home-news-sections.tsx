"use client";

import { Box, Container, Flex, Grid, Title, Text, Card, Group, Anchor, Skeleton } from "@mantine/core";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AdDisplay, { AdPosition } from "./ad-display";
import WeatherSection from "./weather-section";

// Categorias das notícias
const NEWS_CATEGORIES = [
  "Geral",
  "Política",
  "Esportes",
  "Cultura",
  "Tecnologia",
];

// Interface para o tipo de notícia
interface News {
  id: string;
  title: string;
  subtitle: string | null;
  category: string;
  content: string;
  image: string | null;
  tags: string[];
  publisher: string;
  publishedAt: string;
}

// Componente para uma seção de categoria
function CategorySection({ category, isRightAligned = false }: { category: string; isRightAligned?: boolean }) {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        const response = await fetch(`/api/news?category=${category}&limit=3`);
        if (!response.ok) {
          throw new Error(`Erro ao buscar notícias de ${category}`);
        }
        
        const data = await response.json();
        if (data.success) {
          setNews(data.news || []);
        } else {
          console.error(`Erro na resposta ao buscar notícias de ${category}`);
          setNews([]);
        }
      } catch (err) {
        console.error(`Erro ao carregar notícias de ${category}:`, err);
        setNews([]);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [category]);

  // Se não tiver notícias e não estiver carregando, não renderiza a seção
  if (!loading && news.length === 0) {
    return null;
  }

  return (
    <Box my="xl">
      <Container size="xl">
        {/* Título da categoria com linha decorativa */}
        <Flex
          align="center"
          mb="md"
          direction={isRightAligned ? "row-reverse" : "row"}
        >
          {loading ? (
            <>
              <Skeleton height={30} width={150} radius="md" />
              <Skeleton
                ml={isRightAligned ? undefined : "md"}
                mr={isRightAligned ? "md" : undefined}
                style={{ flex: 1 }}
                height={4}
                radius={2}
              />
            </>
          ) : (
            <>
              <Title order={2} size="h3" fw={700}>
                {category.toUpperCase()}
              </Title>
              <Box
                ml={isRightAligned ? undefined : "md"}
                mr={isRightAligned ? "md" : undefined}
                style={{
                  flex: 1,
                  height: 4,
                  backgroundColor: "black",
                  borderRadius: 2,
                }}
              />
            </>
          )}
        </Flex>

        {/* Grid de notícias */}
        <Grid>
          {loading
            ? // Skeleton durante o carregamento
              Array(3)
                .fill(0)
                .map((_, index) => (
                  <Grid.Col
                    span={{ base: 12, sm: 6, md: 4 }}
                    key={`loading-${index}`}
                  >
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                      <Card.Section>
                        <Skeleton height={200} radius={0} animate={true} />
                      </Card.Section>
                      <Group mt="md">
                        <Skeleton height={14} width={80} radius="xl" />
                        <Skeleton height={14} width={100} radius="xl" />
                      </Group>
                      <Skeleton height={22} mt="sm" width="90%" radius="xl" />
                      <Skeleton height={22} mt={4} width="40%" radius="xl" />
                      <Skeleton height={16} mt="xs" width="80%" radius="xl" />
                    </Card>
                  </Grid.Col>
                ))
            : // Notícias reais
              news.map((item) => (
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={item.id}>
                  <Link
                    href={`/noticias/${item.id}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "block",
                    }}
                  >
                    <Card
                      shadow="sm"
                      padding="lg"
                      radius="md"
                      withBorder
                      style={{
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        height: "100%",
                      }}
                      className="hover:shadow-lg hover:-translate-y-1"
                    >
                      <Card.Section>
                        <Box style={{ position: "relative", height: 200 }}>
                          <Image
                            src={item.image || "/images/placeholder.jpg"}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            style={{ objectFit: "cover" }}
                          />
                        </Box>
                      </Card.Section>
                      <Group mt="md">
                        <Text size="xs" c="dimmed">
                          {new Date(item.publishedAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {item.publisher}
                        </Text>
                      </Group>
                      <Text mt="sm" fw={700} lineClamp={2}>
                        {item.title}
                      </Text>
                      {item.subtitle && (
                        <Text size="sm" c="dimmed" lineClamp={2} mt="xs">
                          {item.subtitle}
                        </Text>
                      )}
                    </Card>
                  </Link>
                </Grid.Col>
              ))}
        </Grid>

        {/* Ver mais link */}
        <Flex justify={isRightAligned ? "flex-end" : "flex-start"} mt="md">
          {loading ? (
            <Skeleton height={24} width={200} radius="xl" />
          ) : (
            <Anchor
              component={Link}
              href={`/${category.toLowerCase()}`}
              fw={500}
              size="sm"
            >
              Ver mais notícias de {category} {isRightAligned ? "→" : ""}
              {!isRightAligned ? "←" : ""}
            </Anchor>
          )}
        </Flex>
      </Container>
    </Box>
  );
}

// Componente principal que exibe todas as seções de categorias
export default function HomeNewsSections() {
  return (
    <>
      {NEWS_CATEGORIES.map((category, index) => {
        // Após a segunda categoria (índice 1), inserimos a seção de clima
        if (index === 2) {
          return (
            <Box key={category}>
              {/* Seção de clima após a segunda categoria */}
              <WeatherSection />
              
              {/* Continuamos com a categoria atual */}
              <CategorySection 
                category={category} 
                isRightAligned={index % 2 === 1}
              />
              
              {/* Anúncio se necessário */}
              {index % 2 === 1 && index < NEWS_CATEGORIES.length - 1 && (
                <Container size="xl" my="xl">
                  <Box maw={728} mx="auto">
                    <AdDisplay position={AdPosition.HEADER} width={728} height={90} />
                  </Box>
                </Container>
              )}
            </Box>
          );
        }
        
        // Renderização normal para outras categorias
        return (
          <Box key={category}>
            <CategorySection 
              category={category} 
              isRightAligned={index % 2 === 1} // Alternar alinhamento: ímpar -> direita, par -> esquerda
            />
            
            {/* Inserir anúncio após cada 2 seções */}
            {index % 2 === 1 && index < NEWS_CATEGORIES.length - 1 && (
              <Container size="xl" my="xl">
                <Box maw={728} mx="auto">
                  <AdDisplay position={AdPosition.HEADER} width={728} height={90} />
                </Box>
              </Container>
            )}
          </Box>
        );
      })}
    </>
  );
}
