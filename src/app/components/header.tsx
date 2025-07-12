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
import { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";

const headerLinks = [
  { label: "Notícias", href: "/noticias" },
  { label: "Esportes", href: "/esportes" },
  { label: "Cultura", href: "/cultura" },
  { label: "Comércios", href: "/comercios" },
];

export default function Header() {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  return (
    <header>
      {/* Top Bar (hidden on mobile) */}
      <Box bg="#00adef" py={5} h={40} visibleFrom="sm">
        <Container size="xl" h="100%" px={isMobile ? "sm" : "xl"}>
          <Flex justify="space-between" align="center" h="100%">
            <Text color="white" fs="italic" size="sm">
              Fique por dentro das últimas notícias.
            </Text>
            <Group gap="xs">
              <Text color="white" size="sm">
                @mt9.com.br
              </Text>
              <Divider color="dark" orientation="vertical" />
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

      {/* Main Header */}
      <Container
        size="xl"
        px={40}
        py="sm"
        h={{ base: 80, sm: 110 }}
      >
        <Flex justify={"space-between"} align="center" wrap="nowrap" gap="sm">
          {/* Logo and Navigation */}
          <Flex align="center" gap="md" style={{ flex: 1 }}>
            <Link href="/" style={{ lineHeight: 0 }} className="hover:scale-105 transition-transform">
              <Image
                src="/images/mt9-logo.svg"
                alt="MT9 Notícias e Comércios"
                width={140}
                height={100}
                priority
              />
            </Link>

            <Divider orientation="vertical" visibleFrom="sm" />

            {/* Desktop Navigation */}
            <Group gap="xs" visibleFrom="sm">
              {headerLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="subtle"
                  component={Link}
                  href={link.href}
                  px="sm"
                  size="compact-md"
                >
                  {link.label}
                </Button>
              ))}
            </Group>
          </Flex>

          {/* Mobile Burger */}
          <Box hiddenFrom="sm">
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              color={theme.colors.gray[7]}
              size="sm"
            />
          </Box>

          {/* Ad Space */}
          <Box
            miw={300}
            mih={90}
            visibleFrom="xl"
            style={{
              border: `${rem(2)} dashed ${theme.colors.gray[3]}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              maxWidth: 728,
            }}
          >
            Publicidade
          </Box>
        </Flex>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        position="right"
        size="100%"
        padding="md"
        withCloseButton={false}
        zIndex={10000}
      >
        <Stack h="100%">
          <Flex justify="flex-end" p="md">
            <ActionIcon
              variant="outline"
              color="dark"
              onClick={() => setOpened(false)}
            >
              <X size={18} />
            </ActionIcon>
          </Flex>
          
          <Stack justify="center" flex={1}>
            {headerLinks.map((link) => (
              <Button
                key={link.label}
                component={Link}
                href={link.href}
                variant={"subtle"}
                size="xl"
                onClick={() => setOpened(false)}
                styles={{ inner: { justifyContent: "center" } }}
              >
                {link.label}
              </Button>
            ))}
          </Stack>
          
          <Group justify="center" pb="xl">
            <ActionIcon variant="filled" size="lg">
              <Instagram size={20} />
            </ActionIcon>
            <ActionIcon variant="filled" size="lg">
              <Facebook size={20} />
            </ActionIcon>
          </Group>
        </Stack>
      </Drawer>
    </header>
  );
}