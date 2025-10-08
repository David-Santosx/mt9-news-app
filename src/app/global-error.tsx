'use client';

import { Button, Container, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const theme = useMantineTheme();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Fatal application error:', error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body>
        <Container
          py={100}
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Stack align="center" gap="xl">
            <Title order={1} size="h1" ta="center" c="red">
              Erro Fatal na Aplicação
            </Title>
            
            <Text size="lg" ta="center" maw={600} mx="auto">
              Ocorreu um erro grave que impede o carregamento da aplicação.
              Por favor, tente novamente ou entre em contato com o suporte se o problema persistir.
            </Text>
            
            {process.env.NODE_ENV === 'development' && (
              <div
                style={{
                  padding: '20px',
                  margin: '20px 0',
                  backgroundColor: theme.colors.red[0],
                  border: `1px solid ${theme.colors.red[5]}`,
                  borderRadius: theme.radius.md,
                  width: '100%',
                  maxWidth: '800px',
                }}
              >
                <Text fw={700} size="md" mb={10}>
                  Detalhes do Erro (visível apenas em ambiente de desenvolvimento):
                </Text>
                <Text component="pre" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {error.message}
                  {error.stack && `\n\n${error.stack}`}
                </Text>
                {error.digest && (
                  <Text size="sm" mt={10}>
                    Digest: {error.digest}
                  </Text>
                )}
              </div>
            )}
            
            <Stack align="center" gap="md" mt="xl">
              <Button
                size="lg"
                onClick={reset}
                variant="filled"
                leftSection={<span>↻</span>}
              >
                Tentar Novamente
              </Button>
              <Button
                component={Link}
                href="/"
                variant="subtle"
                size="md"
              >
                Voltar para a página inicial
              </Button>
            </Stack>
          </Stack>
        </Container>
      </body>
    </html>
  );
}