"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Text,
  Group,
  ThemeIcon,
  Container,
  Transition,
} from "@mantine/core";
import { NewspaperIcon } from "lucide-react";
import { getPublicNews } from "../actions/noticias/get-news";
import { News } from "@/../prisma/generated";
import Link from "next/link";

export function NewsTicker() {
  const [news, setNews] = useState<News[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    try {
      const data = await getPublicNews(8);
      if (data.length > 0) {
        setNews(data);
        setError(null);
      }
    } catch (err) {
      setError("Falha ao carregar as últimas notícias");
      console.error("Erro ao buscar notícias:", err);
    }
  }, []);

  const rotateNews = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
      setIsVisible(true);
    }, 200);
  }, [news.length]);

  useEffect(() => {
    fetchNews();
    const fetchInterval = setInterval(fetchNews, 5 * 60 * 1000); // Atualiza a cada 5 minutos
    return () => clearInterval(fetchInterval);
  }, [fetchNews]);

  useEffect(() => {
    if (news.length > 0) {
      const rotationInterval = setInterval(rotateNews, 6000); // Roda a cada 6 segundos
      return () => clearInterval(rotationInterval);
    }
  }, [news.length, rotateNews]);

  if (error) return null;
  if (!news.length) return null;

  const currentNews = news[currentIndex];

  return (
    <Box
      bg="blue"
      style={{
        overflow: "hidden",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Container size="xl">
        <Group gap="md" py={8} wrap="nowrap" justify="space-between">
          <Group gap="xs" wrap="nowrap">
            <ThemeIcon variant="filled" size="sm">
              <NewspaperIcon size={14} />
            </ThemeIcon>
            <Text size="sm" fw={500} c="white" span>
              ÚLTIMAS NOTÍCIAS:
            </Text>
          </Group>

          <Transition mounted={isVisible} transition="fade" duration={200}>
            {(styles) => (
              <Group
                style={{
                  flex: 1,
                  ...styles,
                }}
                gap="md"
                wrap="nowrap"
              >
                <Link
                  href={`/noticias/${currentNews.slug}`}
                  style={{
                    color: "white",
                    textDecoration: "none",
                    flex: 1,
                  }}
                >
                  <Text size="sm" lineClamp={1} style={{ opacity: 0.9 }}>
                    {currentNews.title}
                  </Text>
                </Link>
              </Group>
            )}
          </Transition>
        </Group>
      </Container>
    </Box>
  );
}
