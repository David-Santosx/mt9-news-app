import { getPublicNewsByCategorySlug } from "@/app/actions/noticias/get-news";
import { Box, Container, SimpleGrid, Text, Title, Card, Badge, Image, Stack } from "@mantine/core";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "./article-card";

type PageProps = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;

  if (!category) {
    return {
      title: "",
      description: "A categoria que você está procurando não foi encontrada.",
    };
  }

  return {
    title: `Notícias sobre ${category}`,
    openGraph: {
      title: `Notícias sobre ${category}`,
      description: "Leia mais sobre esta categoria",
      images: [],
    },
    keywords: [category],
    description: "Leia mais sobre esta categoria",
    category: [
      category,
      "notícias",
      "portal MT9 Notícias",
    ].join(", "),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const news = await getPublicNewsByCategorySlug(category);

  if (!news) {
    return notFound();
  }

  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  };

  return (
    <Container size="xl" p="xl">
      <Box 
        mb={50} 
        style={{ 
          textAlign: "center",
          position: "relative",
          padding: "40px 0"
        }}
      >
        <Box 
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "1px",
            background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(34,139,230,0.5) 50%, rgba(0,0,0,0) 100%)"
          }} 
        />
        
        <Badge 
          size="lg" 
          radius="sm" 
          mb="md" 
          variant="light"
        >
          CATEGORIA
        </Badge>
        
        <Title 
          order={1} 
          style={{ 
            color: "#228BE6", 
            fontSize: "2.5rem", 
            fontWeight: 800
          }}
        >
          {formatCategoryName(category)}
        </Title>
        
        <Text 
          size="lg" 
          c="dimmed" 
          mt="xs" 
          maw={600} 
          mx="auto"
        >
          Confira as últimas notícias e atualizações sobre {category.toLowerCase()}
        </Text>
      </Box>

      {news.length > 0 ? (
        <SimpleGrid 
          cols={{ base: 1, sm: 2, md: 3 }}
          spacing={{ base: 'md', sm: 'lg' }}
        >
          {news.map((item, index) => (
            <ArticleCard
              key={item.id}
              image={item.image as string}
              title={item.title}
              category={item.category}
              subtitle={item.subtitle as string}
              publishedAt={item.publishedAt}
              slug={item.slug}
              index={index}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Card
          withBorder
          radius="md"
          shadow="sm"
          padding="xl"
          style={{
            textAlign: "center",
            backgroundColor: "var(--mantine-color-body)",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <Stack align="center" gap="md">
            <Image
              src="/images/mt9-logo.svg"
              width={120}
              height={80}
              alt="MT9 Logo"
              opacity={0.7}
            />
            
            <Title order={3}>
              Não há notícias disponíveis nesta categoria
            </Title>
            
            <Text size="md" c="dimmed" maw={400} mx="auto">
              Estamos sempre trabalhando para trazer os melhores conteúdos. 
              Volte mais tarde para conferir as últimas atualizações.
            </Text>
            
            <Badge size="lg" variant="outline" color="blue" radius="md" mt="md">
              Em breve novos conteúdos
            </Badge>
          </Stack>
        </Card>
      )}
    </Container>
  );
}
