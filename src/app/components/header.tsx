"use client";
import {
  ActionIcon,
  Button,
  Container,
  Divider,
  Flex,
  Group,
  Text,
  Burger,
  Drawer,
  Stack,
  Box,
  useMantineTheme,
  rem,
} from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { Instagram, X, Facebook } from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
import AdDisplay from "./ad-display";
import { NewsCategories } from "@/lib/schemas/news-schema";
import slugify from "slugify";
import NewsSearch from "./news-search";
import { useEffect, useState } from "react";
import { getPublicAds } from "../actions/publicidades/get-ads";
import { Advertisement as PrismaAds } from "@prisma/client";

const headerLinks = NewsCategories.map((category) => ({
  label: category,
  href: `/noticias/categoria/${slugify(category.toLowerCase())}`,
}));

export default function Header() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [hasHeaderAd, setHasHeaderAd] = useState(false);
  const [loading, setLoading] = useState(true);
  const theme = useMantineTheme();
  const currentDate = new Date().toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    async function checkHeaderAds() {
      try {
        setLoading(true);
        const data = await getPublicAds();
        if (!data) {
          setHasHeaderAd(false);
          return;
        }

        // Verifica se há anúncios válidos para a posição HEADER
        const now = new Date();
        const validHeaderAds = data.filter((ad: PrismaAds) => {
          if (ad.position !== "HEADER") return false;
          if (!ad.image) return false;
          
          const startDate = new Date(ad.startDate);
          const endDate = new Date(ad.endDate);
          
          return startDate <= now && endDate >= now;
        });

        setHasHeaderAd(validHeaderAds.length > 0);
      } catch (error) {
        console.error("Erro ao verificar anúncios do header:", error);
        setHasHeaderAd(false);
      } finally {
        setLoading(false);
      }
    }

    checkHeaderAds();
  }, []);

  return (
    <header style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}>
      {/* Top Bar - Informações e Redes Sociais */}
      <Box 
        bg="linear-gradient(90deg, #1976d2 0%, #1565c0 100%)" 
        py={8} 
        h={44} 
        display={{ base: "none", sm: "block" }}
      >
        <Container size="xl" h="100%">
          <Flex justify="space-between" align="center" h="100%">
            <Text c="white" size="sm" fw={400} style={{ letterSpacing: '0.3px' }}>
              Seu portal de informação confiável e atualizada • {currentDate}
            </Text>
            <Group gap="xs">
              <Text c="white" size="sm" fw={500}>
                Siga-nos:
              </Text>
              <ActionIcon
                variant="subtle"
                size="sm"
                component="a"
                href="https://www.instagram.com/mt9.com.br/"
                target="_blank"
                aria-label="Instagram"
                style={{ 
                  color: 'white',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <Instagram size={16} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                size="sm"
                component="a"
                href="https://www.facebook.com/profile.php?id=61578324400179"
                target="_blank"
                aria-label="Facebook"
                style={{ 
                  color: 'white',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <Facebook size={16} />
              </ActionIcon>
            </Group>
          </Flex>
        </Container>
      </Box>

      {/* Header Principal */}
      <Box bg="white" py={{ base: "md", lg: "xl" }}>
        <Container size="xl" px={{ base: "md", sm: "xl" }}>
          <Stack gap={{ base: "md", lg: "xl" }}>
            {/* Layout Desktop */}
            <Box display={{ base: "none", lg: "block" }}>
              {!loading && hasHeaderAd ? (
                // Layout com publicidade: Publicidade | Logo | Pesquisa
                <Flex align="center" justify="space-between" gap="xl">
                  {/* Publicidade - Esquerda */}
                  <Box style={{ flex: 1, maxWidth: 728, display: 'flex', justifyContent: 'flex-start' }}>
                    <AdDisplay position={["HEADER"]} width={728} height={90} />
                  </Box>

                  {/* Logo - Centro */}
                  <Box style={{ flex: '0 0 auto' }}>
                    <Link
                      href="/"
                      style={{
                        display: 'inline-block',
                        lineHeight: 0,
                        transition: "all 0.3s ease",
                        borderRadius: '12px',
                        padding: '8px'
                      }}
                      className="hover:scale-105"
                    >
                      <Image
                        src="/images/mt9-logo.svg"
                        alt="MT9 Notícias e Comércios"
                        width={200}
                        height={110}
                        priority
                        style={{ objectFit: 'contain' }}
                      />
                    </Link>
                  </Box>

                  {/* Barra de Pesquisa - Direita */}
                  <Box style={{ flex: 1, maxWidth: 350, display: 'flex', justifyContent: 'flex-end' }}>
                    <NewsSearch 
                      width="100%" 
                      placeholder="Buscar notícias..." 
                      size="md"
                    />
                  </Box>
                </Flex>
              ) : (
                // Layout sem publicidade: Logo | Pesquisa
                <Flex align="center" justify="space-between" gap="xl">
                  {/* Logo - Esquerda */}
                  <Box>
                    <Link
                      href="/"
                      style={{
                        display: 'inline-block',
                        lineHeight: 0,
                        transition: "all 0.3s ease",
                        borderRadius: '12px',
                        padding: '8px'
                      }}
                      className="hover:scale-105"
                    >
                      <Image
                        src="/images/mt9-logo.svg"
                        alt="MT9 Notícias e Comércios"
                        width={240}
                        height={130}
                        priority
                        style={{ objectFit: 'contain' }}
                      />
                    </Link>
                  </Box>

                  {/* Barra de Pesquisa - Direita */}
                  <Box style={{ maxWidth: 450, flex: 1 }}>
                    <NewsSearch 
                      width="100%" 
                      placeholder="Buscar notícias..." 
                      size="lg"
                    />
                  </Box>
                </Flex>
              )}
            </Box>

            {/* Layout Tablet: Logo | Pesquisa */}
            <Box display={{ base: "none", md: "block", lg: "none" }}>
              <Flex align="center" justify="space-between" gap="xl">
                {/* Logo */}
                <Box style={{ minWidth: 'fit-content' }}>
                  <Link
                    href="/"
                    style={{
                      display: 'inline-block',
                      lineHeight: 0,
                      transition: "all 0.3s ease",
                      borderRadius: '8px',
                      padding: '4px'
                    }}
                    className="hover:scale-105"
                  >
                    <Image
                      src="/images/mt9-logo.svg"
                      alt="MT9 Notícias e Comércios"
                      width={180}
                      height={100}
                      priority
                      style={{ objectFit: 'contain' }}
                    />
                  </Link>
                </Box>

                {/* Barra de Pesquisa */}
                <Box style={{ flex: 1, maxWidth: 400 }}>
                  <NewsSearch 
                    width="100%" 
                    placeholder="Buscar notícias..." 
                    size="md"
                  />
                </Box>
              </Flex>
            </Box>

            {/* Layout Mobile: Logo | Menu */}
            <Box display={{ base: "flex", md: "none" }}>
              <Flex align="center" justify="space-between" w="100%">
                {/* Logo Mobile */}
                <Box>
                  <Link
                    href="/"
                    style={{
                      display: 'inline-block',
                      lineHeight: 0,
                      transition: "all 0.3s ease",
                      borderRadius: '6px',
                      padding: '2px'
                    }}
                    className="hover:scale-105"
                  >
                    <Image
                      src="/images/mt9-logo.svg"
                      alt="MT9 Notícias e Comércios"
                      width={140}
                      height={80}
                      priority
                      style={{ objectFit: 'contain' }}
                    />
                  </Link>
                </Box>

                {/* Burger Menu Mobile */}
                <Burger
                  opened={opened}
                  onClick={toggle}
                  color={theme.colors.gray[8]}
                  size="md"
                  styles={{
                    burger: {
                      transition: 'all 0.2s ease',
                    }
                  }}
                />
              </Flex>
            </Box>

            {/* Publicidade Tablet - Linha Separada */}
            <Box display={{ base: "none", md: "block", lg: "none" }}>
              <Flex justify="center" mt="md">
                <AdDisplay position={["HEADER"]} width={728} height={90} />
              </Flex>
            </Box>

            {/* Barra de Pesquisa Mobile */}
            <Box display={{ base: "block", md: "none" }}>
              <NewsSearch 
                width="100%" 
                placeholder="🔍 Pesquisar notícias..." 
                size="md"
              />
            </Box>

            {/* Navegação Desktop */}
            <Box display={{ base: "none", md: "block" }}>
              <Box 
                py="sm" 
                style={{ 
                  borderTop: '2px solid var(--mantine-color-blue-1)',
                  borderBottom: '1px solid var(--mantine-color-gray-2)',
                  backgroundColor: 'var(--mantine-color-gray-0)'
                }}
              >
                <Flex justify="center" wrap="wrap" gap="xs">
                  {headerLinks.map((link) => (
                    <Button
                      key={link.label}
                      variant="subtle"
                      component={Link}
                      href={link.href}
                      px="lg"
                      py="sm"
                      size="sm"
                      fw={500}
                      styles={(theme) => ({
                        root: {
                          borderRadius: theme.radius.md,
                          transition: "all 0.2s ease",
                          color: theme.colors.gray[7],
                          fontSize: theme.fontSizes.sm,
                          height: '38px',
                          backgroundColor: 'transparent',
                          "&:hover": {
                            backgroundColor: theme.colors.white,
                            color: theme.colors.blue[7],
                            transform: "translateY(-1px)",
                            boxShadow: '0 3px 6px rgba(0,0,0,0.12)',
                            borderColor: theme.colors.blue[2],
                            border: `1px solid ${theme.colors.blue[2]}`
                          },
                        },
                      })}
                    >
                      {link.label}
                    </Button>
                  ))}
                </Flex>
              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Drawer de Navegação Mobile */}
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="85%"
        padding={0}
        withCloseButton={false}
        zIndex={10000}
        styles={{
          body: {
            padding: 0,
            height: "100%",
            backgroundColor: "var(--mantine-color-gray-0)",
          },
          header: {
            backgroundColor: "var(--mantine-color-gray-0)",
            borderBottom: "1px solid var(--mantine-color-gray-2)",
          },
        }}
      >
        <Stack h="100%" gap={0}>
          {/* Header do Drawer */}
          <Box p="lg" bg="white" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
            <Flex justify="space-between" align="center">
              <Text size="lg" fw={600} c="gray.8">
                Menu
              </Text>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={close}
                size="lg"
                radius="md"
              >
                <X size={20} />
              </ActionIcon>
            </Flex>
          </Box>

          {/* Barra de Pesquisa Mobile */}
          <Box p="lg" bg="white">
            <NewsSearch 
              placeholder="Pesquisar notícias..." 
              size="md" 
              width="100%"
            />
          </Box>

          {/* Links de Navegação */}
          <Box flex={1} p="md" bg="gray.0">
            <Text size="sm" fw={600} c="gray.6" mb="md" tt="uppercase" px="md">
              Categorias
            </Text>
            <Stack gap="xs">
              {headerLinks.map((link) => (
                <Button
                  key={link.label}
                  component={Link}
                  href={link.href}
                  variant="subtle"
                  size="md"
                  onClick={close}
                  justify="flex-start"
                  styles={(theme) => ({
                    root: {
                      height: rem(48),
                      borderRadius: theme.radius.md,
                      backgroundColor: 'white',
                      color: theme.colors.gray[7],
                      fontWeight: 500,
                      border: `1px solid ${theme.colors.gray[2]}`,
                      transition: 'all 0.2s ease',
                      "&:hover": {
                        backgroundColor: theme.colors.blue[0],
                        color: theme.colors.blue[7],
                        borderColor: theme.colors.blue[2],
                        transform: 'translateX(4px)',
                      },
                    },
                    inner: { 
                      justifyContent: "flex-start",
                      paddingLeft: theme.spacing.lg,
                    },
                  })}
                >
                  {link.label}
                </Button>
              ))}
            </Stack>
          </Box>

          {/* Footer do Drawer */}
          <Box p="lg" bg="white" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
            <Stack gap="md" align="center">
              <Text size="sm" c="gray.6" ta="center">
                Siga-nos nas redes sociais
              </Text>
              <Group gap="md" justify="center">
                <ActionIcon
                  variant="light"
                  size="xl"
                  color="blue"
                  component="a"
                  href="https://instagram.com/mt9.com.br"
                  target="_blank"
                  aria-label="Instagram"
                  radius="md"
                  styles={(theme) => ({
                    root: {
                      transition: 'all 0.2s ease',
                      "&:hover": {
                        transform: 'scale(1.1)',
                      },
                    },
                  })}
                >
                  <Instagram size={24} />
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  size="xl"
                  color="blue"
                  component="a"
                  href="https://www.facebook.com/profile.php?id=61578324400179"
                  target="_blank"
                  aria-label="Facebook"
                  radius="md"
                  styles={(theme) => ({
                    root: {
                      transition: 'all 0.2s ease',
                      "&:hover": {
                        transform: 'scale(1.1)',
                      },
                    },
                  })}
                >
                  <Facebook size={24} />
                </ActionIcon>
              </Group>
            </Stack>
          </Box>
        </Stack>
      </Drawer>
    </header>
  );
}
