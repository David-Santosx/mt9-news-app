import {
  Box,
  Container,
  Grid,
  Group,
  Stack,
  Text,
  Title,
  Divider,
  ActionIcon,
  Anchor,
  Flex,
  GridCol,
} from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";

// Links estruturados por categoria
const footerLinks = {
  categories: {
    title: "Categorias",
    links: [
      { label: "Geral", href: "/geral" },
      { label: "Política", href: "/politica" },
      { label: "Esportes", href: "/esportes" },
      { label: "Cultura", href: "/cultura" },
      { label: "Tecnologia", href: "/tecnologia" },
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
    <Box component="footer" bg="gray.0" mt="xl">
      <Container size="xl" py="xl">
        <Grid gutter={{ base: "xl", md: 50 }}>
          {/* Coluna da Esquerda: Logo, Descrição e Social */}
          <GridCol span={{ base: 12, md: 4 }}>
            <Stack gap="md">
              <Link
                href="/"
                style={{ display: "inline-block", width: "fit-content" }}
              >
                <Image
                  src="/images/mt9-logo.svg"
                  alt="MT9 News Logo"
                  width={120}
                  height={40}
                  className="transition-transform duration-300 hover:scale-105"
                />
              </Link>
              <Text size="sm" c="dimmed">
                Seu portal de notícias com informações atualizadas e confiáveis
                sobre os principais acontecimentos em Mato Grosso, no Brasil e
                no mundo.
              </Text>
              <Group mt="xs" align="center">
                <ActionIcon
                  variant="subtle"
                  color="blue"
                  component="a"
                  href="https://www.instagram.com/mt9.com.br/"
                  target="_blank"
                  size="lg"
                  aria-label="Instagram"
                  className="transition-transform duration-200 hover:scale-110"
                >
                  <Instagram size={20} />
                </ActionIcon>
                <Anchor
                  href="https://www.instagram.com/mt9.com.br/"
                  target="_blank"
                  c="dimmed"
                  size="sm"
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  @mt9.com.br
                </Anchor>
              </Group>
            </Stack>
          </GridCol>

          {/* Coluna da Direita: Links */}
          <GridCol span={{ base: 12, md: 8 }}>
            <Grid gutter={{ base: "xl", sm: "md" }}>
              {Object.values(footerLinks).map((section) => (
                <GridCol span={{ base: 6, sm: 4 }} key={section.title}>
                  <Stack gap="sm">
                    <Title
                      order={4}
                      size="sm"
                      fw={700}
                      c="dark.4"
                      tt="uppercase"
                    >
                      {section.title}
                    </Title>
                    {section.links.map((link) => (
                      <Anchor
                        key={link.href}
                        component={Link}
                        href={link.href}
                        c="dimmed"
                        size="sm"
                        className="hover:text-blue-600 transition-colors duration-200"
                      >
                        {link.label}
                      </Anchor>
                    ))}
                  </Stack>
                </GridCol>
              ))}
            </Grid>
          </GridCol>
        </Grid>

        <Divider my="xl" />

        {/* Barra Inferior: Copyright e Links Legais */}
        <Flex
          direction={{ base: "column-reverse", sm: "row" }}
          justify="space-between"
          align="center"
          gap="md"
        >
          <Text size="xs" c="dimmed">
            © {new Date().getFullYear()} MT9 News. Todos os direitos reservados.
            Desenvolvido por{" "}
            <Anchor
              href="https://www.github.com/David-Santosx"
              target="_blank"
              c="blue.6"
              size="xs"
            >
              David Santos
            </Anchor>
          </Text>
          <Group gap="md">
            <Anchor
              component={Link}
              href="/politica-privacidade"
              c="dimmed"
              size="xs"
            >
              Política de Privacidade
            </Anchor>
            <Anchor component={Link} href="/termos-uso" c="dimmed" size="xs">
              Termos de Uso
            </Anchor>
          </Group>
        </Flex>
      </Container>
    </Box>
  );
}
