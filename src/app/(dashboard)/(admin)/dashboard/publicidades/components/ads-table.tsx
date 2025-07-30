"use client";

import {
  ActionIcon,
  Button,
  Divider,
  Group,
  ScrollArea,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { RefreshCcwIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Ads } from "@/lib/schemas/ads-schema";
import { getAds, getAdsByCampaing } from "@/app/actions/publicidades/get-ads";
import { deleteAds } from "@/app/actions/publicidades/delete-ads";

export default function AdsTable() {
  const [ads, setAds] = useState<Ads[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const ads = await getAds();
    setAds(ads);
    setIsLoading(false);
  };

  useEffect(() => {
    // Chama a função fetchData ao montar o componente
    fetchData();
  }, []);

  const rows = ads.map((element) => (
    <Table.Tr key={element.campaing}>
      <Table.Td fw={700}>
        {element.campaing.length > 50
          ? `${element.campaing.slice(0, 50)}...`
          : element.campaing}
      </Table.Td>
      <Table.Td>{element.position}</Table.Td>
      <Table.Td>{new Date(element.startDate).toLocaleDateString()}</Table.Td>
      <Table.Td>{new Date(element.endDate).toLocaleDateString()}</Table.Td>
      <Table.Td>
        <Group justify="center">
          <Tooltip label="Excluir anúncio">
            <ActionIcon
              variant="light"
              color="red"
              onClick={() => {
                modals.openConfirmModal({
                  title: "Excluir anúncio",
                  children: (
                    <Text size="sm">
                      Você tem certeza que deseja excluir o anúncio{" "}
                      <strong>{element.campaing}</strong>?
                    </Text>
                  ),
                  labels: { confirm: "Excluir", cancel: "Cancelar" },
                  onConfirm: async () => {
                    setIsLoading(true);
                    const ads = await getAdsByCampaing(element.campaing);
                    if (!ads) {
                      notifications.show({
                        title: "Anúncio não encontrado",
                        message: `Nenhum anúncio encontrado com o título: ${element.campaing}`,
                        color: "red",
                      });
                      return;
                    }
                    await deleteAds(ads.id);
                    notifications.show({
                      title: "Anúncio excluído",
                      message: `O anúncio ${element.campaing} foi excluído com sucesso.`,
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
    return <div>Carregando anúncios...</div>;
  }

  return (
    <>
      <Group align="center" justify="flex-end">
        <Text size="sm" c="dimmed">
          Caso você não tenha encontrado o anúncio desejado, clique em
          &quot;Atualizar anúncios&quot; para tentar novamente.
        </Text>
        <Tooltip label="Atualizar anúncios">
          <Button
            onClick={fetchData}
            leftSection={<RefreshCcwIcon size={14} />}
            variant="default"
          >
            Atualizar anúncios
          </Button>
        </Tooltip>
      </Group>
      <Divider my="md" />
      <ScrollArea offsetScrollbars h={650} px="md" py="xs">
        <Table verticalSpacing={"md"} withTableBorder withColumnBorders striped>
          <Table.Thead bg={"blue"} c="white">
            <Table.Tr>
              <Table.Th>Campanha</Table.Th>
              <Table.Th>Posição</Table.Th>
              <Table.Th>Data de Início</Table.Th>
              <Table.Th>Data de Fim</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
      <Group justify="center" mt="md">
        <Text size="sm">Atualmente {ads.length} anúncios cadastrados.</Text>
      </Group>
    </>
  );
}
