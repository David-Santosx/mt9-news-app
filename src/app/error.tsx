'use client';

import { Container, Title, Text, Button, Box, Stack, Group, Image } from "@mantine/core";
import Link from "next/link";
import { useEffect } from "react";

// Define the props type for the Error component
type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  // Log the error to an error reporting service
  useEffect(() => {
    console.error('Erro na aplicação:', error);
    
    // Aqui você poderia integrar com um serviço de monitoramento como Sentry
    // if (typeof window !== 'undefined') {
    //   import('@sentry/browser').then(Sentry => {
    //     Sentry.captureException(error);
    //   });
    // }
  }, [error]);

  return (
    <Container py={80} size="md">
      <Stack align="center" gap={32} mb={40}>
        <Box ta="center">
          <Image 
            src="/images/mt9-logo.svg" 
            alt="MT9 Logo" 
            maw={120} 
            mx="auto" 
            mb="md"
          />
          <Title fw={900} size="h1">Ops! Algo deu errado</Title>
          <Text c="dimmed" mt="md" size="lg" maw={600} mx="auto">
            Enfrentamos um problema inesperado ao tentar carregar esta página.
            Nossa equipe foi notificada e estamos trabalhando para resolver o problema.
          </Text>
        </Box>

        {/* Detalhes técnicos do erro (somente em ambiente de desenvolvimento) */}
        {process.env.NODE_ENV === 'development' && (
          <Box 
            p="lg" 
            w="100%" 
            style={{
              backgroundColor: 'rgba(255, 0, 0, 0.05)',
              border: '1px solid rgba(255, 0, 0, 0.2)',
              borderRadius: 'var(--mantine-radius-md)',
            }}
          >
            <Text fw={700} size="lg" mb="xs">Detalhes do erro (apenas visível em desenvolvimento):</Text>
            <Text component="pre" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </Text>
          </Box>
        )}

        <Group>
          <Button 
            size="lg" 
            variant="filled" 
            color="blue" 
            onClick={reset} 
            leftSection={<span>↻</span>}
          >
            Tentar Novamente
          </Button>
          <Button
            size="lg"
            variant="outline"
            component={Link}
            href="/"
            leftSection={<span>←</span>}
          >
            Voltar para a página inicial
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}