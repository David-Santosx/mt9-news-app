"use client";

import {
  Paper,
  Text,
  Title,
  SimpleGrid,
  Stack,
  Group,
  Skeleton,
  Card,
  Badge,
  Box,
  Grid,
  GridCol,
  Divider,
  Image,
  ThemeIcon,
  Center,
  Button,
} from "@mantine/core";
import { BarChart, DonutChart, PieChart } from "@mantine/charts";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Newspaper, MonitorPlay, Clock, CalendarDays, ExternalLink, RefreshCw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { getDashboardDataCached } from "../../../actions/dashboard/get-dashboard-data";
import type { DashboardData } from "../../../actions/dashboard/get-dashboard-data";
import Link from "next/link";

export default function Page() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para buscar dados do dashboard
  const fetchDashboardData = async () => {
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
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Formata os dados para o gráfico de evolução temporal, agrupando por dia
  const timeChartData = React.useMemo(() => {
    if (!data?.newsCountByDay) return [];

    // Agrupar notícias por data formatada (dia)
    const groupedByDay = data.newsCountByDay.reduce((acc, item) => {
      const date = format(new Date(item.createdAt), "dd MMM", { locale: ptBR });
      
      if (!acc[date]) {
        acc[date] = 0;
      }
      
      acc[date] += item.count;
      return acc;
    }, {} as Record<string, number>);
    
    // Converter para o formato do gráfico e ordenar por data
    return Object.entries(groupedByDay)
      .map(([date, count]) => ({
        date,
        Notícias: count,
      }))
      .sort((a, b) => {
        // Extrair dia e mês para ordenação
        const [dayA, monthA] = a.date.split(' ');
        const [dayB, monthB] = b.date.split(' ');
        
        // Comparar mês primeiro
        const monthOrder = getMonthIndex(monthA) - getMonthIndex(monthB);
        if (monthOrder !== 0) return monthOrder;
        
        // Se mesmo mês, comparar dia
        return parseInt(dayA) - parseInt(dayB);
      });
  }, [data?.newsCountByDay]);
  
  // Função auxiliar para obter o índice do mês
  function getMonthIndex(monthAbbr: string): number {
    const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    return months.findIndex(m => monthAbbr.toLowerCase().startsWith(m));
  }

  // Formata os dados para o gráfico de distribuição por categoria
  const categoryChartData =
    data?.categoryDistribution.map((item) => ({
      name: item.category,  // Alterado de category para name conforme esperado pelo DonutChart
      value: item.count,
      color: getCategoryColor(item.category),
    })) || [];
    
  // Função para gerar cores consistentes baseadas no nome da categoria
  function getCategoryColor(category: string) {
    // Lista de cores pré-definidas para categorias comuns
    const colorMap: Record<string, string> = {
      "Política": "#3f51b5",
      "Esporte": "#4caf50",
      "Economia": "#ff9800",
      "Cultura": "#9c27b0",
      "Tecnologia": "#00bcd4",
      "Saúde": "#e91e63",
      "Educação": "#795548",
      "Internacional": "#607d8b",
      "Geral": "#2196f3",
    };
    
    // Retorna a cor mapeada ou uma cor padrão
    return colorMap[category] || `hsl(${Math.abs(hashCode(category) % 360)}, 70%, 50%)`;
  }
  
  // Função simple de hash para gerar cores consistentes
  function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0; // Converte para inteiro de 32 bits
    }
    return hash;
  }

  // Remover logs de produção
  if (process.env.NODE_ENV !== 'production') {
    console.log("Dashboard Time Data (grouped by day):", timeChartData);
    console.log("Dashboard Category Data:", categoryChartData);
    
    // Log estatísticas do gráfico para debug
    if (timeChartData.length > 0) {
      console.log("Número de dias no gráfico:", timeChartData.length);
      console.log("Total de notícias no gráfico:", 
        timeChartData.reduce((sum, item) => sum + item.Notícias, 0));
    }
  }

  // Formatar data relativa (ex: "há 2 dias")
  const formatRelativeDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: ptBR,
    });
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-start" mb="md">
        <Box>
          <Title order={2} size="h1" mb={5}>
            Dashboard
          </Title>
          <Text c="dimmed" size="sm">Visão geral do sistema de notícias e publicidade</Text>
        </Box>
        <Button
          variant="light"
          color="blue"
          leftSection={<RefreshCw size={16} />}
          onClick={() => {
            setIsLoading(true);
            fetchDashboardData();
          }}
          loading={isLoading}
          disabled={isLoading}
        >
          Atualizar dados
        </Button>
      </Group>

      <Grid gutter="md">
        {/* Cards com estatísticas */}
        <GridCol span={{ base: 12, md: 6, lg: 3 }}>
          <Paper withBorder p="lg" radius="md" h="100%">
            {isLoading ? (
              <Skeleton height={80} radius="md" />
            ) : (
              <Stack gap="xs" justify="center" h="100%">
                <ThemeIcon size={48} radius="md" color="blue.5" variant="light">
                  <Newspaper size={24} />
                </ThemeIcon>
                <Text fw={500} c="dimmed" size="sm">Total de Notícias</Text>
                <Text size="2.5rem" fw={700} lh={1}>
                  {data?.totalNews?.toLocaleString('pt-BR') || 0}
                </Text>
              </Stack>
            )}
          </Paper>
        </GridCol>

        <GridCol span={{ base: 12, md: 6, lg: 3 }}>
          <Paper withBorder p="lg" radius="md" h="100%">
            {isLoading ? (
              <Skeleton height={80} radius="md" />
            ) : (
              <Stack gap="xs" justify="center" h="100%">
                <ThemeIcon size={48} radius="md" color="indigo.5" variant="light">
                  <MonitorPlay size={24} />
                </ThemeIcon>
                <Text fw={500} c="dimmed" size="sm">Total de Publicidades</Text>
                <Text size="2.5rem" fw={700} lh={1}>
                  {data?.totalAds?.toLocaleString('pt-BR') || 0}
                </Text>
              </Stack>
            )}
          </Paper>
        </GridCol>

        {/* Última notícia publicada */}
        <GridCol span={{ base: 12, lg: 6 }}>
          <Paper withBorder p="lg" radius="md" h="100%">
            {isLoading ? (
              <Skeleton height={200} radius="md" />
            ) : !data?.latestNews ? (
              <Stack align="center" justify="center" h="100%">
                <Text fw={500} c="dimmed">Nenhuma notícia publicada ainda</Text>
              </Stack>
            ) : (
              <Stack gap="md">
                <Group justify="space-between" wrap="nowrap">
                  <Title order={3} size="h4">Última Notícia</Title>
                  <Badge size="lg" radius="sm">
                    {data.latestNews.category}
                  </Badge>
                </Group>
                <Divider />
                <Group wrap="nowrap" align="flex-start">
                  {data.latestNews.image && (
                    <Image 
                      src={data.latestNews.image} 
                      alt={data.latestNews.title}
                      radius="md"
                      w={120}
                      h={80}
                      fit="cover"
                    />
                  )}
                  <Stack gap="xs">
                    <Text fw={700} size="lg" lineClamp={2}>
                      {data.latestNews.title}
                    </Text>
                    {data.latestNews.subtitle && (
                      <Text size="sm" c="dimmed" lineClamp={2}>
                        {data.latestNews.subtitle}
                      </Text>
                    )}
                    <Group gap="lg">
                      <Group gap="xs">
                        <CalendarDays size={16} />
                        <Text size="xs" c="dimmed">
                          {format(new Date(data.latestNews.publishedAt), "dd/MM/yyyy", { locale: ptBR })}
                        </Text>
                      </Group>
                    </Group>
                    <Link 
                      href={`/noticias/${data.latestNews.slug}`}
                      style={{ textDecoration: 'none', alignSelf: 'flex-start' }}
                      target="_blank"
                    >
                      <Group gap="xs" style={{ color: 'var(--mantine-color-blue-filled)' }}>
                        <Text size="sm">Ver notícia</Text>
                        <ExternalLink size={14} />
                      </Group>
                    </Link>
                  </Stack>
                </Group>
              </Stack>
            )}
          </Paper>
        </GridCol>
      </Grid>

      {/* Grade de gráficos */}
      <Grid gutter="md">
        {/* Gráfico de evolução temporal */}
        <GridCol span={{ base: 12, xl: 8 }}>
          <Paper withBorder p="xl" radius="md" shadow="sm" h="100%">
            {isLoading ? (
              <Skeleton height={400} radius="md" />
            ) : (
              <>
                <Stack gap="xs" mb="lg">
                  <Title order={3} size="h3">Evolução de Notícias</Title>
                  <Text size="sm" c="dimmed">
                    Quantidade de notícias publicadas por dia
                  </Text>
                  {timeChartData.length === 0 && (
                    <Text size="sm" c="dimmed" fs="italic">
                      Nenhum dado disponível para o período
                    </Text>
                  )}
                </Stack>
                <Box style={{ height: 320 }}>
                  <BarChart
                    h={320}
                    data={timeChartData}
                    dataKey="date"
                    series={[
                      {
                        name: "Notícias",
                        color: "#2196f3",
                      },
                    ]}
                    withLegend
                    legendProps={{
                      verticalAlign: "top",
                      height: 30,
                    }}
                    gridAxis="y"
                    withTooltip
                    barProps={{
                      radius: 4,
                      width: 36, // Barra mais larga para melhor visualização
                    }}
                    valueFormatter={(value) => `${value} notícias`}
                    yAxisProps={{
                      domain: [0, 'auto'],
                      allowDecimals: false,
                      tickCount: 5,
                      tickFormatter: (value) => value.toLocaleString("pt-BR"),
                    }}
                    xAxisProps={{
                      tickMargin: 10,
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
                </Box>
              </>
            )}
          </Paper>
        </GridCol>

        {/* Gráfico de distribuição por categoria */}
        <GridCol span={{ base: 12, xl: 4 }}>
          <Paper withBorder p="xl" radius="md" shadow="sm" h="100%">
            {isLoading ? (
              <Skeleton height={400} radius="md" />
            ) : (
              <>
                <Stack gap="xs" mb="lg">
                  <Title order={3} size="h3">Categorias Publicadas</Title>
                  <Text size="sm" c="dimmed">
                    Distribuição das notícias por categoria
                  </Text>
                </Stack>
                
                {categoryChartData.length > 0 ? (
                  <Box>
                    <DonutChart
                      h={240}
                      data={categoryChartData}
                      withLabels
                      paddingAngle={2}
                      thickness={30}
                      tooltipDataSource="segment"
                      strokeWidth={1}
                      withTooltip
                      tooltipProps={{
                        content: ({ payload }) => {
                          if (!payload || payload.length === 0) return null;
                          const data = payload[0]?.payload;
                          return (
                            <Paper
                              withBorder
                              shadow="sm"
                              radius="md"
                              p="md"
                              bg="var(--mantine-color-body)"
                            >
                              <Stack gap="xs">
                                <Group gap="xs" align="center">
                                  <Box
                                    w={12}
                                    h={12}
                                    style={{
                                      backgroundColor: data.color,
                                      borderRadius: 2,
                                    }}
                                  />
                                  <Text fw={600}>{data.name}</Text>
                                </Group>
                                <Group gap="xs" align="baseline">
                                  <Text size="xl" fw={700}>
                                    {data.value}
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
                    
                    {/* Legenda personalizada */}
                    <Box mt="md">
                      <SimpleGrid cols={{ base: 2, md: 2 }} spacing={5}>
                        {categoryChartData.map((item) => (
                          <Group key={item.name} gap="xs" wrap="nowrap">
                            <Box
                              w={8}
                              h={8}
                              style={{
                                backgroundColor: item.color,
                                borderRadius: 2,
                                flexShrink: 0,
                              }}
                            />
                            <Text size="xs" lineClamp={1}>
                              {item.name} ({item.value})
                            </Text>
                          </Group>
                        ))}
                      </SimpleGrid>
                    </Box>
                  </Box>
                ) : (
                  <Center h={240}>
                    <Text c="dimmed">Nenhuma categoria disponível</Text>
                  </Center>
                )}
              </>
            )}
          </Paper>
        </GridCol>
      </Grid>
    </Stack>
  );
}
