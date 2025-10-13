import {
  Box,
  Container,
  List,
  ListItem,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Script from "next/script";

export default function Page() {
  const currentDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Box ta="center">
          <Title order={1}>Termos de Uso</Title>
          <Text mt="md" size="lg">
            Bem-vindo ao <strong>MT9 Notícias & Comércios</strong>
          </Text>
        </Box>

        <Text>
          Ao acessar e utilizar nosso portal, você concorda com os seguintes
          termos e condições. Caso não concorde, recomendamos que não utilize
          nossos serviços.
        </Text>

        <Box>
          <Title order={2} size="h3" mb="md">
            1. Objetivo do site
          </Title>
          <Text>
            O MT9 é um portal de notícias e informações do estado do Mato Grosso que tem como
            objetivo informar a população com conteúdos de interesse público,
            além de divulgar comércios e serviços da região.
          </Text>
        </Box>

        <Box>
          <Title order={2} size="h3" mb="md">
            2. Uso do conteúdo
          </Title>
          <List spacing="sm">
            <ListItem>
              O conteúdo publicado é de uso informativo e não pode ser
              reproduzido sem autorização prévia.
            </ListItem>
            <ListItem>
              Notícias podem incluir opiniões de colunistas e não refletem,
              necessariamente, a posição do portal.
            </ListItem>
          </List>
        </Box>

        <Box>
          <Title order={2} size="h3" mb="md">
            3. Responsabilidade
          </Title>
          <List spacing="sm">
            <ListItem>
              Nos esforçamos para manter as informações atualizadas, mas não nos
              responsabilizamos por erros ou omissões.
            </ListItem>
            <ListItem>
              Não nos responsabilizamos por danos decorrentes do uso indevido
              das informações publicadas.
            </ListItem>
          </List>
        </Box>

        <Box>
          <Title order={2} size="h3" mb="md">
            4. Anúncios e patrocínios
          </Title>
          <List spacing="sm">
            <ListItem>
              O MT9 exibe anúncios de empresas e órgãos públicos locais.
            </ListItem>
            <ListItem>
              A responsabilidade pelo conteúdo dos anúncios é exclusiva dos
              anunciantes.
            </ListItem>
          </List>
        </Box>

        <Box>
          <Title order={2} size="h3" mb="md">
            5. Alterações
          </Title>
          <Text>
            Estes termos podem ser modificados a qualquer momento. Recomendamos
            que verifique periodicamente esta página.
          </Text>
        </Box>

        <Text c="dimmed" ta="center" mt="xl">
          Última atualização: <strong>{currentDate}</strong>
        </Text>
      </Stack>
    </Container>
    <Script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1306875437034957" crossOrigin="anonymous"/>
    </>
  );
}
