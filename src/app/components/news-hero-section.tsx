"use client";
import { Carousel, CarouselSlide } from "@mantine/carousel";
import { News } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { getPublicNews } from "../actions/noticias/get-news";
import { notifications } from "@mantine/notifications";
import {
  Title,
  Text,
  Paper,
  Stack,
  Badge,
  Group,
  Box,
  Divider,
  Skeleton,
  Container,
} from "@mantine/core";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";

interface NewsCarouselSlideProps {
  image: string;
  title: string;
  slug: string;
  subtitle?: string;
  category: string;
  publishedAt: Date;
}

function NewsCarouselSlide({
  image,
  title,
  slug,
  category,
  publishedAt,
}: NewsCarouselSlideProps) {
  return (
    <Paper
      shadow="lg"
      radius="md"
      c="white"
      h={{ base: 400, sm: 500, md: 600 }}
      className="transition-all duration-300 hover:shadow-xl"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6)), url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Stack gap="xs" h="100%" justify="flex-end">
        <Stack
          gap="md"
          p={{ base: "xs", sm: "md", lg: "xl" }}
          style={{
            color: "white",
            background: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(8px)",
          }}
          className="transition-all duration-300"
        >
          <Badge
            color="blue"
            size="lg"
            radius="md"
            className="w-fit transition-transform duration-300 hover:scale-105"
          >
            {category.toUpperCase()}
          </Badge>
          <Text
            component={Link}
            href={`/noticias/${slug}`}
            size="lg"
            fw={700}
            className="transition-colors duration-300 hover:text-blue-400"
          >
            {title}
          </Text>
          <Group justify="space-between" align="center">
            <Text size="sm" className="opacity-80">
              {new Date(publishedAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </Group>
        </Stack>
      </Stack>
    </Paper>
  );
}

export function NewsCard({
  image,
  title,
  slug,
  subtitle,
  category,
  publishedAt,
}: NewsCarouselSlideProps) {
  return (
    <Link
      className="block w-full md:w-[32%]"
      href={`/noticias/${slug}`}
    >
      <Paper
        shadow="md"
        radius="md"
        className="group cursor-pointer transition-all duration-300 hover:shadow-lg h-full"
      >
        <Stack p="xs" gap="sm">
          <Box
            h={180}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <Stack gap="xs">
            <Text
              component="h3"
              size="sm"
              fw={600}
              lineClamp={2}
              className="transition-colors duration-300 hover:text-blue-600"
            >
              {title}
            </Text>
            {subtitle && (
              <Text size="xs" c="dimmed" lineClamp={2}>
                {subtitle}
              </Text>
            )}
            <Group justify="space-between" align="center">
              <Badge
                color="blue"
                size="sm"
                radius="md"
                className="transition-transform duration-200 group-hover:scale-105"
              >
                {category.toUpperCase()}
              </Badge>
              <Text size="xs" c="dimmed">
                {new Date(publishedAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                })}
              </Text>
            </Group>
          </Stack>
        </Stack>
      </Paper>
    </Link>
  );
}

export default function NewsHeroSection() {
  const [carouselNews, setCarouselNews] = useState<News[]>([]);
  const [cardsNews, setCardsNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const autoplay = useRef(Autoplay({ delay: 6000 }));

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const [carouselData, cardsData] = await Promise.all([
        getPublicNews(3, 0),
        getPublicNews(3, 3),
      ]);
      setCarouselNews(carouselData);
      setCardsNews(cardsData);
    } catch (error) {
      notifications.show({
        title: "Erro ao carregar notícias",
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as notícias no momento.",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Title order={2}>Últimas Notícias</Title>
        </Group>

        {isLoading ? (
          <Stack>
            <Skeleton height={600} radius="md" animate={true} />
            <Group mt="xl" grow>
              <Skeleton height={300} radius="md" animate={true} />
              <Skeleton height={300} radius="md" animate={true} />
              <Skeleton height={300} radius="md" animate={true} />
            </Group>
          </Stack>
        ) : (
          <Stack gap="xl">
            <Box className="relative">
              <Carousel
                plugins={[autoplay.current]}
                emblaOptions={{ loop: true }}
                withIndicators
                controlsOffset="md"
                controlSize={35}
              >
                {carouselNews.map((item) => (
                  <CarouselSlide key={item.id}>
                    <NewsCarouselSlide
                      image={item.image as string}
                      title={item.title}
                      category={item.category}
                      publishedAt={item.publishedAt}
                      slug={item.slug}
                    />
                  </CarouselSlide>
                ))}
              </Carousel>
            </Box>

            <Divider
              my="md"
              size="sm"
              label={
                <Text fw={500} tt="uppercase" size="sm">
                  Destaques da Semana
                </Text>
              }
              labelPosition="center"
            />

            <Group grow preventGrowOverflow={false} wrap="wrap" align="stretch">
              {cardsNews.map((item) => (
                <NewsCard
                  key={item.id}
                  image={item.image as string}
                  title={item.title}
                  category={item.category}
                  subtitle={item.subtitle as string}
                  publishedAt={item.publishedAt}
                  slug={item.slug}
                />
              ))}
            </Group>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
