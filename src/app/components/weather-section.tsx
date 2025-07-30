"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Flex,
  Grid,
  Group,
  Tabs,
  Text,
  Title,
  Skeleton,
  Paper,
} from "@mantine/core";
import {
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  Sun,
  Wind,
  ArrowDown,
  ArrowRight,
  ArrowUp,
} from "lucide-react";

// Definição das cidades por região
const MT_CITIES = {
  Norte: [
    { name: "Sinop", lat: -11.8642, lon: -55.5025 },
    { name: "Sorriso", lat: -12.5453, lon: -55.7114 },
    { name: "Matupá", lat: -10.1693, lon: -54.9344 },
  ],
  Centro: [
    { name: "Cuiabá", lat: -15.5961, lon: -56.0967 },
    { name: "Várzea Grande", lat: -15.6467, lon: -56.1325 },
    { name: "Tangará da Serra", lat: -14.6226, lon: -57.4933 },
  ],
  Sul: [
    { name: "Rondonópolis", lat: -16.4673, lon: -54.6372 },
    { name: "Primavera do Leste", lat: -15.544, lon: -54.2811 },
    { name: "Cáceres", lat: -16.0764, lon: -57.6818 },
  ],
};

interface WeatherData {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
  city: string;
  region: string;
}

// Função para obter o ícone com base no código do tempo e horário
function getWeatherIcon(weatherCode: number, isDaytime: boolean) {
  // Códigos baseados na documentação da API OpenMeteo
  // https://open-meteo.com/en/docs
  if (weatherCode <= 1) {
    return isDaytime ? (
      <Sun size={36} color="#FFB800" />
    ) : (
      <Cloud size={36} color="#8F8F8F" />
    );
  } else if (weatherCode <= 3) {
    return isDaytime ? (
      <CloudSun size={36} color="#B0B0B0" />
    ) : (
      <Cloud size={36} color="#8F8F8F" />
    );
  } else if (weatherCode <= 49) {
    return <Cloud size={36} color="#8F8F8F" />;
  } else if (weatherCode <= 69) {
    return <CloudRain size={36} color="#5F8FBF" />;
  } else {
    return <CloudRain size={36} color="#5F8FBF" />;
  }
}

// Componente para o card de clima de uma cidade
function WeatherCard({
  data,
  isLoading,
}: {
  data?: WeatherData;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Card
        shadow="sm"
        p="md"
        radius="md"
        withBorder
        style={{
          height: "100%",
          background:
            "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,252,255,1) 100%)",
        }}
      >
        <Group wrap="nowrap" justify="space-between" py={5}>
          <Group gap="sm" wrap="nowrap">
            <Skeleton height={36} width={36} circle animate />
            <div>
              <Skeleton height={16} width={80} radius="xl" mb="xs" animate />
              <Skeleton height={24} width={60} radius="xl" animate />
            </div>
          </Group>
          <Group gap="md">
            <Skeleton height={16} width={40} radius="xl" animate />
            <Skeleton height={16} width={40} radius="xl" animate />
          </Group>
        </Group>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card
      shadow="sm"
      p="xs"
      radius="md"
      withBorder
      style={{
        transition: "all 0.2s ease",
        height: "100%",
        background:
          "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(240,249,255,1) 100%)",
      }}
      className="hover:shadow-sm hover:-translate-y-0.5"
    >
      <Group wrap="nowrap" justify="space-between">
        <Group gap="sm" wrap="nowrap">
          {getWeatherIcon(data.weatherCode, new Date().getHours() < 18)}
          <div>
            <Text fw={600} size="sm" c="#005580">
              {data.city}
            </Text>
            <Text fw={700} size="lg" c="#00adef">
              {data.temperature}°C
            </Text>
          </div>
        </Group>
        <Group gap="md">
          <Group gap={4}>
            <Wind size={14} style={{ color: "#666" }} />
            <Text size="xs" c="dimmed">
              {data.windSpeed} km/h
            </Text>
          </Group>
          <Group gap={4}>
            <Droplets size={14} style={{ color: "#00adef" }} />
            <Text size="xs" c="dimmed">
              {data.humidity}%
            </Text>
          </Group>
        </Group>
      </Group>
    </Card>
  );
}

export default function WeatherSection() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRegion, setActiveRegion] = useState<string>("Centro");
  const [isClient, setIsClient] = useState(false);

  // Usamos isso para evitar erro de hidratação (SSR vs Cliente)
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function fetchWeatherData() {
      setLoading(true);
      const allCities = Object.entries(MT_CITIES).flatMap(([region, cities]) =>
        cities.map((city) => ({ ...city, region }))
      );

      try {
        const weatherPromises = allCities.map(async (city) => {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=America/Cuiaba`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch weather for ${city.name}`);
          }
          const data = await response.json();
          return {
            city: city.name,
            region: city.region,
            temperature: Math.round(data.current.temperature_2m),
            weatherCode: data.current.weather_code,
            windSpeed: Math.round(data.current.wind_speed_10m),
            humidity: data.current.relative_humidity_2m,
          };
        });

        const results = await Promise.all(weatherPromises);
        setWeatherData(results);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Erro ao buscar dados do tempo: ${error.message}`);
        } else {
          throw new Error("Erro desconhecido ao buscar dados do tempo");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchWeatherData();
  }, []);

  return (
    <Paper withBorder radius={"md"} p="lg">
      <Flex align="center" mb="md">
        <Box mr="xs">
          <CloudSun size={24} />
        </Box>
        <Title order={3} size="h4" fw={700} c="blue">
          Previsão do Tempo
        </Title>
      </Flex>

      {isClient && (
        <Tabs
          value={activeRegion}
          onChange={(value) => setActiveRegion(value as string)}
          radius="md"
          mb="sm"
          color="blue"
          variant="pills"
          styles={{
            tab: {
              padding: "6px 12px",
              fontSize: "12px",
            },
          }}
        >
          <Tabs.List>
            {Object.keys(MT_CITIES).map((region) => (
              <Tabs.Tab
                key={region}
                value={region}
                leftSection={
                  region === "Norte" ? (
                    <ArrowUp size={12} />
                  ) : region === "Centro" ? (
                    <ArrowRight size={12} />
                  ) : (
                    <ArrowDown size={12} />
                  )
                }
              >
                {region}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
      )}

      <Grid gutter="xs">
        {(isClient
          ? MT_CITIES[activeRegion as keyof typeof MT_CITIES]
          : MT_CITIES.Centro
        ).map((city) => {
          const cityWeather = weatherData.find((w) => w.city === city.name);
          return (
            <Grid.Col span={12} key={city.name}>
              <WeatherCard data={cityWeather} isLoading={loading} />
            </Grid.Col>
          );
        })}
      </Grid>

      <Text ta="right" size="xs" mt="md" c="dimmed" style={{ opacity: 0.7 }}>
        Dados fornecidos por OpenMeteo
      </Text>
    </Paper>
  );
}
