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
import { Facebook, Instagram, X } from "lucide-react";
import { useDisclosure } from "@mantine/hooks";

const headerLinks = [
  { label: "Notícias", href: "/noticias" },
  { label: "Esportes", href: "/esportes" },
  { label: "Cultura", href: "/cultura" },
  { label: "Comércios", href: "/comercios" },
];

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
              Fique por dentro das últimas notícias.
            </Text>
            <Group gap="xs">
              <Text c="white" size="sm">
                @mt9.com.br
              </Text>
              <Divider c="dark" orientation="vertical" />
              <ActionIcon variant="transparent" size="sm">
                <Instagram color="white" size={16} />
              </ActionIcon>
              <ActionIcon variant="transparent" size="sm">
                <Facebook color="white" size={16} />
              </ActionIcon>
            </Group>
          </Flex>
        </Container>
      </Box>

      {/* Header Principal */}
      <Container
        size="xl"
        px={{ base: "md", sm: "xl" }}
        py="sm"
        h={{ base: 70, sm: 110 }}
      >
        <Flex
          justify="space-between"
          align="center"
          wrap="nowrap"
          gap="sm"
          h="100%"
        >
          {/* Logo e Navegação */}
          <Flex align="center" gap="md" style={{ flex: 1 }}>
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
                width={120}
                height={90}
                priority
              />
            </Link>

            <Divider
              orientation="vertical"
              display={{ base: "none", sm: "block" }}
            />

            {/* Navegação Desktop */}
            <Group gap="xs" display={{ base: "none", sm: "flex" }}>
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
          </Flex>

          {/* Burger Menu Mobile */}
          <Box display={{ base: "block", sm: "none" }}>
            <Burger
              opened={opened}
              onClick={toggle}
              color={theme.colors.gray[7]}
              size="sm"
            />
          </Box>

          {/* Espaço para Publicidade */}
          <Box
            miw={300}
            mih={90}
            display={{ base: "none", xl: "flex" }}
            style={{
              border: `${rem(2)} dashed ${theme.colors.gray[3]}`,
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              maxWidth: 728,
              borderRadius: theme.radius.sm,
            }}
          >
            <Text c="dimmed" size="sm" ta="center">
              Publicidade
            </Text>
          </Box>
        </Flex>
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
            <ActionIcon variant="filled" size="lg" color="#00adef">
              <Instagram size={20} />
            </ActionIcon>
            <ActionIcon variant="filled" size="lg" color="#00adef">
              <Facebook size={20} />
            </ActionIcon>
          </Group>
        </Stack>
      </Drawer>
    </header>
  );
}