"use client";

import { useEffect, useState } from "react";
import {
  Paper,
  Text,
  Title,
  SimpleGrid,
  Stack,
  Group,
  Skeleton,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { AreaChart } from "@mantine/charts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Newspaper, MonitorPlay } from "lucide-react";

// Note: Como este é um componente client-side, os metadados são definidos no layout parent

type NewsCount = {
  count: number;
  createdAt: string;
};

type DashboardData = {
  totalNews: number;
  totalAds: number;
  newsCountByMonth: NewsCount[];
};

export default function Page() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const response = await fetch(`${baseUrl}/api/admin/dashboard`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Falha ao carregar dados do dashboard");
        }

        setData(data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        notifications.show({
          title: "Erro",
          message:
            error instanceof Error
              ? error.message
              : "Erro ao carregar dados do dashboard",
          color: "red",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Formata os dados para o gráfico
  const chartData =
    data?.newsCountByMonth.map((item) => ({
      date: format(new Date(item.createdAt), "MMM/yyyy", { locale: ptBR }),
      count: item.count,
    })) || [];

  return (
    <Stack gap="lg">
      <Title order={2} size="h1">
        Dashboard
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <Paper withBorder p="md" radius="md">
          {isLoading ? (
            <Skeleton height={100} radius="md" />
          ) : (
            <Stack gap="xs">
              <Group>
                <Newspaper size={24} />
                <Title order={3}>Total de Notícias</Title>
              </Group>
              <Text size="xl" fw={500}>
                {data?.totalNews || 0}
              </Text>
            </Stack>
          )}
        </Paper>

        <Paper withBorder p="md" radius="md">
          {isLoading ? (
            <Skeleton height={100} radius="md" />
          ) : (
            <Stack gap="xs">
              <Group>
                <MonitorPlay size={24} />
                <Title order={3}>Total de Publicidades</Title>
              </Group>
              <Text size="xl" fw={500}>
                {data?.totalAds || 0}
              </Text>
            </Stack>
          )}
        </Paper>
      </SimpleGrid>

      <Paper withBorder p="md" radius="md">
        {isLoading ? (
          <Skeleton height={300} radius="md" />
        ) : (
          <>
            <Stack gap="xs" mb="md">
              <Title order={3}>
                Evolução de Notícias
              </Title>
              <Text size="sm" c="dimmed">
                Quantidade de notícias publicadas por mês
              </Text>
            </Stack>
            <AreaChart
              h={300}
              data={chartData}
              dataKey="date"
              series={[
                { 
                  name: "Notícias",
                  color: "var(--mantine-primary-color-filled)"
                }
              ]}
              withLegend
              gridAxis="xy"
              withTooltip
              strokeWidth={2}
              curveType="natural"
              yAxisProps={{
                label: "Quantidade de Notícias",
                tickFormatter: (value) => value.toLocaleString('pt-BR')
              }}
              xAxisProps={{
                label: "Período"
              }}
              tooltipProps={{
                content: ({ payload }) => {
                  if (!payload || payload.length === 0) return null;
                  const value = payload[0]?.value as number;
                  return (
                    <Paper withBorder shadow="sm" radius="md" p="md" bg="var(--mantine-color-body)">
                      <Stack gap="xs">
                        <Text size="sm" c="dimmed" tt="uppercase">
                          {payload[0]?.payload?.date}
                        </Text>
                        <Group gap="xs" align="baseline">
                          <Text size="xl" fw={700}>
                            {value?.toLocaleString('pt-BR')}
                          </Text>
                          <Text size="sm" c="dimmed">notícias</Text>
                        </Group>
                      </Stack>
                    </Paper>
                  );
                },
              }}
            />
          </>
        )}
      </Paper>
    </Stack>
  );
}
