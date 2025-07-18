import {
  Box,
  Container,
  Flex,
  Group,
  Stack,
  Text,
  Title,
  Divider,
  ActionIcon,
} from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";

// Links estruturados por categoria
const footerLinks = {
  categories: {
    title: "Categorias",
    links: [
      { label: "Geral", href: "/geral" },
      { label: "Política", href: "/politica" },
      { label: "Esportes", href: "/esportes" },
      { label: "Cultura", href: "/cultura" },
      { label: "Comércios", href: "/comercios" },
    ],
  },
};

export default function Footer() {
  return (
    <Box component="footer" bd={"1px 0px 0px 0px solid"} c="dark">
      <Container size="xl" py="xl">
        {/* Logo e Descrição */}
        <Flex
          direction={{ base: "column", sm: "row" }}
          justify="space-between"
          align={{ base: "center", sm: "flex-start" }}
          gap="xl"
          mb="xl"
        >
          <Box maw={400} className="sm:text-left text-center">
            <Stack>
              <Box className="flex justify-center sm:justify-start">
                <Image
                  src="/images/mt9-logo.svg"
                  alt="MT9 News Logo"
                  width={120}
                  height={40}
                />
              </Box>
              <Text size="sm" c="dark">
                MT9 News é seu portal de notícias com informações atualizadas e
                confiáveis sobre os principais acontecimentos no Brasil e no
                mundo.
              </Text>
            </Stack>
          </Box>

          {/* Links de Mídia Social */}
          <Group gap="md">
            <ActionIcon
              variant="subtle"
              color="dark"
              component="a"
              href="https://facebook.com"
              target="_blank"
              size="lg"
            >
              <Facebook size={24} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="dark"
              component="a"
              href="https://instagram.com"
              target="_blank"
              size="lg"
            >
              <Instagram size={24} />
            </ActionIcon>
          </Group>
        </Flex>

        <Divider my="xl" />

        {/* Seções de Links */}
        <Flex
          wrap="wrap"
          gap={{ base: "xl", md: 50 }}
          justify={{ base: "center", sm: "flex-start" }}
          align="flex-start"
        >
          {Object.values(footerLinks).map((section) => (
            <Stack key={section.title} maw={160}>
              <Title order={3} size="h6">
                {section.title}
              </Title>
              <Flex gap="xl">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      color: "var(--mantine-color-dark)",
                      textDecoration: "none",
                      fontSize: "var(--mantine-font-size-sm)",
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Flex>
            </Stack>
          ))}
        </Flex>

        <Divider my="xl" style={{ color: "var(--mantine-color-dark)" }} />

        {/* Copyright e Links Legais */}
        <Flex
          direction={{ base: "column", sm: "row" }}
          justify="space-between"
          align="center"
          gap="md"
        >
          <Group gap="xs">
            <Text size="xs" c="dark">
              © {new Date().getFullYear()} MT9 News. Todos os direitos reservados.
            </Text>
            <Text size="sm" c="dark.4">•</Text>
            <Text size="xs" c="dark">
              Desenvolvido por <Link href="https://www.github.com/David-Santosx" target="_blank">David Santos</Link>
            </Text>
          </Group>
          <Group gap="md">
            <Link
              href="/politica-privacidade"
              style={{
                color: "var(--mantine-color-dark)",
                fontSize: "var(--mantine-font-size-sm)",
              }}
            >
              Política de Privacidade
            </Link>
            <Link
              href="/termos-uso"
              style={{
                color: "var(--mantine-color-dark)",
                fontSize: "var(--mantine-font-size-sm)",
              }}
            >
              Termos de Uso
            </Link>
            <Link
              href="/contato"
              style={{
                color: "var(--mantine-color-dark)",
                fontSize: "var(--mantine-font-size-sm)",
              }}
            >
              Contato
            </Link>
          </Group>
        </Flex>
      </Container>
    </Box>
  );
}
