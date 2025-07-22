"use client";

import { useState, useEffect, useCallback } from 'react';
import { Container, Title, Grid, Card, Text, Button, Group, Box, Skeleton, Flex, Anchor } from '@mantine/core';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Interface para o tipo de notícia
interface NewsItem {
  id: string;
  title: string;
  subtitle: string | null;
  image: string | null;
  publisher: string;
  publishedAt: Date | string;
  category: string;
}

const NEWS_PER_PAGE = 9;

// Componente para o card de notícia
function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link href={`/noticias/${item.id}`} style={{ textDecoration: 'none', height: '100%' }}>
      <Card 
        shadow="sm" 
        padding="lg" 
        radius="md" 
        withBorder 
        style={{ 
          height: '100%',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        className="hover:shadow-lg hover:-translate-y-1"
      >
        <Card.Section>
          <Box style={{ position: 'relative', height: 200 }}>
            <Image
              src={item.image || '/images/placeholder.jpg'}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
          </Box>
        </Card.Section>
        <Flex direction="column" justify="space-between" style={{ height: 'calc(100% - 200px)' }}>
          <Box>
            <Group mt="md" justify='space-between'>
              <Text size="xs" c="dimmed">
                {new Date(item.publishedAt).toLocaleDateString('pt-BR')}
              </Text>
              <Anchor component={Link} href={`/categoria/${item.category.toLowerCase()}`} size="xs">
                {item.category}
              </Anchor>
            </Group>
            <Text mt="sm" fw={700} lineClamp={3}>
              {item.title}
            </Text>
          </Box>
          {item.subtitle && (
            <Text size="sm" c="dimmed" lineClamp={2} mt="xs">
              {item.subtitle}
            </Text>
          )}
        </Flex>
      </Card>
    </Link>
  );
}

// Componente para o skeleton do card
function NewsCardSkeleton() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Skeleton height={200} radius={0} animate />
      <Skeleton height={14} mt="md" width="50%" animate />
      <Skeleton height={20} mt="sm" width="90%" animate />
      <Skeleton height={20} mt={4} width="70%" animate />
    </Card>
  );
}

export default function CategoryPage() {
  const params = useParams();
  const category = typeof params.category === 'string' ? params.category : Array.isArray(params.category) ? params.category[0] : '';
  
  const [news, setNews] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const fetchNews = useCallback(async (pageNum: number) => {
    if (!category) return;
    setLoading(true);
    try {
      console.log(`Buscando notícias para categoria: "${category}" (URL slug)`);
      const skip = (pageNum - 1) * NEWS_PER_PAGE;
      
      // Primeiro, vamos verificar quais categorias existem no banco
      const categoriesResponse = await fetch('/api/categories');
      const categoriesData = await categoriesResponse.json();
      console.log("Categorias disponíveis:", categoriesData.categories);
      
      // Agora vamos buscar as notícias para a categoria especificada
      const response = await fetch(`/api/news?category=${encodeURIComponent(category)}&limit=${NEWS_PER_PAGE}&skip=${skip}`);
      const data = await response.json();
      console.log("Resposta da API:", data);
      
      if (data.success) {
        setNews(prev => pageNum === 1 ? data.news : [...prev, ...data.news]);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Erro ao buscar notícias:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    setNews([]);
    setPage(1);
    setHasMore(true);
    fetchNews(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(nextPage);
  };

  // Capitalizar a primeira letra da categoria para exibição
  const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
  
  // Criar um mapeamento de slugs para nomes de categorias mais amigáveis
  const categoryDisplayNames: Record<string, string> = {
    'politica': 'Política',
    'esportes': 'Esportes',
    'cultura': 'Cultura',
    'tecnologia': 'Tecnologia',
    'comercios': 'Comércios',
    'geral': 'Geral'
  };
  
  // Usar o nome amigável se disponível, caso contrário usar a versão capitalizada
  const displayCategory = categoryDisplayNames[category.toLowerCase()] || capitalizedCategory;

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">
        Notícias de {displayCategory}
      </Title>

      <Grid>
        {news.map((item) => (
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={item.id}>
            <NewsCard item={item} />
          </Grid.Col>
        ))}
        
        {loading && Array(3).fill(0).map((_, index) => (
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={`skeleton-${index}`}>
            <NewsCardSkeleton />
          </Grid.Col>
        ))}
      </Grid>

      {hasMore && !loading && (
        <Flex justify="center" mt="xl">
          <Button onClick={handleLoadMore} loading={loading}>
            Carregar mais notícias
          </Button>
        </Flex>
      )}

      {!hasMore && !loading && news.length === 0 && (
        <Text ta="center" mt="xl">
          Nenhuma notícia encontrada para a categoria &quot;{displayCategory}&quot;.
        </Text>
      )}
    </Container>
  );
}
