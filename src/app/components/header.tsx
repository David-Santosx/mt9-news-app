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
import { Instagram, X } from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
import AdDisplay from "./ad-display";
import { NewsCategories } from "@/lib/schemas/news-schema";
import slugify from "slugify";

const headerLinks = NewsCategories.map((category) => ({
  label: category,
  href: `/noticias/categoria/${slugify(category.toLowerCase())}`,
}));

export default function Header() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const theme = useMantineTheme();

  return (
    <header>
      {/* Top Bar - Oculta em mobile */}
      <Box bg="#00adef" py={5} h={40} display={{ base: "none", sm: "block" }}>
        <Container size="xl" h="100%">
          <Flex justify="space-between" align="center" h="100%">
            <Text c="white" fs="italic" size="sm">
              Seu portal de informação confiável e atualizada.
            </Text>
            <Group gap="xs">
              <Text c="white" size="sm">
                @mt9.com.br
              </Text>
              <Divider c="dark" orientation="vertical" />
              <ActionIcon
                variant="transparent"
                size="sm"
                component="a"
                href="https://www.instagram.com/mt9.com.br/"
                target="_blank"
                aria-label="Instagram"
              >
                <Instagram color="white" size={16} />
              </ActionIcon>
            </Group>
          </Flex>
        </Container>
      </Box>

      {/* Header Principal */}
      <Container size="xl" px={{ base: "md", sm: "xl" }} py="md">
        <Stack gap="md">
          {/* Primeira Linha: Logo e Publicidade */}
          <Flex
            justify="space-between"
            align="center"
            wrap={{ base: "wrap", md: "nowrap" }}
            gap={{ base: "md", md: "xl" }}
          >
            {/* Logo */}
            <Box>
              <Link
                href="/"
                style={{
                  lineHeight: 0,
                  transition: "transform 0.2s ease",
                }}
                className="hover:scale-105"
              >
                <Image
                  src="/images/mt9-logo.svg"
                  alt="MT9 Notícias e Comércios"
                  width={160}
                  height={90}
                  priority
                />
              </Link>
            </Box>

            {/* Burger Menu Mobile */}
            <Box display={{ base: "block", md: "none" }} ml="auto">
              <Burger
                opened={opened}
                onClick={toggle}
                color={theme.colors.gray[7]}
                size="sm"
              />
            </Box>

            {/* Publicidade Desktop */}
            <Box
              display={{ base: "none", md: "block" }}
              style={{ flex: 1, maxWidth: 728 }}
            >
              <AdDisplay position={["HEADER"]} width={728} height={90} />
            </Box>
          </Flex>

          {/* Divisor */}
          <Divider display={{ base: "none", md: "block" }} />

          {/* Segunda Linha: Navegação */}
          <Box display={{ base: "none", md: "block" }}>
            <Group justify="center" gap="md">
              {headerLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="subtle"
                  component={Link}
                  href={link.href}
                  px="sm"
                  size="compact-md"
                  styles={(theme) => ({
                    root: {
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: theme.colors.gray[1],
                        transform: "translateY(-1px)",
                      },
                    },
                  })}
                >
                  {link.label}
                </Button>
              ))}
            </Group>
          </Box>
        </Stack>
      </Container>

      {/* Drawer de Navegação Mobile */}
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="100%"
        padding="md"
        withCloseButton={false}
        zIndex={10000}
        styles={{
          body: {
            padding: 0,
            height: "100%",
          },
        }}
      >
        <Stack h="100%" p="md">
          {/* Botão de Fechar */}
          <Flex justify="flex-end" pb="md">
            <ActionIcon
              variant="outline"
              color="dark"
              onClick={close}
              size="lg"
            >
              <X size={18} />
            </ActionIcon>
          </Flex>

          {/* Links de Navegação */}
          <Stack justify="center" flex={1} gap="md">
            {headerLinks.map((link) => (
              <Button
                key={link.label}
                component={Link}
                href={link.href}
                variant="subtle"
                size="xl"
                onClick={close}
                styles={{
                  inner: { justifyContent: "center" },
                  root: { height: rem(60) },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Stack>

          {/* Redes Sociais */}
          <Group justify="center" pb="xl">
            <ActionIcon
              variant="filled"
              size="lg"
              color="#00adef"
              component="a"
              href="https://instagram.com/mt9.com.br"
              target="_blank"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </ActionIcon>
          </Group>
        </Stack>
      </Drawer>
    </header>
  );
}
