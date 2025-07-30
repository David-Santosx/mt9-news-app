"use client";

import {
  ActionIcon,
  Container,
  Divider,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import AdsTable from "./components/ads-table";
import AdsFormModal from "./components/ads-form-modal";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <Container>
      <Group justify="space-between">
        <Stack>
          <Title order={2}>Gerenciar Publicidades</Title>
          <Text c={"dimmed"} size="sm">
            Aqui você pode criar, editar e excluir publicidades do portal MT9.
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
          <AdsFormModal />
        </Group>
      </Group>
      <Divider my={"lg"} />
      <AdsTable />
    </Container>
  );
}
