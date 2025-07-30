import { Box, Container, List, ListItem, Stack, Text, Title } from "@mantine/core";

export default function Page() {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Box ta="center">
          <Title order={1}>Política de Privacidade</Title>
          <Text mt="md" size="lg">
            A sua privacidade é importante para nós. Esta Política explica como coletamos, 
            usamos e protegemos as suas informações.
          </Text>
        </Box>

        <Box>
          <Title order={2} size="h3" mb="md">1. Coleta de dados</Title>
          <List spacing="sm">
            <ListItem>
              O MT9 pode coletar dados básicos de navegação para fins de estatística e 
              melhoria de desempenho do site.
            </ListItem>
            <ListItem>
              Utilizamos ferramentas como <strong>Vercel Analytics</strong> e <strong>Speed Insights</strong> para 
              medir performance e tráfego.
            </ListItem>
          </List>
        </Box>

        <Box>
          <Title order={2} size="h3" mb="md">2. Uso de cookies</Title>
          <List spacing="sm">
            <ListItem>
              Cookies podem ser utilizados para melhorar a experiência de navegação.
            </ListItem>
            <ListItem>
              Nenhuma informação pessoal é vendida ou compartilhada com terceiros.
            </ListItem>
          </List>
        </Box>

        <Box>
          <Title order={2} size="h3" mb="md">3. Anúncios</Title>
          <List spacing="sm">
            <ListItem>
              O portal pode exibir anúncios de parceiros e órgãos públicos.
            </ListItem>
            <ListItem>
              Nenhum dado sensível é compartilhado com anunciantes.
            </ListItem>
          </List>
        </Box>

        <Box>
          <Title order={2} size="h3" mb="md">4. Segurança</Title>
          <List spacing="sm">
            <ListItem>
              Implementamos medidas de segurança para proteger as informações.
            </ListItem>
            <ListItem>
              Apesar dos esforços, não podemos garantir proteção absoluta contra 
              ataques ou invasões.
            </ListItem>
          </List>
        </Box>

        <Box>
          <Title order={2} size="h3" mb="md">5. Alterações</Title>
          <Text>
            Esta política pode ser atualizada periodicamente. Sempre que houver alterações, 
            a data de atualização será modificada.
          </Text>
        </Box>

        <Text c="dimmed" ta="center" mt="xl">
          Última atualização: <strong>{currentDate}</strong>
        </Text>
      </Stack>
    </Container>
  );
}
