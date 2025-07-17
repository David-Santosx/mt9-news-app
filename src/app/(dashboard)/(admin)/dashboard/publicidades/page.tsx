import { Container, Divider, Group, Text } from "@mantine/core";
import { AdsTable } from "./components/ads-table";
import AdsFormModal from "./components/ads-form-modal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerenciar Publicidades",
  description:
    "Gerencie todas as publicidades do MT9 Notícias - Criar, editar e configurar anúncios",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
  openGraph: {
    title: "Gerenciar Publicidades - Dashboard MT9 Notícias & Comércios",
    description:
      "Área de administração para gerenciar publicidades do portal MT9 Notícias & Comércios",
    type: "website",
  },
};

export default function Page() {
    return (
        <Container>
            <Group justify="space-between">
                <Text c={"dark.4"}>Gerencie as publicidades exibidas no MT9</Text>
                <AdsFormModal/>
            </Group>
            <Divider my={"lg"}/>
            <AdsTable/>
        </Container>
    )
}