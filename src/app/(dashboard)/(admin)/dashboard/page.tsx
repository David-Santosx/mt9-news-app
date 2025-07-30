"use client";

import {
  Paper,
  Text,
  Title,
  SimpleGrid,
  Stack,
  Group,
  Skeleton,
} from "@mantine/core";
import { AreaChart } from "@mantine/charts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Newspaper, MonitorPlay } from "lucide-react";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { getDashboardDataCached } from "../../../actions/dashboard/get-dashboard-data";
import type { DashboardData } from "../../../actions/dashboard/get-dashboard-data";

export default function Page() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const dashboardData = await getDashboardDataCached();
        setData(dashboardData);
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
    data?.newsCountByDay.map((item) => ({
      date: format(new Date(item.createdAt), "dd/MM/yyyy", { locale: ptBR }),
      count: item.count,
    })) || [];

  console.log("Dashboard Data:", chartData);

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
              <Title order={3}>Evolução de Notícias</Title>
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
                  color: "var(--mantine-primary-color-filled)",
                },
              ]}
              withLegend
              gridAxis="xy"
              withTooltip
              strokeWidth={2}
              curveType="natural"
              yAxisProps={{
                label: "Quantidade de Notícias",
                tickFormatter: (value) => value.toLocaleString("pt-BR"),
              }}
              xAxisProps={{
                label: "Período",
              }}
              tooltipProps={{
                content: ({ payload }) => {
                  if (!payload || payload.length === 0) return null;
                  const value = payload[0]?.value as number;
                  return (
                    <Paper
                      withBorder
                      shadow="sm"
                      radius="md"
                      p="md"
                      bg="var(--mantine-color-body)"
                    >
                      <Stack gap="xs">
                        <Text size="sm" c="dimmed" tt="uppercase">
                          {payload[0]?.payload?.date}
                        </Text>
                        <Group gap="xs" align="baseline">
                          <Text size="xl" fw={700}>
                            {value?.toLocaleString("pt-BR")}
                          </Text>
                          <Text size="sm" c="dimmed">
                            notícias
                          </Text>
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
