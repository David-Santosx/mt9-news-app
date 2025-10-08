import { Container, Title, Text, Button, Image, Box, Stack } from "@mantine/core";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container py={80} size="md">
      <Stack align="center" gap={32}>
        <Box ta="center">
          <Image 
            src="/images/mt9-logo.svg" 
            alt="MT9 Logo" 
            maw={120} 
            mx="auto" 
            mb="md"
          />
          <Title fw={900} size="h1">404 - Página não encontrada</Title>
          <Text c="dimmed" mt="md" size="lg" maw={600} mx="auto">
            Desculpe, mas a página que você está procurando não existe ou foi removida.
          </Text>
        </Box>
        
        <Button
          size="lg"
          variant="filled"
          component={Link}
          href="/"
          leftSection={<span>←</span>}
        >
          Voltar para a página inicial
        </Button>
      </Stack>
    </Container>
  );
}