"use client";
import { useEffect, useState } from "react";
import { Button, Group, ScrollArea, Table, Text, Skeleton } from "@mantine/core";
import { ActionButtons } from "./action-buttons";
import { fetchNews } from "../actions/fetch-news";
import { useRouter } from "next/navigation";

interface News {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
}

export function NewsTable() {
  const [scrolled, setScrolled] = useState(false);
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Carrega as notícias
  const loadNews = async () => {
    setIsLoading(true);
    try {
      const data = await fetchNews();
      setNews(data);
    } catch (error) {
      console.error("Erro ao carregar notícias:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  // Handlers
  const handleEdit = (id: string) => {
    // TODO: Implementar navegação para edição
    router.push(`/dashboard/noticias/editar/${id}`);
  };

  const rows = isLoading
    ? Array.from({ length: 5 }).map((_, index) => (
        <Table.Tr key={index}>
          <Table.Td>
            <Skeleton height={20} width={100} />
          </Table.Td>
          <Table.Td>
            <Skeleton height={20} width={200} />
          </Table.Td>
          <Table.Td>
            <Skeleton height={20} width={150} />
          </Table.Td>
          <Table.Td>
            <Skeleton height={20} width={120} />
          </Table.Td>
          <Table.Td>
            <Skeleton height={20} width={100} />
          </Table.Td>
        </Table.Tr>
      ))
    : news.map((item) => (
        <Table.Tr key={item.id}>
          <Table.Td>
            <Text size="sm" c="dimmed">
              {item.id.substring(0, 8)}...
            </Text>
          </Table.Td>
          <Table.Td>
            <Text size="sm" fw={500}>
              {item.title}
            </Text>
          </Table.Td>
          <Table.Td>
            <Text size="sm">{item.category}</Text>
          </Table.Td>
          <Table.Td>
            <Text size="sm">
              {new Date(item.publishedAt).toLocaleDateString("pt-BR")}
            </Text>
          </Table.Td>
          <Table.Td>
            <ActionButtons
              newsId={item.id}
              onEdit={handleEdit}
              onDelete={loadNews}
            />
          </Table.Td>
        </Table.Tr>
      ));

  return (
    <>
      <Group justify="flex-end" mb="sm">
        <Button onClick={loadNews} loading={isLoading} variant="outline" color="blue">
          Atualizar Lista
        </Button>
      </Group>
      <ScrollArea
        p={"sm"}
        h={400}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table bdrs={"lg"} bd={"solid 1px var(--mantine-color-gray-4)"} miw={700}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Título</Table.Th>
              <Table.Th>Categoria</Table.Th>
              <Table.Th>Data de Publicação</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </>
  );
}
