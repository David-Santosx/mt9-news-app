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
  about: {
    title: "Sobre",
    links: [
      { label: "Sobre Nós", href: "/sobre" },
      { label: "Contato", href: "/contato" },
      { label: "Política de Privacidade", href: "/politica-privacidade" },
      { label: "Termos de Uso", href: "/termos-uso" },
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
          gap={{ base: "xl", sm: "xl", md: "2rem" }}
          mb="xl"
          wrap={{ base: "wrap", lg: "nowrap" }}
        >
          <Box
            maw={{ base: "100%", md: 400 }}
            w={{ base: "100%", md: "auto" }}
            ta={{ base: "center", sm: "left" }}
          >
            <Stack gap="md">
              <Box className="flex justify-center sm:justify-start">
                <Image
                  src="/images/mt9-logo.svg"
                  alt="MT9 News Logo"
                  width={120}
                  height={40}
                  className="transition-transform duration-300 hover:scale-105"
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
          <Group
            gap="md"
            mt={{ base: 0, sm: "1rem" }}
            className="sm:self-start self-center"
          >
            <ActionIcon
              variant="subtle"
              color="dark"
              component="a"
              href="https://facebook.com"
              target="_blank"
              size="lg"
              className="transition-transform duration-200 hover:scale-110"
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
              className="transition-transform duration-200 hover:scale-110"
            >
              <Instagram size={24} />
            </ActionIcon>
          </Group>
        </Flex>

        <Divider my="xl" />

        {/* Seções de Links */}
        <Box my="xl">
          <Flex
            wrap="wrap"
            gap={{ base: "xl", md: 50 }}
            justify={{ base: "flex-start", sm: "flex-start" }}
            align="flex-start"
          >
            {Object.values(footerLinks).map((section) => (
              <Box
                key={section.title}
                maw={{ base: "100%", xs: 160 }}
                w={{ base: "100%", xs: "auto" }}
                ta={{ base: "center", xs: "left" }}
              >
                <Title order={3} size="h6" mb="md">
                  {section.title}
                </Title>
                <Stack gap="xs">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      style={{
                        color: "var(--mantine-color-dark)",
                        textDecoration: "none",
                        fontSize: "var(--mantine-font-size-sm)",
                      }}
                      className="hover:underline transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  ))}
                </Stack>
              </Box>
            ))}
          </Flex>
        </Box>

        <Divider my="xl" style={{ color: "var(--mantine-color-dark)" }} />

        {/* Copyright e Links Legais */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "center", md: "center" }}
          gap={{ base: "xl", md: "md" }}
          wrap="wrap"
        >
          <Group gap="xs" justify="center" wrap="wrap">
            <Text size="xs" c="dark" ta={{ base: "center", md: "left" }}>
              © {new Date().getFullYear()} MT9 News. Todos os direitos
              reservados.
            </Text>
            <Text size="xs" c="dark.4" display={{ base: "none", sm: "block" }}>
              •
            </Text>
            <Text size="xs" c="dark" ta={{ base: "center", md: "left" }}>
              Desenvolvido por{" "}
              <Link
                href="https://www.github.com/David-Santosx"
                target="_blank"
                className="hover:underline"
                style={{ color: "#00adef" }}
              >
                David Santos
              </Link>
            </Text>
          </Group>
          <Group gap="md" justify="center" wrap="wrap" mt={{ base: 0, md: 0 }}>
            <Link
              href="/politica-privacidade"
              style={{
                color: "var(--mantine-color-dark)",
                fontSize: "var(--mantine-font-size-xs)",
              }}
              className="hover:underline transition-colors duration-200"
            >
              Política de Privacidade
            </Link>
            <Link
              href="/termos-uso"
              style={{
                color: "var(--mantine-color-dark)",
                fontSize: "var(--mantine-font-size-xs)",
              }}
              className="hover:underline transition-colors duration-200"
            >
              Termos de Uso
            </Link>
            <Link
              href="/contato"
              style={{
                color: "var(--mantine-color-dark)",
                fontSize: "var(--mantine-font-size-xs)",
              }}
              className="hover:underline transition-colors duration-200"
            >
              Contato
            </Link>
          </Group>
        </Flex>
      </Container>
    </Box>
  );
}
