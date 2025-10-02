"use client";

import { getNews, getNewsByTitle } from "@/app/actions/noticias/get-news";
import { News } from "@/lib/schemas/news-schema";
import {
  ActionIcon,
  Button,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { RefreshCcwIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteNews } from "@/app/actions/noticias/delete-news";

export default function NewsTable() {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const newsData = await getNews(50, 0);
    const mappedNews = newsData.map((item) => ({
      ...item,
      source: item.source ?? undefined,
      imageSource: item.imageSource ?? undefined,
    }));
    setNews(mappedNews);
    setIsLoading(false);
  };

  useEffect(() => {
    // Chama a função fetchData ao montar o componente
    fetchData();
  }, []);

  const rows = news.map((element) => (
    <Table.Tr key={element.title}>
      <Table.Td fw={700}>
        {element.title.length > 50
          ? `${element.title.slice(0, 50)}...`
          : element.title}
      </Table.Td>
      <Table.Td>{element.category}</Table.Td>
      <Table.Td>{new Date(element.publishedAt).toLocaleDateString()}</Table.Td>
      <Table.Td>
        <Group justify="center">
          <Tooltip label="Excluir notícia">
            <ActionIcon
              variant="light"
              color="red"
              onClick={() => {
                modals.openConfirmModal({
                  title: "Excluir notícia",
                  children: (
                    <Text size="sm">
                      Você tem certeza que deseja excluir a notícia{" "}
                      <strong>{element.title}</strong>?
                    </Text>
                  ),
                  labels: { confirm: "Excluir", cancel: "Cancelar" },
                  onConfirm: async () => {
                    setIsLoading(true);
                    const news = await getNewsByTitle(element.title);
                    if (!news) {
                      notifications.show({
                        title: "Notícia não encontrada",
                        message: `Nenhuma notícia encontrada com o título: ${element.title}`,
                        color: "red",
                      });
                      return;
                    }
                    await deleteNews(news.id);
                    notifications.show({
                      title: "Notícia excluída",
                      message: `A notícia ${element.title} foi excluída com sucesso.`,
                      color: "green",
                    });
                    await fetchData(); // Atualiza a lista de notícias
                    setIsLoading(false);
                  },
                });
              }}
            >
              <TrashIcon size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  if (isLoading) {
    return <div>Carregando notícias...</div>;
  }

  return (
    <>
      <Group align="center" justify="flex-end">
        <Text size="sm" c="dimmed">
          Caso você não tenha encontrado a notícia desejada, clique em
          &quot;Atualizar notícias&quot; para tentar novamente.
        </Text>
        <Tooltip label="Atualizar notícias">
          <Button
            onClick={fetchData}
            leftSection={<RefreshCcwIcon size={14} />}
            variant="default"
          >
            Atualizar notícias
          </Button>
        </Tooltip>
      </Group>
      <Divider my="md" />
      {news.length === 0 ? (
        <Group justify="center" py={100}>
          <Stack align="center" gap="xs">
            <Text size="xl" fw={700} c="dimmed">
              Nenhuma notícia encontrada
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              Não há notícias cadastradas no sistema. Clique em &quot;Criar
              notícia&quot; para adicionar uma nova.
            </Text>
            <Button
              onClick={fetchData}
              leftSection={<RefreshCcwIcon size={14} />}
              variant="outline"
              mt="md"
            >
              Atualizar notícias
            </Button>
          </Stack>
        </Group>
      ) : (
        <ScrollArea offsetScrollbars h={650} px="md" py="xs">
          <Table
            verticalSpacing={"md"}
            withTableBorder
            withColumnBorders
            striped
          >
            <Table.Thead bg={"blue"} c="white">
              <Table.Tr>
                <Table.Th>Título</Table.Th>
                <Table.Th>Categoria</Table.Th>
                <Table.Th>Data</Table.Th>
                <Table.Th>Ações</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
      )}
      <Group justify="center" mt="md">
        <Text size="sm">Atualmente {news.length} notícias cadastradas.</Text>
      </Group>
    </>
  );
}
