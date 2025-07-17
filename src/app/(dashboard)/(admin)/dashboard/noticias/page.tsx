import { Container, Divider, Group, Text } from "@mantine/core";
import { NewsTable } from "./components/news-table";
import NewsFormModal from "./components/news-form-modal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerenciar Notícias",
  description:
    "Gerencie todas as notícias do portal MT9 Notícias - Criar, editar e excluir artigos",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
  openGraph: {
    title: "Gerenciar Notícias - Dashboard MT9 Notícias & Comércios",
    description:
      "Área de administração para gerenciar notícias do portal MT9 Notícias & Comércios",
    type: "website",
  },
};

export default function Page() {
    return (
        <Container>
            <Group justify="space-between">
                <Text c={"dark.4"}>Gerencie as notícias exibidas no MT9</Text>
                <NewsFormModal/>
            </Group>
            <Divider my={"lg"}/>
            <NewsTable/>
        </Container>
    )
}