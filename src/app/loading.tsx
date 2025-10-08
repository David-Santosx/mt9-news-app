'use client';

import { Container, Title, Text, Box, Stack, Button, Group, Image } from "@mantine/core";
import Link from "next/link";

export default function GlobalLoading() {
  return (
    <Container py={80} size="md" ta="center">
      <Stack align="center" gap={24}>
        <Image 
          src="/images/mt9-logo.svg" 
          alt="MT9 Logo" 
          maw={120} 
          mx="auto" 
          mb="md"
        />
        
        <Title order={1} size="h2">Carregando conteúdo</Title>
        
        <Box 
          style={{ 
            width: 60, 
            height: 60, 
            border: '4px solid var(--mantine-color-blue-filled)', 
            borderBottomColor: 'transparent',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin 1s linear infinite',
          }}
        />
        
        <style jsx global>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </Stack>
    </Container>
  );
}