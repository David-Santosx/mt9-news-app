"use client";

import {
  ActionIcon,
  Button,
  Container,
  Divider,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import NewsTable from "./components/news-table";
import NewsFormModal from "./components/news-form-modal";
import { FolderPlusIcon, HomeIcon } from "lucide-react";
import Link from "next/link";
import { seedNews } from "@/app/actions/noticias/seed-news";
import { notifications } from "@mantine/notifications";

export default function Page() {
  return (
    <Container>
      <Group justify="space-between">
        <Stack>
          <Title order={2}>Gerenciar Notícias</Title>
          <Text c={"dimmed"} size="sm">
            Aqui você pode criar, editar e excluir notícias do portal MT9.
          </Text>
        </Stack>
        <Group justify="flex-end">
          <ActionIcon
            component={Link}
            href="/"
            variant="outline"
            aria-label="Voltar para a página inicial"
          >
            <HomeIcon size={14} />
          </ActionIcon>
          <Button
            leftSection={<FolderPlusIcon size={14} />}
            variant="outline"
            onClick={async () => {
              try {
                await seedNews();
                notifications.show({
                  title: "Notícias geradas com sucesso!",
                  message: "As notícias foram inseridas no banco de dados.",
                  color: "green",
                });
              } catch (error) {
                notifications.show({
                  title: "Erro ao gerar notícias",
                  message:
                    error instanceof Error
                      ? error.message
                      : "Não foi possível gerar as notícias.",
                  color: "red",
                });
              }
            }}
          >
            Gerar notícias
          </Button>
          <NewsFormModal />
        </Group>
      </Group>
      <Divider my={"lg"} />
      <NewsTable />
    </Container>
  );
}
