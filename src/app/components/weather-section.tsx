"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Container,
  Flex,
  Grid,
  Group,
  Tabs,
  Text,
  Title,
  rem,
  Skeleton,
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
import AdDisplay, { AdPosition } from "./ad-display";

// Definição das cidades por região
const MT_CITIES = {
  "Norte": [
    { name: "Sinop", lat: -11.8642, lon: -55.5025 },
    { name: "Sorriso", lat: -12.5453, lon: -55.7114 },
    { name: "Matupá", lat: -10.1693, lon: -54.9344 },
  ],
  "Centro": [
    { name: "Cuiabá", lat: -15.5961, lon: -56.0967 },
    { name: "Várzea Grande", lat: -15.6467, lon: -56.1325 },
    { name: "Tangará da Serra", lat: -14.6226, lon: -57.4933 },
  ],
  "Sul": [
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

// Função para obter o ícone com base no código do tempo
function getWeatherIcon(weatherCode: number) {
  // Códigos baseados na documentação da API OpenMeteo
  // https://open-meteo.com/en/docs
  if (weatherCode <= 1) {
    return <Sun size={36} color="#FFB800" />;
  } else if (weatherCode <= 3) {
    return <CloudSun size={36} color="#B0B0B0" />;
  } else if (weatherCode <= 49) {
    return <Cloud size={36} color="#8F8F8F" />;
  } else if (weatherCode <= 69) {
    return <CloudRain size={36} color="#5F8FBF" />;
  } else {
    return <CloudRain size={36} color="#5F8FBF" />;
  }
}

// Componente para o card de clima de uma cidade
function WeatherCard({ data, isLoading }: { data?: WeatherData; isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card 
        shadow="sm" 
        p="md" 
        radius="md" 
        withBorder
        style={{
          height: "100%",
          background: "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,252,255,1) 100%)"
        }}
      >
        <Flex direction="column" align="center" py={5}>
          <Skeleton height={40} width={40} circle mb="sm" animate />
          <Skeleton height={24} width={120} radius="xl" mb="xs" animate />
          <Skeleton height={32} width={80} radius="xl" mb="xs" animate />
          <Group gap="xs" mt="xs">
            <Skeleton height={20} width={60} radius="xl" animate />
            <Skeleton height={20} width={60} radius="xl" animate />
          </Group>
        </Flex>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card 
      shadow="sm" 
      p="md" 
      radius="md" 
      withBorder
      style={{
        transition: "all 0.2s ease",
        height: "100%",
        background: "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(240,249,255,1) 100%)"
      }}
      className="hover:shadow-lg hover:-translate-y-1"
    >
      <Flex direction="column" align="center" py={5}>
        {getWeatherIcon(data.weatherCode)}
        <Text fw={700} size="lg" mt="sm" c="#005580">
          {data.city}
        </Text>
        <Text size="xl" fw={900} style={{ fontSize: rem(32) }} c="#00adef">
          {data.temperature}°C
        </Text>
        <Group gap="md" mt="xs">
          <Group gap="xs">
            <Wind size={16} style={{ color: "#666" }} />
            <Text size="sm" c="dimmed">{data.windSpeed} km/h</Text>
          </Group>
          <Group gap="xs">
            <Droplets size={16} style={{ color: "#00adef" }} />
            <Text size="sm" c="dimmed">{data.humidity}%</Text>
          </Group>
        </Group>
      </Flex>
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
        cities.map(city => ({ ...city, region }))
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
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWeatherData();
  }, []);

  return (
    <Box py="xl" bg="rgba(0, 173, 239, 0.05)">
      <Container size="xl">
        <Grid gutter={{ base: "md", md: "xl" }}>
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Flex 
              align="center" 
              mb="lg"
            >
              <Box mr="md" style={{ color: "#00adef" }}>
                <CloudSun size={32} />
              </Box>
              <Title order={2} size="h3" fw={700} c="#00adef">
                MT9 INFORMA - CLIMA
              </Title>
              <Box 
                ml="md"
                style={{ 
                  flex: 1, 
                  height: 4, 
                  backgroundColor: "#00adef", 
                  borderRadius: 2 
                }} 
              />
            </Flex>
            
            {isClient && (
              <Tabs 
                value={activeRegion} 
                onChange={(value) => setActiveRegion(value as string)} 
                radius="md"
                mb="md"
                color="blue"
              >
                <Tabs.List>
                  {Object.keys(MT_CITIES).map((region) => (
                    <Tabs.Tab 
                      key={region} 
                      value={region}
                      leftSection={region === "Norte" ? <ArrowUp size={16} /> : 
                                 region === "Centro" ? <ArrowRight size={16} /> : 
                                 <ArrowDown size={16} />}
                    >
                      {region} de MT
                    </Tabs.Tab>
                  ))}
                </Tabs.List>
              </Tabs>
            )}
            
            <Grid>
              {(isClient ? MT_CITIES[activeRegion as keyof typeof MT_CITIES] : MT_CITIES.Centro).map((city) => {
                const cityWeather = weatherData.find((w) => w.city === city.name);
                return (
                  <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={city.name}>
                    <WeatherCard 
                      data={cityWeather} 
                      isLoading={loading} 
                    />
                  </Grid.Col>
                );
              })}
            </Grid>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Box mt={{ base: "xl", lg: 85 }} h="100%">
              <AdDisplay position={AdPosition.HIGHLIGHT} width={300} height={250} />
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
