"use client";
import { useEffect, useState } from "react";
import {
  Button,
  Group,
  ScrollArea,
  Table,
  Text,
  Skeleton,
} from "@mantine/core";
import { ActionButtons } from "./action-buttons"
import { useRouter } from "next/navigation";
import { fetchAds } from "../actions/fetch-ads";

interface Ads {
  id: string;
  campaing: string;
  startDate: string;
  endDate: string;
}

export function AdsTable() {
  const [, setScrolled] = useState(false);
  const [ads, setAds] = useState<Ads[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Carrega as publicidades
  const loadAds = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAds();
      setAds(data);
    } catch (error) {
      console.error("Erro ao carregar publicidades:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAds();
  }, []);

  // Handlers
  const handleEdit = (id: string) => {
    // TODO: Implementar navegação para edição
    router.push(`/dashboard/publicidades/editar/${id}`);
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
    : ads.map((item) => (
        <Table.Tr key={item.id}>
          <Table.Td>
            <Text size="sm" c="dimmed">
              {item.id.substring(0, 8)}...
            </Text>
          </Table.Td>
          <Table.Td>
            <Text size="sm" fw={500}>
              {item.campaing}
            </Text>
          </Table.Td>
          <Table.Td>
            <Text size="sm">{new Date(item.startDate).toLocaleDateString("pt-br")}</Text>
          </Table.Td>
          <Table.Td>
            <Text size="sm">
              {new Date(item.endDate).toLocaleDateString("pt-BR")}
            </Text>
          </Table.Td>
          <Table.Td>
            <ActionButtons
              adsId={item.id}
              onEdit={handleEdit}
              onDelete={loadAds}
            />
          </Table.Td>
        </Table.Tr>
      ));

  return (
    <>
      <Group justify="flex-end" mb="sm">
        <Button
          onClick={loadAds}
          loading={isLoading}
          variant="outline"
          color="blue"
        >
          Atualizar Lista
        </Button>
      </Group>
      <ScrollArea
        p={"sm"}
        h={400}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table
          bdrs={"lg"}
          bd={"solid 1px var(--mantine-color-gray-4)"}
          miw={700}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Campanha</Table.Th>
              <Table.Th>Data de Início</Table.Th>
              <Table.Th>Data de Fim</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </>
  );
}
