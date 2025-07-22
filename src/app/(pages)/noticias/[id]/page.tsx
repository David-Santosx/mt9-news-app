"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Container, Title, Text, Box, Paper, Skeleton, Group, Stack, Divider, Badge, Flex, Grid } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, User, Tag } from 'lucide-react';
import AdDisplay, { AdPosition } from '@/app/components/ad-display';

// Interface para o tipo de notícia
interface NewsItem {
  id: string;
  title: string;
  subtitle: string | null;
  image: string | null;
  publisher: string;
  publishedAt: Date | string;
  category: string;
  content: string;
  tags: string[];
}

// Componente para o skeleton de carregamento
function NewsDetailSkeleton() {
  return (
    <Stack>
      <Skeleton height={60} mb="xl" width="80%" />
      <Skeleton height={30} width="60%" mb="lg" />
      <Skeleton height={400} mb="xl" />
      <Skeleton height={20} mb="xs" />
      <Skeleton height={20} mb="xs" />
      <Skeleton height={20} mb="xs" />
      <Skeleton height={20} mb="xs" />
      <Skeleton height={20} mb="xs" />
    </Stack>
  );
}

export default function NewsDetailPage() {
  const params = useParams();
  const newsId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNewsDetail() {
      if (!newsId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/news/${newsId}`);
        const data = await response.json();
        
        if (data.success) {
          setNews(data.news);
        } else {
          setError('Não foi possível carregar a notícia.');
        }
      } catch (err) {
        console.error('Erro ao buscar detalhes da notícia:', err);
        setError('Erro ao carregar a notícia. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }

    fetchNewsDetail();
  }, [newsId]);

  // Função para formatar a data
  const formatDate = (dateString: string | Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  // Função para renderizar o conteúdo como texto com quebras de linha
  const renderContent = (content: string) => {
    // Divide o texto por quebras de linha e gera parágrafos
    return content.split('\n').map((paragraph, index) => (
      // Ignora linhas em branco
      paragraph.trim() ? (
        <p key={index} className="news-paragraph">
          {paragraph}
        </p>
      ) : <br key={index} />
    ));
  };

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <NewsDetailSkeleton />
      </Container>
    );
  }

  if (error || !news) {
    return (
      <Container size="lg" py="xl">
        <Paper p="xl" withBorder shadow="sm" radius="md">
          <Title order={2} ta="center" c="red.7">Erro ao carregar notícia</Title>
          <Text ta="center" mt="md">{error || 'Notícia não encontrada'}</Text>
          <Flex justify="center" mt="xl">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Text c="blue" fw={500}>Voltar para a página inicial</Text>
            </Link>
          </Flex>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      {/* Botão voltar */}
      <Box mb="lg">
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Text size="sm" fw={500} c="dimmed">
            &larr; Voltar
          </Text>
        </Link>
      </Box>
      
      {/* Título e subtítulo */}
      <Title order={1} mb="md">{news.title}</Title>
      {news.subtitle && (
        <Text size="xl" c="dimmed" mb="xl">{news.subtitle}</Text>
      )}

      {/* Metadados da notícia */}
      <Group mb="xl" gap="sm">
        <Group gap="xs">
          <Clock size={16} />
          <Text size="sm" c="dimmed">{formatDate(news.publishedAt)}</Text>
        </Group>
        <Divider orientation="vertical" />
        <Group gap="xs">
          <User size={16} />
          <Text size="sm" c="dimmed">{news.publisher}</Text>
        </Group>
        <Divider orientation="vertical" />
        <Link href={`/categoria/${news.category.toLowerCase()}`} style={{ textDecoration: 'none' }}>
          <Badge variant="light" color="blue">{news.category}</Badge>
        </Link>
      </Group>

      {/* Imagem principal */}
      {news.image && (
        <Box mb="xl" pos="relative" h={400}>
          <Image
            src={news.image}
            alt={news.title}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </Box>
      )}

      {/* Layout com grid para conteúdo principal e anúncio lateral */}
      <Grid gutter={30} mb="xl">
        <Grid.Col span={{ base: 12, lg: 8 }}>
          {/* Conteúdo da notícia */}
          <Paper p="xl" withBorder className="prose max-w-none" radius="md" shadow="sm">
            {renderContent(news.content)}
          </Paper>
        </Grid.Col>
        
        {/* Anúncio lateral (visível apenas em telas grandes) */}
        <Grid.Col span={{ base: 0, lg: 4 }} visibleFrom="lg">
          <Box pos="sticky" top={20} style={{ alignSelf: 'start' }}>
            <Text c="dimmed" size="xs" mb="xs" ta="center">PUBLICIDADE</Text>
            <AdDisplay position={AdPosition.HIGHLIGHT} height={250} width={300} />
          </Box>
        </Grid.Col>
        
        {/* Anúncio para telas menores (aparece abaixo do conteúdo) */}
        <Grid.Col span={12} hiddenFrom="lg">
          <Box mt="xl">
            <Text c="dimmed" size="xs" mb="xs" ta="center">PUBLICIDADE</Text>
            <AdDisplay position={AdPosition.HIGHLIGHT} height={250} width={300} />
          </Box>
        </Grid.Col>
      </Grid>

      {/* Tags da notícia */}
      {news.tags && news.tags.length > 0 && (
        <Box mt="xl">
          <Group gap="xs" align="center">
            <Tag size={16} />
            <Text fw={500}>Tags:</Text>
            {news.tags.map((tag, index) => (
              <Badge key={index} variant="outline">{tag}</Badge>
            ))}
          </Group>
        </Box>
      )}
      
      {/* Notícias relacionadas */}
      <RelatedNews currentNewsId={news.id} category={news.category} />
    </Container>
  );
}

// Componente para notícias relacionadas
function RelatedNews({ currentNewsId, category }: { currentNewsId: string; category: string }) {
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelatedNews() {
      try {
        setLoading(true);
        // Buscar notícias da mesma categoria, excluindo a notícia atual
        const response = await fetch(`/api/news?category=${encodeURIComponent(category)}&limit=3`);
        const data = await response.json();
        
        if (data.success) {
          // Filtra para remover a notícia atual
          const filtered = data.news.filter((item: NewsItem) => item.id !== currentNewsId);
          setRelatedNews(filtered.slice(0, 3)); // Limita a 3 notícias relacionadas
        }
      } catch (error) {
        console.error('Erro ao buscar notícias relacionadas:', error);
      } finally {
        setLoading(false);
      }
    }

    if (category) {
      fetchRelatedNews();
    }
  }, [category, currentNewsId]);

  if (loading) {
    return (
      <Box mt="xl">
        <Title order={3} mb="md">Notícias Relacionadas</Title>
        <Grid>
          {[1, 2, 3].map((i) => (
            <Grid.Col span={{ base: 12, sm: 4 }} key={i}>
              <Skeleton height={180} mb="sm" />
              <Skeleton height={20} width="80%" mb="xs" />
              <Skeleton height={15} width="60%" />
            </Grid.Col>
          ))}
        </Grid>
      </Box>
    );
  }

  if (relatedNews.length === 0) {
    return null;
  }

  return (
    <Box mt="xl" pt="xl">
      <Divider mb="xl" />
      <Title order={3} mb="xl">Notícias Relacionadas</Title>
      <Grid>
        {relatedNews.map((item) => (
          <Grid.Col span={{ base: 12, sm: 4 }} key={item.id}>
            <Link href={`/noticias/${item.id}`} style={{ textDecoration: 'none' }}>
              <Paper withBorder p="md" h="100%" className="hover:shadow-md transition-shadow duration-200">
                {item.image && (
                  <Box pos="relative" h={140} mb="sm">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </Box>
                )}
                <Text fw={600} lineClamp={2}>{item.title}</Text>
                <Text size="sm" c="dimmed" mt="xs">
                  {new Date(item.publishedAt).toLocaleDateString('pt-BR')}
                </Text>
              </Paper>
            </Link>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
}
