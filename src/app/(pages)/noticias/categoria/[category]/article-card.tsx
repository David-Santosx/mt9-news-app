'use client';

import { Card, Badge, Text, Stack, Group, Flex, Image } from "@mantine/core";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Componente client para o card de notícias com animação
export const ArticleCard = ({
  image,
  title,
  subtitle,
  category,
  publishedAt,
  slug,
  index = 0,
}: {
  image?: string;
  title: string;
  subtitle?: string;
  category: string;
  publishedAt: Date;
  slug: string;
  index?: number;
}) => {
  const formattedDate = format(new Date(publishedAt), "dd 'de' MMMM', 'yyyy", {
    locale: ptBR,
  });

  return (
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder 
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        transform: 'translateY(20px)',
        opacity: 0,
        animation: `fadeIn 0.5s ease forwards ${0.1 + index * 0.1}s`,
      }}
      className="article-card"
    >
      <style jsx global>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .article-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .article-card:hover {
          transform: translateY(-5px) !important;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>

      <Card.Section>
        <Image
          src={image || '/images/og-image.jpg'}
          height={180}
          alt={title}
          style={{ objectFit: 'cover' }}
        />
      </Card.Section>

      <Stack gap="xs" mt="md" style={{ flex: 1 }}>
        <Badge color="blue" variant="light" size="sm">
          {category}
        </Badge>
        
        <Text fw={700} size="lg" lineClamp={2} component={Link} href={`/noticias/${slug}`} style={{ 
          color: 'var(--mantine-color-text)', 
          textDecoration: 'none',
        }}>
          {title}
        </Text>
        
        {subtitle && (
          <Text size="sm" c="dimmed" lineClamp={3}>
            {subtitle}
          </Text>
        )}
      </Stack>

      <Group mt="md" gap="xs" c="dimmed">
        <Flex align="center" gap={4}>
          <Calendar size={14} />
          <Text size="xs">{formattedDate}</Text>
        </Flex>
      </Group>
    </Card>
  );
};
